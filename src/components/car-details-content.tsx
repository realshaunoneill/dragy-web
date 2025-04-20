"use client";

import { useState } from "react";
import {
  CarIcon,
  Clock,
  Gauge,
  LineChart,
  Table2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { PerformanceChart } from "@/src/components/performance-chart";
import { PerformanceDataTable } from "@/src/components/performance-data-table";
import useGetCarTimeData from "@/src/app/hooks/getCarTimeData";
import useGetUserData from "@/src/app/hooks/getUserData";

interface CarDetailsContentProps {
  id: string;
}

export function CarDetailsContent({ id }: CarDetailsContentProps) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const { data: timeData } = useGetCarTimeData({ id });
  const { data: userData } = useGetUserData({ id });

  if (!timeData || !userData || timeData.length === 0 || userData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (time: number | null | undefined) => {
    if (time === null || time === undefined) return "N/A";
    return `${time.toFixed(2)}s`;
  };

  // Transform time data for the chart
  const transformedTimeData = timeData.map((time) => ({
    date: time.testtime,
    results: time.results,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <CarIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            {userData[0].garage.brandName} {userData[0].garage.models}
          </h1>
          <Badge variant="outline" className="ml-2">
            {userData[0].garage.carDecade}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>
              {userData[0].garage.displacement || "Displacement N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              Best Time: {formatTime(timeData[0]?.results)}
            </span>
          </div>
        </div>
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
          <div className="p-6">
            <div className="space-y-6">
              {/* Chart View */}
              {viewMode === "chart" && (
                <div className="h-[350px] w-full">
                  <PerformanceChart
                    data={transformedTimeData}
                    metric="results"
                    metricLabel="Time"
                  />
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <PerformanceDataTable
                  data={transformedTimeData}
                  metric="results"
                  metricLabel="Time"
                />
              )}

              {/* Always show the table below the chart in chart view */}
              {viewMode === "chart" && (
                <div className="mt-8 border-t pt-4">
                  <h3 className="mb-4 text-lg font-medium">
                    Historical Data
                  </h3>
                  <PerformanceDataTable
                    data={transformedTimeData}
                    metric="results"
                    metricLabel="Time"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 