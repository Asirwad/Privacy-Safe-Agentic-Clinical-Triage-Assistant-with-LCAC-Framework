"use client"

import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function BreadcrumbsTest() {
  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: 'LCAC Clinical Triage', href: '/projects/lcac' },
    { label: 'Dashboard', href: '/projects/lcac/dashboard' },
    { label: 'Memory Management' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Breadcrumbs Test</h1>
        
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Atlassian Jira Style Breadcrumbs</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This implementation follows Atlassian Jira's breadcrumb design patterns:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Subtle background color for the breadcrumb container</li>
            <li>Blue links with hover states for navigation</li>
            <li>Chevron separators between items</li>
            <li>Home icon for the root link</li>
            <li>Truncated text for long breadcrumb items</li>
            <li>Font weight differentiation between current and parent pages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}