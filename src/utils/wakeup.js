/**
 * wakeupBackend — Silently ping the backend health endpoint to wake it up
 * from Render free-tier cold start (~50 s spin-up).
 *
 * Call this as early as possible (login page mount) so the backend is ready
 * by the time the user hits "Sign In".
 *
 * - Uses the same VITE_API_URL as the rest of the app.
 * - Retries up to MAX_RETRIES times with exponential backoff.
 * - Never throws — all errors are swallowed silently.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// Strip trailing /api to hit the root health path
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

const HEALTH_PATH = '/api/health/'; // Django health endpoint
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 4000; // 4 s first retry, then 8 s, 16 s …

let _wakeupPromise = null; // singleton — only one wakeup per session

/**
 * @returns {Promise<void>}  Resolves when backend responds OK (or all retries exhausted).
 */
export async function wakeupBackend() {
  // Already started — return the same promise
  if (_wakeupPromise) return _wakeupPromise;

  _wakeupPromise = _doWakeup();
  return _wakeupPromise;
}

async function _doWakeup() {
  const url = `${BASE_URL}${HEALTH_PATH}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(12000), // 12 s per attempt
      });
      if (res.ok) {
        console.info(`[Wakeup] Backend is awake (attempt ${attempt})`);
        return;
      }
    } catch {
      // Network error or timeout — keep retrying
    }

    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.info(`[Wakeup] Backend not ready yet, retrying in ${delay / 1000}s…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  console.warn('[Wakeup] Backend did not respond after all retries (cold start may still be in progress)');
}
