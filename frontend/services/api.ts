// API service for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-demo-key-change-in-production'

interface Memory {
  id: string
  zone: string
  tags: string[]
  content: string
  content_hash: string
  created_at: string
  redacted: boolean
}

interface Session {
  session_id: string
  zone: string
  user_id: string
  started_at: string
  revoked_at: string | null
  metadata: Record<string, any>
}

interface AskRequest {
  session_id: string
  message: string
}

interface AskResponse {
  session_id: string
  response: string
  audit_id: string
  used_memory_ids: string[]
  success: boolean
  error: string | null
  session_revoked: boolean
}

interface AuditLog {
  id: string
  session_id: string
  timestamp: string
  prompt: string
  response: string
  used_memory_ids: string[]
  provenance_hash: string
  policy_violation: boolean
  violation_reason: string | null
}

interface TrustScore {
  user_id: string
  score: number
  last_updated: string
  violation_count: number
  successful_inferences: number
}

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  }
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json() as Promise<T>
}

// Memory API
export const memoryApi = {
  create: (data: { zone: string; tags: string[]; content: string }) => 
    apiRequest<Memory>('/memories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  list: (zone?: string) => 
    apiRequest<Memory[]>(`/memories${zone ? `?zone=${zone}` : ''}`),
}

// Session API
export const sessionApi = {
  create: (data: { zone: string; user_id: string; metadata?: Record<string, any> }) => 
    apiRequest<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Ask API
export const askApi = {
  ask: (data: AskRequest) => 
    apiRequest<AskResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Audit API
export const auditApi = {
  list: (sessionId?: string) => 
    apiRequest<AuditLog[]>(`/audit${sessionId ? `?session_id=${sessionId}` : ''}`),
}

// Trust API
export const trustApi = {
  get: (userId: string) => 
    apiRequest<TrustScore>(`/trust?user_id=${userId}`),
}