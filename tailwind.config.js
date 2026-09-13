/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A9D67', // Fresh Green
        ink: '#2B221A',     // Ink
        paper: '#FFFDFA',   // Paper
      },
    },
  },
  plugins: []
}