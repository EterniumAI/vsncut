/**
 * Content contract client.
 *
 * The page is fetched per request from the CentraMind Connected Sites content
 * endpoint, so a copy edit published in the app is live within the cache TTL
 * with no rebuild.
 *
 * The payload is NESTED: { site, sections, products, shop }. A consumer written
 * against a flattened shape nulls out on every request.
 *
 * Never throws. A dead API must degrade to the holding page, never to a 500.
 */
export interface SiteMeta {
  name?: string;
  slug?: string;
  live?: boolean;
  theme?: { primary?: string; accent?: string; bg?: string };
  seo?: { title?: string; description?: string; og_image?: string };
}

export interface Section {
  type: string;
  [key: string]: unknown;
}

export interface SiteContent {
  site: SiteMeta;
  sections: Section[];
  products: Array<Record<string, unknown>>;
}

const API_ORIGIN = import.meta.env.PUBLIC_API_ORIGIN || 'https://api.eternium.ai';
const SITE_SLUG = import.meta.env.PUBLIC_SITE_SLUG || 'vsn-cut';

export async function getContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/v1/public/site/${SITE_SLUG}/content`);
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<SiteContent>;
    if (!data || typeof data !== 'object') return null;
    return {
      site: data.site ?? {},
      sections: Array.isArray(data.sections) ? data.sections : [],
      products: Array.isArray(data.products) ? data.products : [],
    };
  } catch {
    return null;
  }
}

/** Strict hex guard before a runtime colour is written into a CSS variable. */
export function hex(v: unknown): string | null {
  return typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : null;
}
