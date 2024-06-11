module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFDFD",
        lightPurple: "#a9aff4",
        neonBlue: "#5460EA",
        purple: "#835EE7",
        violet: "#2F2351",
        black: "#08070B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
