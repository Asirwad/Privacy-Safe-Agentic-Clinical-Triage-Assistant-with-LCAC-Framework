import React from 'react'
import { Card, CardHeader } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'

interface Memory {
  id: string
  zone: string
  tags: string[]
  content: string
  redacted: boolean
}

interface Zone {
  id: string
  name: string
  color: string
  allowedTags: string[]
}

interface MemoryGridProps {
  memories: Memory[]
  activeZone: string
  zones: Zone[]
}

export function MemoryGrid({ memories, activeZone, zones }: MemoryGridProps) {
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

  return (
    <Card>
      <CardHeader 
        title="Memory Management" 
        subtitle="Accessible and blocked memories by zone"
      />
      
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Accessible Memories in {activeZoneData?.name} Zone</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessibleMemories.map((memory) => (
            <div key={memory.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex justify-between items-start">
                <Badge variant="success" size="sm">
                  {memory.zone}
                </Badge>
                {memory.redacted && (
                  <Badge variant="error" size="sm">
                    Redacted
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="info" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {accessibleMemories.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No accessible memories in this zone
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-red-700 mb-3">Inaccessible/Blocked Memories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inaccessibleMemories.map((memory) => (
            <div key={memory.id} className="border border-red-200 rounded-lg p-4 bg-red-50 opacity-70">
              <div className="flex justify-between items-start">
                <Badge variant="error" size="sm">
                  {memory.zone}
                </Badge>
                {memory.redacted && (
                  <Badge variant="error" size="sm">
                    Redacted
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
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
            <div className="col-span-2 text-center py-8 text-gray-500">
              No blocked memories
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}