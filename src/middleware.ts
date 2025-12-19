import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  ACCESS_TOKEN_COOKIE,
  CLIENT_TOKEN_COOKIE,
  decodeTokenValue,
} from "./utils/tokenCookie";

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
  receptionist: [
    /^\/receptionist/,
    /^\//,
    /^\/additems/,
    /^\/success-payment/,
    /^\/failed-payment/,
  ],
  admin: [/^\/receptionist/, /^\//, /^\//],
  user: [
    /^\/user/,
    /^\/profile/,
    /^\/departmentalDoctors/,
    /^\//,
    /^\/additems/,
    /^\/success-payment/,
    /^\/failed-payment/,
  ],
  doctor: [
    /^\/doctor/,
    /^\//,
    /^\/departmentalDoctors/,
    /^\/success-payment/,
    /^\/failed-payment/,
  ],
};

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(CLIENT_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
};

export async function middleware(request: NextRequest) {
  const rawToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const token = decodeTokenValue(rawToken);
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    publicRoutes.has(pathname) ||
    publicRoutePatterns.some((pattern) => pattern.test(pathname));

  if (isPublicRoute) {
    // Public routes: let through. If a bad token exists, clear it silently.
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
        await jwtVerify(token, secret);
      } catch {
        return clearAuthCookies(NextResponse.next());
      }
    }
    return NextResponse.next();
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload?.role as string;

      // Role-based route checking
      const allowedRoutes = roleBasedAccess[userRole] || [];
      const isAllowed = allowedRoutes.some((pattern) => pattern.test(pathname));

      if (!isAllowed && pathname !== "/" && pathname !== "/unauthorized") {
        console.warn(`Blocked ${userRole} from ${pathname}`);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (err) {
      console.error("Invalid or expired token:", err);
      return clearAuthCookies(
        NextResponse.redirect(new URL("/login", request.url))
      );
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
