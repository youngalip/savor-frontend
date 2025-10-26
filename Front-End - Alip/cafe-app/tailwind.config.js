/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f3',
          100: '#fce7e9',
          200: '#f9d3d7',
          300: '#f4adb6',
          400: '#ec7d8d',
          500: '#e05268',
          600: '#c93452',
          700: '#a92344',
          800: '#8d1f3e',
          900: '#7a1d3a',
        }
      }
    },
  },
  plugins: [],
}