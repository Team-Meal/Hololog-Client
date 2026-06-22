import { type NextRequest } from "next/server";

// Server-side proxy to the backend. The browser calls /api/backend/* (same origin, no
// CORS), and this handler forwards the request server-side. The backend only whitelists
// its own origin, so we must STRIP the browser's Origin/Referer/Host headers — otherwise
// its CORS filter rejects the forwarded request with 403.
const BACKEND_URL = process.env.NEXT_PUBLIC_MEAL_API_BASE_URL;

const STRIPPED_REQUEST_HEADERS = new Set([
  "origin",
  "referer",
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

async function handler(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  if (!BACKEND_URL) {
    return new Response("Backend URL is not configured.", { status: 500 });
  }

  const { path } = await ctx.params;
  const target = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  });

  // Drop encoding headers — fetch already decoded the body, so passing them through
  // would make the browser try to decode it again.
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("connection");

  // Null-body statuses (e.g. 204 No Content from /auth/signup) must NOT carry a body —
  // constructing a Response with one throws.
  const buffer = await upstream.arrayBuffer();
  const responseBody = buffer.byteLength > 0 ? buffer : null;

  return new Response(responseBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
