import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware() {
  // Middleware intentionally disabled: admin protection is handled via NextAuth session on the server.
  return NextResponse.next();
}

export const config = {
  // No matcher -> middleware won't run by default. Kept file to avoid accidental deletion.
  matcher: [],
};
