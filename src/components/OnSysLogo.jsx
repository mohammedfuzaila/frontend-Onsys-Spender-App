import React from 'react';

export const OnSysIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left Silver Arc */}
    <path 
      d="M 50 12 A 38 38 0 0 0 50 88 L 50 74 A 24 24 0 0 1 50 26 Z" 
      fill="url(#onsys-silver-gradient)" 
    />
    {/* Right Gold Arc */}
    <path 
      d="M 50 12 A 38 38 0 0 1 50 88 L 50 74 A 24 24 0 0 0 50 26 Z" 
      fill="url(#onsys-gold-gradient)" 
    />
    {/* Center 'i' dot */}
    <circle cx="50" cy="33" r="5" fill="url(#onsys-gold-gradient)" />
    {/* Center 'i' stem */}
    <rect x="46" y="44" width="8" height="26" rx="3" fill="url(#onsys-silver-gradient)" />
    
    <defs>
      <linearGradient id="onsys-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="onsys-silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
  </svg>
);

export const OnSysLogo = ({ subtitle = "SPENDER", size = "md" }) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12"
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center space-x-3">
      <OnSysIcon className={iconSizes[size] || iconSizes.md} />
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-wider text-white uppercase leading-none font-sans ${titleSizes[size] || titleSizes.md}`}>
          ONSYS
        </span>
        <span className="text-[10px] tracking-[0.25em] font-bold text-amber-500 uppercase mt-0.5 leading-none">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default OnSysLogo;
