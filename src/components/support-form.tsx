"use client";

import * as React from "react";

interface PickerItem {
  slug: string;
  name: string;
}

const CATEGORIES = ["Bug report", "Component question", "Billing", "Other"] as const;

export function SupportForm({ items }: { items: PickerItem[] }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>("Other");
  const [itemQuery, setItemQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<PickerItem | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const matches = React.useMemo(() => {
    const q = itemQuery.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 6);
  }, [itemQuery, items]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          message,
          company,
          category,
          relatedItem: selectedItem ? selectedItem.name : "",
        }),
      });
      if (!res.ok) throw new Error("request failed");

      setStatus("sent");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setCategory("Other");
      setItemQuery("");
      setSelectedItem(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-border bg-card px-8 py-12 text-center">
        <p className="text-lg font-medium">Message sent.</p>
        <p className="mt-2 text-sm text-foreground/50">I&rsquo;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-14 flex max-w-md flex-col gap-4 rounded-2xl border border-border bg-card px-8 py-10 text-left">
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="support-first-name" className="text-xs font-medium text-foreground/50">
            First Name
          </label>
          <input
            id="support-first-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            suppressHydrationWarning
            className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors duration-300 ease-signature focus:border-foreground/30"
          />
        </div>

        <div>
          <label htmlFor="support-last-name" className="text-xs font-medium text-foreground/50">
            Last Name
          </label>
          <input
            id="support-last-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            suppressHydrationWarning
            className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors duration-300 ease-signature focus:border-foreground/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="support-email" className="text-xs font-medium text-foreground/50">
          Email
        </label>
        <input
          id="support-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          suppressHydrationWarning
          className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors duration-300 ease-signature focus:border-foreground/30"
        />
      </div>

      <div ref={categoryRef} className="relative">
        <label htmlFor="support-category" className="text-xs font-medium text-foreground/50">
          Category
        </label>
        <button
          id="support-category"
          type="button"
          onClick={() => setCategoryOpen((v) => !v)}
          aria-expanded={categoryOpen}
          className="mt-1.5 flex w-full items-center justify-between rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-left text-sm outline-none transition-colors duration-300 ease-signature focus:border-foreground/30"
        >
          {category}
          <svg
            viewBox="0 0 12 12"
            className={`h-3 w-3 shrink-0 text-foreground/40 transition-transform duration-300 ease-signature ${categoryOpen ? "rotate-180" : ""}`}
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {categoryOpen && (
          <div className="absolute z-10 mt-1.5 w-full space-y-1 rounded-xl border border-border bg-card p-1.5 shadow-lg">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setCategoryOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-300 ease-signature hover:bg-foreground/[0.05] ${
                  category === c ? "font-medium text-foreground" : "text-foreground/70"
                }`}
              >
                <span className="w-3.5 shrink-0 text-foreground/60">{category === c && "✓"}</span>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={pickerRef} className="relative">
        <label htmlFor="support-item" className="text-xs font-medium text-foreground/50">
          Related component <span className="text-foreground/30">(optional)</span>
        </label>

        {selectedItem ? (
          <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-border bg-foreground/[0.02] p-2">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-foreground/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/thumbnails/${selectedItem.slug}.webp`} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{selectedItem.name}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedItem(null);
                setItemQuery("");
              }}
              className="px-2 text-sm text-foreground/40 hover:text-foreground"
              aria-label="Clear selection"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="relative mt-1.5">
            <input
              id="support-item"
              value={itemQuery}
              onChange={(e) => {
                setItemQuery(e.target.value);
                setPickerOpen(true);
              }}
              onFocus={() => setPickerOpen(true)}
              placeholder="Search by name…"
              autoComplete="off"
              className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 pr-10 text-sm outline-none transition-colors duration-300 ease-signature placeholder:text-foreground/40 focus:border-foreground/30"
            />
            <svg viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-3.5 h-3 w-3 -translate-y-1/2 text-foreground/40">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {pickerOpen && !selectedItem && matches.length > 0 && (
          <div className="absolute z-10 mt-1.5 w-full space-y-1 rounded-xl border border-border bg-card p-1.5 shadow-lg">
            {matches.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  setSelectedItem(item);
                  setPickerOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors duration-300 ease-signature hover:bg-foreground/[0.05]"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-foreground/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/thumbnails/${item.slug}.webp`} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="support-message" className="text-xs font-medium text-foreground/50">
          Message
        </label>
        <textarea
          id="support-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          suppressHydrationWarning
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors duration-300 ease-signature focus:border-foreground/30"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-500">Something went wrong — try emailing directly instead.</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
