/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // 👈 así controlas dark con la clase .dark
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}", // 👈 que abarque pages y components
  ],
  theme: { extend: {} },
  plugins: [], // si usas tw-animate, agrégalo aquí
};
