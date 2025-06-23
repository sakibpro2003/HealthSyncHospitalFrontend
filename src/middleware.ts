import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Router, useRouter } from "next/router";

const authRoutes = ["/login", "/register"];
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function middleware(request: NextRequest) {
  console.log("hello");

  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
      const { payload } = await jwtVerify(token, secret);
      console.log("Token is valid:", payload);

      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

    } catch (err) {
      console.error("Invalid or expired token:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (!authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
