import "styles/tailwind.css"
import { ReactNode } from "react"
import { Layout } from "@/components/Layout"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="motion-safe:scroll-smooth">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}