import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav 
      className={cn('flex items-center py-2 px-4 glass-card rounded text-sm', className)} 
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center font-medium interactive-element"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            {isLast ? (
              <span className="text-gray-900 font-semibold truncate max-w-xs">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium truncate max-w-xs interactive-element"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 truncate max-w-xs">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};