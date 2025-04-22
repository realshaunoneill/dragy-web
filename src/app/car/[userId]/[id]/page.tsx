"use client";

import { use } from "react";
import { CarDetailsContent } from "@/src/components/car-details-content";
import { useQueryState } from "nuqs";
import { Metric } from "@/src/constants/metrics";

export default function CarDetailsPage({ params }: { params: Promise<{ userId: string, id: string }> }) {
  // Unwrap the params using React.use()
  const resolvedParams = use(params);
  
  // Get the metric from URL query parameter, defaulting to "zeroToHundred"
  const [metric] = useQueryState("metric");
  
  // Ensure we have a valid metric
  const currentMetric = (metric || "zeroToHundred") as Metric;
  
  return (
    <CarDetailsContent 
      userId={resolvedParams.userId} 
      carId={resolvedParams.id} 
      metric={currentMetric}
    />
  );
}
