import React from 'react';
import { Cpu, Database, Server, Shield, Layers, HardDrive } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const specs = [
    {
      icon: Cpu,
      title: 'Spring WebFlux Engine',
      description:
        'Non-blocking, event-driven HTTP ping worker built on Reactor Netty. Evaluates high-concurrency monitor fleets with sub-millisecond thread switching overhead.',
      metric: 'Non-Blocking',
      metricLabel: 'Netty Event Loops',
    },
    {
      icon: Database,
      title: 'PostgreSQL 16 Time-Series Indexing',
      description:
        'Composite B-Tree indexes on (monitor_id, checked_at DESC) guarantee ultra-fast analytics across millions of historical heartbeat records.',
      metric: '< 2ms',
      metricLabel: 'Index Query Latency',
    },
    {
      icon: Server,
      title: 'Redis 7 In-Memory Cache',
      description:
        'Sub-millisecond token caching, session verification, and fast state distribution to eliminate redundant database load.',
      metric: 'In-Memory',
      metricLabel: 'Distributed Caching',
    },
    {
      icon: Shield,
      title: 'SSRF DNS Pre-Flight Firewall',
      description:
        'Kernel-level IP validation checks all target hostnames against RFC 1918 subnets and cloud metadata IPs (169.254.169.254) before establishing any connection.',
      metric: 'RFC 1918 Block',
      metricLabel: 'Zero-Trust Outbound',
    },
    {
      icon: HardDrive,
      title: 'Automated 30-Day Retention Pruning',
      description:
        'Automated midnight scheduled cleanup purges telemetry heartbeats older than 30 days, keeping database volumes lean and eliminating storage bloat.',
      metric: 'Self-Cleaning',
      metricLabel: 'Daily Data Hygiene',
    },
    {
      icon: Layers,
      title: 'Full Docker Compose Microservices',
      description:
        'Production-ready container orchestration with Alpine JRE, Nginx HTTPS reverse proxy, health-check dependencies, and automated SSL cert renewal.',
      metric: '100% Isolated',
      metricLabel: 'Docker Orchestrated',
    },
  ];

  return (
    <section id="architecture" className="py-20 md:py-28 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Engineering & Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Built for engineering teams who demand <br className="hidden sm:inline" />
            <span className="text-zinc-400">transparent performance.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            No bloated dependencies, no mystery black boxes. PulseWatch is engineered for transparent speed, ironclad security, and cloud-native resilience.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-7 hover:border-cyan-500/30 transition-all hover:bg-slate-900/70 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-cyan-400">
                      {item.metric}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {item.metricLabel}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
