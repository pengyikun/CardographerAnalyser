/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cardographerThemeBG': '#374151'
            },

        },
        fontFamily: {
            'roboto': ['Roboto', 'sans-serif'],
            'montserrat': ['Montserrat', 'sans-serif']
        }
    },
    plugins: [],
}
