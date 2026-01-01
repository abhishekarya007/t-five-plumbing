/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7', // Sky 600
          hover: '#0369a1',   // Sky 700
          light: '#e0f2fe',   // Sky 100
        },
        secondary: '#64748b', // Slate 500
        dark: '#0f172a',      // Slate 900
        light: '#f1f5f9',     // Slate 100
      },
    },
  },
  plugins: [],
}
