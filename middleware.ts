import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/register", "/"];

  if (publicPaths.includes(path)) {
    if (token && (path === "/login" || path === "/register")) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role === "client") {
          return NextResponse.redirect(new URL("/portal", request.url));
        }
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (path.startsWith("/admin") && payload.role === "client") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    if (path.startsWith("/portal") && (payload.role === "admin" || payload.role === "manager")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/register"],
};
