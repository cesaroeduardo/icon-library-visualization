import gradientMaskImage from 'tailwind-gradient-mask-image'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js}',
    '../studio/src/**/*.{vue,js}'
  ],
  theme: {
    extend: {}
  },
  plugins: [gradientMaskImage]
}
