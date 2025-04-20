import { NextResponse } from "next/server"
import { UserDetailsResponse } from "@/types/car-data";
import { mockSpecificCarData, mockUserDetailsData } from "../mock-data";

// export async function GET(request: Request): Promise<NextResponse<CarListResponse> | NextResponse<{ error: string }>> {
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No car ID provided" }, { status: 400 })
    }
    
    // const response = await fetch(`http://app.godragy.com/dragy/otherUserInfo/getOtherUserForumList?offsize=30&otherUserId=${id}&page=1&version=2.6.4`);
    
    // const json = await response.json() as UserDetailsResponse;

    // if (json.data?.data?.length === 0) {
    //   return NextResponse.json({ error: "No data available" }, { status: 404 })
    // }

    // return NextResponse.json(json.data.data)
    return NextResponse.json(mockUserDetailsData.data.data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch car data" }, { status: 500 })
  }
}
