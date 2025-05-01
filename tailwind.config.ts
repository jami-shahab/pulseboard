import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/graphql/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          hover: '#4338CA', // Indigo 700
          light: '#A5B4FC' // Indigo 300
        },
        secondary: {
          DEFAULT: '#9333EA', // Purple 600
          hover: '#7E22CE', // Purple 700
        },
        accent: {
          DEFAULT: '#EC4899', // Pink 500
          hover: '#DB2777', // Pink 600
        },
        background: '#F3F4F6', // Gray 100
        foreground: '#1F2937', // Gray 800
        card: '#FFFFFF', // White
        border: '#E5E7EB', // Gray 200
        success: '#10B981', // Emerald 500
        danger: '#EF4444', // Red 500
      },
      borderRadius: {
        'xl': '1rem', // Slightly larger rounded corners for bubbly feel
        '2xl': '1.5rem'
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
};

export default config; 