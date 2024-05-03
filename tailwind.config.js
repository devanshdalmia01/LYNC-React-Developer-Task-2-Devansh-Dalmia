/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#583DA1",
                secondary: "#2560A7",
                tertiary: "#12131A",
                quaternary: "#FAFAFA",
                quinary: "#FFFFFF",
            },
            fontFamily: {
                sans: ["Gladiora"],
            },
        },
    },
    plugins: [],
};
