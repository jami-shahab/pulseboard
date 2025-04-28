import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette (Cool Blues/Purples)
        primary: {
          light: "#a8a6ff", // Lighter purple
          DEFAULT: "#6e5ff1", // Main purple
          dark: "#5045b6", // Darker purple
        },
        // Secondary/Accent Palette (Vibrant Pinks/Oranges)
        secondary: {
          light: "#ffacac", // Light pink
          DEFAULT: "#ff6b6b", // Main vibrant pink/red
          dark: "#e65151", // Darker pink/red
        },
        accent: {
          light: "#ffe0a6", // Light orange/yellow
          DEFAULT: "#ffc94d", // Main orange/yellow
          dark: "#fcae1e", // Darker orange/yellow
        },
        // Neutral Backgrounds/Text (Slightly off-white/grey)
        neutral: {
          50: "#fafbff", // Very light bg
          100: "#f1f2f6", // Light bg
          200: "#e2e5ed", // Light grey
          300: "#cdd3e0", // Grey
          400: "#abb4c7", // Medium grey
          500: "#8a95ae", // Darker grey
          600: "#6d7893", // Dark grey
          700: "#535d75", // Very dark grey
          800: "#3e455a", // Near black
          900: "#2c3242", // Darkest
        },
      },
      fontFamily: {
        // Ensure Inter font is primary, fallback to sans
        sans: ["var(--font-inter)", "sans-serif"],
      },
      // Add subtle bubbly animations (optional)
      animation: {
        'bubble-pop': 'bubble-pop 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'bubble-pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0.5' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config; 