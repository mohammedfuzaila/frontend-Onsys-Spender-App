import React from 'react';

/**
 * OnSysIcon — Round dark badge with a glowing purple lightning bolt.
 * Used anywhere a compact square/round app icon is needed.
 */
export const OnSysIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="oi-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0F0A1E" />
        <stop offset="100%" stopColor="#160B2E" />
      </linearGradient>
      <linearGradient id="oi-bolt" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C77DFF" />
        <stop offset="40%" stopColor="#9B5DE5" />
        <stop offset="100%" stopColor="#5A0FA0" />
      </linearGradient>
      <linearGradient id="oi-gloss" x1="40" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="oi-glow" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stopColor="#7B2FFF" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0" />
      </radialGradient>
      <filter id="oi-blur" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <clipPath id="oi-clip"><circle cx="100" cy="100" r="96" /></clipPath>
    </defs>

    {/* Background */}
    <circle cx="100" cy="100" r="98" fill="url(#oi-bg)" stroke="#3A1570" strokeWidth="1.5" />

    {/* Ambient glow behind bolt */}
    <circle cx="100" cy="88" r="55" fill="url(#oi-glow)" clipPath="url(#oi-clip)" />

    {/* Lightning bolt with glow */}
    <g filter="url(#oi-blur)" clipPath="url(#oi-clip)">
      <path d="M113 22 L60 98 L90 98 L87 178 L140 102 L110 102 Z" fill="url(#oi-bolt)" />
      <path d="M113 22 L60 98 L90 98 L87 178 L140 102 L110 102 Z" fill="url(#oi-gloss)" />
    </g>
  </svg>
);

/**
 * SpenderWordmark — The big bold "Spender" text used as the primary brand element.
 * Features a purple gradient across the letters with a subtle glow.
 */
export const SpenderWordmark = ({ className = "" }) => (
  <svg
    viewBox="0 0 320 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sw-text-grad" x1="0" y1="0" x2="320" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D4A0FF" />
        <stop offset="50%" stopColor="#9B5DE5" />
        <stop offset="100%" stopColor="#6A1BE0" />
      </linearGradient>
      <filter id="sw-glow" x="-5%" y="-20%" width="110%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <text
      x="50%"
      y="50"
      textAnchor="middle"
      fontFamily="'Inter', 'Segoe UI', sans-serif"
      fontWeight="900"
      fontSize="52"
      letterSpacing="2"
      fill="url(#sw-text-grad)"
      filter="url(#sw-glow)"
    >
      SPENDER
    </text>
  </svg>
);

/**
 * OnSysLogo — Horizontal layout: icon + ONSYS brand name + subtitle.
 * Used in navbars and sidebars.
 */
export const OnSysLogo = ({ subtitle = "SPENDER", size = "md" }) => {
  const iconSizes = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-12 h-12" };
  const titleSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  const subtitleSizes = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };

  return (
    <div className="flex items-center space-x-3">
      <OnSysIcon className={iconSizes[size] || iconSizes.md} />
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-wider text-white uppercase leading-none font-sans ${titleSizes[size] || titleSizes.md}`}
        >
          ONSYS
        </span>
        <span
          className={`tracking-[0.25em] font-bold uppercase mt-0.5 leading-none ${subtitleSizes[size] || subtitleSizes.md}`}
          style={{ background: "linear-gradient(90deg,#C77DFF,#7B2FFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};

/**
 * OnSysLogoFull — Stacked layout: icon + big SPENDER wordmark + OnSys sub-label.
 * Ideal for login screens and splash pages.
 */
export const OnSysLogoFull = ({ className = "" }) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <OnSysIcon className="w-16 h-16 drop-shadow-[0_0_18px_rgba(155,93,229,0.7)]" />
    <SpenderWordmark className="w-56 mt-1" />
    <span
      className="text-[10px] font-bold tracking-[0.35em] uppercase mt-0.5"
      style={{ color: "#F59E0B" }}
    >
      BY ONSYS INFOTECH
    </span>
  </div>
);

export default OnSysLogo;
