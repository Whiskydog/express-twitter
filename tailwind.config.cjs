/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.{html,pug}'],
  theme: {
    extend: {
      dropShadow: {
        xl: '0 0 5px yellow',
      },
    },
  },
  plugins: [require('daisyui')],
};
