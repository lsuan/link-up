/* eslint-disable import/no-extraneous-dependencies */

const { fontFamily } = require("tailwindcss/defaultTheme");
const lineClamp = require("@tailwindcss/line-clamp");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
        montserrat: ["var(--font-montserrat)", ...fontFamily.sans],
      },
    },
  },
  plugins: [lineClamp],
};
