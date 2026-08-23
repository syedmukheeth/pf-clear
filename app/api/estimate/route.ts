import { NextResponse } from "next/server";
import { estimatePension, estimateWithdrawal } from "@/lib/estimate";
import { findFix } from "@/lib/mock/fixes";
import { sleep } from "@/lib/latency";
import { currentMember, publicMember } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await sleep();

  const member = await currentMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { mode?: "withdrawal" | "pension"; form15G?: boolean };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const mode = body.mode === "pension" ? "pension" : "withdrawal";

  if (mode === "pension") {
    return NextResponse.json({
      mode,
      member: publicMember(member),
      pension: estimatePension(member),
    });
  }

  const withdrawal = estimateWithdrawal(member, body.form15G ?? member.form15GFiled);

  return NextResponse.json({
    mode,
    member: publicMember(member),
    withdrawal,
    fix: withdrawal.savingFrom15G > 0 ? findFix("fix_form_15g") : undefined,
  });
}
