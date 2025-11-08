import { cn } from '@/lib/utils/helpers';
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-fast focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate border border-gray-300 dark:border-slate-light text-gray-900 dark:text-gray-100',
    danger: 'bg-error hover:bg-error/90 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate text-primary dark:text-primary-dark',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-body',
    lg: 'h-10 px-5 text-body-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: !disabled && !isLoading ? 1.03 : 1 }}
      whileTap={{ scale: !disabled && !isLoading ? 0.98 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
};