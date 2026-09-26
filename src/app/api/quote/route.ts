import type { NextRequest } from "next/server";
import { buildQuote } from "@/lib/quote";

// Prices the ReactFrame items an AI agent picked for a site: GET /api/quote?slugs=a,b,c (or POST
// {"slugs": [...]}) returns each item's price, the premium total and whether All-Access is the
// cheaper way to get them. Read-only and public, so it answers any origin.
const MAX_SLUGS = 200;
const CORS = { "Access-Control-Allow-Origin": "*" };

function respond(slugs: string[]) {
  return Response.json(buildQuote(slugs.slice(0, MAX_SLUGS)), { headers: CORS });
}

export function GET(request: NextRequest) {
  return respond((request.nextUrl.searchParams.get("slugs") ?? "").split(","));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { slugs?: unknown } | null;
  const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((s): s is string => typeof s === "string") : [];
  return respond(slugs);
}

export function OPTIONS() {
  return new Response(null, { headers: { ...CORS, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
}
