"use client";

import useGetLeaderboardData from "../app/hooks/getLeaderboardData";
import { Country } from "../constants/countries";
import LeaderboardTable from "./leaderboard-table";
import { Metric } from "../constants/metrics";

interface LeaderboardTableProps {
  selectedCountry: Country;
  currentMetric: Metric;
}

const metricLabels = {
  zeroToHundred: "0-100 km/h",
  hundredToTwoHundred: "100-200 km/h",
  quarterMile: "1/4 Mile",
};

export default function LeaderboardContent({
  selectedCountry,
  currentMetric,
}: LeaderboardTableProps) {
  const { data: carData } = useGetLeaderboardData({
    country: selectedCountry,
    group: metricLabels[currentMetric] === "0-100 km/h" ? "0" : "1",
    metric: currentMetric,
  });

  if (!carData || carData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <LeaderboardTable
      data={carData}
      metric={currentMetric}
      metricLabel={metricLabels[currentMetric]}
    />
  );
}
