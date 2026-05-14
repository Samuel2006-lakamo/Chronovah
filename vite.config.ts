import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "prompt" mode: we handle the update UI ourselves (see useInstallPrompt hook)
      registerType: "prompt",
      // Include all static assets the service worker should pre-cache
      includeAssets: [
        "favicon.ico",
        "favicon-32x32.png",
        "favicon-16x16.png",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "og-image.jpeg",
        "robots.txt",
        "sitemap.xml",
      ],
      // Point to the manifest in /public — don't duplicate it here
      manifest: false,
      workbox: {
        // Cache the shell (index.html) with a network-first strategy so Safari
        // always gets the latest version and never serves a stale 404 shell
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          // Don't intercept actual API calls or Vercel system paths
          /^\/api\//,
          /^\/_vercel\//,
        ],
        // Runtime caching rules
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache Cloudinary images
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    allowedHosts: ["chronovah.outray.app"],
    proxy: {
      "/api": {
        target: "https://x52bljmr-3000.uks1.devtunnels.ms/",
        changeOrigin: true,
      },
    },
  },
});
