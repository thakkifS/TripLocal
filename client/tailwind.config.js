/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8f2', 100: '#d8efe1', 200: '#b3dfc4', 300: '#81c89f',
          400: '#4aaa76', 500: '#278b59', 600: '#176f45', 700: '#135839',
          800: '#11462f', 900: '#0e3a28',
        },
        secondary: {
          50: '#fff9e8', 100: '#fff0bd', 200: '#ffe383', 300: '#ffd044',
          400: '#f7b91c', 500: '#df9810', 600: '#bd720b', 700: '#96510d',
          800: '#7b4011', 900: '#683512',
        }
      }
    },
  },
  plugins: [],
}
