/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1B73E8",
      },
      boxShadow: {
        white:
          "0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)",
      },
      extend: {
        zIndex: {
          60: "60",
          70: "70",
          80: "80",
          90: "90",
          100: "100",
        },
      },
    },
  },
  plugins: [],
};
