/**
 * Shapes for the footage the home page renders, and where it is served from.
 *
 * These live here rather than in the .astro components because an Astro
 * component has exactly one export, the component itself. A `import Work, {
 * type WorkItem } from './WorkGrid.astro'` looks reasonable and fails at build.
 */

/**
 * The footage lives in the `vsncut-media` R2 bucket behind media.vsncut.com,
 * NOT in this repo.
 *
 * It moved off Cloudflare Pages because Pages does not honour HTTP Range: it
 * answers a `Range:` header with a 200 and the entire body, no accept-ranges,
 * on every asset. Video still plays (browsers fall back to a progressive
 * download) but seeking the 62s featured film re-pulls all 20MB, and scrubbing
 * is unusable. R2 serves real 206 Partial Content, so the player can seek.
 *
 * Objects are uploaded with `cache-control: public, max-age=31536000,
 * immutable`. Filenames are stable and NOT content-hashed, so REPLACING a clip
 * in place will not be picked up by anything that already cached it. To swap a
 * piece of footage, upload it under a new key and change the reference here, or
 * purge the Cloudflare cache for that path.
 *
 * Upload with `wrangler r2 object put ... --remote`. Without --remote wrangler
 * writes to the local miniflare simulation, reports "Upload complete", and the
 * real bucket stays empty.
 */
const MEDIA_ORIGIN = (
  import.meta.env.PUBLIC_MEDIA_ORIGIN || 'https://media.vsncut.com'
).replace(/\/+$/, '');

/** Absolute url for a footage key, e.g. media('work/hhc.mp4'). */
export function media(path: string): string {
  return `${MEDIA_ORIGIN}/${path.replace(/^\/+/, '')}`;
}

export interface WorkItem {
  key: string;
  title: string;
  /**
   * Set ONLY where the business is named on screen in the footage. Guessing a
   * client is inventing a credit, which the design system forbids.
   */
  client?: string;
  tag: string;
  year?: string;
  /** Silent 7-8s hover loop, 1280x720. */
  loop: string;
  poster: string;
  /** Watchable excerpt with sound, opened in the lightbox. */
  full?: string;
}

export interface Reel {
  key: string;
  client: string;
  /** 9:16 loop, 608x1080, audio retained for tap-to-unmute. */
  loop: string;
  poster: string;
}
