import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal (formerly BottomSheet) — Centered modal across all devices.
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
      <div
        className="
          fixed inset-0
          flex items-center justify-center
          p-4 sm:p-5
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
            shadow-2xl
            rounded-2xl
            flex flex-col
            max-h-[85vh]
          `}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2532] flex-shrink-0 rounded-t-2xl">
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
            <div className="flex-shrink-0 px-5 py-3.5 border-t border-[#1E2532] bg-[#0E1117]/80 flex items-center justify-end gap-2.5 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
