/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    yellow: '#FACC15', // primary CTA color
                    dark: '#1F2018',   // main background for services page
                    card: '#16181A',   // very dark for cards
                    text: '#E4E4E7',   // light gray for body
                    muted: '#9CA3AF',  // muted text
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            }
        },
    },
    plugins: [],
}