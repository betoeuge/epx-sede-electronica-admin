import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colores ──────────────────────────────────────────────────────────
      colors: {
        // GOV.CO institucional
        brand: {
          primary:   "#003DA6",
          secondary: "#F0A500",
          white:     "#FFFFFF",
        },
        // Azules Figma
        blue: {
          1: "#2f80ed",
          2: "#2d9cdb",
          3: "#56CCF2",
        },
        // Grises Figma
        gray: {
          1: "#333333",
          2: "#4f4f4f",
          3: "#828282",
          4: "#bdbdbd",
          5: "#e0e0e0",
          6: "#f2f2f2",
        },
        // Estados
        status: {
          error:   "#eb5757",
          success: "#27ae60",
          warning: "#f2994a",
          info:    "#2f80ed",
        },
        // Tema oscuro del CMS admin (extraído de screens Figma)
        admin: {
          canvas:  "#000000",   // fondo canvas / área principal
          surface: "#181818",   // superficies: sidebar, cards, panel
          border:  "#2d2d2d",   // bordes entre secciones
          overlay: "#252525",   // hover, selected state
          input:   "#0d0d0d",   // fondos de inputs
        },
      },

      // ── Tipografía ───────────────────────────────────────────────────────
      fontFamily: {
        heading: ['"Nunito Sans"', "sans-serif"],
        body:    ['"Nunito Sans"', "sans-serif"],
        ui:      ['"Inter"',       "sans-serif"],
        sans:    ['"Nunito Sans"', '"Inter"', "sans-serif"],
      },
      fontSize: {
        "xs":  ["12px", { lineHeight: "16px" }],
        "sm":  ["14px", { lineHeight: "20px" }],
        "md":  ["16px", { lineHeight: "24px" }],
        "lg":  ["18px", { lineHeight: "25px" }],
        "xl":  ["20px", { lineHeight: "27px" }],
        "2xl": ["22px", { lineHeight: "30px" }],
        "4xl": ["34px", { lineHeight: "46px" }],
      },
      fontWeight: {
        regular:  "400",
        medium:   "500",
        semibold: "600",
        bold:     "700",
      },

      // ── Bordes ───────────────────────────────────────────────────────────
      borderRadius: {
        sm:   "4px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl":"20px",
        full: "9999px",
      },

      // ── Sombras ──────────────────────────────────────────────────────────
      boxShadow: {
        xs:  "0px 1px 2px rgba(16, 24, 40, 0.05)",
        sm:  "0px 1px 3px rgba(16, 24, 40, 0.10), 0px 1px 2px rgba(16, 24, 40, 0.06)",
        md:  "0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
        lg:  "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        card: "0px 24px 14px 0px rgba(0,0,0,0.65)",
      },

      // ── Gradientes ───────────────────────────────────────────────────────
      backgroundImage: {
        "gradient-button": "linear-gradient(135deg, #242424 0%, #000000 100%)",
        "gradient-brand":  "linear-gradient(135deg, #003DA6 0%, #2f80ed 100%)",
      },

      // ── Dimensiones fijas del layout ─────────────────────────────────────
      width: {
        sidebar: "300px",
        panel:   "320px",
      },
      height: {
        topbar: "50px",
        tabbar: "50px",
      },
    },
  },
  plugins: [],
};

export default config;
