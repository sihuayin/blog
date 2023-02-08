import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: 'https://sihuayin.github.io',
  base: 'blog',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
  ],
});