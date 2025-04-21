import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/src/components/theme-provider"
import { ReactQueryProvider } from '@/src/lib/react-query'
import { Header } from "@/src/components/Header"
import { Suspense } from "react"
import { ErrorBoundary } from "@/src/components/error-boundary"
import Loading from "./loading"
import { Footer } from "@/src/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dragy Web - Car Performance Leaderboard",
  description: "Compare the fastest cars based on real-world performance data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
          <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
              <Header />
              <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </Suspense>
              <Footer />
            </div>
          </main>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
