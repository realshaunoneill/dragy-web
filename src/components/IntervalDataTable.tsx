"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Clock } from "lucide-react";

interface IntervalDataTableProps {
  intervalData: {
    name: string;
    time: number;
  }[];
}

export function IntervalDataTable({ intervalData }: IntervalDataTableProps) {
  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format the time value
  const formatTime = (time: number) => {
    if (!time) return "N/A";
    return `${time.toFixed(2)}s`;
  };

  const formatDistance = (distance: string) => {
    if (!distance) return "N/A";
    return `${distance}m`;
  };

  const midpoint = Math.ceil(intervalData.length / 2);
  const leftColumnIntervals = intervalData.slice(0, midpoint);
  const rightColumnIntervals = intervalData.slice(midpoint);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Interval Times</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Interval</TableHead>
                <TableHead className="text-right">Time (seconds)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leftColumnIntervals.map((interval) => (
                <TableRow key={interval.name}>
                  <TableCell className="font-medium">{interval.name}</TableCell>
                  <TableCell className="text-right font-bold text-primary">{formatTime(interval.time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Column */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Interval</TableHead>
                <TableHead className="text-right">Time (seconds)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rightColumnIntervals.map((interval) => (
                <TableRow key={interval.name}>
                  <TableCell className="font-medium">{interval.name}</TableCell>
                  <TableCell className="text-right font-bold text-primary">{formatTime(interval.time)}</TableCell>
                </TableRow>
              ))}
              {/* Add empty rows if right column has fewer items than left column */}
              {rightColumnIntervals.length < leftColumnIntervals.length && (
                <TableRow>
                  <TableCell colSpan={2} className="h-10"></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
