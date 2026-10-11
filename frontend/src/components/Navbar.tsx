import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PulseWatchLogo } from './PulseWatchLogo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <PulseWatchLogo size="md" showText={false} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white">
                PulseWatch
              </span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest -mt-1">
                Telemetry Console
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isActive(
                '/dashboard'
              )}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/monitors"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isActive(
                '/monitors'
              )}`}
            >
              <Activity className="w-4 h-4" />
              Monitors
            </Link>
            <Link
              to="/status-pages"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isActive(
                '/status-pages'
              )}`}
            >
              <Globe className="w-4 h-4" />
              Status Pages
            </Link>
            <Link
              to="/"
              className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1.5 rounded-lg transition-colors hidden lg:flex items-center gap-1"
            >
              <span>Public Site</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                {user.pictureUrl ? (
                  <img
                    src={user.pictureUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200">{user.name || user.email}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{user.email}</div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
