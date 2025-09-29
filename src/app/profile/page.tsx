// app/profile/page.tsx or pages/profile.tsx (based on your routing)
import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

type AuthPayload = JWTPayload & {
  role?: string;
  id?: string;
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: AuthPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_ACCESS_SECRET)
      );
      user = payload;
    } catch (err) {
      console.error("Token invalid or expired", err);
    }
  }

  if (!user) {
    return <div className="text-red-500">You must be logged in.</div>;
  }

  const email = typeof user.email === "string" ? user.email : "Unknown";
  const role = user.role ?? "Unknown";
  const id = user.id ?? (typeof user.sub === "string" ? user.sub : "Unknown");

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">👋 Welcome, {email}</h1>
      <p>Your role: {role}</p>
      <p>Your ID: {id}</p>
    </div>
  );
}
