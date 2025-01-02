/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-background': "url('/images/login-bg.jpg')",
      },
    },
  },
  plugins: [],
}