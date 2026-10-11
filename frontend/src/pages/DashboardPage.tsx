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
  Search,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Globe,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UP' | 'DOWN' | 'PAUSED'>('ALL');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [statsData, monitorsData, incidentsData] = await Promise.all([
        apiClient.getStats(),
        apiClient.getMonitors(),
        apiClient.getIncidents(),
      ]);
      setStats(statsData);
      setMonitors(monitorsData);
      setIncidents(incidentsData.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

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

  const handleCopyUrl = (url: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter monitors
  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAUSED') return m.isPaused;
    if (statusFilter === 'UP') return m.status === 'UP' && !m.isPaused;
    if (statusFilter === 'DOWN') return m.status === 'DOWN' && !m.isPaused;
    return true;
  });

  const allOperational = stats ? stats.downMonitors === 0 : true;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-zinc-500">Loading telemetry data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Top Global Status Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          allOperational
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
              allOperational ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white tracking-wide">
                {allOperational ? 'ALL SYSTEMS OPERATIONAL' : 'SYSTEM INCIDENT DETECTED'}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {allOperational
                ? `100% of monitored probes are healthy. 30-day average uptime is ${stats?.overallUptime30d?.toFixed(2) || '100'}%.`
                : `${stats?.downMonitors} service(s) currently experiencing degradation or downtime.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SSRF Filter Active</span>
          </div>
          <button
            onClick={handleManualRefresh}
            title="Refresh telemetry"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monitors */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>ACTIVE MONITORS</span>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {stats?.totalMonitors || 0}
            </span>
            <span className="text-xs font-mono text-zinc-500">configured</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>10s scheduler evaluation</span>
          </div>
        </div>

        {/* Operational */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
            <span>HEALTHY PROBES</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
              {stats?.upMonitors || 0}
            </span>
            <span className="text-xs font-mono text-zinc-500">/ {stats?.totalMonitors || 0}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            <span>Responding HTTP 200 OK</span>
          </div>
        </div>

        {/* Outages */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-rose-400 font-medium">
            <span>INCIDENTS / OUTAGES</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-400 tracking-tight">
              {stats?.downMonitors || 0}
            </span>
            <span className="text-xs font-mono text-zinc-500">open tickets</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            {stats?.downMonitors === 0 ? 'Zero active service disruptions' : 'Immediate alert dispatched'}
          </div>
        </div>

        {/* 30-Day Uptime */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>30-DAY SLA UPTIME</span>
            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {stats?.overallUptime30d ? `${stats.overallUptime30d.toFixed(2)}%` : '100%'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono">
            <span>Production Grade SLA</span>
          </div>
        </div>
      </div>

      {/* Main Action Bar: Search, Filters, and New Monitor */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monitors by name or URL..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filter Pills & Create Monitor */}
        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
            {(['ALL', 'UP', 'DOWN', 'PAUSED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {filter === 'ALL'
                  ? `All (${monitors.length})`
                  : filter === 'UP'
                  ? `Up (${monitors.filter((m) => m.status === 'UP' && !m.isPaused).length})`
                  : filter === 'DOWN'
                  ? `Down (${monitors.filter((m) => m.status === 'DOWN' && !m.isPaused).length})`
                  : `Paused (${monitors.filter((m) => m.isPaused).length})`}
              </button>
            ))}
          </div>

          {/* New Monitor Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Monitor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Monitor Fleet & Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monitor Fleet List (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            <span>Fleet Probes ({filteredMonitors.length})</span>
            <Link
              to="/monitors"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 normal-case text-xs"
            >
              Full Monitor Table <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredMonitors.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed space-y-3">
              <Globe className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No monitors found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No monitors matched your search query. Try clearing the search filter.'
                  : 'Get started by creating your first uptime probe to monitor health and latency.'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Monitor</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMonitors.map((m) => {
                const isCopied = copiedId === m.id;
                const latency = m.lastResponseTimeMs || 0;

                return (
                  <Link
                    key={m.id}
                    to={`/monitors/${m.id}`}
                    className="block p-4 sm:p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          <StatusBadge status={m.status} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {m.name}
                            </h3>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                m.httpMethod === 'GET'
                                  ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                                  : 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                              }`}
                            >
                              {m.httpMethod}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {m.checkIntervalSeconds}s
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-1 truncate">
                            <span className="truncate max-w-[280px] sm:max-w-xs">{m.targetUrl}</span>
                            <button
                              onClick={(e) => handleCopyUrl(m.targetUrl, m.id, e)}
                              title="Copy Target URL"
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                              {isCopied ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Telemetry & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-zinc-800/60 flex-shrink-0">
                        {/* 30-Day Uptime Ribbon */}
                        <div className="w-28 sm:w-36 space-y-1">
                          <UptimeBar percentage={m.uptime30d} />
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>30d</span>
                            <span className="text-zinc-400 font-semibold">{m.uptime30d?.toFixed(1) || '100'}%</span>
                          </div>
                        </div>

                        {/* Latency */}
                        <div className="text-right min-w-[65px]">
                          <div
                            className={`text-xs font-mono font-bold ${
                              !latency
                                ? 'text-zinc-500'
                                : latency < 150
                                ? 'text-emerald-400'
                                : latency < 350
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {latency ? `${latency} ms` : '—'}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {m.lastCheckedAt
                              ? new Date(m.lastCheckedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Pending'}
                          </div>
                        </div>

                        {/* Pause / Resume Button */}
                        <button
                          onClick={(e) => handleTogglePause(m, e)}
                          title={m.isPaused ? 'Resume probe' : 'Pause probe'}
                          className={`p-2 rounded-xl border text-xs transition-colors ${
                            m.isPaused
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'text-zinc-400 bg-zinc-800/80 border-zinc-700 hover:text-amber-300 hover:bg-zinc-800'
                          }`}
                        >
                          {m.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Incident Telemetry Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            <span>Incident Audit Feed</span>
            <span className="text-[10px] font-mono text-zinc-500">Live Webhooks</span>
          </div>

          {incidents.length === 0 ? (
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto" />
              <p className="text-sm font-bold text-white">Zero Active Disruptions</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All scheduled probes are returning expected HTTP response codes with zero connection timeouts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    inc.status === 'OPEN'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-zinc-900/40 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[170px]">
                      {inc.monitorName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        inc.status === 'OPEN'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {inc.status === 'OPEN' ? 'OUTAGE OPEN' : 'RESOLVED'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-zinc-400 truncate">
                    {inc.cause || 'Service unresponsive'}
                  </p>

                  <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {new Date(inc.startedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {inc.durationSeconds && (
                      <span className="text-amber-400/90 font-bold">
                        Duration: {Math.round(inc.durationSeconds / 60)}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Shortcuts Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 space-y-2 text-xs text-zinc-400">
            <div className="font-semibold text-zinc-200">DevOps Quick Actions</div>
            <div className="space-y-1.5 pt-1">
              <Link
                to="/status-pages"
                className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Manage Public Status Pages</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
              <Link
                to="/monitors"
                className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Bulk Monitor Configuration</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
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
