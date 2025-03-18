/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-yellow': '#FFF9E6', // Base light yellow
        'dark-bg': '#1F2937',      // Dark background
        'dark-accent': '#374151',  // Darker accent
        'light-text': '#F3F4F6',   // Light text for dark theme
        'yellow-accent': '#FCD34D', // Vibrant yellow for highlights
        'glass-bg': 'rgba(255, 249, 230, 0.1)', // Semi-transparent light yellow for glass
      },
      backdropFilter: {
        'blur': 'blur(10px)',
      },
      boxShadow: {
        'glass': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'), // For backdrop-filter support
  ],
};