import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Send,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Filter,
  Trash2,
  FileText
} from 'lucide-react';
import { AlertNotification, Student } from '../types';

interface AlertsViewProps {
  notifications: AlertNotification[];
  students: Student[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  students,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNoticeStudent, setSelectedNoticeStudent] = useState<Student | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [sentNoticeSuccess, setSentNoticeSuccess] = useState<boolean>(false);

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCopyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleSendNotice = () => {
    setSentNoticeSuccess(true);
    setTimeout(() => setSentNoticeSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" />
            <span>Task 6: Alerts &amp; Institutional Notification Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Attendance Alerts &amp; Official Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time warnings for students breaching the 75% bar and automated parent communication templates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterType === 'unread'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterType === 'critical'
              ? 'bg-rose-600 text-white'
              : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          Critical Shortage (&lt;65%)
        </button>
        <button
          onClick={() => setFilterType('warning')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterType === 'warning'
              ? 'bg-amber-600 text-white'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          Warning (65-74%)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Notifications Stream */}
        <div className="lg:col-span-2 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              No notifications matching this filter.
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const student = students.find((s) => s.id === notif.studentId);
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition ${
                    notif.isRead
                      ? 'bg-white border-slate-200'
                      : notif.type === 'critical'
                      ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                      : 'bg-amber-50/40 border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {notif.type === 'critical' && (
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'warning' && (
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'info' && (
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Student: <strong className="text-slate-800">{notif.studentName}</strong> (
                          <span className="font-mono text-slate-500">{notif.registerNumber}</span>)
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {new Date(notif.timestamp).toLocaleDateString()}
                      </span>
                      <div className="mt-2 flex items-center space-x-1">
                        {!notif.isRead && (
                          <button
                            onClick={() => onMarkAsRead(notif.id)}
                            className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onClearNotification(notif.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span>Recorded Rate: <strong>{notif.currentPercentage}%</strong></span>
                      <span>•</span>
                      <span>AI Projected: <strong>{notif.predictedPercentage}%</strong></span>
                    </div>

                    {student && (
                      <button
                        onClick={() => setSelectedNoticeStudent(student)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>Generate Academic Notice</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 1 Col: Official Formal Notice Dispatch Generator */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Institutional Notice Dispatch
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Generate and dispatch an official attendance shortage intimation letter to the student and parent.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student:
            </label>
            <select
              value={selectedNoticeStudent?.id || ''}
              onChange={(e) => {
                const s = students.find((st) => st.id === e.target.value) || null;
                setSelectedNoticeStudent(s);
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="">-- Choose student --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.attendancePercentage}%) - {st.registerNumber}
                </option>
              ))}
            </select>
          </div>

          {selectedNoticeStudent ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
{`KGiSL INSTITUTE OF TECHNOLOGY
DEPARTMENT OF AI & DATA SCIENCE
ATTENDANCE SHORTAGE NOTICE

To: Mr./Ms. ${selectedNoticeStudent.name} (${selectedNoticeStudent.registerNumber})
Class: III Year B.Tech AI & DS 'A' (Semester V)
Parent Contact: ${selectedNoticeStudent.parentPhone}

Dear Parent / Student,
This is to bring to your immediate attention that your current attendance is ${selectedNoticeStudent.attendancePercentage}%, which is below the mandatory Anna University norm of 75%.

As per our AI Smart Attendance Predictor, if this absenteeism continues, you are at critical risk of examination debarment for Semester V.

Kindly meet Ms. Jasmine Saranya (Internship Coordinator) or Dr. Sathish R (HOD) immediately.

Authorized Signatory,
HOD - Artificial Intelligence & Data Science`}
              </div>

              {sentNoticeSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notice simulated and dispatched to student email &amp; SMS!</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleCopyNotice(
                      `KGiSL Institute of Technology - AI & DS: Attendance Shortage Alert for ${selectedNoticeStudent.name} (${selectedNoticeStudent.registerNumber}). Current Attendance: ${selectedNoticeStudent.attendancePercentage}%. Immediate counseling required.`
                    )
                  }
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  {copiedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SMS Text</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSendNotice}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Notice</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Select a student above to inspect and dispatch their formal academic notice.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
