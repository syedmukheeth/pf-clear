import { NextResponse } from "next/server";
import { checksFor, orderChecks, verdictFor } from "@/lib/mock/kyc";
import { findFix } from "@/lib/mock/fixes";
import { sleep } from "@/lib/latency";
import { currentMember, publicMember } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  await sleep();

  const member = await currentMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const checks = orderChecks(checksFor(member));

  return NextResponse.json({
    member: publicMember(member),
    checks,
    verdict: verdictFor(checks),
    // Blockers first, so the Action Cards arrive in the order to act on them.
    fixes: checks
      .filter((c) => c.fixId)
      .map((c) => ({ checkId: c.id, fix: findFix(c.fixId) })),
  });
}
