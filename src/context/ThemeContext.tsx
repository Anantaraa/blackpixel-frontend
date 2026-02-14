import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (clientX?: number, clientY?: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as Theme) || 'light';
    });

    useLayoutEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (clientX?: number, clientY?: number) => {
        const isDark = theme === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        // @ts-ignore - View Transition API might not be in TS definitions yet
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        });

        // If coordinates act as the center of the circle
        if (clientX === undefined || clientY === undefined) {
            return;
        }

        transition.ready.then(() => {
            // Calculate distance to the furthest corner
            const right = window.innerWidth - clientX;
            const bottom = window.innerHeight - clientY;
            const maxRadius = Math.hypot(
                Math.max(clientX, right),
                Math.max(clientY, bottom)
            );

            // Light -> Dark: New View (Dark) expands from 0 to Max
            // Dark -> Light: Old View (Dark) shrinks from Max to 0 (revealing Light underneath)
            // Note: CSS ensures 'old' view is on top during Dark->Light transition.

            const isGoingToDark = newTheme === 'dark';

            // If going Dark -> Light, we need to ensure the "Old" view (Dark) is on top
            // and shrinks to reveal the "New" view (Light) underneath.
            // We use a custom attribute to enforce z-index in CSS.
            document.documentElement.setAttribute('data-theme-transition', isGoingToDark ? 'to-dark' : 'to-light');

            const clipPath = [
                `circle(0px at ${clientX}px ${clientY}px)`,
                `circle(${maxRadius}px at ${clientX}px ${clientY}px)`,
            ];

            const animation = document.documentElement.animate(
                {
                    clipPath: isGoingToDark ? clipPath : [...clipPath].reverse(),
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: isGoingToDark
                        ? '::view-transition-new(root)'
                        : '::view-transition-old(root)',
                }
            );

            animation.finished.then(() => {
                document.documentElement.removeAttribute('data-theme-transition');
            });
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
