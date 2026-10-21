import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
  BookOpen
} from 'lucide-react';
import { Student, RiskCategory, Subject } from '../types';
import { calculateStudentPrediction, simulateAttendance } from '../utils/predictor';

interface StudentManagementViewProps {
  students: Student[];
  subjects: Subject[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  subjects,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  selectedStudent,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | RiskCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // What-If local simulation state for student detail drawer
  const [simulateClasses, setSimulateClasses] = useState(10);
  const [simulateAttendCount, setSimulateAttendCount] = useState(8);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: 'Artificial Intelligence and Data Science',
    year: 'III Year',
    semester: 'V Semester',
    section: 'A',
    email: '',
    phone: '',
    parentPhone: '',
    totalClasses: 84,
    attendedClasses: 65,
    odClasses: 1,
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      registerNumber: `711724UAD${100 + students.length + 1}`,
      department: 'Artificial Intelligence and Data Science',
      year: 'III Year',
      semester: 'V Semester',
      section: 'A',
      email: '',
      phone: '+91 ',
      parentPhone: '+91 ',
      totalClasses: 84,
      attendedClasses: 65,
      odClasses: 1,
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormData({
      name: student.name,
      registerNumber: student.registerNumber,
      department: student.department,
      year: student.year,
      semester: student.semester,
      section: student.section,
      email: student.email,
      phone: student.phone,
      parentPhone: student.parentPhone,
      totalClasses: student.totalClasses,
      attendedClasses: student.attendedClasses,
      odClasses: student.odClasses,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.registerNumber) return;

    const total = Number(formData.totalClasses) || 84;
    const attended = Number(formData.attendedClasses) || 0;
    const od = Number(formData.odClasses) || 0;
    const effectiveAttended = attended + od * 0.5;
    const percentage = Number(((effectiveAttended / total) * 100).toFixed(1));

    let risk: RiskCategory = 'safe';
    if (percentage < 65) risk = 'at_risk';
    else if (percentage < 75) risk = 'warning';

    // Build subject-wise default distribution
    const subjectWise: Record<string, { attended: number; total: number; percentage: number }> = {};
    subjects.forEach((sub) => {
      const subAttended = Math.round((sub.totalConducted * percentage) / 100);
      subjectWise[sub.code] = {
        attended: subAttended,
        total: sub.totalConducted,
        percentage: Number(((subAttended / sub.totalConducted) * 100).toFixed(1)),
      };
    });

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        ...formData,
        totalClasses: total,
        attendedClasses: attended,
        odClasses: od,
        attendancePercentage: percentage,
        riskCategory: risk,
        subjectWiseAttendance: editingStudent.subjectWiseAttendance || subjectWise,
      };
      onUpdateStudent(updated);
    } else {
      const newStudent: Student = {
        id: `std_${Date.now()}`,
        ...formData,
        totalClasses: total,
        attendedClasses: attended,
        odClasses: od,
        attendancePercentage: percentage,
        riskCategory: risk,
        streakAbsences: 0,
        subjectWiseAttendance: subjectWise,
      };
      onAddStudent(newStudent);
    }

    setIsAddModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'all' || s.riskCategory === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Student Management Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage student records, view attendance statistics, and run individual forecasts.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, register number (e.g. 711724UAD133)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Risk Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          <span className="text-slate-400 mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Status:
          </span>
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterRisk === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setFilterRisk('safe')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterRisk === 'safe'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Safe (&ge;75%)
          </button>
          <button
            onClick={() => setFilterRisk('warning')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterRisk === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Warning (65-74%)
          </button>
          <button
            onClick={() => setFilterRisk('at_risk')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterRisk === 'at_risk'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            At-Risk (&lt;65%)
          </button>
        </div>

      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Department & Class</th>
                <th className="py-3.5 px-4">Attendance %</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">AI Prediction</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No students match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const pred = calculateStudentPrediction(st);
                  const isSpecialGowdham = st.registerNumber === '711724UAD133';

                  return (
                    <tr
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className={`hover:bg-blue-50/40 transition cursor-pointer ${
                        isSpecialGowdham ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      {/* Register Number */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800 flex items-center space-x-1.5">
                        <span>{st.registerNumber}</span>
                        {isSpecialGowdham && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                            Author
                          </span>
                        )}
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>

                      {/* Dept & Class */}
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        <div className="font-medium">AI &amp; DS (Sec {st.section})</div>
                        <div className="text-[11px] text-slate-400">III Year • Sem V</div>
                      </td>

                      {/* Attendance % with Mini Bar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 w-12">
                            {st.attendancePercentage}%
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div
                              className={`h-1.5 rounded-full ${
                                st.attendancePercentage >= 75
                                  ? 'bg-emerald-500'
                                  : st.attendancePercentage >= 65
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, st.attendancePercentage)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {st.attendedClasses} of {st.totalClasses} classes
                        </div>
                      </td>

                      {/* Risk Category Badge */}
                      <td className="py-3 px-4">
                        {st.riskCategory === 'safe' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Safe</span>
                          </span>
                        )}
                        {st.riskCategory === 'warning' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Warning</span>
                          </span>
                        )}
                        {st.riskCategory === 'at_risk' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>At-Risk</span>
                          </span>
                        )}
                      </td>

                      {/* AI Prediction */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-bold text-slate-800">
                            {pred.predictedFinalPercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({pred.modelConfidence}% conf.)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {pred.classesNeededFor75 > 0 ? (
                            <span className="text-rose-600 font-semibold">
                              Needs +{pred.classesNeededFor75} classes
                            </span>
                          ) : (
                            <span className="text-emerald-600">
                              Can miss up to {pred.safeBunkAllowance}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(st);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Deep Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleOpenEditModal(st, e)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${st.name}?`)) {
                                onDeleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            
            <button
              onClick={() => onSelectStudent(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedStudent.name}
                  </h3>
                  {selectedStudent.registerNumber === '711724UAD133' && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-600 text-white">
                      Author / Intern
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-500 font-semibold mt-0.5">
                  Reg No: {selectedStudent.registerNumber} • Dept of {selectedStudent.department}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedStudent.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedStudent.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Prediction Insight Box */}
            {(() => {
              const pred = calculateStudentPrediction(selectedStudent);
              const sim = simulateAttendance(selectedStudent, simulateAttendCount, simulateClasses);

              return (
                <div className="mt-5 space-y-5">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI Forecasting Engine</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {pred.modelConfidence}% Model Confidence
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <div className="text-[11px] text-slate-400">Current Rate</div>
                        <div className="text-xl font-extrabold text-white mt-1">
                          {pred.currentPercentage}%
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <div className="text-[11px] text-slate-400">Predicted Final</div>
                        <div className="text-xl font-extrabold text-cyan-400 mt-1">
                          {pred.predictedFinalPercentage}%
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <div className="text-[11px] text-slate-400">Classes Needed</div>
                        <div className="text-xl font-extrabold text-rose-400 mt-1">
                          {pred.classesNeededFor75 > 0 ? `+${pred.classesNeededFor75}` : '0'}
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <div className="text-[11px] text-slate-400">Safe Bunk Allowance</div>
                        <div className="text-xl font-extrabold text-emerald-400 mt-1">
                          {pred.safeBunkAllowance}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                      <strong>AI Diagnosis: </strong> {pred.aiRecommendation}
                    </p>
                  </div>

                  {/* Subject Wise Performance */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Subject Breakdown</span>
                    </h4>
                    <div className="space-y-2">
                      {subjects.map((sub) => {
                        const rec = selectedStudent.subjectWiseAttendance[sub.code] || {
                          attended: Math.round(sub.totalConducted * 0.8),
                          total: sub.totalConducted,
                          percentage: 80,
                        };
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{sub.code}: </span>
                              <span className="text-slate-600">{sub.name}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-slate-500 font-mono">
                                {rec.attended}/{rec.total} sessions
                              </span>
                              <span
                                className={`font-bold px-2 py-0.5 rounded ${
                                  rec.percentage >= 75
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : rec.percentage >= 65
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {rec.percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive What-If Simulator for this Student */}
                  <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>Interactive What-If Scenario Simulator</span>
                    </h4>
                    <p className="text-xs text-indigo-800 mb-3">
                      Simulate the impact of attending upcoming lectures on semester eligibility:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Upcoming Classes to Simulate: {simulateClasses}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={simulateClasses}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSimulateClasses(val);
                            if (simulateAttendCount > val) setSimulateAttendCount(val);
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Classes Student Attends: {simulateAttendCount}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={simulateClasses}
                          value={simulateAttendCount}
                          onChange={(e) => setSimulateAttendCount(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Resulting Attendance: </span>
                        <strong
                          className={`text-sm ${
                            sim.achieves75 ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'
                          }`}
                        >
                          {sim.simulatedPercentage}%
                        </strong>
                        <span className="text-slate-400 ml-1.5">
                          ({sim.difference >= 0 ? `+${sim.difference}%` : `${sim.difference}%`} change)
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          sim.achieves75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sim.achieves75 ? 'Target 75% Achieved!' : 'Below 75% Required'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => onSelectStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gowdham S"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Register Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registerNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registerNumber: e.target.value.toUpperCase() })
                    }
                    placeholder="711724UAD133"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Year &amp; Section
                  </label>
                  <input
                    type="text"
                    value={`${formData.year} - Sec ${formData.section}`}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@kgisl.ac.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 90420 90708"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    value={formData.totalClasses}
                    onChange={(e) =>
                      setFormData({ ...formData, totalClasses: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Attended
                  </label>
                  <input
                    type="number"
                    value={formData.attendedClasses}
                    onChange={(e) =>
                      setFormData({ ...formData, attendedClasses: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    On-Duty (OD)
                  </label>
                  <input
                    type="number"
                    value={formData.odClasses}
                    onChange={(e) =>
                      setFormData({ ...formData, odClasses: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
