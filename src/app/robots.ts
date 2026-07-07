import type { MetadataRoute } from "next";

// The whole app sits behind auth (see proxy.ts) — nothing here is meant for public
// search discovery, so block crawling outright rather than picking pages to allow.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
