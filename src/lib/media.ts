/**
 * Shapes for the footage the home page renders.
 *
 * These live here rather than in the .astro components because an Astro
 * component has exactly one export, the component itself. A `import Work, {
 * type WorkItem } from './WorkGrid.astro'` looks reasonable and fails at build.
 */

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
