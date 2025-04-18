import { NextResponse } from "next/server"
import { carDataByCountry } from "../../mock-data"
import type { CarData } from "@/types/car-data"

// Generate mock historical data for a car
function generateHistoricalData(carId: string) {
  // Find the car in our data
  let car: CarData | null = null

  // Search through all countries
  for (const countryData of Object.values(carDataByCountry)) {
    const found = countryData.find((c) => c.id === carId)
    if (found) {
      car = found
      break
    }
  }

  if (!car) {
    return null
  }

  // Generate 12 months of historical data with slight variations
  const now = new Date()
  const historicalData = []

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(now.getMonth() - i)

    // Create random variations around the current values
    const randomFactor = () => 0.95 + Math.random() * 0.1 // Between 0.95 and 1.05

    historicalData.push({
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      zeroToHundred: car.zeroToHundred ? +(car.zeroToHundred * randomFactor()).toFixed(2) : null,
      hundredToTwoHundred: car.hundredToTwoHundred ? +(car.hundredToTwoHundred * randomFactor()).toFixed(2) : null,
      quarterMile: car.quarterMile ? +(car.quarterMile * randomFactor()).toFixed(3) : null,
    })
  }

  return {
    car,
    historicalData,
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const carId = params.id

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const data = generateHistoricalData(carId)

    if (!data) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch car data" }, { status: 500 })
  }
}
