const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
    mode: "jit",
    theme: {
        extend: {
            colors: {
                textdark: "#f1f1f1",
                textlight: "#0f0f0f",
                bgdark: "#161616",
                bglight: "#ffffff",
                primary: "#00040f",
                youtube: "#cb4545",
                twitch: "#8e61c1",
                button: "#3694ff",
                dimWhite: "rgba(255, 255, 255, 0.7)",
                dimBlue: "rgba(9, 151, 124, 0.1)",
                textAlt: "#3694ff"
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
        },
        screens: {
            xsup: "480px",
            ssup: "620px",
            smup: "768px",
            mdup: "1060px",
            lgup: "1200px",
            xxlup: "1700px",
            xs: { 'max': '480px' },
            ss: { 'max': '640px' },
            sm: { 'max': '768px' },
            md: { 'max': '1024px' },
            lg: { 'max': '1280px' },
            xl: { 'max': '1536px' },
        },
    },
    darkMode: "class",
    plugins: [nextui()],
    corePlugins: {
        preflight: false,
    },
    important: true,
};