import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock } from 'lucide-react';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Public Launch • 100% Free
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Full monitoring access,{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              zero subscription fees.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            During our public launch phase, all core monitoring capabilities are completely free.
            Paid subscriptions are coming in future releases, but your access is free today with no credit card required.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Active Free Launch Plan */}
          <div className="relative rounded-3xl p-8 flex flex-col justify-between bg-slate-900 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/30 scale-100 lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-md">
              Available Now • Free Access
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">Community Launch Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete access to the PulseWatch monitoring engine for developers and teams.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border text-emerald-300 bg-emerald-500/10 border-emerald-500/30">
                  Active
                </span>
              </div>

              {/* Price Block */}
              <div className="pt-2 flex items-baseline gap-1.5">
                <span className="text-5xl font-black text-white font-mono">$0</span>
                <span className="text-sm font-semibold text-emerald-400">
                  / free forever
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Everything included today:
                </div>
                {[
                  '50 HTTP(s) & REST API Monitors',
                  '60s, 300s & 900s Check Intervals',
                  'Unlimited Branded Public Status Pages',
                  'Real-Time HTML Email Outage Alerts',
                  '30-Day Rolling Latency History & Charts',
                  'Zero-Trust SSRF Protection (RFC 1918 Block)',
                  'Automated Incident Tracking & Downtime Seconds',
                  'No Credit Card Required',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800/80">
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pro (Coming Soon) */}
          <div className="relative rounded-3xl p-8 flex flex-col justify-between bg-slate-900/40 border border-slate-800/80 opacity-85 hover:opacity-100 transition-opacity">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Pro Team</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-region synthetic locations, team roles, and webhook integrations.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border text-indigo-300 bg-indigo-500/10 border-indigo-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Coming Soon
                </span>
              </div>

              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-400 font-mono">Future Plan</span>
                <span className="text-xs text-slate-500">In Development</span>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Planned Pro Capabilities:
                </div>
                {[
                  'Everything in Community Plan',
                  '30-Second High Frequency Checks',
                  'Multi-Region Geo Ping Workers',
                  'Slack & Discord Webhook Alerts',
                  'SSL Certificate Expiry Tracking',
                  'Role-Based Team Collaboration',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800/80">
              <div className="w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-800/60 text-slate-400 border border-slate-700/60 cursor-not-allowed">
                <span>Coming in Future Release</span>
              </div>
            </div>
          </div>

          {/* Enterprise & Scale (Coming Soon) */}
          <div className="relative rounded-3xl p-8 flex flex-col justify-between bg-slate-900/40 border border-slate-800/80 opacity-85 hover:opacity-100 transition-opacity">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Enterprise Scale</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Dedicated worker pools, white-label custom domains, and SLA compliance.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border text-cyan-300 bg-cyan-500/10 border-cyan-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Coming Soon
                </span>
              </div>

              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-400 font-mono">Future Plan</span>
                <span className="text-xs text-slate-500">In Development</span>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Planned Enterprise Capabilities:
                </div>
                {[
                  'Everything in Pro Plan',
                  'Dedicated Worker IP Addresses',
                  'White-Label Status Pages with Custom SSL',
                  '90-Day Extended Telemetry Retention',
                  'SLA Uptime Compliance Reports',
                  'Custom Single Sign-On (SAML / SSO)',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800/80">
              <div className="w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-800/60 text-slate-400 border border-slate-700/60 cursor-not-allowed">
                <span>Coming in Future Release</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
