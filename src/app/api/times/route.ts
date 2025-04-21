import { NextResponse } from "next/server"
import { CarTimeResponse } from "@/types/car-data";
import { mockSpecificCarData } from "../mock-data";

// export async function GET(request: Request): Promise<NextResponse<CarListResponse> | NextResponse<{ error: string }>> {
export async function GET(request: Request) {
  try {
    // Properly parse the URL with the full origin
    const url = new URL(request.url);
    const carId = url.searchParams.get("carId");

    if (!carId) {
      return NextResponse.json({ error: "No car ID provided" }, { status: 400 })
    }

    console.log('Fetching times for ID:', carId);
    
    const apiUrl = `http://app.godragy.com/dragy/carRanking/getSameTypeAndGarageRank?appVersion=0&id=${carId}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    const json = await response.json() as CarTimeResponse;

    if (!json.data.data || json.data.data.length === 0) {
      return NextResponse.json({ error: "No car time data available" }, { status: 404 })
    }

    console.log('Times fetched successfully', json.data);

    return NextResponse.json(json.data.data)
    // return NextResponse.json(mockSpecificCarData.data.data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch car data: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}
