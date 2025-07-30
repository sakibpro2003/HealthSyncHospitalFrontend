import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";

export default async function DashboardPage() {
  const token = cookies().get("token")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) return <div>Unauthorized</div>;

  return <div>Welcome, {user.email}</div>;
}
