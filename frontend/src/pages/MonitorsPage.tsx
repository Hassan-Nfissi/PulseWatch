import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit2,
  Search,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Monitor } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UptimeBar } from '../components/UptimeBar';
import { MonitorModal } from '../components/MonitorModal';

export const MonitorsPage: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UP' | 'DOWN' | 'PAUSED'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);

  const fetchMonitors = async () => {
    try {
      const data = await apiClient.getMonitors();
      setMonitors(data);
    } catch (err) {
      console.error('Failed to load monitors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleTogglePause = async (m: Monitor) => {
    if (m.isPaused) {
      await apiClient.resumeMonitor(m.id);
    } else {
      await apiClient.pauseMonitor(m.id);
    }
    await fetchMonitors();
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete monitor "${name}"? This action cannot be undone.`)) {
      await apiClient.deleteMonitor(id);
      await fetchMonitors();
    }
  };

  const handleSaveMonitor = async (data: any) => {
    if (editingMonitor) {
      await apiClient.updateMonitor(editingMonitor.id, data);
    } else {
      await apiClient.createMonitor(data);
    }
    await fetchMonitors();
    setEditingMonitor(null);
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'PAUSED'
        ? m.isPaused
        : m.status === filter && !m.isPaused;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.targetUrl.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Monitors</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure uptime targets, check frequencies, and alert thresholds.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMonitor(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Monitor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'UP', 'DOWN', 'PAUSED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search monitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Monitors Table */}
      {filteredMonitors.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No monitors found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Name & Target</th>
                  <th className="px-6 py-3.5 font-semibold">Interval</th>
                  <th className="px-6 py-3.5 font-semibold">30d Uptime</th>
                  <th className="px-6 py-3.5 font-semibold">Last Latency</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMonitors.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={m.status} />
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/monitors/${m.id}`}
                        className="font-semibold text-sm text-white hover:text-indigo-400 transition-colors block"
                      >
                        {m.name}
                      </Link>
                      <div className="text-slate-400 text-xs font-mono truncate max-w-xs mt-0.5">
                        {m.targetUrl}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {m.checkIntervalSeconds < 60
                        ? `${m.checkIntervalSeconds}s`
                        : `${m.checkIntervalSeconds / 60}m`}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap w-44">
                      <UptimeBar percentage={m.uptime30d} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-200">
                      {m.lastResponseTimeMs ? `${m.lastResponseTimeMs}ms` : '—'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTogglePause(m)}
                          title={m.isPaused ? 'Resume' : 'Pause'}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          {m.isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingMonitor(m);
                            setIsModalOpen(true);
                          }}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMonitor(null);
        }}
        onSubmit={handleSaveMonitor}
        initialData={editingMonitor}
      />
    </div>
  );
};
