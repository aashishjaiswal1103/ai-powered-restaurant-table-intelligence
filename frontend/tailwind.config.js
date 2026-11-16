/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bordo: "#6C151E",
        emerald_deep: "#0F3D3A",
        cream_bg: "#F5DABF",
      },
    },
  },
  plugins: [],
}
