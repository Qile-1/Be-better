import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { leaf: "#365641", ink: "#242823", paper: "#F4F3ED", wheat: "#D8ED9F", coral: "#786B49" }, boxShadow: { soft: "0 14px 40px rgba(22,32,25,0.08)" } } },
  plugins: []
};
export default config;
