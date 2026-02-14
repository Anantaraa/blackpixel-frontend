import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-neutral-card/50 backdrop-blur-md border border-neutral-border hover:bg-neutral-border transition-colors duration-300 group"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-text-muted group-hover:text-text transition-colors" />
            ) : (
                <Sun className="w-5 h-5 text-text-muted group-hover:text-text transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;
