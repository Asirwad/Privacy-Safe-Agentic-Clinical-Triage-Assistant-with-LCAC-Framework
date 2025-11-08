import React from 'react'

interface Zone {
  id: string
  name: string
  color: string
  allowedTags: string[]
}

interface ZoneVisualizationProps {
  zones: Zone[]
  activeZone: string
  onZoneSelect: (zoneId: string) => void
}

export function ZoneVisualization({ zones, activeZone, onZoneSelect }: ZoneVisualizationProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">LCAC Zones</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              activeZone === zone.id
                ? `${zone.color} text-white ring-4 ring-opacity-50 ring-blue-500`
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onZoneSelect(zone.id)}
          >
            <h4 className="font-semibold">{zone.name}</h4>
            <p className="text-sm mt-1">
              Allowed tags: {zone.allowedTags.join(', ')}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800">Active Zone: {zones.find(z => z.id === activeZone)?.name}</h4>
        <p className="text-sm text-blue-700 mt-1">
          Only memories with tags [{zones.find(z => z.id === activeZone)?.allowedTags.join(', ')}] are accessible in this zone.
        </p>
      </div>
    </div>
  )
}