import { addMetric } from "@/lib/metrics";
import { BlogMetric } from "@/types/metrics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const metric: BlogMetric = await request.json();
    
    // Validate the metric
    if (!metric.slug || !metric.sessionId || !metric.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    await addMetric(metric);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error storing metric:", error);
    return NextResponse.json(
      { error: "Failed to store metric" },
      { status: 500 }
    );
  }
}
