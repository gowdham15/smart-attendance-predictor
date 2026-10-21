import React from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Building,
  User,
  GraduationCap,
  Calendar,
  X,
  FileCheck,
  Code2,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface VivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaModal: React.FC<VivaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Bonafide Internship Dossier
              </span>
              <span className="text-xs text-slate-400">JULY 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Smart Attendance Predictor
            </h2>
            <p className="text-xs text-slate-500">
              KGiSL Institute of Technology • Department of Artificial Intelligence and Data Science
            </p>
          </div>
        </div>

        {/* Student & College Credentials Box */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Student Details (Candidate)
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>GOWDHAM S</span>
            </div>
            <div className="text-slate-600 font-mono">
              Register No: <strong className="text-slate-900">711724UAD133</strong>
            </div>
            <div className="text-slate-600">
              Class: <strong>III Year B.Tech AI &amp; DS &ldquo;A&rdquo;</strong> (V Semester)
            </div>
            <div className="text-slate-600">
              Academic Year: <strong>2026-2027</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Internship &amp; Guidance
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Litz Tech (ISO Certified)</span>
            </div>
            <div className="text-slate-600">
              Internship Period: <strong>June 01, 2026 &ndash; June 15, 2026</strong>
            </div>
            <div className="text-slate-600">
              Internship Coordinator: <strong>Ms. Jasmine Saranya</strong>
            </div>
            <div className="text-slate-600">
              Head of Department: <strong>Dr. Sathish R</strong>
            </div>
          </div>
        </div>

        {/* 8 Development Tasks Breakdown (from Report Page 12-14) */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Implemented Report Tasks &amp; Milestones</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              {
                title: 'Task 1: Authentication Module',
                desc: 'User registration/login, JWT session security, role handling (Faculty, Admin, Student).',
              },
              {
                title: 'Task 2: Dashboard Module',
                desc: 'KPI stat cards, attendance trends, subject charts, and recent activity feeds.',
              },
              {
                title: 'Task 3: Student Management',
                desc: 'Full CRUD operations, search, filters by department/year, individual student drilldown.',
              },
              {
                title: 'Task 4: Attendance Marking',
                desc: 'Session selector, P / A / OD marking, batch actions, and live recalculation.',
              },
              {
                title: 'Task 5: AI Attendance Predictor',
                desc: 'Historical modeling, Safe/Warning/At-Risk classifications, classes needed calculation, what-if simulator.',
              },
              {
                title: 'Task 6: Alerts & Notifications',
                desc: 'Real-time shortage flags, low-attendance alerts, and copyable parent intimation notices.',
              },
              {
                title: 'Task 7: Reports & Analytics',
                desc: 'Subject and department analytics, CSV spreadsheet export, printable formal report card.',
              },
              {
                title: 'Task 8: Integration & Deployment',
                desc: 'Responsive component architecture, interactive testing, clean React + Tailwind design.',
              },
            ].map((task, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-blue-300 transition"
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{task.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{task.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Acknowledgment */}
        <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
          <strong className="text-indigo-900 block mb-1">
            Internship Acknowledgement Note:
          </strong>
          &ldquo;Gratefully acknowledged to Chairman Dr. Ashok Bakthavathsalam, CEO Mr. Aravind Kumar Rajendran, Principal Dr. Suresh Kumar S, Dean Dr. Kannan, HOD Sathish R, and Internship Coordinator Ms. Jasmine Saranya for enabling the development of this real-world AI-assisted application.&rdquo;
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
