"use client"

import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { LoadingPage } from '@/components/shared/LoadingSpinner'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Component Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Card Component</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a test of the Card component with some content inside.
          </p>
          <Button>Test Button</Button>
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Badges</h2>
          <div className="space-y-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Loading Spinner</h2>
        <LoadingPage />
      </div>
    </div>
  )
}