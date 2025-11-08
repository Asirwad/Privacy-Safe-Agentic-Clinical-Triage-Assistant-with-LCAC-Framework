'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  InformationCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes with clsx
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface Tip {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    href: string;
  };
}

interface TipsCarouselProps {
  tips: Tip[];
  storageKey?: string;
  className?: string;
}

export interface TipsCarouselRef {
  show: () => void;
  hide: () => void;
}

export const TipsCarousel = forwardRef<TipsCarouselRef, TipsCarouselProps>(({
  tips, 
  storageKey = 'dashboard-tips-hidden',
  className 
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const isHidden = localStorage.getItem(storageKey) === 'true';
      setIsVisible(!isHidden);
    } catch (e) {
      // If localStorage is unavailable (e.g., private mode), default to showing tips
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleHide = () => {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch (e) {
      // If localStorage is unavailable, continue with in-memory preference
    }
    setIsVisible(false);
  };

  const handleShow = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // If localStorage is unavailable, continue with in-memory preference
    }
    setIsVisible(true);
  };

  // Expose methods for external control
  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide,
  }));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleGoToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, tips.length]);

  if (!isVisible || tips.length === 0) {
    return null;
  }

  const currentTip = tips[currentIndex];
  const Icon = currentTip.icon || InformationCircleIcon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'bg-info-light dark:bg-info-bg border border-info dark:border-info-dark rounded-lg shadow-sm',
            className
          )}
        >
          <div className="p-6">
            {/* Header with close button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-info dark:bg-info-dark flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-body font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard Tips
                  </h3>
                  <p className="text-body-xs text-gray-600 dark:text-gray-400">
                    {currentIndex + 1} of {tips.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleHide}
                className="p-1 hover:bg-info/20 dark:hover:bg-info-dark/20 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate"
                aria-label="Hide tips"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Tip Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <h4 className="text-body font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {currentTip.title}
                </h4>
                <p className="text-body-sm text-gray-700 dark:text-gray-300">
                  {currentTip.description}
                </p>
                {currentTip.action && (
                  <div className="mt-4">
                    <Link href={currentTip.action.href}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                      >
                        {currentTip.action.label}
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-info/30 dark:border-info-dark/30">
              {/* Stepper Dots */}
              <div className="flex items-center gap-2">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoToIndex(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate',
                      index === currentIndex
                        ? 'w-6 bg-info dark:bg-info-dark'
                        : 'w-2 bg-info/40 dark:bg-info-dark/40 hover:bg-info/60 dark:hover:bg-info-dark/60'
                    )}
                    aria-label={`Go to tip ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={tips.length <= 1}
                  className="gap-1"
                  aria-label="Previous tip"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={tips.length <= 1}
                  className="gap-1"
                  aria-label="Next tip"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TipsCarousel.displayName = 'TipsCarousel';