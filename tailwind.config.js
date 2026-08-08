/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sekhmet-red': '#ff4444',
        'sekhmet-orange': '#ff8844',
        'sekhmet-green': '#44ff88',
      },
    },
  },
  plugins: [],
}