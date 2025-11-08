"use client"

import React from 'react'
import { AnimatedThemeToggler } from '@/components/AnimatedThemeToggler'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
      <AnimatedThemeToggler className="fixed top-4 right-4 z-50" />
    </div>
  )
}