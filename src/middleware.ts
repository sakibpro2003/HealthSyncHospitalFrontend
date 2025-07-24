// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { getDecodedToken } from "./utils/decodeTokens";

// const authRoutes = ["/login", "/register"];
// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

// export async function middleware(request: NextRequest) {
//   console.log("hello");

//   const token = request.cookies.get("token")?.value;
//   console.log(token,"middlesware token")
//   getDecodedToken(token);
//   console.log(token,"token milddderware")
//   const pathname = request.nextUrl.pathname;

//   if (token) {
//     try {
//       const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
//       const { payload } = await jwtVerify(token, secret);
//       console.log("Token is valid:", payload);
      

//       if (authRoutes.includes(pathname)) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }
      

//     } catch (err) {
//       console.error("Invalid or expired token:", err);
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   } else {
//     if (!authRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/unauthorized","/"];

// Role-based access map
const roleBasedAccess: Record<string, RegExp[]> = {
  receptionist: [/^\/receptionist/],
  user: [/^\/user/, /^\/profile/],
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
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // 🔐 Role-based route checking
      const allowedRoutes = roleBasedAccess[userRole] || [];

      const isAllowed = allowedRoutes.some((pattern) =>
        pattern.test(pathname)
      );

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
