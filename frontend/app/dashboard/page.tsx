"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { TriageAssistant } from '@/components/TriageAssistant'

interface Zone {
  id: string
  name: string
  color: string
  allowedTags: string[]
}

interface Memory {
  id: string
  zone: string
  tags: string[]
  content: string
  redacted: boolean
}

interface Session {
  id: string
  zone: string
  userId: string
  status: string
  startTime: string
  reason?: string
}

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

interface TrustScoreData {
  userId: string
  score: number
  violationCount: number
  successfulInferences: number
}

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<string>('triage')
  const [memories, setMemories] = useState<Memory[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [trustScores, setTrustScores] = useState<TrustScoreData[]>([])

  // Mock data for demonstration
  const zones: Zone[] = [
    { id: 'triage', name: 'Triage', color: 'bg-blue-500', allowedTags: ['symptoms', 'vitals', 'recent_visit'] },
    { id: 'teleconsult', name: 'Teleconsult', color: 'bg-green-500', allowedTags: ['symptoms', 'vitals', 'recent_visit', 'prescription'] },
    { id: 'billing', name: 'Billing', color: 'bg-yellow-500', allowedTags: ['billing_code', 'insurance', 'procedure'] },
    { id: 'research', name: 'Research', color: 'bg-purple-500', allowedTags: ['anonymized_data', 'aggregate_stats'] },
    { id: 'radiology', name: 'Radiology', color: 'bg-red-500', allowedTags: ['imaging_results', 'radiology_report'] },
  ]

  const mockMemories: Memory[] = [
    { id: '1', zone: 'triage', tags: ['symptoms', 'vitals'], content: 'Patient reports chest pain for 2 days. Blood pressure: 140/90.', redacted: false },
    { id: '2', zone: 'triage', tags: ['symptoms'], content: 'Patient reports persistent cough for 1 week.', redacted: false },
    { id: '3', zone: 'radiology', tags: ['imaging_results', 'radiology_report'], content: 'Chest X-ray shows no acute disease. Lungs are clear.', redacted: false },
    { id: '4', zone: 'billing', tags: ['billing_code', 'procedure'], content: 'Procedure code: 99213. Insurance: Blue Cross Blue Shield.', redacted: false },
    { id: '5', zone: 'triage', tags: ['recent_visit'], content: 'Patient visited clinic last week with complaint of headaches.', redacted: true },
  ]

  const mockSessions: Session[] = [
    { id: 'sess1', zone: 'triage', userId: 'patient_001', status: 'active', startTime: '2023-05-15 10:30:00' },
    { id: 'sess2', zone: 'radiology', userId: 'patient_002', status: 'revoked', startTime: '2023-05-15 09:15:00', reason: 'Policy violation' },
    { id: 'sess3', zone: 'teleconsult', userId: 'patient_003', status: 'active', startTime: '2023-05-15 11:45:00' },
  ]

  const mockAuditLogs: AuditLog[] = [
    { id: 'audit1', sessionId: 'sess1', timestamp: '2023-05-15 10:32:00', prompt: 'What should I do about my chest pain?', response: 'Based on your symptoms, I recommend...', usedMemories: ['1'], policyViolation: false },
    { id: 'audit2', sessionId: 'sess2', timestamp: '2023-05-15 09:20:00', prompt: 'What do you know about radiology results?', response: 'I cannot access radiology information from this zone.', usedMemories: [], policyViolation: true, reason: 'Cross-zone access attempt' },
    { id: 'audit3', sessionId: 'sess1', timestamp: '2023-05-15 10:45:00', prompt: 'Any recent visits?', response: 'I see you visited last week for headaches.', usedMemories: ['5'], policyViolation: false },
  ]

  const mockTrustScores: TrustScoreData[] = [
    { userId: 'patient_001', score: 0.95, violationCount: 0, successfulInferences: 12 },
    { userId: 'patient_002', score: 0.6, violationCount: 2, successfulInferences: 8 },
    { userId: 'patient_003', score: 0.85, violationCount: 1, successfulInferences: 15 },
  ]

  useEffect(() => {
    // Set mock data immediately
    setMemories(mockMemories)
    setSessions(mockSessions)
    setAuditLogs(mockAuditLogs)
    setTrustScores(mockTrustScores)
  }, [])

  // Filter memories for active zone
  const activeZoneData = zones.find(zone => zone.id === activeZone)
  const accessibleMemories = memories.filter(memory => 
    memory.zone === activeZone && 
    memory.tags.some(tag => activeZoneData?.allowedTags.includes(tag)) &&
    !memory.redacted
  )
  
  const inaccessibleMemories = memories.filter(memory => 
    !(memory.zone === activeZone && 
    memory.tags.some(tag => activeZoneData?.allowedTags.includes(tag)) &&
    !memory.redacted)
  )

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: 'LCAC Clinical Triage', href: '/projects/lcac' },
    { label: 'Dashboard' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center interactive-element">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900 interactive-element">LCAC<span className="text-blue-600">Triage</span></span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="success" className="interactive-element">Live</Badge>
              <Button variant="subtle" size="sm" className="interactive-element">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Expanded width */}
          <div className="lg:w-8/12">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 interactive-element">LCAC Dashboard</h1>
              <p className="mt-1 text-gray-600 interactive-element">
                Real-time visualization of cognitive access control in clinical triage
              </p>
            </div>

            {/* Zone Selection */}
            <Card className="mb-6">
              <div className="flex flex-wrap gap-3">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    className={`px-4 py-2 rounded-sm font-semibold transition-all interactive-element ${
                      activeZone === zone.id
                        ? `${zone.color} text-white shadow-md hover:shadow-lg`
                        : 'bg-white/80 text-gray-700 border border-gray-300 hover:bg-gray-50/80'
                    }`}
                    onClick={() => setActiveZone(zone.id)}
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50/80 rounded interactive-element">
                <p className="text-blue-800">
                  <span className="font-semibold">Active Zone:</span> {activeZoneData?.name} • 
                  <span className="ml-2">Allowed tags: {activeZoneData?.allowedTags.join(', ')}</span>
                </p>
              </div>
            </Card>

            {/* Memory Grid */}
            <Card className="mb-6">
              <CardHeader 
                title="Memory Management" 
                subtitle="Accessible and blocked memories by zone"
                action={<Badge variant="info" className="interactive-element">{memories.length} memories</Badge>}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center interactive-element">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Accessible Memories ({accessibleMemories.length})
                  </h3>
                  <div className="space-y-4">
                    {accessibleMemories.map((memory) => (
                      <div key={memory.id} className="border border-green-200 rounded p-4 bg-green-50/80 interactive-element">
                        <div className="flex justify-between items-start">
                          <Badge variant="success" size="sm" className="interactive-element">
                            {memory.zone}
                          </Badge>
                          {memory.redacted && (
                            <Badge variant="error" size="sm" className="interactive-element">
                              Redacted
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {memory.tags.map((tag) => (
                            <Badge key={tag} variant="info" size="sm" className="interactive-element">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {accessibleMemories.length === 0 && (
                      <div className="text-center py-8 text-gray-500 interactive-element">
                        No accessible memories in this zone
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center interactive-element">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Blocked Memories ({inaccessibleMemories.length})
                  </h3>
                  <div className="space-y-4">
                    {inaccessibleMemories.map((memory) => (
                      <div key={memory.id} className="border border-red-200 rounded p-4 bg-red-50/80 opacity-90 interactive-element">
                        <div className="flex justify-between items-start">
                          <Badge variant="error" size="sm" className="interactive-element">
                            {memory.zone}
                          </Badge>
                          {memory.redacted && (
                            <Badge variant="error" size="sm" className="interactive-element">
                              Redacted
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {memory.tags.map((tag) => (
                            <Badge key={tag} variant="default" size="sm" className="interactive-element">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-red-600">
                          Blocked by LCAC policy
                        </div>
                      </div>
                    ))}
                    {inaccessibleMemories.length === 0 && (
                      <div className="text-center py-8 text-gray-500 interactive-element">
                        No blocked memories
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Sessions and Trust Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sessions */}
              <Card>
                <CardHeader 
                  title="Active Sessions" 
                  subtitle="Currently active LCAC sessions"
                  action={<Badge variant="info" className="interactive-element">{sessions.length} sessions</Badge>}
                />
                
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className={`border rounded p-4 interactive-element ${
                        session.status === 'active' 
                          ? 'border-green-200 bg-green-50/80' 
                          : 'border-red-200 bg-red-50/80'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">Session {session.id.substring(0, 8)}...</h4>
                          <p className="text-sm text-gray-600">User: {session.userId}</p>
                        </div>
                        <Badge variant={session.status === 'active' ? 'success' : 'error'} size="sm" className="interactive-element">
                          {session.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <Badge variant="info" size="sm" className="interactive-element">
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
                    <div className="text-center py-8 text-gray-500 interactive-element">
                      No active sessions
                    </div>
                  )}
                </div>
              </Card>

              {/* Trust Scores */}
              <Card>
                <CardHeader 
                  title="Trust Scores" 
                  subtitle="Dynamic trust scoring for users"
                  action={<Badge variant="info" className="interactive-element">{trustScores.length} users</Badge>}
                />
                
                <div className="space-y-4">
                  {trustScores.map((score) => (
                    <div key={score.userId} className="border border-gray-200 rounded p-4 interactive-element">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">User: {score.userId}</h4>
                        <Badge variant="info" size="sm" className="interactive-element">
                          Score: {score.score.toFixed(2)}
                        </Badge>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trust Level</span>
                          <span>{(score.score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full interactive-element ${
                              score.score > 0.8 ? 'bg-green-500' : 
                              score.score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${score.score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-red-50/80 p-2 rounded interactive-element">
                          <p className="font-semibold text-red-800">Violations</p>
                          <p className="text-red-600">{score.violationCount}</p>
                        </div>
                        <div className="bg-green-50/80 p-2 rounded interactive-element">
                          <p className="font-semibold text-green-800">Successful</p>
                          <p className="text-green-600">{score.successfulInferences}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {trustScores.length === 0 && (
                    <div className="text-center py-8 text-gray-500 interactive-element">
                      No trust scores available
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Audit Trail */}
            <Card className="mb-6">
              <CardHeader 
                title="Audit Trail" 
                subtitle="Complete provenance tracking"
                action={<Badge variant="info" className="interactive-element">{auditLogs.length} events</Badge>}
              />
              
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`border rounded p-4 interactive-element ${
                      log.policyViolation 
                        ? 'border-red-200 bg-red-50/80' 
                        : 'border-gray-200 bg-gray-50/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">Audit #{log.id.substring(0, 8)}...</h4>
                        <p className="text-sm text-gray-600">Session: {log.sessionId.substring(0, 8)}...</p>
                      </div>
                      <Badge variant={log.policyViolation ? 'error' : 'success'} size="sm" className="interactive-element">
                        {log.policyViolation ? 'Violation' : 'Compliant'}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Prompt:</p>
                      <p className="text-gray-700 bg-gray-100/80 p-2 rounded">{log.prompt}</p>
                      
                      <p className="font-semibold mt-2">Response:</p>
                      <p className="text-gray-700 bg-gray-100/80 p-2 rounded">{log.response}</p>
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
                
                {auditLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500 interactive-element">
                    No audit records
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Reduced width */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              <TriageAssistant />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}