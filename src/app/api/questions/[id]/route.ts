import { NextResponse } from "next/server";

// This route has been superseded by /api/questions/never/[id] and /api/questions/quiz/[id]
export async function DELETE() {
  return NextResponse.json({ error: "Use /api/questions/never/[id] or /api/questions/quiz/[id]" }, { status: 410 });
}
