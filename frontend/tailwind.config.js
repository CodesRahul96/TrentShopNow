/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3182CE', // Blue
        secondary: '#F5F7FA', // Light Gray
        accent: '#2B6CB0', // Darker Blue
        text: '#2D3748', // Dark Gray
        background: '#FFFFFF', // White
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}