/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5A52FF',
          600: '#483DF6',
          700: '#3D34D9',
          800: '#322BAA',
          900: '#2A2589',
        },
        background: '#FAFAFD',
      },
    },
  },
  plugins: [],
}

