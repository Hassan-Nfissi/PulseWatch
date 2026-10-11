import React from 'react';
import { Link } from 'react-router-dom';
import { PulseWatchLogo } from '../PulseWatchLogo';
import { ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <PulseWatchLogo size="md" showText={false} />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-wider uppercase bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
                  PulseWatch
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-indigo-400/90 uppercase -mt-1">
                  Uptime Infrastructure
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Co-founded and architected by <strong className="text-white font-medium">Hassan Nfissi</strong>. Enterprise-grade uptime monitoring, incident management, and public status pages powered by Spring WebFlux and zero-trust SSRF protection.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99%)</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Product</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  HTTP(s) Monitoring
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Response Time Charts
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Incident Alerting
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Public Status Pages
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Engine</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Spring WebFlux Worker
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  PostgreSQL Time-Series
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Redis 7 Distributed Cache
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Zero-Trust SSRF Defense
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Docker Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Access */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Access</div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In with Google
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  1-Click Dev Access
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Console Dashboard
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ & Knowledge Base
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} PulseWatch &bull; Co-Founded by <strong className="text-slate-300 font-medium">Hassan Nfissi</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              SSRF Hardened &bull; TLS Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
