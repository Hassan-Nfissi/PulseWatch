import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PublicStatusPage as IPublicStatusPage } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { IncidentList } from '../components/IncidentList';

export const PublicStatusPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<IPublicStatusPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicPage = async () => {
      if (!slug) return;
      try {
        const res = await apiClient.getPublicStatusPage(slug);
        setData(res);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Status page not found or private');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPage();
    const interval = setInterval(fetchPublicPage, 20000); // 20s auto-refresh
    return () => clearInterval(interval);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 text-center">
        <AlertOctagon className="w-12 h-12 text-rose-500 mb-3" />
        <h1 className="text-xl font-bold text-white">Status Page Unavailable</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">{error || 'This status page is not public.'}</p>
      </div>
    );
  }

  const isAllOperational = data.overallStatus === 'ALL_OPERATIONAL';
  const isDegraded = data.overallStatus === 'DEGRADED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Live Status Page
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="text-sm text-slate-400 max-w-lg mx-auto">{data.description}</p>
          )}
        </div>

        {/* Global Status Banner */}
        <div
          className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
            isAllOperational
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : isDegraded
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {isAllOperational ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          ) : isDegraded ? (
            <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
          ) : (
            <AlertOctagon className="w-8 h-8 text-rose-400 flex-shrink-0" />
          )}

          <div>
            <h2 className="text-lg font-bold">
              {isAllOperational
                ? 'All Systems Operational'
                : isDegraded
                ? 'Degraded Performance'
                : 'Major System Outage'}
            </h2>
            <p className="text-xs opacity-90 mt-0.5">
              {isAllOperational
                ? 'All services are executing normally with zero disruptions.'
                : 'Some systems are experiencing downtime or performance degradation.'}
            </p>
          </div>
        </div>

        {/* Monitored Components */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
            <h3 className="text-sm font-semibold text-white">Services & Systems</h3>
          </div>

          <div className="divide-y divide-slate-800/60">
            {data.monitors.map((m) => (
              <div
                key={m.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-white">{m.name}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {m.lastCheckedAt
                      ? `Last checked: ${new Date(m.lastCheckedAt).toLocaleTimeString()}`
                      : 'Recently updated'}
                  </div>
                </div>

                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Past Incidents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-semibold text-white">Past Incident Timeline</h3>
          </div>
          <IncidentList incidents={data.recentIncidents} />
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
          Powered by{' '}
          <a
            href="/"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            PulseWatch
          </a>{' '}
          Uptime & Status Infrastructure
        </div>
      </div>
    </div>
  );
};
