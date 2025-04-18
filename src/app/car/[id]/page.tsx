"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CarIcon, Clock, Gauge, AlertCircle, LineChart, Table2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"
import type { CarData, TimeMetric } from "@/types/car-data"
import { PerformanceChart } from "@/src/components/performance-chart"
import { PerformanceDataTable } from "@/src/components/performance-data-table"

interface CarHistoryData {
  date: string
  zeroToHundred: number | null
  hundredToTwoHundred: number | null
  quarterMile: number | null
}

interface CarDetailsData {
  car: CarData
  historicalData: CarHistoryData[]
}

// Default car data if API fails
const defaultCar: CarData = {
  id: "1",
  make: "Tesla",
  model: "Model S Plaid",
  year: 2023,
  zeroToHundred: 2.1,
  hundredToTwoHundred: 4.3,
  quarterMile: 9.23,
  power: 1020,
  modifications: null,
}

// Generate default historical data
const defaultHistoricalData = Array.from({ length: 12 }).map((_, i) => {
  const date = new Date()
  date.setMonth(date.getMonth() - (11 - i))

  // Create slight variations
  const randomFactor = () => 0.95 + Math.random() * 0.1

  return {
    date: date.toISOString().split("T")[0],
    zeroToHundred: +(defaultCar.zeroToHundred! * randomFactor()).toFixed(2),
    hundredToTwoHundred: +(defaultCar.hundredToTwoHundred! * randomFactor()).toFixed(2),
    quarterMile: +(defaultCar.quarterMile! * randomFactor()).toFixed(3),
  }
})

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<CarDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMetric, setCurrentMetric] = useState<TimeMetric>("zeroToHundred")
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use a simple fetch with no content-type validation
        const response = await fetch(`/api/car-times/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch car data: ${response.status}`)
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        console.error("Error fetching car data:", err)
        setError("Failed to load car data. Using default data.")

        // Use default data as fallback
        setData({
          car: { ...defaultCar, id: params.id },
          historicalData: defaultHistoricalData,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCarData()
  }, [params.id])

  const metricLabels = {
    zeroToHundred: "0-100 km/h",
    hundredToTwoHundred: "100-200 km/h",
    quarterMile: "1/4 Mile",
  }

  const formatTime = (time: number | null, metric: TimeMetric) => {
    if (time === null || time === undefined) return "N/A"

    // Format based on metric type
    if (metric === "quarterMile") {
      // Format quarter mile time with 3 decimal places
      return `${time.toFixed(3)}s`
    } else {
      // Format 0-100 and 100-200 times with 2 decimal places
      return `${time.toFixed(2)}s`
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Button>

        {error && (
          <div className="mb-4 rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <CarIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">
                  {data.car.make} {data.car.model}
                </h1>
                <Badge variant="outline" className="ml-2">
                  {data.car.year}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Gauge className="h-4 w-4" />
                  <span>{data.car.power ? `${data.car.power} hp` : "Power N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Best 0-100 km/h: {formatTime(data.car.zeroToHundred, "zeroToHundred")}</span>
                </div>
              </div>
              {data.car.modifications && data.car.modifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.car.modifications.map((mod, i) => (
                    <Badge key={i} variant="secondary">
                      {mod}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
              <CardHeader className="border-b bg-muted/30 px-6">
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Trends</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "chart" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setViewMode("chart")}
                    >
                      <LineChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Chart</span>
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setViewMode("table")}
                    >
                      <Table2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Table</span>
                    </Button>
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
                    <TabsContent key={metric} value={metric} className="p-6">
                      <div className="space-y-6">
                        {/* Chart View */}
                        {viewMode === "chart" && (
                          <div className="h-[350px] w-full">
                            <PerformanceChart
                              data={data.historicalData}
                              metric={metric as TimeMetric}
                              metricLabel={metricLabels[metric as TimeMetric]}
                            />
                          </div>
                        )}

                        {/* Table View */}
                        {viewMode === "table" && (
                          <PerformanceDataTable
                            data={data.historicalData}
                            metric={metric as TimeMetric}
                            metricLabel={metricLabels[metric as TimeMetric]}
                          />
                        )}

                        {/* Always show the table below the chart in chart view */}
                        {viewMode === "chart" && (
                          <div className="mt-8 pt-4 border-t">
                            <h3 className="text-lg font-medium mb-4">Historical Data</h3>
                            <PerformanceDataTable
                              data={data.historicalData}
                              metric={metric as TimeMetric}
                              metricLabel={metricLabels[metric as TimeMetric]}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p>No data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
