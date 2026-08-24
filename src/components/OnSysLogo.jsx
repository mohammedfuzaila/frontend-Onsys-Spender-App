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
      <radialGradient id="si-bg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#1C1C22" />
        <stop offset="100%" stopColor="#0D0D0F" />
      </radialGradient>
      <linearGradient id="si-silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#D4D8E2" />
        <stop offset="60%" stopColor="#9BA3B2" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <linearGradient id="si-gold" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#FDE68A" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="si-letter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="si-sq" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="si-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="si-left-clip">
        <rect x="0" y="0" width="100" height="200" />
      </clipPath>
      <clipPath id="si-right-clip">
        <rect x="100" y="0" width="100" height="200" />
      </clipPath>
    </defs>

    {/* Dark circle background */}
    <circle cx="100" cy="100" r="98" fill="url(#si-bg)" />

    {/* Subtle inner glow */}
    <circle cx="100" cy="85" r="60" fill="#F59E0B" fillOpacity="0.05" />

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
      strokeOpacity="0.3"
    />

    {/* Center gold square accent (like the original logo's square dot) */}
    <rect
      x="89" y="89" width="22" height="22"
      rx="4"
      fill="url(#si-sq)"
      filter="url(#si-glow)"
    />

    {/* "S" letterform — bold, centered, gold */}
    <text
      x="100"
      y="107"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="'Georgia', 'Times New Roman', serif"
      fontWeight="700"
      fontSize="52"
      fill="url(#si-letter)"
      filter="url(#si-glow)"
    >
      S
    </text>
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
