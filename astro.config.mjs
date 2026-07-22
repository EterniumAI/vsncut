// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// output: 'server' is load-bearing, not a preference. The page content is
// managed in CentraMind and fetched from the content contract PER REQUEST, so a
// copy edit goes live on publish without a rebuild. Going static would mean a
// deploy for every word change, which is exactly what the Connected Sites
// integration exists to avoid.
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
