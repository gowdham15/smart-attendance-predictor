import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Calendar,
  Building,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  Layers
} from 'lucide-react';
import { Student, Subject, AttendanceRecord } from '../types';
import { calculateStudentPrediction } from '../utils/predictor';

interface ReportsViewProps {
  students: Student[];
  subjects: Subject[];
  records: AttendanceRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  subjects,
  records,
}) => {
  const [filterDept] = useState('Artificial Intelligence and Data Science');
  const [isPrintView, setIsPrintView] = useState(false);

  // Compute all predictions
  const predictions = students.map((s) => ({
    student: s,
    pred: calculateStudentPrediction(s),
  }));

  const exportCSV = () => {
    const headers = [
      'Register Number',
      'Student Name',
      'Department',
      'Year & Sec',
      'Total Classes',
      'Attended Classes',
      'OD Classes',
      'Current Attendance %',
      'Predicted Final %',
      'Classification',
      'Consecutive Classes Needed For 75%',
      'Safe Absence Allowance',
      'Model Confidence %',
    ];

    const rows = predictions.map(({ student, pred }) => [
      `"${student.registerNumber}"`,
      `"${student.name}"`,
      `"${student.department}"`,
      `"${student.year} - Sec ${student.section}"`,
      student.totalClasses,
      student.attendedClasses,
      student.odClasses,
      student.attendancePercentage,
      pred.predictedFinalPercentage,
      `"${pred.riskCategory.toUpperCase()}"`,
      pred.classesNeededFor75,
      pred.safeBunkAllowance,
      `${pred.modelConfidence}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Smart_Attendance_Predictor_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Task 7: Reports &amp; Comprehensive Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Institutional Attendance Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Export official records to CSV spreadsheet format or generate printable Anna University format report cards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>
          <button
            onClick={() => setIsPrintView(!isPrintView)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isPrintView ? 'Exit Print Mode' : 'Printable Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable / Formatted Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Formal Institutional Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-wide uppercase">
            KGiSL Institute of Technology
          </div>
          <div className="text-xs font-semibold text-slate-600">
            (An Autonomous Institution • Affiliated to Anna University, Chennai)
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            365, KGiSL Campus, Thudiyalur Road, Saravanampatti, Coimbatore – 641035
          </div>
          <div className="mt-3 inline-block px-4 py-1 bg-slate-100 rounded-md text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider border border-slate-300">
            Department of Artificial Intelligence and Data Science
          </div>
          <div className="text-xs font-semibold text-blue-700 mt-2">
            SMART ATTENDANCE PREDICTION &amp; SHORTAGE ANALYSIS REPORT • SEMESTER V (2026-2027)
          </div>
        </div>

        {/* Report Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class / Degree</span>
            <span className="font-bold text-slate-800">III B.Tech AI &amp; DS 'A'</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Students</span>
            <span className="font-bold text-slate-800">{students.length} Enrolled</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Classes Completed</span>
            <span className="font-bold text-slate-800">{students[0]?.totalClasses || 84} Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Report Generated</span>
            <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Official Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-y border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">S.No</th>
                <th className="py-2.5 px-3">Register No.</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Attended</th>
                <th className="py-2.5 px-3">OD</th>
                <th className="py-2.5 px-3">Current %</th>
                <th className="py-2.5 px-3">Predicted Final %</th>
                <th className="py-2.5 px-3">Action Needed</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {predictions.map(({ student, pred }, idx) => {
                const isGowdham = student.registerNumber === '711724UAD133';

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50 transition ${
                      isGowdham ? 'bg-indigo-50/20 font-medium' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">
                      {student.registerNumber}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        <span>{student.name}</span>
                        {isGowdham && (
                          <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white">
                            Author
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">{student.totalClasses}</td>
                    <td className="py-2 px-3 font-medium text-slate-700">
                      {student.attendedClasses}
                    </td>
                    <td className="py-2 px-3">{student.odClasses}</td>
                    <td className="py-2 px-3 font-extrabold text-slate-900">
                      {student.attendancePercentage}%
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-700">
                      {pred.predictedFinalPercentage}%
                    </td>
                    <td className="py-2 px-3">
                      {pred.classesNeededFor75 > 0 ? (
                        <span className="text-rose-600 font-bold">
                          Must attend +{pred.classesNeededFor75}
                        </span>
                      ) : (
                        <span className="text-emerald-600">
                          Buffer: {pred.safeBunkAllowance}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pred.riskCategory === 'safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pred.riskCategory === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pred.riskCategory.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Signatures Section for Viva & Academic Submission */}
        <div className="pt-10 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-500 italic">
              Ms. Jasmine Saranya
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Faculty Incharge / Coordinator
            </div>
            <div className="text-[10px] text-slate-500">Dept of AI &amp; DS</div>
          </div>
          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-500 italic">
              Dr. Sathish R
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Head of the Department (HOD)
            </div>
            <div className="text-[10px] text-slate-500">Dept of AI &amp; DS</div>
          </div>
          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-500 italic">
              Dr. Suresh Kumar S
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Principal
            </div>
            <div className="text-[10px] text-slate-500">KGiSL Institute of Technology</div>
          </div>
        </div>

        {/* Print Button within page */}
        {isPrintView && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print This Document</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
