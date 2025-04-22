import { NextResponse } from "next/server"
import { UserDetailsResponse } from "@/types/car-data";
import { mockSpecificCarData, mockUserDetailsData } from "../mock-data";

export async function GET(request: Request) {
  try {
    // Properly parse the URL with the full URL including origin
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
    }

    console.log('Fetching user details for ID:', userId);
    
    const apiUrl = `http://app.godragy.com/dragy/otherUserInfo/getOtherUserForumList?offsize=30&otherUserId=${userId}&page=1&version=2.6.4`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    const json = await response.json() as UserDetailsResponse;

    if (!json.data.data || json.data.data.length === 0) {
      return NextResponse.json({ error: "No user details data available" }, { status: 404 })
    }

    console.log('User details fetched successfully - ', json.data.data[0].username);

    return NextResponse.json(json.data.data);
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch user data: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}
