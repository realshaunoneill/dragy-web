"use client"

import { useState, useEffect, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Search, Gauge, Trophy, AlertCircle } from "lucide-react"
import { ThemeSwitcher } from "@/src/components/theme-switcher"
import { CountrySwitcher } from "@/src/components/country-switcher"
import type { TimeMetric } from "@/types/car-data"
import { Country, COUNTRY_CODES } from "../constants/countries"
import { ErrorBoundary } from "react-error-boundary"
import dynamic from "next/dynamic"

const metricLabels = {
  zeroToHundred: "0-100 km/h",
  hundredToTwoHundred: "100-200 km/h",
  quarterMile: "1/4 Mile",
}

const DynamicLeaderboardContent = dynamic(
  () => import('@/src/components/leaderboard-content'),
  { ssr: false }
)

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>Something went wrong: {error.message}</p>
      </div>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRY_CODES[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMetric, setCurrentMetric] = useState<TimeMetric>("zeroToHundred")

  // Get selected country from local storage
  useEffect(() => {
    const storedCountryId = localStorage.getItem("selectedCountry")
    if (storedCountryId) {
      setSelectedCountry(COUNTRY_CODES.find((country) => country.id.toString() === storedCountryId) || COUNTRY_CODES[0])
    }
  }, [])

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(COUNTRY_CODES.find((country) => country.id.toString() === countryId) || COUNTRY_CODES[0])
    localStorage.setItem("selectedCountry", countryId)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Gauge className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Dragy Web</h1>
            <ThemeSwitcher />
          </div>
          <p className="max-w-[600px] text-center text-muted-foreground">
            Compare the fastest cars based on real-world performance data
          </p>
        </div>

        <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/30 px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Performance Leaderboard</CardTitle>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <CountrySwitcher
                  selectedCountry={selectedCountry}
                  onCountryChange={handleCountryChange}
                />
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="zeroToHundred"
              onValueChange={(value) => setCurrentMetric(value as TimeMetric)}
              className="w-full"
            >
              <div className="border-b px-6">
                <TabsList className="flex h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                  {Object.entries(metricLabels).map(([key, label]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.keys(metricLabels).map((metric) => (
                <TabsContent key={metric} value={metric} className="p-0">
                  <ErrorBoundary 
                    FallbackComponent={ErrorFallback}
                    onReset={() => {
                      // Reset the state when the error boundary is reset
                    }}
                  >
                    <Suspense fallback={<LoadingFallback />}>
                      <DynamicLeaderboardContent 
                        selectedCountry={selectedCountry}
                        currentMetric={metric as TimeMetric}
                      />
                    </Suspense>
                  </ErrorBoundary>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
