export type TimeMetric = "zeroToHundred" | "hundredToTwoHundred" | "quarterMile"

export interface CarData {
  id: string
  make: string
  model: string
  year: number
  zeroToHundred: number | null
  hundredToTwoHundred: number | null
  quarterMile: number | null
  power: number | null
  modifications: string[] | null
}
