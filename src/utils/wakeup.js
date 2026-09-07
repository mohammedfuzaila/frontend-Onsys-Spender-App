/**
 * High-Speed Backend Wakeup & Warm-up Manager
 *
 * Keeps Render free-tier cold starts to the absolute minimum duration:
 * - Fires immediately on application load (in main.jsx)
 * - Uses rapid 2-second polling instead of slow exponential backoff
 * - Detects readiness within 1–2 seconds of server spin-up
 * - Provides reactive event listeners so the UI responds instantaneously
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BASE_URL = API_URL.replace(/\/api\/?$/, '');
const HEALTH_URL = `${BASE_URL}/api/health/`;

// Configuration for fast wakeup detection
const MAX_ATTEMPTS = 25;       // Up to 25 attempts (~60s max window)
const RETRY_INTERVAL_MS = 2000; // Fast 2-second check interval
const TIMEOUT_PER_REQ_MS = 6000; // 6-second timeout per probe

let _wakeupPromise = null;
let _isReady = false;
let _currentStatus = 'waking'; // 'waking' | 'ready' | 'slow' | 'failed'
const _listeners = new Set();

function _setStatus(newStatus) {
  if (_currentStatus === newStatus) return;
  _currentStatus = newStatus;
  _listeners.forEach((fn) => {
    try {
      fn(_currentStatus);
    } catch (e) {
      console.error('[Wakeup] Listener error:', e);
    }
  });
}

/**
 * Subscribe to backend wake status changes.
 * @param {(status: 'waking'|'ready'|'slow'|'failed') => void} listener
 * @returns {() => void} Unsubscribe function
 */
export function subscribeWakeupStatus(listener) {
  _listeners.add(listener);
  // Send current status immediately
  listener(_currentStatus);
  return () => _listeners.delete(listener);
}

/**
 * Check if the backend is already verified awake.
 */
export function isBackendReady() {
  return _isReady;
}

/**
 * Get current wakeup status ('waking' | 'ready' | 'slow' | 'failed').
 */
export function getWakeupStatus() {
  return _currentStatus;
}

/**
 * Main wakeup starter — idempotent, can be called anywhere, anytime.
 */
export function wakeupBackend() {
  if (_isReady) return Promise.resolve(true);
  if (_wakeupPromise) return _wakeupPromise;

  _wakeupPromise = _runWakeupLoop();
  return _wakeupPromise;
}

/**
 * Force an immediate out-of-band health probe (e.g., when user focuses an input or hovers Sign In).
 */
export async function triggerImmediateCheck() {
  if (_isReady) return true;
  try {
    const res = await fetch(HEALTH_URL, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      _isReady = true;
      _setStatus('ready');
      return true;
    }
  } catch {
    // Silently continue polling
  }
  return false;
}

async function _runWakeupLoop() {
  const startTime = Date.now();

  // Slow warning timer: after 14 seconds mark as 'slow' so UI can reassure user
  const slowTimer = setTimeout(() => {
    if (!_isReady) _setStatus('slow');
  }, 14000);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(HEALTH_URL, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(TIMEOUT_PER_REQ_MS),
      });

      if (res.ok) {
        clearTimeout(slowTimer);
        _isReady = true;
        _setStatus('ready');
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.info(`[Wakeup] Backend is warm & ready (${elapsed}s, attempt ${attempt})`);
        return true;
      }
    } catch {
      // Network timeout or 502/503 during container spinup — fast retry
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
    }
  }

  clearTimeout(slowTimer);
  if (!_isReady) {
    _setStatus('failed');
    console.warn('[Wakeup] Max attempts reached; cold start took unusually long.');
  }
  return false;
}

// Automatically start background warmup as soon as this module loads
wakeupBackend();
