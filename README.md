# vsncut

The VSN CUT marketing site. Astro 5 SSR on Cloudflare Pages, content managed in
CentraMind.

## How this works

The page is NOT hardcoded. On every request the site fetches
`GET https://api.eternium.ai/v1/public/site/vsn-cut/content` and renders whatever
sections are published, so copy, reels and portfolio pieces are edited in the
CentraMind Website panel and go live on publish with no rebuild. Pushing to
`main` only redeploys the code.

If the API is unreachable or the site has no published sections, the page
degrades to a holding hero with a working phone CTA. It never 500s.

## Design system

Tokens in `src/styles/tokens.css` are copied VERBATIM from the VSN CUT design
system (claude.ai/design project `86fceff9-609d-4112-91d0-f16da3fa7ab6`). Do not
hand-tune them here; change them there and re-copy, or the two drift.

House rules that outlive any one page: near-black + off-white + signal yellow
only, Bebas Neue display (always uppercase) / Archivo body / IBM Plex Mono
metadata, square corners, 1px hairline borders, no shadows. Outcome-led copy.
**No emoji. No em dashes. Never fabricate a metric, testimonial or award** --
none exist publicly for this business.

## Section types

`src/components/SectionRenderer.astro` must cover every type in `SECTION_TYPES`
(`eternium-api/lib/site-sections.js`). A type missing there renders nothing, with
no error. Currently 14: hero, about, offer, testimonials, faq, contact, cta,
form, gallery, products, showreel, work, team, stats.

## Env

Set on the Pages project:

    PUBLIC_SITE_SLUG=vsn-cut
    PUBLIC_API_ORIGIN=https://api.eternium.ai

Both have fallbacks in `src/lib/content.ts`, but set them explicitly so a
misconfiguration fails loudly rather than silently serving the wrong slug.

## Deploy

Cloudflare Pages builds from `main` automatically once the repo is connected via
the CentraMind Website panel. Do not create a direct-upload Pages project named
`cm-vsn-cut-*` by hand: a direct-upload project can never be converted to
git-backed and would permanently block the connected-site path.

## Still to come

- Self-host Bebas Neue / Archivo / IBM Plex Mono as woff2 instead of the Google
  Fonts stylesheet (render-blocking; costs LCP).
- Real footage, a vector logo, and headshots from Austin. The design system's
  placeholder stills are generated abstractions.
