export const METRICS = {
  zeroToHundred: { label: "0-100 km/h", value: "0" },
  hundredToTwoHundred: { label: "100-200 km/h", value: "1" },
  
  zeroToTwoHundred: { label: "0-200 km/h", value: "3" },
  hundredToZero: { label: "100-0 km/h", value: "4" },

  zeroTo60: { label: "0-60 mph", value: "10" },
  sixtyToOneThirty: { label: "60-130 mph", value: "11" },
  quarterMile: { label: "1/4 Mile", value: "12" },
  zeroToOneThirty: { label: "0-130 mph", value: "13" },
  sixtyToZero: { label: "60-0 mph", value: "14" },
  halfMile: { label: "1/2 Mile", value: "15" },
  eighthMile: { label: "1/8 Mile", value: "16" },
  mile: { label: "1 Mile", value: "17" },

} as const;

export type Metric = keyof typeof METRICS;
