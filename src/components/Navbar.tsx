import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  Award,
  UserCheck,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { User, AlertNotification } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  notifications: AlertNotification[];
  onOpenNotifications: () => void;
  onOpenVivaModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  notifications,
  onOpenNotifications,
  onOpenVivaModal,
  onResetData,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Branding & Institution */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-lg tracking-wider">
              SA
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Smart Attendance Predictor
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AI-Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                KGiSL Institute of Technology • Dept of AI & DS
              </p>
            </div>
          </div>

          {/* Center: Author badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">
              Submitted by <strong className="text-white font-semibold">GOWDHAM S</strong> (711724UAD133)
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-medium">Litz Tech Internship</span>
          </div>

          {/* Right: Actions, Notifications, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Project / Viva Report Button */}
            <button
              onClick={onOpenVivaModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition shadow-sm"
              title="View Internship Report & Viva Presentation Details"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Internship Report</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Alerts and Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={() => {
                if (confirm('Reset application back to initial sample dataset from the Internship Report?')) {
                  onResetData();
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition hidden sm:flex"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile / Switch Role dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] capitalize text-slate-400 leading-tight">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-50 text-slate-200 text-xs">
                    <div className="px-3 py-2 border-b border-slate-700">
                      <p className="font-medium text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300">
                        Role: {currentUser.role}
                      </span>
                    </div>

                    <div className="px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Switch Demo Role
                      </p>
                      {INITIAL_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between mb-1 transition ${
                            u.id === currentUser.id
                              ? 'bg-blue-600 text-white font-medium'
                              : 'hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-[10px] opacity-75 capitalize">
                              {u.role} {u.registerNumber ? `(${u.registerNumber})` : ''}
                            </div>
                          </div>
                          {u.id === currentUser.id && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
