import React from 'react';
import { cn } from '@/lib/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-sm whitespace-nowrap transition-all duration-200 interactive-element';
  
  const sizes = {
    sm: 'h-[18px] px-2 text-xs',
    md: 'h-[22px] px-2.5 text-xs',
    lg: 'h-[26px] px-3 text-sm',
  };

  const variantMap: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    neutral: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const colorClasses = variantMap[variant] || variantMap.default;

  return (
    <span className={cn(baseStyles, sizes[size], colorClasses, className)}>
      {children}
    </span>
  );
};