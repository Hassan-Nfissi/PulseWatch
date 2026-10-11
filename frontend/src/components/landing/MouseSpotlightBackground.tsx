import React, { useEffect, useState } from 'react';

export const MouseSpotlightBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700">
      {/* 1. Base Dark Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Interactive Mouse Spotlight Glow (Follows cursor smoothly) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isVisible ? 1 : 0.4,
          background: isVisible
            ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.08), rgba(16, 185, 129, 0.03), transparent 70%)`
            : 'radial-gradient(600px circle at 50% 30%, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.05), transparent 70%)',
        }}
      />

      {/* 3. Intense Inner Spotlight Ring (Cyan / Neon Emerald Core) */}
      {isVisible && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.08), transparent 60%)`,
          }}
        />
      )}

      {/* 4. Ambient Static Pulse Glows for Depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/08 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-emerald-500/05 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
};
