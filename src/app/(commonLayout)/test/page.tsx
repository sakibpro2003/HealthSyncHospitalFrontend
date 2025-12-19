import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";
import { ACCESS_TOKEN_COOKIE, decodeTokenValue } from "@/utils/tokenCookie";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const token = decodeTokenValue(rawToken);
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const email = typeof user.email === "string" ? user.email : "user";
  return <div>Welcome, {email}</div>;
}
