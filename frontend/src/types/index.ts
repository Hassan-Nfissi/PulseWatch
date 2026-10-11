export type MonitorStatus = 'UP' | 'DOWN' | 'PAUSED';
export type HttpMethod = 'GET' | 'HEAD';
export type IncidentStatus = 'OPEN' | 'RESOLVED';

export interface User {
  id: number;
  email: string;
  name: string;
  pictureUrl?: string;
}

export interface Monitor {
  id: number;
  name: string;
  targetUrl: string;
  httpMethod: HttpMethod;
  checkIntervalSeconds: number;
  expectedStatusCode: number;
  isPaused: boolean;
  status: MonitorStatus;
  lastCheckedAt?: string;
  uptime30d: number;
  lastResponseTimeMs?: number;
  createdAt: string;
}

export interface Heartbeat {
  id: number;
  status: MonitorStatus;
  statusCode?: number;
  responseTimeMs?: number;
  errorMessage?: string;
  checkedAt: string;
}

export interface Incident {
  id: number;
  monitorId: number;
  monitorName: string;
  status: IncidentStatus;
  startedAt: string;
  resolvedAt?: string;
  durationSeconds?: number;
  cause?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  pausedMonitors: number;
  overallUptime30d: number;
}

export interface StatusPage {
  id: number;
  title: string;
  slug: string;
  description?: string;
  isPublic: boolean;
  monitors: Monitor[];
  createdAt: string;
}

export interface PublicMonitorItem {
  id: number;
  name: string;
  status: MonitorStatus;
  lastCheckedAt?: string;
}

export interface PublicStatusPage {
  title: string;
  slug: string;
  description?: string;
  overallStatus: 'ALL_OPERATIONAL' | 'DEGRADED' | 'MAJOR_OUTAGE';
  monitors: PublicMonitorItem[];
  recentIncidents: Incident[];
}
