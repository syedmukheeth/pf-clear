import { NextResponse } from "next/server";
import { authenticate } from "@/lib/mock/members";
import { sleep } from "@/lib/latency";
import { SESSION_COOKIE, publicMember } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await sleep();

  let body: { uan?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const member = authenticate(body.uan ?? "", body.password ?? "");
  if (!member) {
    return NextResponse.json(
      { error: "That UAN and password do not match a demo account." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ member: publicMember(member) });
  response.cookies.set(SESSION_COOKIE, member.uan, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
