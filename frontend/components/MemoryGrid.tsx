import React from 'react'

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
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Management</h3>
      
      <div className="mb-6">
        <h4 className="font-medium text-green-700">Accessible Memories in {activeZoneData?.name} Zone</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {accessibleMemories.map((memory) => (
            <div key={memory.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {memory.zone}
                </span>
                {memory.redacted && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Redacted
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
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
        <h4 className="font-medium text-red-700">Inaccessible/Blocked Memories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {inaccessibleMemories.map((memory) => (
            <div key={memory.id} className="border border-red-200 rounded-lg p-4 bg-red-50 opacity-70">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {memory.zone}
                </span>
                {memory.redacted && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Redacted
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">{memory.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
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
    </div>
  )
}