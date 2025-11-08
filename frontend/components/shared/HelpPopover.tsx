'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QuestionMarkCircleIcon, 
  EyeIcon, 
  EyeSlashIcon,
  BookOpenIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes with clsx
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface HelpPopoverProps {
  className?: string;
}

export const HelpPopover: React.FC<HelpPopoverProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  // Check localStorage for tips visibility on mount
  useEffect(() => {
    try {
      const isHidden = localStorage.getItem('dashboard-tips-hidden') === 'true';
      setShowTips(!isHidden);
    } catch (e) {
      // If localStorage is unavailable, default to showing tips
      setShowTips(true);
    }
  }, []);

  // Handle clicks outside the popover to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close popover with Escape key
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // Focus back to the help button
        helpButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleTipsVisibility = () => {
    const newShowTips = !showTips;
    setShowTips(newShowTips);
    
    try {
      if (newShowTips) {
        localStorage.removeItem('dashboard-tips-hidden');
      } else {
        localStorage.setItem('dashboard-tips-hidden', 'true');
      }
    } catch (e) {
      // If localStorage is unavailable, continue with in-memory preference
    }

    // Dispatch a custom event to notify the dashboard
    window.dispatchEvent(new CustomEvent('tipsVisibilityChanged', { 
      detail: { show: newShowTips } 
    }));

    // If we're showing tips, close the popover
    if (newShowTips) {
      setIsOpen(false);
      // Focus back to the help button
      helpButtonRef.current?.focus();
    }
  };

  return (
    <div className={cn('relative', className)} ref={popoverRef}>
      <button
        ref={helpButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-light transition-colors text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate"
        aria-label="Help"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <QuestionMarkCircleIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-slate border border-gray-200 dark:border-slate-light rounded-md shadow-lg z-50"
            role="dialog"
            aria-label="Dashboard Help"
          >
            <div className="p-4">
              <h3 className="text-body font-medium text-gray-900 dark:text-gray-100 mb-3">
                Dashboard Help
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body text-gray-700 dark:text-gray-300">
                    Show Tips
                  </span>
                  <button
                    onClick={toggleTipsVisibility}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate"
                    aria-label={showTips ? "Hide dashboard tips" : "Show dashboard tips"}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {showTips ? (
                        <EyeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      )}
                    </motion.div>
                  </button>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-slate-light">
                  <Link 
                    href="/docs/dashboard-tips"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-light transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate"
                    tabIndex={0}
                  >
                    <BookOpenIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-body">Dashboard Tips Docs</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};