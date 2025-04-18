"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { ChevronDown, ChevronUp, Award, Zap } from "lucide-react"
import type { CarData, TimeMetric } from "@/types/car-data"

type SortDirection = "asc" | "desc"

interface LeaderboardTableProps {
  data: CarData[]
  metric: TimeMetric
  metricLabel: string
}

export default function LeaderboardTable({ data, metric, metricLabel }: LeaderboardTableProps) {
  const router = useRouter()
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[metric]
    const bValue = b[metric]

    // Handle null or undefined values
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    // For time metrics, lower is better
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const formatTime = (time: number | null) => {
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

  const handleRowClick = (carId: string) => {
    router.push(`/car/${carId}`)
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Make</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="hidden md:table-cell">Year</TableHead>
            <TableHead>
              <button className="flex items-center gap-1" onClick={toggleSortDirection}>
                {metricLabel}
                {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </TableHead>
            <TableHead className="hidden sm:table-cell">Power</TableHead>
            <TableHead className="hidden lg:table-cell">Modifications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((car, index) => (
              <TableRow
                key={car.id}
                className={`${index === 0 ? "bg-primary/5" : ""} cursor-pointer transition-colors hover:bg-muted/80`}
                onClick={() => handleRowClick(car.id)}
              >
                <TableCell className="text-center font-medium">
                  {index < 3 ? (
                    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Award
                        className={`h-4 w-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}`}
                      />
                    </div>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="font-medium">{car.make}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell className="hidden md:table-cell">{car.year}</TableCell>
                <TableCell className="font-bold text-primary">{formatTime(car[metric])}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {car.power ? (
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>{car.power} hp</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {car.modifications && car.modifications.length > 0 ? (
                      car.modifications.map((mod, i) => (
                        <Badge key={i} variant="outline" className="bg-muted/50">
                          {mod}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Stock</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
