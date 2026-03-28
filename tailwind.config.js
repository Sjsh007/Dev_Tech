/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bcfd",
          400: "#7c98f9",
          500: "#5b75f3",
          600: "#4355e8",
          700: "#3744d4",
          800: "#2f39ab",
          900: "#2c3787",
        },
        surface: {
          dark: "#0f1117",
          card: "#1a1d27",
          border: "#2a2d3a",
          hover: "#23263a",
        },
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(91, 117, 243, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(91, 117, 243, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
