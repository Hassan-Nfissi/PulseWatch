import React from 'react';
import {
  Globe,
  LineChart,
  ShieldCheck,
  BellRing,
  Share2,
  Zap,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'HTTP(s) & REST API Monitoring',
      description:
        'Continuous checks for your APIs, websites, and microservices. Configure HTTP GET or HEAD methods, customizable intervals (60s to 900s), and expected HTTP status codes.',
      badge: 'Core Engine',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: LineChart,
      title: '24-Hour Latency Analytics',
      description:
        'Spot performance degradation before full outages occur. High-resolution time-series response time graphs identify slow database queries and network spikes.',
      badge: 'Time-Series',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust SSRF Protection',
      description:
        'Built-in security filter blocks private subnets (RFC 1918), loopback interfaces, and cloud metadata services (169.254.169.254) before any socket connection is opened.',
      badge: 'Security',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: BellRing,
      title: 'Automated Incident Tracking',
      description:
        'Automated state machine opens incident records on downtime, captures root-cause error codes, and calculates exact outage duration once service health is restored.',
      badge: 'Auto-Recovery',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Share2,
      title: 'Branded Public Status Pages',
      description:
        'Keep users and stakeholders informed with shareable status pages at /status/:slug. Showcase 30-day uptime bars, live component health, and incident history.',
      badge: 'Customer Trust',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Zap,
      title: 'Instant Email Alerting',
      description:
        'Receive immediate HTML-formatted alert notifications directly to your inbox when a monitor fails, with exact error details and instant recovery confirmation.',
      badge: 'Real-Time',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Features & Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              uncompromising uptime.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Engineered from the ground up for high reliability, minimal resource footprint, and instant failure visibility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-7 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>Production verified</span>
                  <span className="mx-2">•</span>
                  <span>100% automated</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
