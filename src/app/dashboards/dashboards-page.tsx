"use client";

import * as React from "react";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";

const DASHBOARD_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Sales & Marketing",
    items: [
      "Marketing SaaS Platform Dashboard",
      "Sales Tracker Dashboard",
      "Sales Management Dashboard",
      "Sales Analytics Dashboard",
      "Website Analytics Admin Dashboard",
    ],
  },
  {
    title: "Finance & Banking",
    items: [
      "Financial Admin Dashboard",
      "Finance Wallet Admin Dashboard",
      "Finance Manager Admin Dashboard",
      "Finance & Stock Admin Dashboard",
      "Banking Dashboard",
      "Exchange Dashboard",
      "Insurance Admin Dashboard",
    ],
  },
  {
    title: "Health & Fitness",
    items: ["Patient Tracking Dashboard", "Workout Tracker Dashboard", "Fitness Tracker Admin Dashboard", "Health Admin Dashboard"],
  },
  {
    title: "Education",
    items: ["E-learning Platform Dashboard", "Learning Platform Dashboard", "Education Admin Dashboard"],
  },
  {
    title: "Project & Productivity",
    items: [
      "Project Admin Dashboard",
      "Project Management Dashboard",
      "Task Management Dashboard",
      "File Management Admin Dashboard",
      "Calendar & Scheduling Dashboard",
    ],
  },
  {
    title: "Commerce & Logistics",
    items: ["E-commerce Admin Dashboard", "Car Rental Admin Dashboard", "Cargo Delivery Tracking Dashboard"],
  },
  {
    title: "Property & Agriculture",
    items: ["Property Management Dashboard", "Farm Management Dashboard", "Hydroponics Admin Dashboard"],
  },
  {
    title: "Social & Communication",
    items: ["Social Media Admin Dashboard", "Chatting Dashboard"],
  },
  {
    title: "HR & Recruitment",
    items: ["HR Admin Dashboard", "Recruitment Tracker Dashboard", "Employee Management Dashboard"],
  },
  {
    title: "Support & Helpdesk",
    items: ["Helpdesk Ticket Dashboard", "Customer Support Dashboard"],
  },
  {
    title: "AI & Analytics",
    items: ["AI Agent Ops Dashboard", "AI Usage Analytics Dashboard"],
  },
  {
    title: "Real Estate",
    items: ["Real Estate Dashboard", "Real Estate Listings Dashboard", "Agent CRM Dashboard"],
  },
  {
    title: "Travel & Hospitality",
    items: ["Hotel Booking Dashboard", "Reservation Management Dashboard"],
  },
  {
    title: "Retail & POS",
    items: ["POS Admin Dashboard", "Retail Inventory Dashboard"],
  },
];

// No dashboard templates have shipped yet, so Free/Premium both read 0
// for now — the filter is still here for when the first ones land.
const freeCount = 0;
const premiumCount = 0;

export function DashboardsPage() {
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [price, setPrice] = React.useState<"all" | "free" | "premium">("free");
  const [query, setQuery] = React.useState("");

  const items: HookSidebarItem[] = DASHBOARD_GROUPS.map((g) => ({ label: g.title, count: g.items.length }));
  const group = DASHBOARD_GROUPS[activeCategory];
  const totalCount = DASHBOARD_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  const q = query.trim().toLowerCase();
  const visible = price !== "all" ? [] : group.items.filter((item) => !q || item.toLowerCase().includes(q));

  const handleSelectCategory = (index: number) => {
    setActiveCategory(index);
    setPrice("all");
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    setPrice((prev) => (prev === next ? "all" : next));
  };

  const heading = price !== "all" ? (price === "free" ? "Free" : "Premium") : group.title;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboards</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {totalCount}
        {" "}
        complete, themed dashboard builds — built end to end from ReactFrame components.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={setQuery} placeholder="Search dashboards…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>
          {visible.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((item) => (
                <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-3.5">
                  <span className="font-mono text-sm text-foreground/70">{item}</span>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground/35 uppercase">Soon</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-foreground/40">Nothing here yet — check back soon.</p>
          )}
        </main>
      </div>
    </div>
  );
}
