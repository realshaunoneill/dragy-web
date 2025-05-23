import { NextResponse } from "next/server"
import { CarDetailsResponse } from "@/types/car-data";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      console.log('Details: No id provided')
      return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    console.log('Details: id provided', id)
    
    const myHeaders = new Headers();
    myHeaders.append("Proxy-Connection", "keep-alive");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Upload-Complete", "?1");
    myHeaders.append("Accept-Language", "en-IE;q=1");
    myHeaders.append("Accept-Encoding", "gzip, deflate");
    myHeaders.append("Upload-Draft-Interop-Version", "6");
    myHeaders.append("User-Agent", "dragy/2.10.1 (iPhone; iOS 18.5; Scale/3.00)");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Host", "app.godragy.com");
    myHeaders.append("Cookie", "ci_session=03053d83eac3bfdd36d08d5cc38825eb8bdc77ef");
    
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("appVersion", "0 --Boundary+13D5DBDB38B84FBD Content-Disposition: form-data; name=\"id\"");
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow" as RequestRedirect
    };
    
    const response = await fetch("http://app.godragy.com/index.php/u_user/get_CarResults", requestOptions);

    if (!response.ok) {
      console.log('Details: Failed to fetch car data')
      return NextResponse.json({ error: "Failed to fetch car data" }, { status: 500 })
    }

    const json = await response.json() as CarDetailsResponse;

    console.log('Details: Car data fetched successfully');
    console.debug(json);

    if (!json.data.carResults) {
      console.log('Details: No car details data available')
      return NextResponse.json({ error: "No car details data available" }, { status: 404 })
    }

    return NextResponse.json(json.data.carResults);
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch car data" }, { status: 500 })
  }
}
