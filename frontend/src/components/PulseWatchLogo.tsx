import React from 'react';

interface PulseWatchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export const PulseWatchLogo: React.FC<PulseWatchLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  animated = true,
}) => {
  // Dimensions mapping
  const sizeMap = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 36, text: 'text-lg' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 88, text: 'text-4xl' },
  };

  const { icon: px, text: textClass } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-slate-950/90 p-1 shadow-lg ring-1 ring-indigo-500/30"
        style={{ width: px, height: px }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="pw-outer-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id="pw-inner-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            <linearGradient id="pw-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="30%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#00f298" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <filter id="pw-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="pw-blue-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Radar Circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#pw-outer-ring)"
            strokeWidth="3.2"
            filter="url(#pw-blue-glow)"
          />

          {/* Inner Radar Concentric Circle */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="url(#pw-inner-ring)"
            strokeWidth="2.5"
            strokeOpacity="0.8"
          />

          {/* Radar Reticle Crosshair Ticks (12, 3, 6, 9 o'clock) */}
          <line x1="50" y1="18" x2="50" y2="24" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="50" y1="76" x2="50" y2="82" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="18" y1="50" x2="24" y2="50" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="76" y1="50" x2="82" y2="50" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />

          {/* Radar Satellite Beam Hand (at 2 o'clock, 45°) */}
          <line
            x1="50"
            y1="50"
            x2="74"
            y2="26"
            stroke="#00f298"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
            filter="url(#pw-glow)"
          />

          {/* Radar Satellite Target Dot Ring */}
          <circle
            cx="75"
            cy="25"
            r="5"
            stroke="#00f298"
            strokeWidth="2"
            fill="#0f172a"
            filter="url(#pw-glow)"
          />
          <circle
            cx="75"
            cy="25"
            r="2"
            fill="#00f298"
            className={animated ? 'animate-pulse' : ''}
          />

          {/* Heartbeat / ECG Waveform through center */}
          <path
            d="M 18 50 L 36 50 L 41 42 L 48 64 L 54 28 L 60 58 L 65 47 L 70 50 L 82 50"
            stroke="url(#pw-pulse-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#pw-glow)"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-widest uppercase bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent font-sans ${textClass}`}
        >
          PulseWatch
        </span>
      )}
    </div>
  );
};
