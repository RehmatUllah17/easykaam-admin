/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
   safelist: [
    'dark:bg-gray-900',
    'dark:bg-gray-800',
    'dark:text-white',
    'dark:hover:bg-gray-700'
  ]
}