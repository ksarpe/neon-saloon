import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ error: "Use /api/questions/never or /api/questions/quiz" }, { status: 400 });
}
