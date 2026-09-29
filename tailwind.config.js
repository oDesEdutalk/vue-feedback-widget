/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './example/**/*.{vue,js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
