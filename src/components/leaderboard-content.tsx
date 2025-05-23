"use client";

import useGetLeaderboardData from "../app/hooks/getLeaderboardData";
import { Country } from "../constants/countries";
import LeaderboardTable from "./leaderboard-table";
import { Metric } from "../constants/metrics";
import { Loader2 } from "lucide-react";

interface LeaderboardTableProps {
  selectedCountry: Country;
  currentMetric: Metric;
  search?: string;
}

export default function LeaderboardContent({
  selectedCountry,
  currentMetric,
  search,
}: LeaderboardTableProps) {
  const { data: carData, isLoading } = useGetLeaderboardData({
    country: selectedCountry,
    metric: currentMetric,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!carData || carData.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No data available</div>;
  }

  const filteredData = search ? carData.filter((car) => car.name.toLowerCase().includes(search.toLowerCase())) : carData;

  return (
    <LeaderboardTable
      data={filteredData}
      metric={currentMetric}
    />
  );
}
