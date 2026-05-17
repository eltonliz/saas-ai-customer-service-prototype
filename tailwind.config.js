/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "PingFang SC", "Microsoft YaHei", "system-ui", "sans-serif"],
      },
      fontSize: {
        "13": ["0.8125rem", { lineHeight: "1.25rem" }],
      },
      minHeight: {
        "row-md": "48px",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 35, 80, 0.08)",
        panel: "0 10px 28px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
      },
    },
  },
  plugins: [],
};
