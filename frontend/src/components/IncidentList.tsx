import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Incident } from '../types';

interface IncidentListProps {
  incidents: Incident[];
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-medium text-slate-300">No Incidents Reported</p>
        <p className="text-xs text-slate-500 mt-0.5">All systems have been fully operational.</p>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Ongoing';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-3">
      {incidents.map((incident) => {
        const isOpen = incident.status === 'OPEN';
        return (
          <div
            key={incident.id}
            className={`p-4 rounded-xl border transition-all ${
              isOpen
                ? 'bg-rose-500/5 border-rose-500/20'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    isOpen ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {isOpen ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {incident.monitorName}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isOpen
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isOpen ? 'Active Outage' : 'Resolved'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {incident.cause || 'Service unavailable'}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span>
                      Started: {new Date(incident.startedAt).toLocaleString()}
                    </span>
                    {incident.resolvedAt && (
                      <span>
                        Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(incident.durationSeconds)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
