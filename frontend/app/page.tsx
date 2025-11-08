import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "LCAC Clinical Triage Dashboard",
  description: "Privacy-Safe Agentic Clinical Triage Assistant with LCAC Framework",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">LCAC Clinical Triage System</h1>
          <p className="mt-1 text-sm text-gray-500">
            Privacy-Safe Agentic Clinical Triage Assistant with Least-Context Access Control
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to the LCAC Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">What is LCAC?</h3>
              <p className="text-gray-700">
                The Least-Context Access Control (LCAC) framework extends Zero Trust principles 
                into the cognitive layer of AI systems, ensuring that AI agents only access and 
                reason about information authorized for their specific zone.
              </p>
            </div>
            
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Zone-based memory access control</li>
                <li>Pre/post-inference policy enforcement</li>
                <li>Audit logging with full provenance</li>
                <li>Dynamic trust scoring</li>
                <li>GDPR-compliant memory redaction</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">LCAC Framework Principles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">Cognitive Least Privilege</h4>
              <p className="mt-2 text-gray-600">
                Limit what an AI agent can know based on contextual authorization
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">Reasoning Isolation</h4>
              <p className="mt-2 text-gray-600">
                Prevent inference drift by isolating reasoning chains
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">Cognitive Integrity</h4>
              <p className="mt-2 text-gray-600">
                Guarantee traceable, verifiable inferences
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}