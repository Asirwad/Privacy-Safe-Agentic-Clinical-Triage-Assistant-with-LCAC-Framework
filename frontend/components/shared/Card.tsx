"use client"

import { cn } from '@/lib/utils/helpers';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  className,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        hover ? 'glass-card-hover interactive-element' : 'glass-card',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="interactive-element">
          {action}
        </div>
      )}
    </div>
  );
};