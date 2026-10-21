import { Student, Subject, AttendanceRecord, AlertNotification, User } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '../data/mockData';
import { calculateStudentPrediction } from './predictor';

const STORAGE_KEYS = {
  STUDENTS: 'sap_students_v1',
  SUBJECTS: 'sap_subjects_v1',
  RECORDS: 'sap_attendance_records_v1',
  NOTIFICATIONS: 'sap_notifications_v1',
  CURRENT_USER: 'sap_current_user_v1',
};

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      saveStoredStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function getStoredSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBJECTS;
  }
}

export function getStoredRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_ATTENDANCE_RECORDS));
      return INITIAL_ATTENDANCE_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATTENDANCE_RECORDS;
  }
}

export function saveStoredRecords(records: AttendanceRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

export function getStoredNotifications(): AlertNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AlertNotification[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Faculty role (Prof. Jasmine Saranya)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      return INITIAL_USERS[0];
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS[0];
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/**
 * Recalculate student statistics after a new attendance submission
 */
export function processAttendanceSubmission(
  record: AttendanceRecord,
  currentStudents: Student[],
  currentRecords: AttendanceRecord[],
  currentNotifs: AlertNotification[]
): { updatedStudents: Student[]; updatedRecords: AttendanceRecord[]; updatedNotifs: AlertNotification[] } {
  const updatedRecords = [record, ...currentRecords];
  
  const updatedStudents = currentStudents.map((student) => {
    const entry = record.entries.find((e) => e.studentId === student.id);
    if (!entry) return student;

    const newTotal = student.totalClasses + 1;
    let newAttended = student.attendedClasses;
    let newOd = student.odClasses;
    let newStreak = student.streakAbsences;

    if (entry.status === 'present') {
      newAttended += 1;
      newStreak = 0;
    } else if (entry.status === 'od') {
      newOd += 1;
      newStreak = 0;
    } else {
      newStreak += 1;
    }

    const effectiveAttended = newAttended + newOd * 0.5;
    const newPercentage = Number(((effectiveAttended / newTotal) * 100).toFixed(1));

    // Update subject wise
    const subjectWise = { ...student.subjectWiseAttendance };
    const currentSub = subjectWise[record.subjectCode] || { attended: 0, total: 0, percentage: 0 };
    const subTotal = currentSub.total + 1;
    const subAttended = currentSub.attended + (entry.status === 'present' || entry.status === 'od' ? 1 : 0);
    subjectWise[record.subjectCode] = {
      attended: subAttended,
      total: subTotal,
      percentage: Number(((subAttended / subTotal) * 100).toFixed(1)),
    };

    const tempStudent: Student = {
      ...student,
      totalClasses: newTotal,
      attendedClasses: newAttended,
      odClasses: newOd,
      attendancePercentage: newPercentage,
      streakAbsences: newStreak,
      subjectWiseAttendance: subjectWise,
    };

    const pred = calculateStudentPrediction(tempStudent, newTotal);
    tempStudent.riskCategory = pred.riskCategory;

    return tempStudent;
  });

  // Check if any new alerts need to be generated
  const newNotifs: AlertNotification[] = [...currentNotifs];
  updatedStudents.forEach((st) => {
    if (st.riskCategory === 'at_risk' && st.streakAbsences >= 2) {
      const existingAlert = newNotifs.find((n) => n.studentId === st.id && !n.isRead && n.type === 'critical');
      if (!existingAlert) {
        newNotifs.unshift({
          id: `notif_${Date.now()}_${st.id}`,
          studentId: st.id,
          studentName: st.name,
          registerNumber: st.registerNumber,
          type: 'critical',
          title: `Attendance Dropped to ${st.attendancePercentage}%`,
          message: `${st.name} missed recent class. Current attendance is critically below 65%. Predicted end of semester shortage.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          currentPercentage: st.attendancePercentage,
          predictedPercentage: calculateStudentPrediction(st).predictedFinalPercentage,
        });
      }
    }
  });

  saveStoredStudents(updatedStudents);
  saveStoredRecords(updatedRecords);
  saveStoredNotifications(newNotifs);

  return { updatedStudents, updatedRecords, updatedNotifs: newNotifs };
}
