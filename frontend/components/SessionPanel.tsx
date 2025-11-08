import React from 'react'

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
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
      
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
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                session.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {session.status}
              </span>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {session.zone}
              </span>
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
    </div>
  )
}