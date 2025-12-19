// app/api/me/route.ts (App Router)
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";
import { ACCESS_TOKEN_COOKIE, decodeTokenValue } from "@/utils/tokenCookie";

export async function GET() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const token = decodeTokenValue(rawToken);
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
