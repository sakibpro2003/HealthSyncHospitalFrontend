import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const email = typeof user.email === "string" ? user.email : "user";
  return <div>Welcome, {email}</div>;
}
