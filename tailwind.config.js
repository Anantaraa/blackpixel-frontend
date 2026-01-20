/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2EB4FF', // Electric Blue (Tech/Modern)
                primaryDark: '#0090E0',
                secondary: '#FFFFFF', // White text for Dark Mode
                neutral: {
                    DEFAULT: '#09090B', // Zinc 950 (Deep Dark)
                    card: '#18181B',    // Zinc 900
                    border: '#27272A',  // Zinc 800
                },
                text: {
                    DEFAULT: '#F4F4F5', // Zinc 100
                    muted: '#A1A1AA',   // Zinc 400
                },
                surface: '#000000', // Pure Black
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            fontSize: {
                'display-1': ['7rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
                'display-2': ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
                'display-3': ['3rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
            },
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.025em',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2EB4FF33 0deg, #000000 360deg)',
            }
        },
    },
    plugins: [],
}
