import { NextResponse } from "next/server"
import { CarList, CarListResponse } from "@/types/car-data";
import { COUNTRY_CODES } from "@/src/constants/countries";

export async function GET(request: Request): Promise<NextResponse<CarList[]> | NextResponse<{ error: string }>> {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "global"
    const metric = searchParams.get("metric") || "0"
    
    // Create form data with required parameters
    const formData = new URLSearchParams({
      addressId: country,
      brand_name: "",
      car_listId: "1",
      distance_type: metric,
      drive_mode: "",
      models: "",
      num: "100",
      series: "",
      sort_type: "1",
      startIndex: "0"
    });
    
    // Check if country is valid
    if (!COUNTRY_CODES.find((c) => c.id.toString() === country)) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 })
    }
    
    const response = await fetch(
      "http://app.godragy.com/index.php/app/car_Controller/searchCarRanking?sid=64eee7e1c7d1b0ef52aa110d881b2a0365d68b0e", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );
    
    const json = await response.json() as CarListResponse;

    if (!json.data.car_list || json.data.car_list.length === 0) {
      return NextResponse.json({ error: "No leaderboard data available" }, { status: 404 })
    }

    return NextResponse.json(json.data.car_list);

  } catch (error) {
    console.error("Leaderboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 })
  }
}
