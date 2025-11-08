import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"

export const metadata: Metadata = {
  title: "LCAC Clinical Triage Dashboard",
  description: "Privacy-Safe Agentic Clinical Triage Assistant with LCAC Framework",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">LCAC<span className="text-blue-600">Triage</span></span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Button variant="primary" size="sm">
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Privacy-First <span className="text-blue-600">Clinical Triage</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700">
              Secure AI-powered clinical decision support with Least-Context Access Control
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" variant="primary">
                <Link href="/dashboard">
                  Access Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Zero Trust Security</h3>
              <p className="mt-2 text-gray-600">
                Cognitive security boundaries ensure AI agents only access authorized information.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Audit Trail</h3>
              <p className="mt-2 text-gray-600">
                Complete provenance tracking for all AI interactions with full compliance reporting.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Real-time Trust</h3>
              <p className="mt-2 text-gray-600">
                Dynamic trust scoring based on policy compliance and successful interactions.
              </p>
            </Card>
          </div>

          {/* How it Works */}
          <div className="mt-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">How LCAC Protects Patient Privacy</h2>
              <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
                Our cognitive security framework extends Zero Trust principles into the AI layer
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Zone Definition</h3>
                <p className="mt-2 text-gray-600">
                  Define clinical zones with specific access policies
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Memory Tagging</h3>
                <p className="mt-2 text-gray-600">
                  Tag patient data with appropriate security classifications
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Access Control</h3>
                <p className="mt-2 text-gray-600">
                  Enforce cognitive boundaries at inference time
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Audit & Trust</h3>
                <p className="mt-2 text-gray-600">
                  Monitor compliance and adjust trust scores dynamically
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-white rounded border border-gray-300 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to secure your clinical AI workflows?
              </h2>
              <p className="mt-4 text-xl text-gray-700">
                Join healthcare organizations using LCAC to protect patient privacy
              </p>
              <div className="mt-8">
                <Button size="lg" variant="primary">
                  <Link href="/dashboard">
                    Get Started Today
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">LCAC<span className="text-blue-600">Triage</span></span>
              </div>
            </div>
            <div className="mt-8 md:mt-0 flex justify-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left">
            <p className="text-gray-600">
              &copy; 2023 LCAC Triage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}