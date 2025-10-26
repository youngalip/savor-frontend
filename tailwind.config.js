/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#8b1538', // Maroon
          600: '#7c1d33',
          700: '#6d1f2c',
          800: '#5e1a25',
          900: '#4f141e',
        },
        cream: {
          50: '#fefcf9',   // Very light cream
          100: '#fef9f3',  // Light cream
          200: '#fdf4e7',  // Soft cream
          300: '#fcefdb',  // Medium cream
          400: '#fbe9cf',  // Deeper cream
          500: '#f5e6d3',  // Base cream
          600: '#e8d4b8',  // Darker cream
          700: '#dbc29d',  // Brown cream
          800: '#ceb082',  // Deep cream
          900: '#c19e67',  // Darkest cream
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}