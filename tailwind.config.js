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
        'vw': '65vw',
      }
    }
  }
};