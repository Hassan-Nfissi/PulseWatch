import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  id: number;
  status: string;
  statusCode?: number;
  responseTimeMs?: number;
  errorMessage?: string;
  checkedAt: string;
}

interface ResponseTimeChartProps {
  data: ChartDataPoint[];
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
        <p className="text-sm">No heartbeat data collected yet.</p>
        <p className="text-xs text-slate-600 mt-1">Data will populate automatically on subsequent checks.</p>
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    time: new Date(d.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    responseTime: d.responseTimeMs || 0,
    status: d.status,
    code: d.statusCode,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            unit="ms"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value: number) => [`${value} ms`, 'Response Time']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="responseTime"
            stroke="#818cf8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorResponse)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
