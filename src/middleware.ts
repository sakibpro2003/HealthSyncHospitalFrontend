import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that don't require authentication
const publicRoutes = new Set([
  "/",
  "/login",
  "/register",
  "/unauthorized",
  "/success-payment",
  "/failed-payment",
  "/about",
  "/services",
  "/contact",
  "/medicine",
  "/departmentalDoctors",
  "/api/me",
]);
const publicRoutePatterns: RegExp[] = [/^\/doctor-details\//];
// Role-based access map
const roleBasedAccess: Record<string, RegExp[]> = {
  receptionist: [/^\/receptionist/, /^\//, /^\/additems/, /^\/success-payment/,/^\/failed-payment/],
  admin: [/^\/receptionist/, /^\//, /^\//],
  user: [
    /^\/user/,
    /^\/profile/,
    /^\/departmentalDoctors/,
    /^\//,
    /^\/additems/,/^\/success-payment/,/^\/failed-payment/
  ],
  doctor: [
    /^\/doctor/,
    /^\//,
    /^\/departmentalDoctors/,
    /^\/success-payment/,
    /^\/failed-payment/,
  ],
};

// Secret for JWT verification
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    publicRoutes.has(pathname) ||
    publicRoutePatterns.some((pattern) => pattern.test(pathname));

  // Public routes: let through. If a bad token exists, clear it silently.
  if (isPublicRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
        await jwtVerify(token, secret);
      } catch {
        const response = NextResponse.next();
        response.cookies.set("token", "", { path: "/", maxAge: 0 });
        return response;
      }
    }
    return NextResponse.next();
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload?.role as string;

      // 🔐 Role-based route checking
      const allowedRoutes = roleBasedAccess[userRole] || [];

      const isAllowed = allowedRoutes.some((pattern) => pattern.test(pathname));

      if (!isAllowed && pathname !== "/" && pathname !== "/unauthorized") {
        console.warn(`🚫 ${userRole} cannot access ${pathname}`);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (err) {
      console.error("❌ Invalid or expired token:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", {
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  } else {
    // User is not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // apply to all except static assets
};
