import React from 'react'
import { Card, CardHeader } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'

interface Session {
  id: string
  zone: string
  userId: string
  status: string
  startTime: string
  reason?: string
}

interface SessionPanelProps {
  sessions: Session[]
}

export function SessionPanel({ sessions }: SessionPanelProps) {
  return (
    <Card>
      <CardHeader 
        title="Active Sessions" 
        subtitle="Current user sessions and their status"
      />
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`border rounded-lg p-4 ${
              session.status === 'active' 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">Session {session.id.substring(0, 8)}...</h4>
                <p className="text-sm text-gray-600">User: {session.userId}</p>
              </div>
              <Badge variant={session.status === 'active' ? 'success' : 'error'} size="sm">
                {session.status}
              </Badge>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Badge variant="info" size="sm">
                {session.zone}
              </Badge>
              <span className="ml-2">Started: {session.startTime}</span>
            </div>
            
            {session.reason && (
              <div className="mt-2 text-sm text-red-600">
                Revocation reason: {session.reason}
              </div>
            )}
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active sessions
          </div>
        )}
      </div>
    </Card>
  )
}