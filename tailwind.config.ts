import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: "#202223",
        ink: "#202223",
        paper: "#F6F6F5",
        wheat: "#E9E9E7",
        coral: "#4C4F4E"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(22, 32, 25, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
