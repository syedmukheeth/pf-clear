import { NextResponse } from "next/server";
import { decodeRemark } from "@/lib/ai/decode-remark";
import { findFix } from "@/lib/mock/fixes";
import { sleep } from "@/lib/latency";

export const dynamic = "force-dynamic";

const MAX_REMARK = 600;

export async function POST(request: Request) {
  let body: { remark?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const remark = (body.remark ?? "").trim();
  if (remark.length < 8) {
    return NextResponse.json(
      { error: "Paste the rejection wording from the portal — at least a few words." },
      { status: 400 },
    );
  }
  if (remark.length > MAX_REMARK) {
    return NextResponse.json(
      { error: `That is longer than ${MAX_REMARK} characters. Paste just the rejection line.` },
      { status: 400 },
    );
  }

  // No artificial delay when a model is doing the work — the wait is real.
  const result = await decodeRemark(remark);
  if (result.provenance.source === "rules") await sleep(200, 400);

  return NextResponse.json({
    ...result,
    fix: findFix(result.decoded.fixId),
  });
}
