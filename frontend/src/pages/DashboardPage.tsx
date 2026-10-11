import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  AlertOctagon,
  Plus,
  Play,
  Pause,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DashboardStats, Monitor, Incident } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UptimeBar } from '../components/UptimeBar';
import { MonitorModal } from '../components/MonitorModal';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [statsData, monitorsData, incidentsData] = await Promise.all([
        apiClient.getStats(),
        apiClient.getMonitors(),
        apiClient.getIncidents(),
      ]);
      setStats(statsData);
      setMonitors(monitorsData);
      setIncidents(incidentsData.slice(0, 5)); // Last 5 incidents
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds for live status
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateMonitor = async (data: any) => {
    await apiClient.createMonitor(data);
    await fetchData();
  };

  const handleTogglePause = async (monitor: Monitor, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (monitor.isPaused) {
      await apiClient.resumeMonitor(monitor.id);
    } else {
      await apiClient.pauseMonitor(monitor.id);
    }
    await fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time monitoring and uptime statistics across your infrastructure.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Monitor
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Monitors
            </span>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {stats?.totalMonitors || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Operational
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-emerald-400 tracking-tight">
            {stats?.upMonitors || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Outages
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-rose-400 tracking-tight">
            {stats?.downMonitors || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              30-Day Uptime
            </span>
            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {stats?.overallUptime30d ? `${stats.overallUptime30d.toFixed(2)}%` : '100%'}
          </div>
        </div>
      </div>

      {/* Main Grid: Monitors & Recent Outages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monitors List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Monitors</h2>
            <Link
              to="/monitors"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {monitors.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
              <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No monitors configured</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Start tracking your websites and APIs by creating your first monitor.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Create Monitor
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {monitors.map((m) => (
                <Link
                  key={m.id}
                  to={`/monitors/${m.id}`}
                  className="block p-4 sm:p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-1">
                        <StatusBadge status={m.status} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                            {m.name}
                          </h3>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {m.httpMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                          {m.targetUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/60">
                      <div className="w-32">
                        <UptimeBar percentage={m.uptime30d} />
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-medium text-slate-200">
                          {m.lastResponseTimeMs ? `${m.lastResponseTimeMs}ms` : '—'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {m.lastCheckedAt
                            ? `${new Date(m.lastCheckedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`
                            : 'Pending'}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleTogglePause(m, e)}
                        title={m.isPaused ? 'Resume monitoring' : 'Pause monitoring'}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          m.isPaused
                            ? 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                            : 'text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
                        }`}
                      >
                        {m.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Incidents Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>

          {incidents.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">All systems normal</p>
              <p className="text-xs text-slate-500 mt-1">No outages in the current period.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-3.5 rounded-xl border ${
                    inc.status === 'OPEN'
                      ? 'bg-rose-500/10 border-rose-500/20'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[150px]">
                      {inc.monitorName}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        inc.status === 'OPEN'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {inc.status === 'OPEN' ? 'Active' : 'Resolved'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {inc.cause || 'Service unavailable'}
                  </p>
                  <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(inc.startedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMonitor}
      />
    </div>
  );
};
