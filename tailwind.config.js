/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        amatic: ["Amatic SC", "cursive"],
      },
      spacing: {
        defaultWidth: "64px",
      },
      colors: {
        primary: "#82AE46",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
        editColor: "#27A743",
        deleteColor: "#F5222D",
      },
    },
  },
  plugins: [],
};
