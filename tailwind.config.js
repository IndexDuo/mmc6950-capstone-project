/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052ff",
        teal: "#067a57",
        danger: "#d4183d",
        dark: "#1a1f36",
        muted: "#576275",
        surface: "#f8f9fc",
        "card-border": "#d8e1f0",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
