import { NextResponse } from "next/server";
import { claimsFor, eventsFor } from "@/lib/mock/claims";
import { sleep } from "@/lib/latency";
import { currentMember, publicMember } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  await sleep();

  const member = await currentMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const claims = claimsFor(member.uan).map((claim) => {
    const events = eventsFor(claim.id);
    const current =
      events.find((e) => e.status === "STALLED" || e.status === "REJECTED") ??
      events.find((e) => e.status === "ACTIVE") ??
      events[events.length - 1];

    return {
      ...claim,
      // The claim list has to answer "who is holding it" without a second tap.
      currentStage: current?.stageLabel ?? "Claim submitted",
      heldBy: current?.heldBy,
      daysAtStage: current?.actualDurationDays,
      normalDurationDays: current?.normalDurationDays,
    };
  });

  // What needs the member first, then most recent. A settled claim from last
  // year should never sit above one that is stuck today.
  const rank = (status: string) =>
    status === "REJECTED" || status === "STALLED" ? 0 : status === "IN_PROGRESS" ? 1 : 2;

  claims.sort(
    (a, b) =>
      rank(a.status) - rank(b.status) || b.filedOn.localeCompare(a.filedOn),
  );

  return NextResponse.json({ member: publicMember(member), claims });
}
