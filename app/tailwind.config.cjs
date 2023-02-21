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
      colors: {
        "primary-purple": {
          900: "#1C1C41",
          700: "#4E4EB2",
        },
        disabled: {
          400: "#C4C4CD",
        },
      },
    },
  },
  plugins: [lineClamp],
};
