import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  Clock,
  BookOpen,
  UserCheck,
  UserX,
  Award,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  History,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { Student, Subject, AttendanceRecord, AttendanceStatus, User } from '../types';

interface AttendanceMarkingViewProps {
  students: Student[];
  subjects: Subject[];
  records: AttendanceRecord[];
  currentUser: User;
  onSubmitAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceMarkingView: React.FC<AttendanceMarkingViewProps> = ({
  students,
  subjects,
  records,
  currentUser,
  onSubmitAttendance,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub_1');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Student statuses map: { [studentId]: 'present' | 'absent' | 'od' }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      // By default start with 'present'
      initial[s.id] = 'present';
    });
    return initial;
  });

  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Compute live stats
  const presentCount = Object.values(attendanceMap).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'absent').length;
  const odCount = Object.values(attendanceMap).filter((s) => s === 'od').length;
  const totalCount = students.length;
  const sessionPercentage =
    totalCount > 0 ? (((presentCount + odCount) / totalCount) * 100).toFixed(1) : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: AttendanceRecord = {
      id: `rec_${Date.now()}`,
      date: selectedDate,
      period: Number(selectedPeriod),
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      department: 'Artificial Intelligence and Data Science',
      year: 'III Year',
      section: 'A',
      entries: students.map((st) => ({
        studentId: st.id,
        studentName: st.name,
        registerNumber: st.registerNumber,
        status: attendanceMap[st.id] || 'present',
        remarks: remarksMap[st.id] || '',
      })),
      timestamp: new Date().toISOString(),
    };

    onSubmitAttendance(record);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>Task 4: Daily Attendance Marking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Attendance Entry &amp; Register
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Mark hour-wise presence, absences, and official On-Duty (OD) permissions with immediate AI percentage recalibration.
          </p>
        </div>

        {submittedSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attendance submitted &amp; stats updated!</span>
          </div>
        )}
      </div>

      {/* Configuration Card: Subject, Period, Date */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Subject Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Subject &amp; Course *</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Session Date *</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Period / Hour */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Hour / Period *</span>
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Period 1 (08:45 AM - 09:40 AM)</option>
                <option value={2}>Period 2 (09:40 AM - 10:35 AM)</option>
                <option value={3}>Period 3 (10:50 AM - 11:45 AM)</option>
                <option value={4}>Period 4 (11:45 AM - 12:40 PM)</option>
                <option value={5}>Period 5 (01:30 PM - 02:20 PM)</option>
                <option value={6}>Period 6 (02:20 PM - 03:10 PM)</option>
                <option value={7}>Period 7 (03:10 PM - 04:00 PM)</option>
              </select>
            </div>

            {/* Faculty In-Charge */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Marking Faculty
              </label>
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-medium truncate">
                {currentUser.name}
              </div>
            </div>

          </div>

          {/* Quick Actions & Live Stats Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Batch toggle buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 mr-1">Quick Bulk:</span>
              <button
                type="button"
                onClick={() => markAll('present')}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll('absent')}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
              >
                Mark All Absent
              </button>
            </div>

            {/* Live Counters */}
            <div className="flex items-center space-x-3 text-xs bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700">Total: {totalCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-bold">Present: {presentCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-700 font-bold">Absent: {absentCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-purple-700 font-bold">OD: {odCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-700 font-extrabold">{sessionPercentage}%</span>
            </div>

          </div>

          {/* Student Roster Marking Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Current Attendance</th>
                  <th className="py-3 px-4 text-center">Status Selection</th>
                  <th className="py-3 px-4">Remarks / OD Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => {
                  const status = attendanceMap[st.id] || 'present';
                  const isGowdham = st.registerNumber === '711724UAD133';

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isGowdham ? 'bg-indigo-50/15' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center text-slate-400 text-xs">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                        {st.registerNumber}
                      </td>

                      <td className="py-2.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span>{st.name}</span>
                          {isGowdham && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                              Author
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-4">
                        <span
                          className={`font-bold ${
                            st.attendancePercentage >= 75
                              ? 'text-emerald-600'
                              : st.attendancePercentage >= 65
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {st.attendancePercentage}%
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1">
                          ({st.attendedClasses}/{st.totalClasses})
                        </span>
                      </td>

                      {/* Status Toggle Pills: P / A / OD */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center justify-center space-x-1 bg-slate-100 p-1 rounded-xl w-fit mx-auto">
                          
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(st.id, 'present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>P</span>
                            {status === 'present' && <Check className="w-3 h-3" />}
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(st.id, 'absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>A</span>
                            {status === 'absent' && <Check className="w-3 h-3" />}
                          </button>

                          {/* On-Duty */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(st.id, 'od')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                              status === 'od'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>OD</span>
                            {status === 'od' && <Check className="w-3 h-3" />}
                          </button>

                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={remarksMap[st.id] || ''}
                          onChange={(e) =>
                            setRemarksMap({ ...remarksMap, [st.id]: e.target.value })
                          }
                          placeholder={status === 'od' ? 'e.g. Hackathon / Symposium OD' : 'Optional note...'}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                Submitting executes automated Pandas/Scikit-learn model recalibration and updates student streaks.
              </span>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Submit &amp; Update Attendance</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historical Submissions Logs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <History className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Recent Attendance Submissions Log
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {records.slice(0, 5).map((rec) => {
            const pCount = rec.entries.filter((e) => e.status === 'present').length;
            const aCount = rec.entries.filter((e) => e.status === 'absent').length;
            const odC = rec.entries.filter((e) => e.status === 'od').length;
            const rate = (((pCount + odC) / rec.entries.length) * 100).toFixed(1);

            return (
              <div
                key={rec.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-400">{rec.date}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold font-mono">
                    Period {rec.period}
                  </span>
                  <span className="font-bold text-slate-800">
                    {rec.subjectCode} - {rec.subjectName}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">
                    by {rec.facultyName}
                  </span>
                </div>
                <div className="flex items-center space-x-3 font-semibold">
                  <span className="text-emerald-700">{pCount} Present</span>
                  <span className="text-rose-700">{aCount} Absent</span>
                  {odC > 0 && <span className="text-purple-700">{odC} OD</span>}
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
