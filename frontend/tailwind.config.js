/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vnd-green': '#00FF85',
        'vnd-dark': '#0a0a0a',
        'vnd-card': '#111111',
        'vnd-card2': '#161616',
        'vnd-border': '#1e1e1e',
        'vnd-muted': '#888888',
      },
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}