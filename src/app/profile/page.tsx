// app/profile/page.tsx or pages/profile.tsx (based on your routing)
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">👋 Welcome, {user.email}</h1>
      <p>Your role: {user.role}</p>
      <p>Your ID: {user.id}</p>
    </div>
  );
}
