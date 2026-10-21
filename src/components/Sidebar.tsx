import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  TrendingUp,
  BellRing,
  FileSpreadsheet,
  BookOpen,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'marking'
  | 'predictor'
  | 'alerts'
  | 'reports'
  | 'viva_prep'
  | 'viva';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlertsCount: number;
  atRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadAlertsCount,
  atRiskCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'students' as NavTab,
      label: 'Student Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'marking' as NavTab,
      label: 'Mark Attendance',
      icon: ClipboardCheck,
      badge: null,
    },
    {
      id: 'predictor' as NavTab,
      label: 'AI Attendance Predictor',
      icon: Cpu,
      badge: atRiskCount > 0 ? `${atRiskCount} At-Risk` : null,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      id: 'alerts' as NavTab,
      label: 'Alerts & Notices',
      icon: BellRing,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount} New` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Analytics',
      icon: FileSpreadsheet,
      badge: 'CSV / PDF',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      id: 'viva_prep' as NavTab,
      label: 'Viva Prep & Q&A Deck',
      icon: Award,
      badge: 'Viva Mode',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'viva' as NavTab,
      label: 'Internship & Viva Dossier',
      icon: BookOpen,
      badge: 'Report',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      
      {/* Institution Mini Subhead */}
      <div className="p-4 border-b border-slate-100 hidden md:block bg-slate-50/50">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Academic Workspace
        </div>
        <div className="text-sm font-bold text-slate-800 mt-0.5">
          III Year AI & DS - Sec 'A'
        </div>
        <div className="text-xs text-slate-500">
          Semester V • Anna Univ Syllabus
        </div>
      </div>

      {/* Navigation links */}
      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status Footer */}
      <div className="p-4 border-t border-slate-100 hidden md:block bg-slate-50/80">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-700">75% Mandatory Policy</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          Predictive alerts flag students approaching the minimum attendance bar for exam eligibility.
        </p>
      </div>

    </aside>
  );
};
