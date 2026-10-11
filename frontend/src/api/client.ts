import axios from 'axios';
import {
  DashboardStats,
  Incident,
  Monitor,
  PublicStatusPage,
  StatusPage,
  User,
} from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pulsewatch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      if (!window.location.pathname.startsWith('/status/') && window.location.pathname !== '/login') {
        localStorage.removeItem('pulsewatch_token');
        localStorage.removeItem('pulsewatch_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Auth
  googleAuth: async (idToken: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/google', { idToken });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  // Dashboard & Analytics
  getStats: async () => {
    const res = await api.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },
  getMonitorAnalytics: async (monitorId: number, range = '24h') => {
    const res = await api.get<{
      monitor: Monitor;
      uptime30d: number;
      heartbeats: Array<{
        id: number;
        status: string;
        statusCode?: number;
        responseTimeMs?: number;
        errorMessage?: string;
        checkedAt: string;
      }>;
    }>(`/monitors/${monitorId}/analytics?range=${range}`);
    return res.data;
  },

  // Monitors
  getMonitors: async () => {
    const res = await api.get<Monitor[]>('/monitors');
    return res.data;
  },
  getMonitor: async (id: number) => {
    const res = await api.get<Monitor>(`/monitors/${id}`);
    return res.data;
  },
  createMonitor: async (data: {
    name: string;
    targetUrl: string;
    httpMethod: string;
    checkIntervalSeconds: number;
    expectedStatusCode: number;
  }) => {
    const res = await api.post<Monitor>('/monitors', data);
    return res.data;
  },
  updateMonitor: async (
    id: number,
    data: {
      name: string;
      targetUrl: string;
      httpMethod: string;
      checkIntervalSeconds: number;
      expectedStatusCode: number;
    }
  ) => {
    const res = await api.put<Monitor>(`/monitors/${id}`, data);
    return res.data;
  },
  deleteMonitor: async (id: number) => {
    await api.delete(`/monitors/${id}`);
  },
  pauseMonitor: async (id: number) => {
    const res = await api.post<Monitor>(`/monitors/${id}/pause`);
    return res.data;
  },
  resumeMonitor: async (id: number) => {
    const res = await api.post<Monitor>(`/monitors/${id}/resume`);
    return res.data;
  },

  // Incidents
  getIncidents: async () => {
    const res = await api.get<Incident[]>('/incidents');
    return res.data;
  },
  getMonitorIncidents: async (monitorId: number) => {
    const res = await api.get<Incident[]>(`/monitors/${monitorId}/incidents`);
    return res.data;
  },

  // Status Pages (Admin)
  getStatusPages: async () => {
    const res = await api.get<StatusPage[]>('/status-pages');
    return res.data;
  },
  getStatusPage: async (id: number) => {
    const res = await api.get<StatusPage>(`/status-pages/${id}`);
    return res.data;
  },
  createStatusPage: async (data: {
    title: string;
    slug: string;
    description?: string;
    isPublic: boolean;
    monitorIds: number[];
  }) => {
    const res = await api.post<StatusPage>('/status-pages', data);
    return res.data;
  },
  updateStatusPage: async (
    id: number,
    data: {
      title: string;
      slug: string;
      description?: string;
      isPublic: boolean;
      monitorIds: number[];
    }
  ) => {
    const res = await api.put<StatusPage>(`/status-pages/${id}`, data);
    return res.data;
  },
  deleteStatusPage: async (id: number) => {
    await api.delete(`/status-pages/${id}`);
  },

  // Public Status Page
  getPublicStatusPage: async (slug: string) => {
    const res = await axios.get<PublicStatusPage>(`/api/v1/public/status/${slug}`);
    return res.data;
  },
};
