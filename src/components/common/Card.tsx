import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverEffect = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                "bg-transparent overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
