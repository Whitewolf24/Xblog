/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./views/**/*.ejs'],

  theme: {
    extend: {
      /*  fontFamily: {
         'noto': ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
       } */
      spacing: {
        'margin-date': '70%',
        'margin-lp': '12%',
        'margin-titles': '19%',
        'margin-about': '30vw',
      },
      fontSize: {
        'r-l': 'clamp(1rem, 2.5vw, 1.35rem)',
        'r-m': 'clamp(0.8rem, 2.5vw, 0.85rem)',
        'r-s': 'clamp(0.6rem, 2.5vw, 0.8rem)',
        'r-t': 'clamp(0.55rem, 2.5vw, 0.75rem)',
      }
    }
  }
};