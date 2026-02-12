import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Aggroso | Meeting Action Items Tracker',
  description: 'Precision AI tools to transform meeting transcripts into actionable items.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        "min-h-screen font-sans antialiased bg-slate-50/50",
        inter.variable,
        outfit.variable
      )}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900">Aggroso</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Making meetings productive, one transcript at a time.
                  </p>
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span className="">© 2026 Aggroso.</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
