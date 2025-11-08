import "@/styles/globals.css"
import "@/styles/tailwind.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LCAC Clinical Triage",
  description: "Privacy-Safe Agentic Clinical Triage Assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-100">
        {children}
      </body>
    </html>
  )
}