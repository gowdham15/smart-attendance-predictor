import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentManagementView } from './components/StudentManagementView';
import { AttendanceMarkingView } from './components/AttendanceMarkingView';
import { PredictionView } from './components/PredictionView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { VivaModal } from './components/VivaModal';
import { VivaCheatsheetView } from './components/VivaCheatsheetView';

import {
  Student,
  AttendanceRecord,
  AlertNotification,
  Subject,
  User,
} from './types';
import {
  getStoredStudents,
  saveStoredStudents,
  getStoredRecords,
  getStoredSubjects,
  getStoredNotifications,
  saveStoredNotifications,
  getCurrentUser,
  setCurrentUser,
  processAttendanceSubmission,
  resetToDefaults,
} from './utils/storage';
import { calculateStudentPrediction } from './utils/predictor';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [subjects, setSubjects] = useState<Subject[]>(() => getStoredSubjects());
  const [records, setRecords] = useState<AttendanceRecord[]>(() => getStoredRecords());
  const [notifications, setNotifications] = useState<AlertNotification[]>(() =>
    getStoredNotifications()
  );
  const [currentUser, setUser] = useState<User>(() => getCurrentUser());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);

  // Calculate global alerts and at-risk count
  const unreadAlertsCount = notifications.filter((n) => !n.isRead).length;
  const atRiskCount = students.filter(
    (s) => calculateStudentPrediction(s).riskCategory === 'at_risk'
  ).length;

  const handleSwitchUser = (user: User) => {
    setUser(user);
    setCurrentUser(user);
  };

  const handleAddStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveStoredStudents(updated);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    setStudents(updated);
    saveStoredStudents(updated);
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    saveStoredStudents(updated);
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }
  };

  const handleSubmitAttendance = (record: AttendanceRecord) => {
    const { updatedStudents, updatedRecords, updatedNotifs } =
      processAttendanceSubmission(record, students, records, notifications);
    setStudents(updatedStudents);
    setRecords(updatedRecords);
    setNotifications(updatedNotifs);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleResetData = () => {
    resetToDefaults();
    setStudents(getStoredStudents());
    setSubjects(getStoredSubjects());
    setRecords(getStoredRecords());
    setNotifications(getStoredNotifications());
    setUser(getCurrentUser());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onOpenNotifications={() => setCurrentTab('alerts')}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'viva') {
              setIsVivaModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          unreadAlertsCount={unreadAlertsCount}
          atRiskCount={atRiskCount}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              students={students}
              records={records}
              notifications={notifications}
              subjects={subjects}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setCurrentTab('students');
              }}
            />
          )}

          {currentTab === 'students' && (
            <StudentManagementView
              students={students}
              subjects={subjects}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
            />
          )}

          {currentTab === 'marking' && (
            <AttendanceMarkingView
              students={students}
              subjects={subjects}
              records={records}
              currentUser={currentUser}
              onSubmitAttendance={handleSubmitAttendance}
            />
          )}

          {currentTab === 'predictor' && (
            <PredictionView
              students={students}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setCurrentTab('students');
              }}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              notifications={notifications}
              students={students}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearNotification={handleClearNotification}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              students={students}
              subjects={subjects}
              records={records}
            />
          )}

          {currentTab === 'viva_prep' && (
            <VivaCheatsheetView />
          )}
        </main>

      </div>

      {/* Viva / Internship Report Dossier Modal */}
      <VivaModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />

    </div>
  );
}
