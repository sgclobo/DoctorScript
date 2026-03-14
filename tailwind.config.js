/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fe",
        surface: "#f7f9fe",
        surface_container_low: "#f1f4f8",
        surface_container_lowest: "#ffffff",
        surface_container_high: "#e5e8ed",
        on_surface: "#181c1f",
        outline_variant: "rgba(194, 198, 212, 0.2)",
        primary: "#00488d",
        primary_container: "#005fb8",
        secondary: "#4c5f7d",
        secondary_container: "#c7dbff",
        tertiary: "#00505b",
        error: "#ba1a1a",
        error_container: "#ffdad6"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [],
}
