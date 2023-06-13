/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./views/**/*.ejs',
  ],

  theme: {
    extend: {
      /*  fontFamily: {
         'noto': ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
       } */
    },
  },
  plugins: [
    //require('@tailwindcss/custom-forms')
  ]
};