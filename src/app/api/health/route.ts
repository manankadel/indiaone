import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "indiaone",
    time: new Date().toISOString(),
    env: { hasOpenAI: !!process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL ?? "gpt-4o-mini" },
    note: "Food-safety cases use the configured server database and verified event history.",
  });
}
