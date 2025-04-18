"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Search, Gauge, Trophy, AlertCircle } from "lucide-react"
import LeaderboardTable from "@/src/components/leaderboard-table"
import { ThemeSwitcher } from "@/src/components/theme-switcher"
import { CountrySwitcher, type Country } from "@/src/components/country-switcher"
import type { CarData, TimeMetric } from "@/types/car-data"

// Default countries if API fails
const defaultCountries: Country[] = [{ id: "global", name: "Global", code: "GLOBAL" }]

// Default car data if API fails
const defaultCarData: CarData[] = [
  {
    id: "1",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    zeroToHundred: 2.1,
    hundredToTwoHundred: 4.3,
    quarterMile: 9.23,
    power: 1020,
    modifications: null,
  },
  {
    id: "2",
    make: "Porsche",
    model: "911 Turbo S",
    year: 2022,
    zeroToHundred: 2.7,
    hundredToTwoHundred: 5.9,
    quarterMile: 10.1,
    power: 640,
    modifications: null,
  },
]

export default function Home() {
  const [carData, setCarData] = useState<CarData[]>(defaultCarData)
  const [countries, setCountries] = useState<Country[]>(defaultCountries)
  const [selectedCountry, setSelectedCountry] = useState<string>("global")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMetric, setCurrentMetric] = useState<TimeMetric>("zeroToHundred")

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Use a simple fetch with no content-type validation for countries
        const response = await fetch("/api/countries")

        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`)
        }

        const data = await response.json()
        setCountries(data)
      } catch (err) {
        console.error("Error fetching countries:", err)
        // Keep using default countries
      }
    }

    fetchCountries()
  }, [])

  // Fetch car data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use a simple fetch with no content-type validation
        const response = await fetch(`/api/car-times?country=${selectedCountry}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch car data: ${response.status}`)
        }

        const data = await response.json()
        setCarData(data)
      } catch (err) {
        console.error("Error fetching car data:", err)
        setError("Failed to load leaderboard data. Using default data.")
        // Keep using default data
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCountry])

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId)
  }

  const filteredData = carData.filter(
    (car) =>
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const metricLabels = {
    zeroToHundred: "0-100 km/h",
    hundredToTwoHundred: "100-200 km/h",
    quarterMile: "1/4 Mile",
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

        {error && (
          <div className="mb-4 rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/30 px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Performance Leaderboard</CardTitle>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <CountrySwitcher
                  countries={countries}
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
                  {loading ? (
                    <div className="flex justify-center py-16">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <LeaderboardTable
                      data={filteredData}
                      metric={metric as TimeMetric}
                      metricLabel={metricLabels[metric as TimeMetric]}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
