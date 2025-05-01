/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary:  '#6936f5',      // bubbly purple
        secondary:'#3245ff',      // dark blue / indigo
        accent:   '#efe9ff',      // extra-light purple for fills
      },
      borderRadius: {
        'xl2': '1.25rem',        // extra chunky corners
      },
      boxShadow: {
        card: '0 6px 16px rgba(50,69,255,.12)',
      },
    },
  },
  plugins: [],
};

