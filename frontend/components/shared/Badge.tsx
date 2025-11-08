import React from 'react';
import { cn } from '@/lib/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'status' | 'success' | 'warning' | 'error' | 'info';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color,
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded whitespace-nowrap';
  
  const sizes = {
    sm: 'h-[18px] px-2 text-[10px]',
    md: 'h-[22px] px-2.5 text-xs',
    lg: 'h-[26px] px-3 text-sm',
  };

  // Determine color classes
  let colorClasses = '';
  
  if (color) {
    const colorMap: Record<string, string> = {
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
    };
    colorClasses = colorMap[color] || colorMap.gray || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  } else {
    const variantMap: Record<string, string> = {
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      warning: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
      error: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      priority: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      status: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    };
    colorClasses = variantMap[variant] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }

  return (
    <span className={cn(baseStyles, sizes[size], colorClasses, className)}>
      {children}
    </span>
  );
};