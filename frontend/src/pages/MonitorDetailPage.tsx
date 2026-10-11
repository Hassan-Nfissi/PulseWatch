import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Monitor, Incident, Heartbeat } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UptimeBar } from '../components/UptimeBar';
import { ResponseTimeChart } from '../components/ResponseTimeChart';
import { IncidentList } from '../components/IncidentList';
import { MonitorModal } from '../components/MonitorModal';

export const MonitorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [heartbeats, setHeartbeats] = useState<Heartbeat[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const monitorId = Number(id);

  const fetchData = async () => {
    if (!monitorId) return;
    try {
      const [analyticsData, incidentsData] = await Promise.all([
        apiClient.getMonitorAnalytics(monitorId, range),
        apiClient.getMonitorIncidents(monitorId),
      ]);
      setMonitor(analyticsData.monitor);
      setHeartbeats(analyticsData.heartbeats as any);
      setIncidents(incidentsData);
    } catch (err) {
      console.error('Failed to load monitor details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, [monitorId, range]);

  const handleTogglePause = async () => {
    if (!monitor) return;
    if (monitor.isPaused) {
      await apiClient.resumeMonitor(monitor.id);
    } else {
      await apiClient.pauseMonitor(monitor.id);
    }
    await fetchData();
  };

  const handleDelete = async () => {
    if (!monitor) return;
    if (confirm(`Are you sure you want to delete monitor "${monitor.name}"?`)) {
      await apiClient.deleteMonitor(monitor.id);
      navigate('/monitors');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!monitor) return;
    await apiClient.updateMonitor(monitor.id, data);
    await fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-white">Monitor Not Found</h2>
        <Link to="/monitors" className="text-indigo-400 text-sm mt-2 inline-block">
          &larr; Back to Monitors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button and header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/monitors"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{monitor.name}</h1>
              <StatusBadge status={monitor.status} size="lg" />
            </div>
            <a
              href={monitor.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 font-mono"
            >
              {monitor.targetUrl} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
              monitor.isPaused
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            {monitor.isPaused ? (
              <>
                <Play className="w-3.5 h-3.5" /> Resume
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            )}
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            30-Day Uptime
          </span>
          <div className="mt-2">
            <UptimeBar percentage={monitor.uptime30d} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Check Frequency
          </span>
          <div className="mt-2 text-xl font-bold text-white">
            Every {monitor.checkIntervalSeconds < 60 ? `${monitor.checkIntervalSeconds}s` : `${monitor.checkIntervalSeconds / 60}m`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Expected Status
          </span>
          <div className="mt-2 text-xl font-bold text-white font-mono">
            HTTP {monitor.expectedStatusCode}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Latest Latency
          </span>
          <div className="mt-2 text-xl font-bold text-indigo-400 font-mono">
            {monitor.lastResponseTimeMs ? `${monitor.lastResponseTimeMs} ms` : '—'}
          </div>
        </div>
      </div>

      {/* Response Time Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Response Time History</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Time-series response times in milliseconds over selected interval.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  range === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <ResponseTimeChart data={heartbeats} />
      </div>

      {/* Incidents & Heartbeat log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Incident Timeline</h2>
          <IncidentList incidents={incidents} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Recent Checks Log</h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Code</th>
                    <th className="px-4 py-2.5">Latency</th>
                    <th className="px-4 py-2.5">Checked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {heartbeats.slice(-15).reverse().map((hb) => (
                    <tr key={hb.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            hb.status === 'UP' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">
                        {hb.statusCode || 'ERR'}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">
                        {hb.responseTimeMs ? `${hb.responseTimeMs}ms` : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {new Date(hb.checkedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <MonitorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={monitor}
      />
    </div>
  );
};
