import { NextResponse } from "next/server"
import { carDataByCountry } from "../mock-data"

export async function GET(request: Request) {
  try {
    // Get the country from the URL
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "global"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Return the data for the requested country
    const data = carDataByCountry[country] || carDataByCountry.global
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch car data" }, { status: 500 })
  }
}
