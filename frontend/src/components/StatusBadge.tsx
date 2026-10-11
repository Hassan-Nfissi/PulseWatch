import React from 'react';
import { MonitorStatus } from '../types';

interface StatusBadgeProps {
  status: MonitorStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isUp = status === 'UP';
  const isDown = status === 'DOWN';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${
        isUp
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : isDown
          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isUp
            ? 'bg-emerald-400 animate-pulse'
            : isDown
            ? 'bg-rose-400 animate-ping'
            : 'bg-amber-400'
        }`}
      />
      {status}
    </span>
  );
};
