import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
    return (
        <div className={cn(
            "bg-white dark:bg-[#2d343c] p-5 rounded-xl border border-gray-100 dark:border-gray-800 soft-shadow transition-colors",
            className
        )}>
            {title && (
                <div className="mb-4">
                    <p className="text-[#5d7f89] text-xs font-bold uppercase tracking-wider">{title}</p>
                    {subtitle && <p className="text-3xl font-extrabold mt-1">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};
