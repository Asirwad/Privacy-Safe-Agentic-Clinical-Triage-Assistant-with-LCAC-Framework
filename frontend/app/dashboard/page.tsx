"use client"

import { useState, useEffect } from 'react'
import { ZoneVisualization } from "@/components/ZoneVisualization"
import { MemoryGrid } from "@/components/MemoryGrid"
import { SessionPanel } from "@/components/SessionPanel"
import { AuditTrail } from "@/components/AuditTrail"
import { TrustScore } from "@/components/TrustScore"
import { LcacExplanation } from "@/components/LcacExplanation"
import { TriageAssistant } from "@/components/TriageAssistant"
import { memoryApi } from "@/services/api"
import { LoadingPage } from '@/components/shared/LoadingSpinner'
import { Card, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'

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

interface ApiMemory {
  id: string
  zone: string
  tags: string[]
  content: string
  content_hash: string
  created_at: string
  redacted: boolean
}

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<string>('triage')
  const [memories, setMemories] = useState<Memory[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [trustScores, setTrustScores] = useState<TrustScoreData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const zones: Zone[] = [
    { id: 'triage', name: 'Triage', color: 'bg-blue-500', allowedTags: ['symptoms', 'vitals', 'recent_visit'] },
    { id: 'teleconsult', name: 'Teleconsult', color: 'bg-green-500', allowedTags: ['symptoms', 'vitals', 'recent_visit', 'prescription'] },
    { id: 'billing', name: 'Billing', color: 'bg-yellow-500', allowedTags: ['billing_code', 'insurance', 'procedure'] },
    { id: 'research', name: 'Research', color: 'bg-purple-500', allowedTags: ['anonymized_data', 'aggregate_stats'] },
    { id: 'radiology', name: 'Radiology', color: 'bg-red-500', allowedTags: ['imaging_results', 'radiology_report'] },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch memories
      const memoryData = await memoryApi.list()
      const formattedMemories: Memory[] = memoryData.map((mem: ApiMemory) => ({
        id: mem.id,
        zone: mem.zone,
        tags: mem.tags,
        content: mem.content,
        redacted: mem.redacted
      }))
      setMemories(formattedMemories)
      
      // For now, we'll keep using mock data for other components
      // In a real implementation, you would fetch this data from the API
      
      const mockSessions: Session[] = [
        { id: 'sess1', zone: 'triage', userId: 'patient_001', status: 'active', startTime: '2023-05-15 10:30:00' },
        { id: 'sess2', zone: 'radiology', userId: 'patient_002', status: 'revoked', startTime: '2023-05-15 09:15:00', reason: 'Policy violation' },
      ]
      
      const mockAuditLogs: AuditLog[] = [
        { id: 'audit1', sessionId: 'sess1', timestamp: '2023-05-15 10:32:00', prompt: 'What should I do about my chest pain?', response: 'Based on your symptoms, I recommend...', usedMemories: ['1'], policyViolation: false },
        { id: 'audit2', sessionId: 'sess2', timestamp: '2023-05-15 09:20:00', prompt: 'What do you know about radiology results?', response: 'I cannot access radiology information from this zone.', usedMemories: [], policyViolation: true, reason: 'Cross-zone access attempt' },
      ]
      
      const mockTrustScores: TrustScoreData[] = [
        { userId: 'patient_001', score: 0.95, violationCount: 0, successfulInferences: 12 },
        { userId: 'patient_002', score: 0.6, violationCount: 2, successfulInferences: 8 },
      ]
      
      setSessions(mockSessions)
      setAuditLogs(mockAuditLogs)
      setTrustScores(mockTrustScores)
      
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch data from the backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader 
            title="Error" 
            subtitle="Failed to load dashboard data"
          />
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchData}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LCAC Clinical Triage Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualizing the Least-Context Access Control framework in action
              </p>
            </div>
            <Badge variant="success">Live</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* LCAC Explanation */}
        <div className="mb-8">
          <LcacExplanation />
        </div>

        {/* Zone Visualization */}
        <div className="mb-8">
          <ZoneVisualization 
            zones={zones} 
            activeZone={activeZone} 
            onZoneSelect={setActiveZone}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Memory Grid */}
            <MemoryGrid 
              memories={memories} 
              activeZone={activeZone} 
              zones={zones}
            />

            {/* Triage Assistant */}
            <TriageAssistant />

            {/* Audit Trail */}
            <AuditTrail logs={auditLogs} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Session Panel */}
            <SessionPanel sessions={sessions} />

            {/* Trust Scores */}
            <TrustScore scores={trustScores} />
          </div>
        </div>
      </main>
    </div>
  )
}