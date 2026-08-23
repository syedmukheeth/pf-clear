import { cookies } from "next/headers";
import type { Member } from "@/lib/types";
import { findMember } from "@/lib/mock/members";

export const SESSION_COOKIE = "pf_uan";

/** Next 15 returns a promise from cookies(). */
export async function currentMember(): Promise<Member | undefined> {
  const store = await cookies();
  const uan = store.get(SESSION_COOKIE)?.value;
  return uan ? findMember(uan) : undefined;
}

/** Never send the password to the client, even in a demo. */
export type PublicMember = Omit<Member, "password">;

export function publicMember(member: Member): PublicMember {
  const { password: _password, ...rest } = member;
  return rest;
}
