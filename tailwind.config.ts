import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/componentes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
      },
      screens: {
        // Alterar o valor do breakpoint 'md'
        lg: "1200px",

        // Adicionar um breakpoint personalizado chamado 'xl2'
        xl2: "1400px",
        sm: { max: "768px" },
        sm2: { max: "510px" },
        sm3: { max: "330px" },

        md: { max: "1024px" },

      },
      fontFamily: {
        Agency: ["Agency", "sans-serif"],
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
