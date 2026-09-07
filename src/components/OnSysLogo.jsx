import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// OnSysSpenderIcon
// Matches the Onsys Infotech brand: split silver/gold circle ring with
// a gold "S" letterform inside, on a dark background.
// ─────────────────────────────────────────────────────────────────────────────
export const OnSysSpenderIcon = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      {/* Deep circular background */}
      <radialGradient id="si-bg" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stopColor="#1E222D" />
        <stop offset="60%" stopColor="#11141B" />
        <stop offset="100%" stopColor="#080A0E" />
      </radialGradient>

      {/* Silver metallic gradient for left half of ring */}
      <linearGradient id="si-silver" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#E2E8F0" />
        <stop offset="60%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>

      {/* Gold metallic gradient for right half of ring */}
      <linearGradient id="si-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#FDE68A" />
        <stop offset="30%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>

      {/* Gold gradient for center S */}
      <linearGradient id="si-letter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#FFFBEB" />
        <stop offset="20%" stopColor="#FDE68A" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>

      {/* Ambient center gold glow */}
      <radialGradient id="si-center-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
        <stop offset="40%" stopColor="#D97706" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>

      {/* Soft warm glow filter */}
      <filter id="si-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clean vertical clip paths for split ring */}
      <clipPath id="si-left-clip">
        <rect x="0" y="0" width="100" height="200" />
      </clipPath>
      <clipPath id="si-right-clip">
        <rect x="100" y="0" width="100" height="200" />
      </clipPath>
    </defs>

    {/* Dark circle background */}
    <circle cx="100" cy="100" r="98" fill="url(#si-bg)" />

    {/* Outer ring: silver left half */}
    <circle
      cx="100" cy="100" r="72"
      fill="none"
      stroke="url(#si-silver)"
      strokeWidth="14"
      clipPath="url(#si-left-clip)"
    />

    {/* Outer ring: gold right half */}
    <circle
      cx="100" cy="100" r="72"
      fill="none"
      stroke="url(#si-gold)"
      strokeWidth="14"
      clipPath="url(#si-right-clip)"
    />

    {/* Inner thin accent ring */}
    <circle
      cx="100" cy="100" r="56"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeOpacity="0.35"
    />

    {/* Ambient warm gold radial glow behind S */}
    <circle cx="100" cy="100" r="42" fill="url(#si-center-glow)" />

    {/* "S" letterform — bold, centered, gold serif */}
    <g filter="url(#si-glow)">
      <path
        d="M 100.14 118.98 Q 96.84 118.98 93.98 118.17 Q 91.13 117.35 89.14 116.23 L 87.39 118.01 L 85.24 118.01 L 84.90 104.99 L 87.09 104.99 Q 87.82 106.84 88.97 108.90 Q 90.11 110.95 91.61 112.58 Q 93.16 114.28 95.08 115.35 Q 96.99 116.41 99.55 116.41 Q 103.01 116.41 104.84 114.72 Q 106.69 113.03 106.69 110.47 Q 106.69 108.36 105.13 106.93 Q 103.57 105.49 100.29 104.45 Q 98.16 103.77 96.37 103.19 Q 94.58 102.60 93.00 101.99 Q 89.37 100.54 87.61 97.85 Q 85.85 95.16 85.85 91.83 Q 85.85 89.73 86.76 87.79 Q 87.67 85.85 89.42 84.29 Q 91.10 82.85 93.71 81.94 Q 96.33 81.02 99.40 81.02 Q 102.40 81.02 105.01 81.85 Q 107.63 82.67 109.12 83.51 L 110.68 81.99 L 112.89 81.99 L 113.09 94.27 L 110.90 94.27 Q 110.14 92.29 109.11 90.23 Q 108.08 88.15 106.95 86.78 Q 105.70 85.31 104.07 84.43 Q 102.45 83.55 100.27 83.55 Q 97.52 83.55 95.78 85.11 Q 94.04 86.66 94.04 88.94 Q 94.04 91.09 95.56 92.47 Q 97.07 93.84 100.27 94.88 Q 102.14 95.52 104.09 96.15 Q 106.05 96.78 107.58 97.37 Q 111.26 98.79 113.18 101.29 Q 115.10 103.79 115.10 107.50 Q 115.10 109.84 114.00 112.03 Q 112.91 114.20 111.06 115.65 Q 109.03 117.25 106.36 118.11 Q 103.70 118.98 100.14 118.98 Z"
        fill="url(#si-letter)"
      />
    </g>
  </svg>
);

