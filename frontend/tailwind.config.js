/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50 : '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#3b91fc',
          600: '#1e6ef1',
          700: '#1a5ade',
          800: '#1c49b4',
          900: '#1c408e',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        }
      }
    },
  },
  plugins: [require("flowbite/plugin")],
}
