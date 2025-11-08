import React from 'react'

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
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Trust Scores</h3>
      
      <div className="space-y-4">
        {scores.map((score) => (
          <div key={score.userId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">User: {score.userId}</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Score: {score.score.toFixed(2)}
              </span>
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
    </div>
  )
}