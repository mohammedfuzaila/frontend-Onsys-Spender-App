import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * BottomSheet — Native-feel mobile bottom sheet / desktop center modal.
 *
 * On mobile (< md): slides up from the bottom, sits above the bottom nav bar,
 * has a drag handle, and dismisses on backdrop tap.
 * On desktop (md+): centered modal with blur backdrop.
 *
 * Props:
 *  isOpen    — boolean: whether the sheet is visible
 *  onClose   — function: called when user dismisses
 *  title     — string: header title
 *  children  — the form / content
 *  footer    — optional ReactNode: action buttons row
 *  maxWidth  — tailwind max-w class, default "max-w-lg"
 */
const BottomSheet = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  const sheetRef = useRef(null);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
      style={{ WebkitBackdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
    >
      {/*
        Mobile: anchored to bottom, above safe area.
        Desktop: centered.
      */}
      <div
        className="
          absolute inset-x-0 bottom-0
          md:relative md:inset-auto
          md:flex md:items-center md:justify-center
          md:min-h-full
          pointer-events-none
        "
      >
        <div
          ref={sheetRef}
          className={`
            pointer-events-auto
            w-full ${maxWidth}
            bg-[#12151C]
            border border-[#252D3D]
            shadow-[0_-8px_60px_rgba(0,0,0,0.7)]
            md:shadow-[0_20px_80px_rgba(0,0,0,0.8)]

            /* Mobile: rounded top corners, full width, slide up */
            rounded-t-3xl
            md:rounded-2xl

            /* Flex column so footer always sticks at bottom */
            flex flex-col

            /* Height constraints */
            max-h-[88vh]
            md:max-h-[85vh]

            /* Bottom safe area for iPhone home bar */
            pb-safe

            /* Slide-up animation on mobile */
            animate-slide-up
            md:animate-fade-in
          `}
          style={{
            /* On mobile, keep 16px gap from bottom nav (56px) + safe area */
            marginBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-600" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2532] flex-shrink-0">
            <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-[#1A2030] border border-[#262D3B] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252E40] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-1">
            {children}
          </div>

          {/* Footer — sticky at bottom */}
          {footer && (
            <div className="flex-shrink-0 px-5 py-3.5 border-t border-[#1E2532] bg-[#0E1117]/80 flex items-center justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
