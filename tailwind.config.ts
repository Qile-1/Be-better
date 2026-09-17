import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: "#2F6F4E",
        ink: "#162019",
        paper: "#F6F7F2",
        wheat: "#E7D8A9",
        coral: "#D86B57"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(22, 32, 25, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
