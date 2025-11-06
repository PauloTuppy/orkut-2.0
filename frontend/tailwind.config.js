/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orkut-blue': {
          DEFAULT: '#0E4194',
          light: '#3B5998',
          dark: '#082554',
        },
        'orkut-pink': {
          DEFAULT: '#FF6AC1',
          light: '#FFB3E0',
        },
        'msn-green': {
          DEFAULT: '#7FBA00',
          yellow: '#FFC700',
          red: '#E74C3C',
        },
        'clubhouse': {
          bg: '#1C1C1E',
          card: '#2C2C2E',
        },
        'napster': {
          gray: '#E0E0E0',
          border: '#BDBDBD',
        },
        'win95-gray': '#c0c0c0',
        'win95-dark': '#808080',
        'win95-light': '#dfdfdf',
        'win95-blue': '#000080',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        classic: ['"MS Sans Serif"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
