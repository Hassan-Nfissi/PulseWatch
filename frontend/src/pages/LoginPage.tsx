import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { PulseWatchLogo } from '../components/PulseWatchLogo';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithDevMode, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const suggestedEmail = (location.state as any)?.suggestedEmail;
  const [devEmail, setDevEmail] = useState(
    suggestedEmail ? suggestedEmail.split('@')[0] : 'demo.engineer'
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
      setError('Google login failed: No credential returned');
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <PulseWatchLogo size="xl" showText={false} />
          </div>
          <h1 className="text-3xl font-black tracking-widest uppercase bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
            PulseWatch
          </h1>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Continuous Uptime Monitoring &bull; Incident Detection &bull; Status Pages
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 backdrop-blur-sm">
          {/* Google Sign-In */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
              Sign In with Google
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed or was cancelled')}
                useOneTap={false}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Or Local Dev Access
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Dev Mode Instant Login */}
          <form onSubmit={handleDevLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Developer Identity / Email Handle
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <input
                  type="text"
                  required
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent text-white focus:outline-none"
                />
                <span className="text-slate-500">@example.com</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              {isLoading ? 'Signing in...' : 'Sign In as Developer (1-Click)'}
            </button>
          </form>
        </div>

        {/* Security Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-900/30 border border-slate-800/80 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-[11px] font-medium text-slate-300">SSRF Protected</div>
            <div className="text-[10px] text-slate-500">Private ranges blocked</div>
          </div>
          <div className="p-3 bg-slate-900/30 border border-slate-800/80 rounded-xl">
            <Zap className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <div className="text-[11px] font-medium text-slate-300">Async Netty WebClient</div>
            <div className="text-[10px] text-slate-500">Non-blocking pings</div>
          </div>
        </div>
      </div>
    </div>
  );
};
