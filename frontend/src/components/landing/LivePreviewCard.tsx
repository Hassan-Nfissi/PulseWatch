import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Shield, Globe } from 'lucide-react';

export const LivePreviewCard: React.FC = () => {
  const [latency, setLatency] = useState(38);
  const [pulse, setPulse] = useState(false);

  // Simulate real-time heartbeat ticker every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4 ms
      setLatency((prev) => Math.min(52, Math.max(31, prev + delta)));
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // 30 days dummy uptime blocks
  const uptimeDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: i === 18 ? 'degraded' : 'up',
    uptime: i === 18 ? '99.2%' : '100%',
  }));

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl shadow-indigo-950/40 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80">
      {/* Top Header Mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900 ${
                pulse ? 'animate-ping' : ''
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">api.production-cluster.io</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Operational
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>HTTPS GET • 60s interval</span>
              <span>•</span>
              <span className="text-slate-400">Target HTTP 200</span>
            </div>
          </div>
        </div>

        {/* Realtime KPI Pill */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <Zap className={`w-3.5 h-3.5 ${pulse ? 'text-cyan-400' : 'text-slate-500'} transition-colors`} />
            <span>Response Time</span>
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {latency} ms
          </div>
        </div>
      </div>

      {/* 30-Day Uptime Ribbon */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-300">30-Day Rolling Uptime</span>
          </div>
          <span className="font-mono font-semibold text-emerald-400">99.98%</span>
        </div>

        {/* Bar Pills */}
        <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1 sm:gap-1.5 h-8 p-1 rounded-lg bg-slate-950/70 border border-slate-800/60">
          {uptimeDays.map((d) => (
            <div
              key={d.day}
              title={`Day ${d.day}: ${d.uptime} uptime`}
              className={`h-full rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer ${
                d.status === 'up'
                  ? 'bg-emerald-500/80 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-amber-500/90 hover:bg-amber-400'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>30 days ago</span>
          <span className="text-emerald-400/80">99.98% overall</span>
          <span>Today</span>
        </div>
      </div>

      {/* Bottom Live Metrics Row */}
      <div className="mt-5 pt-4 border-t border-slate-800/70 grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50">
          <div className="text-[11px] text-slate-400 font-medium">SSL Certificate</div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Valid (82d)
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50">
          <div className="text-[11px] text-slate-400 font-medium">SSRF Filter</div>
          <div className="text-xs font-semibold text-indigo-400 mt-0.5">
            Active & Secured
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50">
          <div className="text-[11px] text-slate-400 font-medium">Incident Status</div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            0 Open Incidents
          </div>
        </div>
      </div>
    </div>
  );
};