// OnSysIcon alias for backward-compat
export const OnSysIcon = OnSysSpenderIcon;

// ─────────────────────────────────────────────────────────────────────────────
// OnSysLogoFull — Full stacked logo for Login page
// Mirrors Onsys Infotech layout exactly:
//   [circle icon with S]
//   ONSYS  (big bold gold serif)
//   — SPENDER —  (gold divider)
//   ENTERPRISE SOFTWARE • AI SOLUTIONS • CLOUD APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const OnSysLogoFull = ({ className = '' }) => (
  <div className={`flex flex-col items-center select-none ${className}`}>
    {/* Icon with gold glow */}
    <OnSysSpenderIcon className="w-24 h-24 drop-shadow-[0_0_28px_rgba(245,158,11,0.55)]" />

    {/* ONSYS — big gold serif text */}
    <div
      className="text-4xl font-black tracking-[0.3em] uppercase mt-3 leading-none"
      style={{
        background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      ONSYS
    </div>

    {/* — SPENDER — with divider lines */}
    <div className="flex items-center gap-3 mt-2">
      <div
        className="h-px w-8"
        style={{ background: 'linear-gradient(90deg, transparent, #D97706)' }}
      />
      <span
        className="text-xs font-bold tracking-[0.4em] uppercase"
        style={{
          background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        SPENDER
      </span>
      <div
        className="h-px w-8"
        style={{ background: 'linear-gradient(90deg, #D97706, transparent)' }}
      />
    </div>

    {/* Tagline */}
    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2 text-center leading-relaxed">
      ENTERPRISE SOFTWARE&nbsp;•&nbsp;AI SOLUTIONS
      <br />
      CLOUD APPLICATIONS
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OnSysLogo — Horizontal logo for nav/sidebar
// ─────────────────────────────────────────────────────────────────────────────
export const OnSysLogo = ({ subtitle = 'SPENDER', size = 'md' }) => {
  const iconSizes     = { sm: 'w-7 h-7',    md: 'w-9 h-9',   lg: 'w-12 h-12' };
  const titleSizes    = { sm: 'text-base',   md: 'text-lg',   lg: 'text-2xl'  };
  const subtitleSizes = { sm: 'text-[9px]',  md: 'text-[10px]', lg: 'text-xs' };

  return (
    <div className="flex items-center space-x-3 select-none">
      <OnSysSpenderIcon
        className={`${iconSizes[size] || iconSizes.md} drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]`}
      />
      <div className="flex flex-col">
        <span
          className={`font-black tracking-[0.22em] uppercase leading-none ${titleSizes[size] || titleSizes.md}`}
          style={{
            background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          ONSYS
        </span>
        <span
          className={`tracking-[0.3em] font-bold uppercase mt-0.5 leading-none ${subtitleSizes[size] || subtitleSizes.md}`}
          style={{
            background: 'linear-gradient(90deg, #FDE68A, #D97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};

// SpenderWordmark kept for backward-compat
export const SpenderWordmark = ({ className = '' }) => (
  <svg viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sw-gold" x1="0" y1="0" x2="320" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#FDE68A" />
        <stop offset="50%"  stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <text
      x="50%" y="50"
      textAnchor="middle"
      fontFamily="'Georgia', 'Times New Roman', serif"
      fontWeight="700"
      fontSize="48"
      letterSpacing="4"
      fill="url(#sw-gold)"
    >
      SPENDER
    </text>
  </svg>
);

export default OnSysLogo;
