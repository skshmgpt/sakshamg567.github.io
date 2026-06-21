import { NextRequest, NextResponse } from "next/server";
import { getScratchpad, setScratchpad } from "@/lib/scratchpad";

export async function GET() {
  try {
    const data = await getScratchpad();
    return NextResponse.json(data ?? { text: "", updatedAt: 0 });
  } catch (error) {
    console.error("Scratchpad GET error:", error);
    return NextResponse.json({ text: "", updatedAt: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-secret-key");
    if (secret !== process.env.SCRATCHPAD_SECRET) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();
    if (!text || typeof text !== "string" || text.length > 280) {
      return NextResponse.json(
        { error: "text required, max 280 chars" },
        { status: 400 }
      );
    }

    const entry = await setScratchpad(text);
    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    console.error("Scratchpad POST error:", error);
    return NextResponse.json(
      { error: "failed to update" },
      { status: 500 }
    );
  }
}
