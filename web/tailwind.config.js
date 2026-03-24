/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -24px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.16), transparent 30%)',
      },
      colors: {
        brand: {
          50: '#fdf8ed',
          100: '#faecc8',
          200: '#f6dc91',
          300: '#f0c657',
          400: '#eab22e',
          500: '#d89217',
          600: '#ba6f11',
          700: '#955012',
          800: '#7a4115',
          900: '#673715',
        },
      },
    },
  },
  plugins: [],
};

