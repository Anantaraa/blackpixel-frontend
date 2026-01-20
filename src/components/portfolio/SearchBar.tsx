import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, ...props }) => {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                {...props}
            />
        </div>
    );
};

export default SearchBar;
