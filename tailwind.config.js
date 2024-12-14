/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
