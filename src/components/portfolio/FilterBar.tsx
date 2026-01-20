import React from 'react';
import { cn } from '../../utils/cn';

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    categories,
    activeCategory,
    onCategoryChange,
    className
}) => {
    return (
        <div className={cn("flex flex-wrap justify-center gap-12 font-sans text-sm tracking-widest uppercase mb-16", className)}>
            <button
                onClick={() => onCategoryChange('All')}
                className={cn(
                    "transition-all duration-300 pb-2 border-b border-transparent",
                    activeCategory === 'All'
                        ? "text-secondary border-primary"
                        : "text-gray-400 hover:text-secondary hover:border-gray-300"
                )}
            >
                All Works
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={cn(
                        "transition-all duration-300 pb-2 border-b border-transparent",
                        activeCategory === category
                            ? "text-secondary border-primary"
                            : "text-gray-400 hover:text-secondary hover:border-gray-300"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
