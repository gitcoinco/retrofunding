import { colors } from "@gitcoin/ui/theme";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: colors,
  },
  plugins: [],
} satisfies Config;
