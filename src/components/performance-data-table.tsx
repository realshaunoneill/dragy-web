"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface PerformanceData {
  date: string;
  results: number;
  distance: string;
}

interface PerformanceDataTableProps {
  data: PerformanceData[]
  metric: string
  metricLabel: string
}

export function PerformanceDataTable({ data, metric, metricLabel }: PerformanceDataTableProps) {
  // Filter out null values and sort by date (newest first)
  const validData = [...data]
    .filter((item) => item.results !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  // Format the time value
  const formatTime = (time: number) => {
    if (!time) return "N/A"
    return `${time.toFixed(2)}s`
  }

  const formatDistance = (distance: string) => {
    if (!distance) return "N/A"
    return `${distance}m`
  }

  // Calculate the trend compared to the previous entry
  const getTrend = (index: number) => {
    if (index === validData.length - 1) return null // No previous entry to compare

    const current = validData[index].results
    const previous = validData[index + 1].results

    if (current === null || previous === null) return null

    // For time metrics, lower is better
    if (current < previous) return "improved"
    if (current > previous) return "worse"
    return "same"
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>{metricLabel}</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No data available.
              </TableCell>
            </TableRow>
          ) : (
            validData.map((entry, index) => {
              const trend = getTrend(index)
              const prevValue = index < validData.length - 1 ? validData[index + 1].results : null

              // Calculate difference if both values exist
              let diff = null
              if (entry.results !== null && prevValue !== null) {
                diff = entry.results - prevValue
              }

              return (
                <TableRow key={entry.date}>
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>{formatTime(entry.results)}</TableCell>
                  <TableCell>{formatDistance(entry.distance)}</TableCell>
                  <TableCell className="text-right">
                    {trend === null ? (
                      <Badge variant="outline" className="ml-auto">
                        <Minus className="mr-1 h-3 w-3" />
                        Baseline
                      </Badge>
                    ) : trend === "improved" ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      >
                        <TrendingDown className="mr-1 h-3 w-3" />
                        {diff !== null ? formatTime(Math.abs(diff)).replace("s", "") : ""}
                      </Badge>
                    ) : trend === "worse" ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      >
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {diff !== null ? formatTime(Math.abs(diff)).replace("s", "") : ""}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Minus className="mr-1 h-3 w-3" />
                        No change
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
