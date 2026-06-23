import { NextResponse } from "next/server";
import { getCachedNowPlaying } from "@/lib/spotify";

export async function GET() {
  try {
    const data = await getCachedNowPlaying();
    return NextResponse.json(data);
  } catch (error) {
    console.error("now-playing error:", error);
    return NextResponse.json(
      { success: false, isPlaying: false, error: "failed to fetch" },
      { status: 500 }
    );
  }
}
