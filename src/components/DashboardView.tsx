import React from 'react';
import {
  Users,
  Percent,
  AlertTriangle,
  UserX,
  BookCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Student, AttendanceRecord, AlertNotification, Subject } from '../types';
import { calculateStudentPrediction } from '../utils/predictor';

interface DashboardViewProps {
  students: Student[];
  records: AttendanceRecord[];
  notifications: AlertNotification[];
  subjects: Subject[];
  onNavigateTab: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  records,
  notifications,
  subjects,
  onNavigateTab,
  onSelectStudent,
}) => {
  // Compute Key Metrics
  const totalStudents = students.length;
  const totalConducted = records.length > 0 ? students[0]?.totalClasses || 84 : 84;
  
  const avgAttendance =
    students.length > 0
      ? (
          students.reduce((acc, s) => acc + s.attendancePercentage, 0) /
          students.length
        ).toFixed(1)
      : '0.0';

  const atRiskStudents = students.filter((s) => s.attendancePercentage < 65);
  const warningStudents = students.filter(
    (s) => s.attendancePercentage >= 65 && s.attendancePercentage < 75
  );
  const safeStudents = students.filter((s) => s.attendancePercentage >= 75);

  // Latest record absentees
  const latestRecord = records[0];
  const todayAbsenteesCount = latestRecord
    ? latestRecord.entries.filter((e) => e.status === 'absent').length
    : 0;

  // AI predictions summary
  const predictions = students.map((s) => calculateStudentPrediction(s));
  const predictedAtRiskCount = predictions.filter((p) => p.riskCategory === 'at_risk').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome with AI Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Smart Attendance Predictor • Litz Tech AI Model</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Academic Attendance Intelligence
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time monitoring and Scikit-learn predictive forecasting for Class III Year AI & DS 'A'. 
              Identifying students at risk before Anna University semester debarment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('marking')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-blue-600/30"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigateTab('predictor')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition border border-slate-700"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Run AI Predictor</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">III Year AI & DS (A)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span className="text-emerald-600 font-semibold">{safeStudents.length} Safe</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{warningStudents.length} Warn</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">{atRiskStudents.length} Risk</span>
          </div>
        </div>

        {/* Average Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Class Average
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {avgAttendance}%
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Above 75% Target
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, Number(avgAttendance))}%` }}
            />
          </div>
        </div>

        {/* Students At Risk */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Shortage Risk
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              {atRiskStudents.length + warningStudents.length}
            </span>
            <span className="text-xs text-rose-600 font-medium">
              Below 75% Threshold
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span className="text-rose-600 font-bold">{atRiskStudents.length} critical</span> (&lt;65%) + {warningStudents.length} warning
          </div>
        </div>

        {/* Absentees in Latest Record */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recent Session Absentees
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {todayAbsenteesCount}
            </span>
            <span className="text-xs text-slate-500">
              of {latestRecord?.entries.length || totalStudents} students
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{latestRecord ? `${latestRecord.date} • Period ${latestRecord.period}` : 'No sessions today'}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Charts & AI Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Subject-Wise & Trend Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subject Attendance Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Subject-Wise Attendance Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  Semester V Core Courses (Minimum University Requirement: 75%)
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Total Classes: {totalConducted}
              </span>
            </div>

            {/* Subject Bars */}
            <div className="space-y-4">
              {subjects.map((sub) => {
                // Compute average attendance in this subject
                const subAttendances = students.map(
                  (st) => st.subjectWiseAttendance[sub.code]?.percentage || 75
                );
                const subAvg = (
                  subAttendances.reduce((a, b) => a + b, 0) / (subAttendances.length || 1)
                ).toFixed(1);
                const numAvg = Number(subAvg);

                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{sub.code}: </span>
                        <span className="font-medium text-slate-700">{sub.name}</span>
                        <span className="text-slate-400 ml-1.5 hidden sm:inline">
                          ({sub.facultyName})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold ${
                            numAvg >= 75
                              ? 'text-emerald-600'
                              : numAvg >= 65
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {subAvg}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({sub.totalConducted} conducted)
                        </span>
                      </div>
                    </div>

                    {/* Bar with 75% reference marker */}
                    <div className="relative w-full bg-slate-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          numAvg >= 75
                            ? 'bg-emerald-500'
                            : numAvg >= 65
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, numAvg)}%` }}
                      />
                      {/* 75% target dashed indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
                        style={{ left: '75%' }}
                        title="75% Mandatory Threshold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>&ge; 75% Safe</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>65% - 74.9% Warning</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>&lt; 65% At-Risk</span>
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline">
                Dashed line = 75% minimum
              </span>
            </div>
          </div>

          {/* Monthly Progression / Trend Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Semester Attendance Trajectory
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly trend & predicted trajectory towards end-of-semester exams
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center space-x-1 text-blue-600 font-semibold">
                  <span className="w-3 h-0.5 bg-blue-600 inline-block" />
                  <span>Historical</span>
                </span>
                <span className="flex items-center space-x-1 text-cyan-500 font-semibold">
                  <span className="w-3 h-0.5 bg-cyan-400 border-dashed border-b-2 inline-block" />
                  <span>AI Forecast</span>
                </span>
              </div>
            </div>

            {/* SVG Trend Graph */}
            <div className="w-full h-48 bg-slate-50/70 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
              <svg viewBox="0 0 600 140" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x="5" y="18" fill="#94a3b8" fontSize="10">90%</text>

                <line x1="0" y1="55" x2="600" y2="55" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
                <text x="5" y="52" fill="#ef4444" fontSize="10" fontWeight="bold">75% (Min)</text>

                <line x1="0" y1="90" x2="600" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x="5" y="88" fill="#94a3b8" fontSize="10">60%</text>

                {/* Historical Line: June -> July -> Aug -> Sep -> Oct */}
                <path
                  d="M 50 45 L 170 42 L 290 48 L 410 46"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Projected Line: Oct -> Nov -> Dec */}
                <path
                  d="M 410 46 L 500 44 L 580 40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { x: 50, y: 45, label: 'June (83%)' },
                  { x: 170, y: 42, label: 'July (84%)' },
                  { x: 290, y: 48, label: 'Aug (79%)' },
                  { x: 410, y: 46, label: 'Sep/Oct (80%)' },
                  { x: 500, y: 44, label: 'Nov [Proj] (81%)' },
                  { x: 580, y: 40, label: 'Dec [Proj] (82.5%)' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={i >= 4 ? 4 : 5}
                      fill={i >= 4 ? '#06b6d4' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </svg>

              {/* Month labels */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-2 pt-2 border-t border-slate-200">
                <span>June (Start)</span>
                <span>July (CIA 1)</span>
                <span>August (Mid)</span>
                <span>September (CIA 2)</span>
                <span className="text-cyan-600 font-bold">November (Model)</span>
                <span className="text-cyan-600 font-bold">December (Univ Exam)</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-600 bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Predictor Insight:</strong> Class average is trending steadily at ~80%. However, 3 students are pulling down section aggregate and require focused intervention to avoid debarment.
              </span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: AI Risk Watchlist & Quick Actions */}
        <div className="space-y-6">
          
          {/* Risk Watchlist Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Critical Watchlist
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('predictor')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Students at immediate risk of falling below mandatory 75% semester requirement:
            </p>

            <div className="space-y-3">
              {predictions
                .filter((p) => p.riskCategory !== 'safe')
                .slice(0, 4)
                .map((pred) => {
                  const studentObj = students.find((s) => s.id === pred.studentId);
                  return (
                    <div
                      key={pred.studentId}
                      onClick={() => studentObj && onSelectStudent(studentObj)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {pred.studentName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {pred.registerNumber}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              pred.riskCategory === 'at_risk'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {pred.currentPercentage}%
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Proj: {pred.predictedFinalPercentage}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] bg-slate-100/80 px-2 py-1 rounded text-slate-600 flex items-center justify-between">
                        <span>Classes needed for 75%:</span>
                        <strong className="text-rose-600 font-bold">
                          +{pred.classesNeededFor75} sessions
                        </strong>
                      </div>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => onNavigateTab('alerts')}
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Send Attendance Warnings</span>
            </button>
          </div>

          {/* Student Gowdham S Spotlight Card (Report Author) */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                Intern Profile
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200/60 text-indigo-800">
                Author
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center">
                GS
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Gowdham S</h4>
                <p className="text-xs text-slate-600 font-mono">711724UAD133</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-xl border border-indigo-100/60">
              <div>
                <div className="text-[10px] text-slate-500">Attendance</div>
                <div className="font-extrabold text-slate-900">79.8% (Safe)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Prediction</div>
                <div className="font-extrabold text-blue-600">81.5% Final</div>
              </div>
            </div>
            <button
              onClick={() => {
                const gowdham = students.find((s) => s.registerNumber === '711724UAD133');
                if (gowdham) onSelectStudent(gowdham);
              }}
              className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
            >
              View Detailed Analytics
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Recent System Activity
              </h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="truncate max-w-[160px]">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
