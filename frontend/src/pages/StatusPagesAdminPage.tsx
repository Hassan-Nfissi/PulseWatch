import React, { useEffect, useState } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Monitor, StatusPage } from '../types';

export const StatusPagesAdminPage: React.FC = () => {
  const [statusPages, setStatusPages] = useState<StatusPage[]>([]);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<number[]>([]);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [pagesData, monitorsData] = await Promise.all([
        apiClient.getStatusPages(),
        apiClient.getMonitors(),
      ]);
      setStatusPages(pagesData);
      setMonitors(monitorsData);
    } catch (err) {
      console.error('Failed to load status pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingPageId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setIsPublic(true);
    setSelectedMonitorIds(monitors.map((m) => m.id)); // Default select all
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (page: StatusPage) => {
    setEditingPageId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setDescription(page.description || '');
    setIsPublic(page.isPublic);
    setSelectedMonitorIds(page.monitors.map((m) => m.id));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slug,
        description,
        isPublic,
        monitorIds: selectedMonitorIds,
      };

      if (editingPageId) {
        await apiClient.updateStatusPage(editingPageId, payload);
      } else {
        await apiClient.createStatusPage(payload);
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save status page');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete status page "${title}"?`)) {
      await apiClient.deleteStatusPage(id);
      await fetchData();
    }
  };

  const copyPublicLink = (slug: string) => {
    const url = `${window.location.origin}/status/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const toggleMonitor = (id: number) => {
    setSelectedMonitorIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Public Status Pages</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build branded, unauthenticated status pages for your customers and stakeholders.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Status Page
        </button>
      </div>

      {statusPages.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
          <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No status pages yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Create a public status page to communicate outages transparently with your users.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Create Your First Status Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statusPages.map((page) => (
            <div
              key={page.id}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{page.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {page.description || 'Public status display for infrastructure services.'}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      page.isPublic
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {page.isPublic ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono text-indigo-400 truncate max-w-[250px]">
                    /status/{page.slug}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyPublicLink(page.slug)}
                      title="Copy Public URL"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    >
                      {copiedSlug === page.slug ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`/status/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open Public Page"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-xs text-slate-500 self-center mr-1">Linked monitors:</span>
                  {page.monitors.map((m) => (
                    <span
                      key={m.id}
                      className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md"
                    >
                      {m.name}
                    </span>
                  ))}
                  {page.monitors.length === 0 && (
                    <span className="text-xs text-slate-600">None</span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(page)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id, page.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">
                {editingPageId ? 'Edit Status Page' : 'New Status Page'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Production Services"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingPageId) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm">
                  <span className="text-slate-500">/status/</span>
                  <input
                    type="text"
                    required
                    pattern="^[a-z0-9-]+$"
                    placeholder="acme-prod"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    className="w-full bg-transparent text-white focus:outline-none ml-0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Public description of the services monitored."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Monitors to Display
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {monitors.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMonitorIds.includes(m.id)}
                        onChange={() => toggleMonitor(m.id)}
                        className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span className="text-white font-medium">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublicCheck"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
                <label htmlFor="isPublicCheck" className="text-xs text-slate-300">
                  Make status page public (unauthenticated access)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingPageId ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
