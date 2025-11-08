import React from 'react'
import { Card, CardHeader } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'

interface TrustScoreData {
  userId: string
  score: number
  violationCount: number
  successfulInferences: number
}

interface TrustScoreProps {
  scores: TrustScoreData[]
}

export function TrustScore({ scores }: TrustScoreProps) {
  return (
    <Card>
      <CardHeader 
        title="Trust Scores" 
        subtitle="Dynamic trust scoring based on policy compliance"
      />
      
      <div className="space-y-4">
        {scores.map((score) => (
          <div key={score.userId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">User: {score.userId}</h4>
              <Badge variant="info" size="sm">
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
                  className={`h-2 rounded-full ${
                    score.score > 0.8 ? 'bg-green-500' : 
                    score.score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${score.score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-red-50 p-2 rounded">
                <p className="font-medium text-red-800">Violations</p>
                <p className="text-red-600">{score.violationCount}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="font-medium text-green-800">Successful</p>
                <p className="text-green-600">{score.successfulInferences}</p>
              </div>
            </div>
          </div>
        ))}
        
        {scores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trust scores available
          </div>
        )}
      </div>
    </Card>
  )
}