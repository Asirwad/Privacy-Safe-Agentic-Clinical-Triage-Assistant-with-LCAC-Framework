import React from 'react'

interface AuditLog {
  id: string
  sessionId: string
  timestamp: string
  prompt: string
  response: string
  usedMemories: string[]
  policyViolation: boolean
  reason?: string
}

interface AuditTrailProps {
  logs: AuditLog[]
}

export function AuditTrail({ logs }: AuditTrailProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Trail</h3>
      
      <div className="space-y-4">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`border rounded-lg p-4 ${
              log.policyViolation 
                ? 'border-red-200 bg-red-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">Audit #{log.id.substring(0, 8)}...</h4>
                <p className="text-sm text-gray-600">Session: {log.sessionId.substring(0, 8)}...</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                log.policyViolation 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {log.policyViolation ? 'Violation' : 'Compliant'}
              </span>
            </div>
            
            <div className="mt-2 text-sm">
              <p className="font-medium">Prompt:</p>
              <p className="text-gray-700 bg-gray-100 p-2 rounded">{log.prompt}</p>
              
              <p className="font-medium mt-2">Response:</p>
              <p className="text-gray-700 bg-gray-100 p-2 rounded">{log.response}</p>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <span>Timestamp: {log.timestamp}</span>
              <span className="ml-4">
                Memories used: {log.usedMemories.length}
              </span>
            </div>
            
            {log.policyViolation && log.reason && (
              <div className="mt-2 text-sm text-red-600">
                Violation reason: {log.reason}
              </div>
            )}
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No audit records
          </div>
        )}
      </div>
    </div>
  )
}