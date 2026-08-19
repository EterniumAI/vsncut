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

The one number on the page, `1.6B+ views across client content`, is supplied by
Austin and confirmed by Ty (2026-08-19), sourced to SHORT CUT's own reporting.
It has no public source, so automated reviews flag it; it is legitimate and
stays. That is a documented exception, not a loosening of the rule below.

House rules that outlive any one page: near-black + off-white + signal yellow
only, Bebas Neue display (always uppercase) / Archivo body / IBM Plex Mono
metadata, square corners, 1px hairline borders, no shadows. Outcome-led copy.
**No emoji. No em dashes. Never fabricate a metric, testimonial or award** --
none exist publicly for this business.

## Footage

The footage is NOT in this repo. It lives in the **`vsncut-media` R2 bucket**,
served from **https://media.vsncut.com**, and is referenced through `media()`
in `src/lib/media.ts` (override with `PUBLIC_MEDIA_ORIGIN`).

It moved off Cloudflare Pages because **Pages does not honour HTTP Range**: it
answers a `Range:` header with `200` and the whole body, on every asset,
including `grain.png`. Video still plays, because browsers fall back to a
progressive download, but seeking the 62s featured film re-pulls all 20MB and
scrubbing is unusable. R2 returns real `206 Partial Content`.

**Uploading:** `wrangler r2 object put vsncut-media/<key> --file <path>
--content-type <ct> --remote`. **Without `--remote` wrangler writes to the local
miniflare simulation, prints "Upload complete", and the real bucket stays
empty.** Objects carry `cache-control: public, max-age=31536000, immutable` and
filenames are NOT content-hashed, so replacing a clip in place will not be
picked up by anything holding a cached copy: upload under a new key and change
the reference, or purge that path.

A 404 from `media.vsncut.com` caches for 4 hours. If you probe a key before
uploading it, that negative response sticks around and the file looks missing
after a perfectly good upload. Bust it with a `?cb=1` query.

Object layout (keys are relative to the bucket root):

    hero/      15s silent montage, 1920x1080 + a 1280x720 variant
    work/      7 silent hover loops, 1280x720, ~7-8s
    full/      watchable excerpts WITH audio, 1280x720, ~32s (lightbox)
    featured/  An Evening with Carpa, full 62s with audio
    social/    9 vertical reels, 608x1080, audio kept for tap-to-unmute
    posters/   poster frame for every one of the above
    tiles/     seven 2200px stills for the zoom-parallax hero

`public/` keeps only what must be same-origin: `og.jpg` (some scrapers are
fussy about cross-origin cards), the favicon, and `grain.png`.

Rules learned the hard way when cutting these, worth keeping:

- **Check for burned-in bars before encoding.** `EP 1 Final 1080p.mp4` is
  2.39:1 inside a 1080 frame (active area `1920x840+0+120`); a naive
  scale-and-crop bakes the black bars into the card. Run
  `ffmpeg -i in.mp4 -vf cropdetect -f null -` first.
- **Check for third-party credit cards.** `AbsoluteFlight MINI DOC 4K.mp4`
  opens on "E. ADAMS MEDIA PRESENTS" for ~5s. Nothing cut for this site may
  start inside another company's credit.
- A piece can change aspect mid-timeline. `Website Final 4k MUSIC.mp4` is a 4K
  landscape container that opens on a pillarboxed vertical insert, so a poster
  grabbed at t=0.5 has black bars and one at t=29 does not.
- Cloudflare Pages rejects any single file over 25 MiB. Keep encodes under it.

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
- A vector logo and crew headshots from Austin. The wordmark is still type, not
  artwork, and the About section has no faces.
- Publish these sections through CentraMind so Austin can reorder the work grid
  himself. Until `site.live` is true with published sections, the coded
  fallback in `src/pages/index.astro` IS the page.
