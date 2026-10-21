export type AttendanceStatus = 'present' | 'absent' | 'od';

export type RiskCategory = 'safe' | 'warning' | 'at_risk';

export type UserRole = 'faculty' | 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  registerNumber?: string;
  department: string;
  designation?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  facultyName: string;
  totalConducted: number;
}

export interface Student {
  id: string;
  registerNumber: string;
  name: string;
  department: string;
  year: string;
  semester: string;
  section: string;
  email: string;
  phone: string;
  parentPhone: string;
  avatarUrl?: string;
  totalClasses: number;
  attendedClasses: number;
  odClasses: number;
  attendancePercentage: number;
  riskCategory: RiskCategory;
  streakAbsences: number;
  subjectWiseAttendance: Record<string, { attended: number; total: number; percentage: number }>;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  period: number; // 1 to 7
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  department: string;
  year: string;
  section: string;
  entries: {
    studentId: string;
    studentName: string;
    registerNumber: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
  timestamp: string;
}

export interface PredictionInsight {
  studentId: string;
  studentName: string;
  registerNumber: string;
  currentPercentage: number;
  predictedFinalPercentage: number;
  riskCategory: RiskCategory;
  modelConfidence: number; // e.g., 92%
  classesNeededFor75: number; // minimum consecutive classes to reach 75%
  safeBunkAllowance: number; // classes student can afford to miss
  trendDirection: 'improving' | 'declining' | 'stable';
  absenceStreak: number;
  weekdayVulnerability: string; // e.g., "Mondays & Fridays"
  aiRecommendation: string;
  remainingSemClasses: number;
}

export interface AlertNotification {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  type: 'critical' | 'warning' | 'improvement' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  currentPercentage: number;
  predictedPercentage: number;
}
