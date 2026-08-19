/**
 * One switch for every piece of decorative motion on the page.
 *
 * WCAG 2.2.2 (Level A) needs a mechanism IN the content to stop anything that
 * auto-starts, runs past five seconds and sits alongside other content. The
 * hero montage, the seven work loops and the nine social reels are all exactly
 * that, and honouring the OS reduced-motion flag does not discharge it: the
 * flag is off by default and lives outside the page.
 *
 * So rather than bolt a pause button onto each component, everything reads one
 * flag. `document.documentElement.dataset.motion` is 'paused' or 'playing',
 * and a `motionpref` event fires on change. Components must ask
 * `motionAllowed()` before calling play(), and pause themselves on the event.
 */

export const MOTION_EVENT = 'motionpref';

/** True when the user has not paused motion and has not asked the OS to reduce it. */
export function motionAllowed(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.dataset.motion === 'paused') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setMotion(paused: boolean): void {
  document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
  document.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: { paused } }));
}

/** Run `fn` now and again whenever the preference flips. */
export function onMotionChange(fn: (allowed: boolean) => void): void {
  document.addEventListener(MOTION_EVENT, () => fn(motionAllowed()));
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', () => fn(motionAllowed()));
}
