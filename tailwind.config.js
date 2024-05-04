/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#583DA1",
                secondary: "#12131A",
            },
            fontFamily: {
                sans: ["Gladiora"],
            },
        },
    },
    plugins: [],
};
