import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    label,
    error,
    id,
    ...props
}, ref) => {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                ref={ref}
                className={cn(
                    "w-full px-4 py-2 rounded-lg border border-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
