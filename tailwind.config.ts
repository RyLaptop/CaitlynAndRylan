import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hand: ["var(--font-caveat)", "cursive"],
        sans: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        cream: "#FFF8F0",
        blush: "#FFB7C5",
        lavender: "#C8B2E8",
        mint: "#B2E8CC",
        peach: "#FFCBA4",
        sky: "#B2D8F0",
        "blush-dark": "#F48FB1",
        "lavender-dark": "#9C7AC4",
        "mint-dark": "#6DC49A",
        "peach-dark": "#F4A460",
      },
      animation: {
        "pet-bounce": "petBounce 2s ease-in-out infinite",
        "pet-wiggle": "petWiggle 0.5s ease-in-out infinite",
        "pet-breathe": "petBreathe 3s ease-in-out infinite",
        "pop": "pop 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        petBounce: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        petWiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        petBreathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-6px) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
