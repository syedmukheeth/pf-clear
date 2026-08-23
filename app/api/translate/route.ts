import { NextResponse } from "next/server";
import { translateToHindi } from "@/lib/ai/translate";

export const dynamic = "force-dynamic";

const MAX_SEGMENTS = 12;
const MAX_CHARS = 3000;

export async function POST(request: Request) {
  let body: { segments?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const segments = Array.isArray(body.segments)
    ? body.segments.filter((s): s is string => typeof s === "string")
    : [];

  if (segments.length === 0 || segments.length > MAX_SEGMENTS) {
    return NextResponse.json({ error: "Nothing to translate." }, { status: 400 });
  }
  if (segments.join("").length > MAX_CHARS) {
    return NextResponse.json({ error: "Too much text to translate at once." }, { status: 400 });
  }

  return NextResponse.json(await translateToHindi(segments));
}
