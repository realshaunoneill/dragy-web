"use client";

import { CarIcon, Clock, Gauge } from "lucide-react";
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
import useGetUserAndTimeData from "@/src/app/hooks/getUserAndTimeData";

interface CarDetailsContentProps {
  userId: string;
  carId: string;
}

export function CarDetailsContent({ userId, carId }: CarDetailsContentProps) {
    const { data } = useGetUserAndTimeData({ userId, carId });

    const userData = data?.userData[0];
    const timeData = data?.timeData;

    console.log('userDataRes', userData, timeData, data);

  if (
    !timeData ||
    !userData ||
    timeData?.length === 0
  ) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }


  const formatTime = (time: number) => {
    if (!time) return "N/A";
    return `${time.toFixed(2)}s`;
  };

  const formatDisplacement = (displacement?: string) => {
    if (!displacement) return "N/A";
    return `${displacement}L`;
  };

  // Transform time data for the chart
  const transformedTimeData = timeData.map((time) => ({
    date: time.testtime,
    results: time.results,
    distance: time.distance,
  }));

  console.log('transformedTimeData', transformedTimeData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <CarIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">
              {userData.username}
            </h1>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {userData.garage.brandName} {userData.garage.models}
              </h2>
              <Badge variant="outline">
                {userData.garage.carDecade}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>Displacement: {formatDisplacement(userData.garage.displacement)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Best Time: {formatTime(timeData[0]?.results)}</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/30 px-6">
          <div className="flex items-center justify-between">
            <CardTitle>Performance Trends</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <div className="space-y-6">
              <div className="h-[350px] w-full">
                <PerformanceChart
                  data={transformedTimeData}
                  metric="results"
                  metricLabel="Time"
                />
              </div>
              <div className="mt-8 border-t pt-4">
                <h3 className="mb-4 text-lg font-medium">Historical Data</h3>
                <PerformanceDataTable
                  data={transformedTimeData}
                  metric="results"
                  metricLabel="Time"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
