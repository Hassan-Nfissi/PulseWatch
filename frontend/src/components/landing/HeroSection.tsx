import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Activity } from 'lucide-react';
import { LivePreviewCard } from './LivePreviewCard';

export const HeroSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStartFree = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login', { state: { suggestedEmail: email.trim() } });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-950/50 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>PulseWatch 2.0 • Ultra-Low Latency & High Concurrency Monitoring</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Catch downtime{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              before your users do.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Continuous uptime monitoring, instant email alerting, and public status pages.
            Powered by non-blocking WebFlux and SSRF-hardened architecture.
          </p>
        </div>

        {/* Quick Email Start CTA Form */}
        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleStartFree}
            className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="flex-1 px-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-500/30 transition-all hover:scale-[1.02] flex-shrink-0"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>50 monitors free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>SSRF Protected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Sub-second alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>No credit card needed</span>
            </div>
          </div>
        </div>

        {/* Live Mockup Preview */}
        <div className="pt-6 sm:pt-10">
          <LivePreviewCard />
        </div>
      </div>
    </section>
  );
};
