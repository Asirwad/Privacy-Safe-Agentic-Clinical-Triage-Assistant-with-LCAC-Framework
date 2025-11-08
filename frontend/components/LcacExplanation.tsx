import React from 'react'

export function LcacExplanation() {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">LCAC Framework Visualization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-2">Zone-Based Access Control</h3>
          <p className="text-sm text-gray-700">
            Memories are tagged and filtered by zone (triage, radiology, billing, etc.). 
            AI agents can only access information authorized for their specific zone.
          </p>
        </div>
        
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h3 className="font-bold text-green-800 mb-2">Pre/Post-Inference Hooks</h3>
          <p className="text-sm text-gray-700">
            All AI interactions are validated through pre-inference and post-inference hooks 
            that enforce policy compliance and prevent cross-zone data leakage.
          </p>
        </div>
        
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <h3 className="font-bold text-purple-800 mb-2">Audit & Trust Scoring</h3>
          <p className="text-sm text-gray-700">
            Complete provenance tracking for all inference events with dynamic trust scoring 
            based on policy compliance and successful interactions.
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">How LCAC Protects Patient Privacy</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Prevents AI agents from accessing information outside their authorized zone</li>
          <li>Automatically revokes sessions when policy violations are detected</li>
          <li>Supports GDPR-compliant memory redaction with audit trail</li>
          <li>Maintains complete audit logs of all AI interactions for compliance</li>
        </ul>
      </div>
    </div>
  )
}