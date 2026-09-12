import { NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_EMAIL = "locaahmet@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

// Best-effort only: this Map lives in the serverless function's memory, so
// it resets on cold start and isn't shared across instances. It still stops
// casual spam/scripts hammering the endpoint from one warm instance; a
// bulletproof multi-instance limit would need an external store like
// Upstash Redis.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages — try again later" }, { status: 429 });
  }

  const { name, email, message, company, category, relatedItem } = await request.json();

  // Honeypot: real users never fill this hidden field, bots usually do.
  // Pretend success so the bot doesn't learn to skip the field.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !message.trim() ||
    !EMAIL_RE.test(email) ||
    name.length > 200 ||
    message.length > 5000 ||
    (category !== undefined && typeof category !== "string") ||
    (relatedItem !== undefined && typeof relatedItem !== "string")
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const safeCategory = typeof category === "string" && category.trim() ? category : "Other";
  const safeRelatedItem = typeof relatedItem === "string" && relatedItem.trim() ? relatedItem : null;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "ReactFrame Support <onboarding@resend.dev>",
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `[${safeCategory}] New support message from ${name}`,
      text: [
        `From: ${name} <${email}>`,
        `Category: ${safeCategory}`,
        safeRelatedItem ? `Related: ${safeRelatedItem}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send support email", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
