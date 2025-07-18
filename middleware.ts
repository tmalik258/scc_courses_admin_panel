// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(`Middleware processing: ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/transactions/:path*", "/api/payments/:path*"],
};
