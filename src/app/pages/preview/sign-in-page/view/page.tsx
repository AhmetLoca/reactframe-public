"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const HEADING = "Welcome back";
const DESCRIPTION = "Sign in to pick up right where you left off.";

const QUOTE = "Nexora cut our handoff time in half. Design and engineering finally work from the same source.";
const QUOTE_AUTHOR = "Maya Chen";
const QUOTE_ROLE = "Head of Product, Lumen Studio";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sign in",
  description: DESCRIPTION,
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";
const fieldClass = `w-full rounded-[12px] border border-white/14 bg-white/[0.03] px-3.5 py-3 text-[15px] leading-[1.4] text-white placeholder:text-white/30 ${focusRing}`;

type Status = "idle" | "loading" | "done";

export default function SignInPageView() {
  const reduce = useReducedMotion();
  const uid = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setError("");
    setStatus("loading");
    timer.current = setTimeout(() => setStatus("done"), 900);
  };

  const loading = status === "loading";

  return (
    <PreviewViewFrame slug="sign-in-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <div className="grid min-h-screen grid-cols-1 @[860px]:grid-cols-2">
          <aside aria-label="Customer quote" className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-white/[0.03] p-10 @[860px]:flex">
            <p className={`${serif.className} m-0 text-[26px] leading-none tracking-[-0.02em] text-white`}>Nexora</p>
            <figure className="m-0">
              <blockquote className={`${serif.className} m-0 text-[34px] leading-[1.2] tracking-[-0.02em] text-white`}>“{QUOTE}”</blockquote>
              <figcaption className="mt-6 text-[14px] leading-[1.5] text-white/55">
                <span className="font-semibold text-white/85">{QUOTE_AUTHOR}</span>
                <br />
                {QUOTE_ROLE}
              </figcaption>
            </figure>
          </aside>

          <main className="flex items-center justify-center px-5 py-12 @[860px]:px-12">
            <motion.section
              aria-labelledby="signin-heading"
              {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } })}
              className="w-full max-w-[380px]"
            >
              <h1 id="signin-heading" className={`${serif.className} m-0 text-[40px] leading-[1.1] font-normal tracking-[-0.03em] text-white`}>{HEADING}</h1>
              <p className="mt-2.5 mb-0 text-[15px] leading-[1.6] text-white/55">{DESCRIPTION}</p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {["Google", "GitHub"].map((provider) => (
                  <button key={provider} type="button" className={`cursor-pointer rounded-full border border-white/16 bg-transparent px-4 py-3 text-[14px] leading-none font-medium text-white transition-colors duration-150 hover:bg-white/[0.06] ${focusRing}`}>
                    Continue with {provider}
                  </button>
                ))}
              </div>

              <div className="my-6 flex items-center gap-3" role="separator" aria-label="or">
                <span className="h-px flex-1 bg-white/12" />
                <span className="text-[12px] tracking-[0.08em] text-white/35 uppercase">or</span>
                <span className="h-px flex-1 bg-white/12" />
              </div>

              {status === "done" ? (
                <p role="status" className="m-0 rounded-[12px] border border-white/14 bg-white/[0.04] px-4 py-4 text-[15px] leading-[1.6] text-white/80">
                  You&apos;re signed in. This is a preview, so nothing was sent.
                </p>
              ) : (
                <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor={`${uid}-email`} className="mb-1.5 block text-[13px] font-medium text-white/70">Email</label>
                    <input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com" className={fieldClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor={`${uid}-password`} className="text-[13px] font-medium text-white/70">Password</label>
                      <a href="#forgot" onClick={(e) => e.preventDefault()} className={`rounded text-[13px] text-white/55 underline underline-offset-2 hover:text-white ${focusRing}`}>Forgot password?</a>
                    </div>
                    <div className="relative">
                      <input id={`${uid}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className={`${fieldClass} pr-16`} />
                      <button
                        type="button"
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((v) => !v)}
                        className={`absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 text-[13px] text-white/55 hover:text-white ${focusRing}`}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-white/65">
                    <input type="checkbox" name="remember" defaultChecked className="h-4 w-4 cursor-pointer accent-white" />
                    Keep me signed in
                  </label>

                  {error && <p role="alert" className="m-0 text-[13px] leading-[1.5] text-[#ff8a8a]">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className={`mt-1 cursor-pointer rounded-full border-0 bg-white px-5 py-3.5 text-[15px] leading-none font-semibold text-[#111] transition-opacity duration-150 hover:opacity-85 disabled:cursor-default disabled:opacity-60 ${focusRing}`}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              )}

              <p className="mt-6 mb-0 text-center text-[14px] text-white/45">
                New to Nexora?{" "}
                <a href="#signup" onClick={(e) => e.preventDefault()} className={`rounded text-white underline underline-offset-2 ${focusRing}`}>Create an account</a>
              </p>
            </motion.section>
          </main>
        </div>
      </div>
    </PreviewViewFrame>
  );
}
