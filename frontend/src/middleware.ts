import { NextRequest, NextResponse } from "next/server";
import { checkUserSession } from "@/lib/utils";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isAuth = await checkUserSession(accessToken, refreshToken);

  const isLoginPage = pathname.startsWith("/auth");
  const sensitiveRoutes = ["/initial", "/label-data"];

  const isAccessingSensitiveRoutes = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isLoginPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth && isAccessingSensitiveRoutes) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/initial/:path*", "/label-data/:path*"],
};
