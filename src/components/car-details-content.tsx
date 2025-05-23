"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Timer,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { PerformanceChart } from "@/src/components/performance-chart";
import { HistoricalDataTable } from "@/src/components/HistoricalDataTable";
import useGetUserAndTimeData from "@/src/app/hooks/getUserAndTimeData";
import { DataInfo } from "@/types/car-data";
import { IntervalDataTable } from "./IntervalDataTable";
import { useMemo } from "react";
import { Metric, METRICS } from "@/src/constants/metrics";

interface CarDetailsContentProps {
  userId: string;
  carId: string;
  metric: Metric;
}

export function CarDetailsContent({ userId, carId, metric }: CarDetailsContentProps) {
  const { data } = useGetUserAndTimeData({ userId, carId });

  const userData = data?.userData[0];
  const timeData = data?.timeData;
  const graphData = data?.graphData;

  const currentTimeData = timeData?.find((item) => item.id.toString() === carId);
  const bestTime = timeData?.reduce((min, item) => (item.results < min.results ? item : min), timeData[0]);

  if (!timeData || !userData || !graphData || timeData?.length === 0 || !currentTimeData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (time: number | undefined) => {
    if (!time) return "N/A";
    return `${time.toFixed(2)}s`;
  };

  // Get the metric label from the METRICS constant
  const metricLabel = METRICS[metric]?.label || METRICS.zeroToHundred.label;

  // Transform time data for the chart
  const historicalTimeData = timeData.map((time) => ({
    date: time.testtime,
    results: time.results,
    distance: time.distance.toString(),
    eventId: time.id.toString(),
  }));

  const timeSeriesData = useMemo(() => {
    try {
      if (!graphData) {
        console.error("No graph data available");
        return {
          intervalTime: [],
          accelerationData: [],
          speedData: [],
        };
      }

      const graphDataObj = JSON.parse(graphData.graph_data);

      if (!graphDataObj.dataInfo) {
        console.error("No dataInfo available", graphDataObj);
        return {
          intervalTime: [],
          accelerationData: [],
          speedData: [],
        };
      }
      
      const dataInfoObj = JSON.parse(graphDataObj.dataInfo) as DataInfo;

      console.log("DataInfo", graphDataObj, dataInfoObj);

      const timeDataWithTimes = dataInfoObj.dataArr.filter((item) => item.time);

      const intervalTime = dataInfoObj.detail.filter((item) => item.name).map((item) => ({
        name: item.name,
        time: item.time,
      }));

      const accelerationData = timeDataWithTimes.map((item) => ({
        time: item.time,
        acceleration: parseFloat(item.acceleration.toFixed(2)),
      }));

      // Find the nearest hundred ceiling for the max speed
      const maxSpeed = Math.max(...timeDataWithTimes.map((item) => item.speed));
      const speedCeiling = Math.ceil(maxSpeed / 100) * 100;

      const speedData = timeDataWithTimes
        .map((item) => ({
          time: item.time,
          speed: parseFloat(item.speed.toFixed(0)),
        }))
        .filter((item) => item.speed <= speedCeiling);

      // Add a base 0 point
      accelerationData.unshift({
        time: 0,
        acceleration: 0,
      });

      // Get the starting speed from the data if available
      const startingSpeed =
        timeDataWithTimes.length > 0
          ? parseFloat(timeDataWithTimes[0].speed.toFixed(0))
          : 0;

      speedData.unshift({
        time: 0,
        speed: startingSpeed,
      });

      return {
        intervalTime,
        accelerationData,
        speedData,
      };
    } catch (error) {
      console.error("Error building time series data", error);
      return {
        intervalTime: [],
        accelerationData: [],
        speedData: [],
      };
    }
  }, [graphData]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 md:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                <img className="rounded-md" src={userData.userIcon} alt={userData.username} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.username}</h1>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semi-bold">
                    {userData.garage.brandName} {userData.garage.models}
                  </h2>
                  <Badge variant="outline" className="ml-2">
                    {userData.garage.carDecade}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-primary">
                  <Clock className="h-5 w-5" />
                  <span>Best 0-100mph: {formatTime(bestTime?.results)}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{currentTimeData?.testtime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg bg-muted/30 p-4">
              <h3 className="font-medium">Selected Metric: {metricLabel}</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-md bg-background/60 p-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {formatTime(currentTimeData?.results)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-md bg-background/60 p-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4" />
                    <span>Distance</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {currentTimeData?.distance}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-md bg-background/60 p-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Slope</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {currentTimeData?.slope}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{userData.country}</span>
                  {userData.province && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <span>{userData.province}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/30 px-6">
          <div className="flex items-center justify-between">
            <CardTitle>Performance Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <div className="space-y-6">
              <div className="h-[350px] w-full">
                <PerformanceChart
                  data={timeSeriesData}
                  metric={metric}
                  metricLabel={metricLabel}
                />
              </div>
              {timeSeriesData.intervalTime.length > 0 && (
                <div className="mt-8 border-t pt-4">
                  <h3 className="mb-4 text-lg font-medium">Interval Data</h3>
                  <IntervalDataTable intervalData={timeSeriesData.intervalTime} />
                </div>
              )}
              <div className="mt-8 border-t pt-4">
                <h3 className="mb-4 text-lg font-medium">Historical Data</h3>
                <HistoricalDataTable
                  userId={userId}
                  data={historicalTimeData}
                  currentEventId={carId}
                  metricLabel={metricLabel}
                  metric={metric}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
