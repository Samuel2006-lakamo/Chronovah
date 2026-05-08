import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // auto updates service worker
      includeAssets: ["favicon.ico", "robots.txt", "sitemap.xml", "apple-touch-icon.png", "og-image.png"],
      manifest: {
        name: "Chronovah",
        short_name: "Chronovah",
        description: "All your life details in one place",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#2b6cb0",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
  server: {
     host: true,
    allowedHosts: ['chronovah.outray.app'],
    proxy: {
      "/api": {
        target: "https://x52bljmr-3000.uks1.devtunnels.ms/",
        changeOrigin: true,
      },
    },
  },
});
