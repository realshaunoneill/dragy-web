export const METRICS = {
  zeroToHundred: { label: "0-100 km/h", value: "0" },
  hundredToTwoHundred: { label: "100-200 km/h", value: "1" },
  quarterMile: { label: "1/4 Mile", value: "2" },
} as const;

export type Metric = keyof typeof METRICS;
