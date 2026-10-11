import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Zap, AlertCircle, ArrowLeft, Lock, Terminal } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { PulseWatchLogo } from '../components/PulseWatchLogo';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithDevMode, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const suggestedEmail = (location.state as any)?.suggestedEmail;
  const [devEmail, setDevEmail] = useState(
    suggestedEmail ? suggestedEmail.split('@')[0] : 'hassan.engineer'
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError('Google authentication failed: No token returned');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devEmail.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await loginWithDevMode(devEmail.trim());
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Dev login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Left Product Showcase Column (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900/40 border-r border-zinc-800/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle dot matrix texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Brand Link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <PulseWatchLogo size="md" showText={false} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white">
                PulseWatch
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest -mt-0.5">
                Synthetic Telemetry Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center Live Telemetry Card */}
        <div className="relative z-10 max-w-md space-y-6 my-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Monitor every heartbeat. Alert on every failure.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Reactive WebFlux non-blocking ping workers, kernel-grade SSRF defense, and sub-second incident alerting.
            </p>
          </div>

          {/* Micro Telemetry Widget */}
          <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 p-5 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono font-medium text-emerald-400">FLEET STATUS: 99.98%</span>
              </div>
              <span className="font-mono text-zinc-400">p95: 42ms</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-zinc-900/60 font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded">GET</span>
                  <span>api.production.internal</span>
                </div>
                <span className="text-emerald-400 font-bold">200 OK • 38ms</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-zinc-900/60 font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 px-1 rounded">HEAD</span>
                  <span>auth.cluster-edge.io</span>
                </div>
                <span className="text-emerald-400 font-bold">200 OK • 29ms</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/60">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SSRF DNS Filter Active
              </span>
              <span>10s Check Rate</span>
            </div>
          </div>

          {/* Co-Founder Quote */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-xs text-zinc-400 space-y-2">
            <p className="italic leading-relaxed">
              &ldquo;We engineered PulseWatch to deliver high-concurrency uptime observability without bloated enterprise pricing.&rdquo;
            </p>
            <div className="text-zinc-300 font-semibold font-mono text-[11px]">
              &mdash; Hassan Nfissi, Co-Founder &amp; Lead Architect
            </div>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            TLS 1.3 Verified
          </span>
          <span>&bull;</span>
          <span>Zero Credential Retention</span>
          <span>&bull;</span>
          <span>100% Free Public Launch</span>
        </div>
      </div>

      {/* Right Authentication Form Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PulseWatch Home</span>
          </Link>

          <div className="lg:hidden">
            <PulseWatchLogo size="sm" showText={false} />
          </div>
        </div>

        {/* Center Auth Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign in to PulseWatch
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Access your monitors, telemetry dashboards, and public status pages.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl space-y-6">
            {/* Primary Google Login Button */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center">
                Recommended Access
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in was cancelled or encountered an error')}
                  useOneTap={false}
                  theme="filled_black"
                  shape="rectangular"
                  width="360"
                  text="signin_with"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-900 px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                Or Continue With Dev Access
              </span>
              <div className="border-t border-zinc-800 w-full" />
            </div>

            {/* Developer / Workspace Account Sign-In */}
            <form onSubmit={handleDevLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Developer Identity / Email Handle
                </label>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <Terminal className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="hassan.engineer"
                    className="w-full bg-transparent text-white font-mono focus:outline-none placeholder-zinc-600"
                  />
                  <span className="text-zinc-500 font-mono text-[11px] flex-shrink-0">@pulsewatch.io</span>
                </div>
              </div>

              {/* Quick Select Preset Handles */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="text-zinc-500">Quick handles:</span>
                {['hassan.engineer', 'sre.lead', 'devops.admin'].map((handle) => (
                  <button
                    type="button"
                    key={handle}
                    onClick={() => setDevEmail(handle)}
                    className="font-mono px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    {handle.split('.')[0]}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In with Developer Access'}</span>
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-zinc-500">
            By signing in, you agree to PulseWatch Terms and Zero-Trust Acceptable Use Policies.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-zinc-600">
          PulseWatch Telemetry Infrastructure &bull; Co-Founded by Hassan Nfissi
        </div>
      </div>
    </div>
  );
};
