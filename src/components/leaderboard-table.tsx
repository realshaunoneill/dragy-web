"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { ChevronDown, ChevronUp, Award, Zap, Calendar } from "lucide-react"
import type { CarList, TimeMetric } from "@/types/car-data"
import { useRouter } from "next/navigation"
type SortDirection = "asc" | "desc"

interface LeaderboardTableProps {
  data: CarList[]
  metric: TimeMetric
  metricLabel: string
}

export default function LeaderboardTable({ data, metric, metricLabel }: LeaderboardTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const router = useRouter()

  const sortedData = [...data].sort((a, b) => {
    return sortDirection === "asc" ? parseFloat(a.results) - parseFloat(b.results) : parseFloat(b.results) - parseFloat(a.results)
  })

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const formatTime = (time: string) => {
    if (time === null || time === undefined) return "N/A"

    // Format based on metric type
    if (metric === "quarterMile") {
      // Format quarter mile time with 3 decimal places
      return `${time}s`
    } else {
      // Format 0-100 and 100-200 times with 2 decimal places
      return `${time}s`
    }
  }

  const handleRowClick = (userId: string) => {
    router.push(`/car/${userId}`)
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Make & Model</TableHead>
            <TableHead>
              <button className="flex items-center gap-1" onClick={toggleSortDirection}>
                {metricLabel}
                {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Year</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((car, index) => (
              <TableRow
                key={car.id}
                className={`${index === 0 ? "bg-primary/5" : ""} cursor-pointer transition-colors hover:bg-muted/80`}
                onClick={() => handleRowClick(car.userId)}
              >
                <TableCell className="text-center font-medium">
                  <Link 
                    id={`car-link-${car.id}`}
                    href={`/car/${car.id}`}
                    className="hidden"
                  />
                  {index < 3 ? (
                    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Award
                        className={`h-4 w-4 ${
                          index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                        }`}
                      />
                    </div>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="p-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-muted/50">
                    <img className="rounded-md" src={car.icon} alt={car.name} width={32} height={32} />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{car.name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{car.brand_name}</div>
                    <div className="text-sm text-muted-foreground">{car.models}</div>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-primary">{formatTime(car.results)}</TableCell>
                <TableCell className="hidden md:table-cell">{car.car_decade}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {car.testTime}
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
