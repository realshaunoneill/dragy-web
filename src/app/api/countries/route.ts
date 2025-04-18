import { NextResponse } from "next/server"

// Define countries data directly in this file to avoid circular dependencies
export const countries = [
  { id: "global", name: "Global", code: "GLOBAL" },
  { id: "usa", name: "United States", code: "US" },
  { id: "germany", name: "Germany", code: "DE" },
  { id: "japan", name: "Japan", code: "JP" },
  { id: "italy", name: "Italy", code: "IT" },
  { id: "uk", name: "United Kingdom", code: "GB" },
]

export async function GET() {
  try {
    return NextResponse.json(countries)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
