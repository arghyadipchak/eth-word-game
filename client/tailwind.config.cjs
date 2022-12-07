/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,svelte}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    styled: true,
    themes: ['emerald', 'night'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark'
  }
}
