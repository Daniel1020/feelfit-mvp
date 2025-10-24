/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F1EB",
        gold1: "#E8CDBA",
        gold2: "#D8BFAF"
      },
      boxShadow: { glass: "0 10px 30px rgba(0,0,0,0.12)" }
    },
  },
  plugins: [],
};
