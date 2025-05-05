/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in forwards",
        letterFadeIn: "letterFadeIn 0.5s ease-in forwards",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        letterFadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animationDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        800: "800ms",
        900: "900ms",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".animation-delay-100": { animationDelay: "100ms" },
        ".animation-delay-200": { animationDelay: "200ms" },
        ".animation-delay-300": { animationDelay: "300ms" },
        ".animation-delay-400": { animationDelay: "400ms" },
        ".animation-delay-500": { animationDelay: "500ms" },
        ".animation-delay-600": { animationDelay: "600ms" },
        ".animation-delay-700": { animationDelay: "700ms" },
        ".animation-delay-800": { animationDelay: "800ms" },
        ".animation-delay-900": { animationDelay: "900ms" },
      };
      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};