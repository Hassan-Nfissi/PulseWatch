import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-indigo-950/50">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Start monitoring in seconds.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Seriously.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Create your first monitor, set up automated email notifications, and publish your branded public status page in less than 2 minutes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02]"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-all"
              >
                Explore Features
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Free forever tier included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Instant setup via Google or Dev login
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
