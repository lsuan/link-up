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
        brand: {
          900: "#1C1C41",
          800: "#363693",
          500: "#4E4EB2",
          200: "#C2C2FF",
          100: "#D8D8E9",
        },
        neutral: {
          200: "#B2B2BA",
        },
        disabled: {
          400: "#C4C4CD",
        },
      },
    },
  },
  plugins: [lineClamp],
};
