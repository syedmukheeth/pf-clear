import { NextResponse } from "next/server";
import { composeGrievance } from "@/lib/ai/grievance";
import { decode } from "@/lib/decode";
import { findClaim } from "@/lib/mock/claims";
import { currentMember } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const member = await currentMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { claimId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const claim = findClaim(body.claimId ?? "");
  if (!claim || claim.uan !== member.uan) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  const grievance = await composeGrievance(member, claim, decode(claim, member));
  return NextResponse.json(grievance);
}
