import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';
import { PulseWatchLogo } from '../PulseWatchLogo';

export const FounderSection: React.FC = () => {
  return (
    <section className="py-20 md:py-24 relative bg-slate-950/80 border-t border-slate-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Leadership & Mission
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Built by engineers,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              led by developer conviction.
            </span>
          </h2>
        </div>

        {/* Founder Card */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Avatar / Brand Side */}
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-950 p-1 shadow-2xl ring-2 ring-indigo-500/40 flex items-center justify-center">
                <PulseWatchLogo size="lg" showText={false} />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow">
                Co-Founder
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Hassan Nfissi
              </h3>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-0.5">
                Co-Founder &amp; Lead Architect
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                Spring &amp; Cloud Native
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                Zero-Trust Security
              </span>
            </div>
          </div>

          {/* Mission Quote Side */}
          <div className="md:col-span-8 space-y-5">
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>CO-FOUNDER MESSAGE // PUBLIC LAUNCH</span>
            </div>

            <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal italic">
              &ldquo;We created PulseWatch to solve a real frustration: modern uptime monitoring should be instant, transparent, and resilient without inflated subscription fees or artificial limits.
              We engineered the core engine with non-blocking WebFlux and kernel-level SSRF defenses so you can trust your monitoring completely.
              Right now, our entire service is 100% free for everyone during our launch.&rdquo;
            </blockquote>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Subscription Fees During Beta</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>SSRF Protection by Default</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Free Branded Public Status Pages</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct Founder &amp; Community Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
