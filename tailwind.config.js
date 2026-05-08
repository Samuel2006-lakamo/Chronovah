// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // This enables dark mode with a class
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
        ui: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        content: ["Source Serif 4", "Georgia", "Times New Roman", "serif"],
      },

      // Flattened colors for better Tailwind compatibility
      colors: {
        // Primary palette
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },

        // Semantic colors (these will work with dark: prefix)
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0B1120",
        },
        card: {
          DEFAULT: "#F9FAFB",
          dark: "#1E293B",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#334155",
        },
        text: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          dark: "#F1F5F9",
          "dark-muted": "#94A3B8",
        },

        // Feature colors
        places: {
          light: "#3b82f6",
          dark: "#60a5fa",
          bg: "#dbeafe",
          "bg-dark": "#1e3a8a",
        },
        notes: {
          light: "#eab308",
          dark: "#facc15",
          bg: "#fef9c3",
          "bg-dark": "#854d0e",
        },
        people: {
          light: "#22c55e",
          dark: "#4ade80",
          bg: "#dcfce7",
          "bg-dark": "#14532d",
        },
        journal: {
          light: "#a855f7",
          dark: "#c084fc",
          bg: "#f3e8ff",
          "bg-dark": "#581c87",
        },

        // Accent colors
        accent: {
          blue: "#3b82f6",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#22c55e",
          yellow: "#eab308",
          orange: "#f97316",
          red: "#ef4444",
        },
      },

      // Gradient patterns
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #3b82f6, #a855f7)",
        "gradient-secondary": "linear-gradient(to right, #a855f7, #ec4899)",
        "gradient-places": "linear-gradient(to right, #3b82f6, #60a5fa)",
        "gradient-notes": "linear-gradient(to right, #eab308, #facc15)",
        "gradient-people": "linear-gradient(to right, #22c55e, #4ade80)",
        "gradient-journal": "linear-gradient(to right, #a855f7, #c084fc)",
      },

      // Box shadows
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
        medium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        hard: "0 8px 30px rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      },

      // Keep your animations and other utilities
      keyframes: {
        // ... (keep all your keyframes)
      },
      animation: {
        // ... (keep all your animations)
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
