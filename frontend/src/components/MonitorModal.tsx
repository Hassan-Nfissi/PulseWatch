import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Monitor } from '../types';

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    targetUrl: string;
    httpMethod: string;
    checkIntervalSeconds: number;
    expectedStatusCode: number;
  }) => Promise<void>;
  initialData?: Monitor | null;
}

export const MonitorModal: React.FC<MonitorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'HEAD'>('GET');
  const [checkIntervalSeconds, setCheckIntervalSeconds] = useState(60);
  const [expectedStatusCode, setExpectedStatusCode] = useState(200);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetUrl(initialData.targetUrl);
      setHttpMethod(initialData.httpMethod);
      setCheckIntervalSeconds(initialData.checkIntervalSeconds);
      setExpectedStatusCode(initialData.expectedStatusCode);
    } else {
      setName('');
      setTargetUrl('https://');
      setHttpMethod('GET');
      setCheckIntervalSeconds(60);
      setExpectedStatusCode(200);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        targetUrl,
        httpMethod,
        checkIntervalSeconds: Number(checkIntervalSeconds),
        expectedStatusCode: Number(expectedStatusCode),
      });
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save monitor';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            {initialData ? 'Edit Monitor' : 'Create New Monitor'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Error: </span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Friendly Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Production API Gateway"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target URL
            </label>
            <input
              type="url"
              required
              placeholder="https://api.example.com/health"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Protected by anti-SSRF filters. Internal IP ranges and AWS metadata endpoints are blocked.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                HTTP Method
              </label>
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value as 'GET' | 'HEAD')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              >
                <option value="GET">GET</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Check Interval
              </label>
              <select
                value={checkIntervalSeconds}
                onChange={(e) => setCheckIntervalSeconds(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              >
                <option value={60}>Every 1 minute</option>
                <option value={300}>Every 5 minutes</option>
                <option value={900}>Every 15 minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Expected HTTP Status Code
            </label>
            <input
              type="number"
              required
              min={100}
              max={599}
              value={expectedStatusCode}
              onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
