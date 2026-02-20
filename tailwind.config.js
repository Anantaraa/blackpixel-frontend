/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'rgba(var(--color-primary) / <alpha-value>)',
                primaryDark: 'rgba(var(--color-primary-dark) / <alpha-value>)',
                secondary: 'rgba(var(--color-secondary) / <alpha-value>)',
                neutral: {
                    DEFAULT: 'rgba(var(--color-neutral) / <alpha-value>)',
                    card: 'rgba(var(--color-neutral-card) / <alpha-value>)',
                    border: 'rgba(var(--color-neutral-border) / <alpha-value>)',
                },
                text: {
                    DEFAULT: 'rgba(var(--color-text) / <alpha-value>)',
                    muted: 'rgba(var(--color-text-muted) / <alpha-value>)',
                },
                surface: 'rgba(var(--color-surface) / <alpha-value>)',
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
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #71717A33 0deg, #000000 360deg)',
            }
        },
    },
    plugins: [],
}
