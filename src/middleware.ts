import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/unauthorized", "/"];
const authRoutes = ["/login", "/register"];

// Role-based access map
const roleBasedAccess: Record<string, RegExp[]> = {
  receptionist: [/^\/receptionist/, /^\//, /^\/additems/],
  admin: [/^\/receptionist/, /^\//, /^\//],
  user: [
    /^\/user/,
    /^\/profile/,
    /^\/departmentalDoctors/,
    /^\//,
    /^\/additems/,
  ],
};

// Secret for JWT verification
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  // console.log(token,'middleware')
  const pathname = request.nextUrl.pathname;

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload?.role as string;

      console.log("✅ Token is valid:", payload);

      // Redirect logged-in users away from login/register
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // 🔐 Role-based route checking
      const allowedRoutes = roleBasedAccess[userRole] || [];

      const isAllowed = allowedRoutes.some((pattern) => pattern.test(pathname));

      if (!isAllowed && pathname !== "/") {
        console.warn(`🚫 ${userRole} cannot access ${pathname}`);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (err) {
      console.error("❌ Invalid or expired token:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // User is not authenticated
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // apply to all except static assets
};
