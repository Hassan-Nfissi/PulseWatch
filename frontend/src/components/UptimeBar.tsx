import React from 'react';

interface UptimeBarProps {
  percentage: number;
}

export const UptimeBar: React.FC<UptimeBarProps> = ({ percentage }) => {
  const getColor = (pct: number) => {
    if (pct >= 99.0) return 'text-emerald-400';
    if (pct >= 95.0) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBarColor = (pct: number) => {
    if (pct >= 99.0) return 'bg-emerald-500';
    if (pct >= 95.0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${getColor(percentage)}`}>
        {percentage.toFixed(2)}%
      </span>
    </div>
  );
};
