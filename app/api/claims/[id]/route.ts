import { NextResponse } from "next/server";
import { eventsFor, findClaim } from "@/lib/mock/claims";
import { findFix } from "@/lib/mock/fixes";
import { decode } from "@/lib/decode";
import { sleep } from "@/lib/latency";
import { currentMember, publicMember } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Next 15 hands route params in as a promise. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await sleep();

  const member = await currentMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const claim = findClaim(id);
  if (!claim || claim.uan !== member.uan) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  const decoded = decode(claim, member);

  return NextResponse.json({
    member: publicMember(member),
    claim,
    events: eventsFor(claim.id),
    decoded,
    fix: findFix(decoded?.fixId),
  });
}
