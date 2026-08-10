/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sekhmet-bg': '#0a0b0d',
        'sekhmet-surface': '#131519',
        'sekhmet-surface-2': '#1b1e24',
        'sekhmet-border': '#262a32',
        'sekhmet-ink': '#e8e9ec',
        'sekhmet-ink-muted': '#8b909c',
        'sekhmet-red': '#ef4444',
        'sekhmet-red-dim': '#7f1d1d',
        'sekhmet-orange': '#f59e0b',
        'sekhmet-green': '#22c55e',
        'sekhmet-blue': '#3b82f6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -6px rgba(239, 68, 68, 0.35)',
      },
    },
  },
  plugins: [],
}
