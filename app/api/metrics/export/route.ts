import { getAllSummaries, metricsToCSV } from "@/lib/metrics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const summaries = await getAllSummaries();
    const csv = metricsToCSV(summaries);
    
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="blog-metrics.csv"',
      },
    });
  } catch (error) {
    console.error("Error exporting metrics:", error);
    return NextResponse.json(
      { error: "Failed to export metrics" },
      { status: 500 }
    );
  }
}
