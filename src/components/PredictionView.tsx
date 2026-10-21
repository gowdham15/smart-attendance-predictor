import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { Student, PredictionInsight, RiskCategory } from '../types';
import {
  calculateStudentPrediction,
  simulateAttendance,
  TOTAL_SEMESTER_CLASSES,
  MANDATORY_ATTENDANCE_THRESHOLD,
  WARNING_ATTENDANCE_THRESHOLD
} from '../utils/predictor';

interface PredictionViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  students,
  onSelectStudent,
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | RiskCategory>('all');
  const [selectedSimStudentId, setSelectedSimStudentId] = useState<string>(
    students.find((s) => s.registerNumber === '711724UAD133')?.id || students[0]?.id
  );
  const [upcomingTotal, setUpcomingTotal] = useState<number>(15);
  const [upcomingAttended, setUpcomingAttended] = useState<number>(12);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Compute all predictions
  const predictions: PredictionInsight[] = students.map((s) => calculateStudentPrediction(s));

  // Risk Counts
  const safeCount = predictions.filter((p) => p.riskCategory === 'safe').length;
  const warningCount = predictions.filter((p) => p.riskCategory === 'warning').length;
  const atRiskCount = predictions.filter((p) => p.riskCategory === 'at_risk').length;
  const avgPredicted = (
    predictions.reduce((acc, p) => acc + p.predictedFinalPercentage, 0) /
    (predictions.length || 1)
  ).toFixed(1);

  const filteredPredictions = predictions.filter((p) => {
    if (filterRisk === 'all') return true;
    return p.riskCategory === filterRisk;
  });

  // Current simulation target
  const simStudent = students.find((s) => s.id === selectedSimStudentId) || students[0];
  const simulationResult = simStudent
    ? simulateAttendance(simStudent, upcomingAttended, upcomingTotal)
    : null;

  return (
    <div className="space-y-6">
      
      {/* Top AI Engine Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Core Module 5: Machine Learning Attendance Predictor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Predictive Attendance &amp; Shortage Forecasting
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Using student historical attendance rates, consecutive absence streaks, and weekday behavioral patterns to forecast end-of-semester percentages and calculate required recovery targets.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{showFormulaDetails ? 'Hide Formulas' : 'Explainable AI Logic'}</span>
            </button>
          </div>
        </div>

        {/* Explainable AI Drawer */}
        {showFormulaDetails && (
          <div className="mt-5 p-4 bg-slate-950/80 rounded-xl border border-indigo-800/80 text-xs text-slate-300 space-y-3">
            <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Scikit-Learn Heuristic &amp; Algebraic Model Specifications:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                <strong className="text-white block mb-1">1. Minimum Consecutive Classes Needed:</strong>
                <code>x = ceil((0.75 * totalClasses - attended) / 0.25)</code>
                <p className="text-slate-400 mt-1 font-sans text-xs">
                  Determines the exact non-negotiable attendance streak to cross the 75% bar.
                </p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                <strong className="text-white block mb-1">2. Safe Absence Buffer (Bunk Allowance):</strong>
                <code>y = floor((attended - 0.75 * totalClasses) / 0.75)</code>
                <p className="text-slate-400 mt-1 font-sans text-xs">
                  Calculates how many classes can be safely missed without dipping below 75%.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              * Feature Engineering includes: Absence streak penalty factor, Day-of-week sensitivity weighting, and remaining semester lecture capacity ({TOTAL_SEMESTER_CLASSES} total semester benchmark hours).
            </div>
          </div>
        )}
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Projected Class Final</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{avgPredicted}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">End of Semester Forecast</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase">Safe Category (&ge;75%)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{safeCount} Students</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Exam Eligible</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-amber-600 font-semibold uppercase">Warning Zone (65-74%)</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{warningCount} Students</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Near Debarment Line</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-rose-600 font-semibold uppercase">At-Risk Debarred (&lt;65%)</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{atRiskCount} Students</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate Notice Required</div>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator Card */}
      {simStudent && simulationResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive 'What-If' Attendance Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Select a student and adjust upcoming attendance parameters to calculate forecasted results.
                </p>
              </div>
            </div>

            {/* Student dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-semibold">Simulate for:</span>
              <select
                value={selectedSimStudentId}
                onChange={(e) => setSelectedSimStudentId(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.attendancePercentage}%) - {st.registerNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Slider 1: Total upcoming lectures */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Upcoming Classes to Conduct:</span>
                <span className="font-bold text-blue-600">{upcomingTotal} classes</span>
              </div>
              <input
                type="range"
                min="5"
                max="36"
                value={upcomingTotal}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setUpcomingTotal(val);
                  if (upcomingAttended > val) setUpcomingAttended(val);
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 classes</span>
                <span>Next 2 weeks</span>
                <span>36 classes (Rest of Sem)</span>
              </div>
            </div>

            {/* Slider 2: Number of classes attended */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Classes Attended by Student:</span>
                <span className="font-bold text-emerald-600">{upcomingAttended} classes</span>
              </div>
              <input
                type="range"
                min="0"
                max={upcomingTotal}
                value={upcomingAttended}
                onChange={(e) => setUpcomingAttended(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 (Full Absent)</span>
                <span>50%</span>
                <span>{upcomingTotal} (100% Perfect)</span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Simulated Outcome</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    simulationResult.achieves75
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {simulationResult.achieves75 ? 'ELIGIBLE' : 'DEBARMENT RISK'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {simulationResult.simulatedPercentage}%
                </span>
                <span
                  className={`text-xs font-bold ${
                    simulationResult.difference >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {simulationResult.difference >= 0
                    ? `+${simulationResult.difference}%`
                    : `${simulationResult.difference}%`}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Was {simStudent.attendancePercentage}%. If {simStudent.name.split(' ')[0]} attends{' '}
                {upcomingAttended}/{upcomingTotal} classes, final attendance reaches{' '}
                <strong>{simulationResult.simulatedPercentage}%</strong>.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Filter and Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900">
              Student Attendance Predictions Roster
            </h3>
            <span className="text-xs text-slate-400">
              ({filteredPredictions.length} students)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterRisk === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Predictions
            </button>
            <button
              onClick={() => setFilterRisk('safe')}
              className={`px-3 py-1 rounded-lg transition ${
                filterRisk === 'safe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Safe
            </button>
            <button
              onClick={() => setFilterRisk('warning')}
              className={`px-3 py-1 rounded-lg transition ${
                filterRisk === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => setFilterRisk('at_risk')}
              className={`px-3 py-1 rounded-lg transition ${
                filterRisk === 'at_risk'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              At-Risk
            </button>
          </div>
        </div>

        {/* Prediction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Register Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Current Attendance</th>
                <th className="py-3 px-4">AI Predicted Final %</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Classes Needed / Bunk Buffer</th>
                <th className="py-3 px-4">Pattern / AI Diagnosis</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPredictions.map((pred) => {
                const studentObj = students.find((s) => s.id === pred.studentId);
                const isGowdham = pred.registerNumber === '711724UAD133';

                return (
                  <tr
                    key={pred.studentId}
                    className={`hover:bg-slate-50/80 transition ${
                      isGowdham ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {pred.registerNumber}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        <span>{pred.studentName}</span>
                        {isGowdham && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                            Intern
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {pred.currentPercentage}%
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-extrabold text-sm ${
                            pred.predictedFinalPercentage >= 75
                              ? 'text-emerald-600'
                              : pred.predictedFinalPercentage >= 65
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {pred.predictedFinalPercentage}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({pred.modelConfidence}% conf.)
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {pred.riskCategory === 'safe' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Safe</span>
                        </span>
                      )}
                      {pred.riskCategory === 'warning' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Warning</span>
                        </span>
                      )}
                      {pred.riskCategory === 'at_risk' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>At-Risk</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {pred.classesNeededFor75 > 0 ? (
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded text-xs inline-block">
                          Must attend: +{pred.classesNeededFor75} classes
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded text-xs inline-block">
                          Can miss: {pred.safeBunkAllowance} classes safely
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        {pred.aiRecommendation}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Absence trend: {pred.trendDirection} • Vulnerable: {pred.weekdayVulnerability}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSimStudentId(pred.studentId);
                          if (studentObj) onSelectStudent(studentObj);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                      >
                        Simulate
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
