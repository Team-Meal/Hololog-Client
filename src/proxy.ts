import { NextResponse, type NextRequest } from "next/server";

// Routes reachable without a token. Everything else requires authentication.
const PUBLIC_PATHS = ["/login", "/signup"];
// Routes a STUDENT role is allowed to visit.
const STUDENT_ALLOWED = ["/student", "/settings"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getTokenRole(token: string): string | null {
  try {
    const raw = token.split(".")[1];
    if (!raw) return null;
    const claims = JSON.parse(Buffer.from(raw, "base64url").toString()) as { role?: string };
    return claims?.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const hasToken = Boolean(token);
  const isPublic = isPublicPath(pathname);

  // No token on a protected route → send to login, remembering where they were headed.
  if (!hasToken && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated but visiting login/signup → bounce to the dashboard.
  if (hasToken && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // STUDENT role: only allow STUDENT_ALLOWED paths.
  if (token) {
    const role = getTokenRole(token);
    if (role === "STUDENT") {
      const allowed = STUDENT_ALLOWED.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );
      if (!allowed) {
        return NextResponse.redirect(new URL("/student", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except Next internals, API routes, and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
