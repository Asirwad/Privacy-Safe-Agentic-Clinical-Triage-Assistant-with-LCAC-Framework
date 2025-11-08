"use client"

import { useState } from 'react'
import { Card, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Badge } from '@/components/shared/Badge'
import { askApi, sessionApi } from "@/services/api"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export function TriageAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your clinical triage assistant. Please describe your symptoms and I\'ll help assess the urgency of your situation.',
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSession = async () => {
    try {
      const response = await sessionApi.create({
        zone: 'triage',
        user_id: `patient_${Math.floor(Math.random() * 10000)}`,
        metadata: { source: 'dashboard' }
      })
      setSessionId(response.session_id)
      return response.session_id
    } catch (err) {
      console.error('Error creating session:', err)
      setError('Failed to create session')
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Create session if it doesn't exist
      let currentSessionId = sessionId
      if (!currentSessionId) {
        currentSessionId = await createSession()
        if (!currentSessionId) return
      }

      // Send message to AI
      const response = await askApi.ask({
        session_id: currentSessionId,
        message: input
      })

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to get response from the assistant')
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader 
        title="Clinical Triage Assistant" 
        subtitle="Interactive demo of the privacy-safe AI assistant"
        action={
          sessionId && (
            <Badge variant="success" size="sm">
              Session: {sessionId.substring(0, 8)}...
            </Badge>
          )
        }
      />
      
      <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Send'}
            </Button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>LCAC Status:</strong> Active</p>
        <p className="mt-1">Zone: Triage | Session: {sessionId ? sessionId.substring(0, 8) + '...' : 'Not established'}</p>
      </div>
    </Card>
  )
}