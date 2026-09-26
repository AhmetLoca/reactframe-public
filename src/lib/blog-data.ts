export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO date, e.g. "2026-08-18"
  readTime: string; // e.g. "4 min read"
  coverImage?: string; // put images in public/blog/
  // Markdown (GFM) — ## / ### headings, paragraphs, links, bold, and
  // tables all render. Rendered via BlogContent in [slug]/page.tsx.
  content: string;
}

// Add new posts here, newest first. Delete the example post once you have
// real ones — it exists only so the blog layout isn't empty by default.
export const posts: BlogPost[] = [
  {
    slug: "react-phone-number-input-with-country-code",
    title: "How to add a phone number input with country codes in React",
    excerpt:
      "A phone field with a searchable country menu, as-you-type formatting and an E.164 value, in React and Tailwind, plus how to validate it properly on the server.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "5 min read",
    content: `Phone numbers are one of the most mistyped fields on any form. People leave out the country code, add a leading 0, paste numbers with spaces and dashes, or type one digit too few. A good phone input fixes most of that while they type and hands your backend one clean format.

This tutorial uses ReactFrame's free [Phone Input](/components/phone-input) element: a country menu with flags and calling codes, formatting per country, paste detection and an E.164 value.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/phone-input.json
\`\`\`

It installs into \`components/phone-input.tsx\` with \`motion\`, \`clsx\` and \`tailwind-merge\`. There's no phone library underneath, so it adds very little to your bundle.

## 2. Drop it into a form

\`\`\`tsx
import { PhoneInput } from "@/components/phone-input";

export function ContactForm() {
  return (
    <form action="/api/contact" method="post" className="flex flex-col gap-4">
      <PhoneInput
        label="Phone number"
        name="phone"
        defaultCountry="TR"
        preferredCountries={["TR", "US", "GB"]}
        helperText="We'll text you a confirmation code"
      />
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\`

\`name="phone"\` adds a hidden input, so a plain form post receives \`phone=+905321234567\` with no JavaScript on your side.

## 3. What people see while they type

- **Formatting per country.** Digits fall into the local layout: \`532 123 45 67\` in Türkiye, \`(415) 555-0123\` in the US, \`7911 123456\` in the UK.
- **Leading 0 dropped.** Typing \`0532…\` keeps \`532…\`, because the trunk 0 isn't part of an international number.
- **Paste detection.** Pasting \`+44 7911 123456\` switches the country to the United Kingdom by its calling code.
- **Searchable menu.** The country menu matches names, ISO codes and calling codes, so typing \`+49\` finds Germany.
- **A length check.** A check mark appears when the number has a valid length for the country, and leaving the field with too few digits shows "Enter a valid phone number".

## 4. Read the value

\`\`\`tsx
const [phone, setPhone] = React.useState("");
const [valid, setValid] = React.useState(false);

<PhoneInput
  value={phone}
  onValueChange={(value, meta) => {
    setPhone(value);          // "+905321234567"
    setValid(meta.isValid);   // length is right for the country
  }}
/>
\`\`\`

The value is **E.164**: a plus, the calling code and the national number, no spaces. It's the format Twilio, WhatsApp, Vonage and most SMS and calling APIs expect, and it's easy to store and compare.

## 5. Validate on the server

The built-in check only looks at the number's length, which catches most typos. It can't tell whether a number exists or is a mobile line. For that, validate on the server:

- **Format and type:** \`libphonenumber-js\` (\`isValidPhoneNumber\`, \`getNumberType\`) knows every country's number plan.
- **Ownership:** send a one-time code by SMS and ask for it back. ReactFrame's [Input OTP](/components/input-otp) is made for that step.

## Common mistakes

- **Storing the formatted string.** Store E.164; format for display only.
- **One country for everyone.** Set \`defaultCountry\` from your audience (or the visitor's locale) and pin your top markets with \`preferredCountries\`.
- **Blocking the form on the length check.** Treat it as a hint and let your server decide.

## Related

Phone Input shares its look with the other form elements: [Credit Card Input](/components/credit-card-input), [Currency Input](/components/currency-input), [Time Picker](/components/time-picker) and [Form Field](/components/form-field). All of them are free in the [UI Elements kit](/kits/ui-elements).`,
  },
  {
    slug: "react-countdown-timer-tutorial",
    title: "How to build a countdown timer in React (days, hours, minutes, seconds)",
    excerpt:
      "Add a countdown to a launch, sale or event in React with a free animated component, and avoid the time zone and hydration mistakes most countdowns make.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A countdown is one of the simplest ways to add urgency to a sale, a launch or an event page. It's also easy to get subtly wrong: the wrong time zone, a flash of the wrong numbers on first load, or a timer that sits at zero after the deadline.

This tutorial uses ReactFrame's free [Countdown Timer](/components/countdown-timer), which ticks with animated digits and handles the end state for you.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/countdown-timer.json
\`\`\`

## 2. Count down to a date

\`\`\`tsx
import { CountdownTimer } from "@/components/countdown-timer";

export function LaunchCountdown() {
  return <CountdownTimer endDate="2026-12-31T23:59:00+03:00" expiredText="We're live!" />;
}
\`\`\`

Write the end time with its UTC offset (\`+03:00\` above is Istanbul). Without an offset, \`2026-12-31T23:59:00\` is read in each **visitor's** own time zone, so someone in New York and someone in Tokyo would see different deadlines. With the offset, everyone counts down to the same moment.

## 3. Or count a fixed duration

For "offer ends in 15 minutes" style timers, pass a duration in milliseconds instead:

\`\`\`tsx
<CountdownTimer duration={15 * 60 * 1000} showDays={false} showHours={false} loop />
\`\`\`

\`duration\` starts when the component mounts. \`loop\` restarts it at zero, which suits demo and recurring offers; it has no effect when you use \`endDate\`.

## 4. Shape it

| Prop | What it does |
|---|---|
| \`showDays\`, \`showHours\`, \`showSeconds\` | Hide units you don't need. |
| \`compact\` | A tighter single-line version for banners and cards. |
| \`cellShape\` | \`"rounded"\`, \`"square"\` or \`"circle"\` cells. |
| \`cellSize\` | Size of each digit cell in pixels. |
| \`labelPosition\` | Unit labels (\`Days\`, \`Hours\`...) on \`"top"\` or \`"bottom"\`. |
| \`fontFamily\` | \`"system"\`, \`"mono"\` or \`"serif"\` digits. |
| \`blinkColon\` | Blinks the separators every second. |
| \`expiredText\` | What shows once the time is up. |

## Common mistakes

- **Trusting the client for real deadlines.** A countdown is display only. If a price or coupon really expires, enforce it on the server; anyone can change their system clock.
- **Computing the time during render.** The server and the browser read the clock at different moments, so a countdown rendered with real numbers on the server causes hydration warnings. This component starts from a fixed placeholder and fills in the real time right after it mounts.
- **A countdown that never ends.** Set \`expiredText\` (or swap the section out after the date) so the page doesn't show 00:00:00 forever.

## Pair it with

A countdown works best next to an offer: an [Announcement Banner](/components/announcement-banner) at the top of the page or a discount popup. See the [Growth kit](/kits/growth) for sets that share one campaign theme.`,
  },
  {
    slug: "react-data-table-sort-filter-pagination",
    title: "How to add a data table with sorting, search and pagination in React",
    excerpt:
      "Turn an array of objects into a sortable, searchable, paginated table with badges, avatars and row actions in React and Tailwind, without a table library.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "5 min read",
    content: `Admin panels, dashboards and internal tools all end up needing the same table: sortable columns, a search box, status tabs, pagination and a few row actions. Libraries like TanStack Table give you the logic but leave the UI to you. This tutorial uses ReactFrame's free [Data Table](/components/data-table), which ships both.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/data-table.json
\`\`\`

## 2. Describe your columns and pass your rows

\`\`\`tsx
import { DataTable, type DataTableColumn } from "@/components/data-table";

const columns: DataTableColumn[] = [
  { key: "name", label: "Customer", type: "avatar", sortable: true },
  { key: "email", label: "Email", type: "text", sortable: true, filterable: true },
  { key: "plan", label: "Plan", type: "badge", sortable: true, filterable: true },
  { key: "mrr", label: "MRR", type: "currency", sortable: true, align: "right" },
  { key: "status", label: "Status", type: "badge", filterable: true },
  { key: "actions", label: "", type: "actions", align: "right" },
];

const rows = [
  { name: "Ada Lovelace", email: "ada@acme.com", plan: "Pro", mrr: 49, status: "Active" },
  { name: "Alan Turing", email: "alan@acme.com", plan: "Team", mrr: 199, status: "Active" },
  { name: "Grace Hopper", email: "grace@acme.com", plan: "Free", mrr: 0, status: "Inactive" },
];

export function CustomersTable() {
  return <DataTable title="Customers" columns={columns} data={rows} rowsPerPage={10} />;
}
\`\`\`

Each row is a plain object; the column \`key\` says which field it reads. The column \`type\` decides how the cell looks:

| Type | Renders |
|---|---|
| \`text\` | Plain text. |
| \`number\` | A number, right for IDs and counts. |
| \`currency\` | A dollar amount with two decimals. |
| \`badge\` | A pill, coloured by \`badgeColors\`. |
| \`avatar\` | Initials in a coloured circle next to the name. |
| \`actions\` | Icon buttons from \`actionButtons\`. |

## 3. Search, filters and tabs

- **Search** (\`showSearch\`) matches every column.
- **Column filters**: columns with \`filterable: true\` get a filter menu in the header, listing that column's values.
- **Status tabs** (\`showStatusTabs\`) build tabs from the values of one column, \`status\` by default; point \`statusTabsColumn\` at another field if needed.
- **Pagination** (\`showPagination\`, \`rowsPerPage\`) and **row selection** (\`selectable\`) are on by default.

## 4. Colour the badges

\`\`\`tsx
<DataTable
  columns={columns}
  data={rows}
  badgeColors={[
    { value: "Active", background: "rgba(135,255,227,0.12)", text: "#87FFE3", dot: true },
    { value: "Inactive", background: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)", dot: true },
    { value: "Pro", background: "rgba(124,92,255,0.14)", text: "#B6A6FF" },
  ]}
/>
\`\`\`

## When to reach for something else

This table sorts, searches and pages **in the browser**, which is ideal up to a few thousand rows. For tens of thousands of rows or data that lives on the server, page and filter in your API and pass one page of results at a time, or use a headless library such as TanStack Table for the logic.

## Related

Pair the table with [charts](/collections/react-chart-components) and stat cards in the [Dashboard kit](/kits/dashboard).`,
  },
  {
    slug: "react-drag-and-drop-kanban-board",
    title: "How to build a drag and drop Kanban board in React",
    excerpt:
      "A Trello-style board with columns, draggable cards, tags, priorities and avatars in React, and how to save every move to your database.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A Kanban board looks simple and turns out to be fiddly: pointer events, drop targets, reordering inside a column, auto-scrolling, and a card that follows the cursor without jank. This tutorial uses ReactFrame's free [Kanban Board](/components/kanban-board), which handles the dragging, so you only bring the data.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/kanban-board.json
\`\`\`

It has no drag and drop dependency; the dragging is built on pointer events, so it works with a mouse, a pen or a finger, and the board scrolls on its own when you drag a card near its edge.

## 2. Columns and cards

\`\`\`tsx
import { KanbanBoard, type KanbanCard } from "@/components/kanban-board";

const columns = [
  { id: "todo", title: "To do", accentColor: "#9a9a96" },
  { id: "doing", title: "In progress", accentColor: "#c98a3f" },
  { id: "done", title: "Done", accentColor: "#5fa874" },
];

const cards: KanbanCard[] = [
  { id: "1", title: "Write launch post", tag: "Content", tagColor: "#6f7fbf", priority: "high", columnId: "todo" },
  { id: "2", title: "Fix checkout bug", tag: "Engineering", tagColor: "#d44c3a", priority: "urgent", columnId: "doing" },
  { id: "3", title: "Pick pricing", tag: "Strategy", priority: "medium", columnId: "done", avatars: ["/team/ada.jpg"] },
];

export function Board() {
  return <KanbanBoard boardTitle="Launch" columns={columns} cards={cards} />;
}
\`\`\`

Each card belongs to a column through \`columnId\`. Optional fields add detail: a \`tag\` with its \`tagColor\`, a \`priority\` (\`"urgent"\`, \`"high"\`, \`"medium"\` or \`"low"\`), a \`note\`, and \`avatars\` (image URLs, up to four shown).

## 3. Save every move

\`onCardsChange\` runs after each drop with every card in its new column and order:

\`\`\`tsx
"use client";

import * as React from "react";
import { KanbanBoard, type KanbanCard } from "@/components/kanban-board";

export function Board({ initialCards }: { initialCards: KanbanCard[] }) {
  const [cards, setCards] = React.useState(initialCards);

  return (
    <KanbanBoard
      columns={columns}
      cards={cards}
      onCardsChange={async (next) => {
        setCards(next);
        await fetch("/api/cards", { method: "PUT", body: JSON.stringify(next) });
      }}
    />
  );
}
\`\`\`

Storing the whole list is the simplest approach for small boards. For bigger ones, compare \`next\` with the previous list and save only the card whose \`columnId\` or position changed.

## 4. Look and feel

- \`defaultTheme\` (\`"dark"\` or \`"light"\`) and \`showThemeToggle\`.
- \`showCounts\` shows the number of cards on each column header.
- Separate light and dark colours: \`backgroundColor\`, \`inkColor\`, \`mutedColor\`, \`surfaceColor\` and their \`dark...\` versions.

## Tips

- Keep card \`id\`s stable (database ids, not array indexes), or cards can jump after a save.
- On phone widths the columns stack vertically, so a four or five column board still reads well on mobile.

## Related

See more app building blocks in the [Dashboard kit](/kits/dashboard), including the [Data Table](/components/data-table) for list views of the same data.`,
  },
  {
    slug: "react-infinite-logo-marquee-tailwind",
    title: "How to make an infinite logo marquee in React and Tailwind",
    excerpt:
      "A seamless scrolling strip of client logos with pause on hover, grayscale to colour, and soft faded edges, in React and Tailwind CSS.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "3 min read",
    content: `A row of client logos that scrolls forever is the most common trust signal on a landing page. Getting it seamless (no jump when the loop restarts, no gap at the end) takes a little care. This tutorial uses ReactFrame's free [Logo Marquee](/components/logo-marquee).

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/logo-marquee.json
\`\`\`

## 2. Pass your logos

\`\`\`tsx
import { LogoMarquee } from "@/components/logo-marquee";

const logos = [
  { name: "Acme", image: "/logos/acme.svg", link: "https://acme.com" },
  { name: "Globex", image: "/logos/globex.svg" },
  { name: "Initech", image: "/logos/initech.svg", imageScale: 90 },
  { name: "Umbrella", image: "/logos/umbrella.svg" },
];

export function Clients() {
  return (
    <section className="py-16">
      <p className="mb-8 text-center text-sm text-neutral-500">Trusted by teams at</p>
      <LogoMarquee logos={logos} />
    </section>
  );
}
\`\`\`

A logo without an \`image\` shows its \`name\` as text, which is handy while you're still collecting files. \`imageScale\` (a percentage) evens out logos that look bigger or smaller than the rest, and \`link\` makes a logo clickable.

## 3. Tune it

| Prop | Default | What it does |
|---|---|---|
| \`speed\` | \`60\` | Scroll speed. |
| \`direction\` | \`"left"\` | \`"left"\` or \`"right"\`. |
| \`pauseOnHover\` | \`true\` | Stops the strip under the cursor. |
| \`grayscale\`, \`hoverReveal\` | \`true\` | Grey logos that turn to colour on hover. |
| \`logoHeight\`, \`gap\` | \`36\`, \`64\` | Size and spacing. |
| \`edgeFade\`, \`edgeBlur\`, \`fadeWidth\` | on, on, \`80\` | Soft edges so logos don't start and end abruptly. |

## Tips for logos that look right

- **Use SVGs** where you can; they stay sharp at any size.
- **Match the visual weight**, not the pixel size. Wordmarks usually need a smaller \`imageScale\` than square icons.
- **Get permission** before showing a customer's logo, and keep a text fallback for the ones still in review.
- **Two rows going opposite ways** (\`direction="left"\` and \`"right"\`) fill a wide section nicely.

## Related

For a static trust bar with logos and a short quote, see [Testimonial Logos](/components/testimonial-logos). To scroll anything else (cards, quotes, product shots), use [Infinite Marquee](/components/infinite-marquee). Both are free.`,
  },
  {
    slug: "react-business-hours-open-now-widget",
    title: "How to show opening hours and an \"Open now\" status on your website",
    excerpt:
      "Add business hours with a live Open now / Closed badge to a React or Next.js site, including the time zone setting most widgets get wrong.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "3 min read",
    content: `For cafés, clinics, shops and offices, "are they open right now?" is one of the first questions a visitor has. A small hours widget with a live status answers it before they reach for Google Maps. This tutorial uses ReactFrame's free [Business Hours](/components/business-hours) widget.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/business-hours.json
\`\`\`

## 2. Add your hours

\`\`\`tsx
import { BusinessHours } from "@/components/business-hours";

const days = [
  { day: "Monday", hours: "08:00 AM - 06:00 PM" },
  { day: "Tuesday", hours: "08:00 AM - 06:00 PM" },
  { day: "Wednesday", hours: "08:00 AM - 06:00 PM" },
  { day: "Thursday", hours: "08:00 AM - 06:00 PM" },
  { day: "Friday", hours: "08:00 AM - 10:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 02:00 AM" },
  { day: "Sunday", hours: "Closed" },
];

export function VisitUs() {
  return (
    <BusinessHours
      title="Visit Moda Roasters"
      headerTitle="Opening hours"
      days={days}
      timeZone="Europe/Istanbul"
      address="Moda Cd. 12, Kadıköy, İstanbul"
      phone="+90 216 123 45 67"
      directionsUrl="https://maps.google.com/?q=Moda+Roasters"
    />
  );
}
\`\`\`

Write hours as \`"HH:MM AM - HH:MM PM"\` (with the spaces around the dash) and use \`"Closed"\` for days off. Late nights work too: Saturday above runs from 10 AM to 2 AM.

## 3. Set the time zone

\`timeZone\` is the business's IANA time zone (\`"Europe/Istanbul"\`, \`"America/New_York"\`, \`"Asia/Tokyo"\`). With it, the Open now badge follows the shop's clock, so a visitor browsing from another country still sees the right status. Without it, the status follows the visitor's own clock, which is only right for people in the same time zone.

## 4. Style it

- \`theme\` (\`"dark"\` or \`"light"\`), and \`showThemeToggle\` to let visitors switch.
- \`backgroundImage\` or \`backgroundVideo\` for a photo of the place behind the card.
- \`openText\` and \`closedText\` to translate the badge, for example \`"Şu an açık"\` / \`"Kapalı"\`.
- \`showDirectionsButton\` with \`directionsUrl\` for a one-tap route in Maps.

## Keep it in sync with Google

Use the same hours as your Google Business Profile. Mismatched hours are a common reason for bad reviews, and search engines compare them. If you use structured data, \`openingHoursSpecification\` on your LocalBusiness schema should match too.

## Related

For a full local business page, pair it with reviews from the [Review widgets collection](/collections/react-review-widgets) and a chat button from [Chat widgets](/collections/react-chat-widgets).`,
  },
  {
    slug: "how-to-build-an-ai-voice-assistant-ui-in-react",
    title: "How to build an AI voice assistant UI in React",
    excerpt:
      "Build a working voice assistant interface in React with a free animated voice component and the browser's Web Speech API, then connect your own model.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A voice assistant needs three things: something that listens, something that answers, and an interface that shows which of the two is happening. This tutorial builds all three in React with no API keys: the browser's built-in Web Speech API does the listening and speaking, and ReactFrame's free [AI Voice 01](/components/ai-voice-01) component is the interface.

By the end you'll have a voice pill that turns on when you tap it, shows a live audio visualizer while you talk, answers out loud, and goes back to idle when it's done. Swapping the canned answer for a real model is one function.

## 1. Install the component

AI Voice 01 is free and installs with the shadcn CLI:

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/ai-voice-01.json
\`\`\`

It drops the full source into \`components/ai-voice-01.tsx\` and installs its two small dependencies, \`clsx\` and \`tailwind-merge\`.

## 2. How the component thinks

The component has three states, \`idle\`, \`listening\` and \`speaking\`, and two ways to change them:

- **Your code** sets the \`status\` prop.
- **The user** taps the pill, which toggles between idle and listening and fires \`onStart\` (leaving idle) or \`onStop\` (back to idle).

Out of the box it also runs a demo flow that walks through the states on a timer. For a real assistant, turn that off with \`autoFlow={false}\` so only you and the user move it.

Two more props matter here: \`input="microphone"\` makes the visualizer follow the real microphone level while listening, and \`transcript={false}\` hides the demo sentences it types by default, so you can show what was actually heard.

## 3. Wire it to the Web Speech API

\`\`\`tsx
"use client";

import * as React from "react";
import { AiVoice01 } from "@/components/ai-voice-01";

type Status = "idle" | "listening" | "speaking";

// Replace this with a call to your model (an API route that calls OpenAI, Anthropic, and so on).
async function getReply(text: string): Promise<string> {
  return \`You said: \${text}\`;
}

export function VoiceAssistant() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [heard, setHeard] = React.useState("");
  const recognition = React.useRef<any>(null);

  const listen = () => {
    const Recognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setHeard("Speech recognition isn't supported in this browser.");
      return;
    }
    const r = new Recognition();
    r.lang = "en-US";
    r.onresult = async (event: any) => {
      if (recognition.current !== r) return; // stopped before the result arrived
      const text = event.results[0][0].transcript;
      setHeard(text);
      const reply = await getReply(text);
      if (recognition.current !== r) return;
      setStatus("speaking");
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.onend = () => setStatus("idle");
      speechSynthesis.speak(utterance);
    };
    r.onerror = () => setStatus("idle");
    recognition.current = r;
    r.start();
  };

  const stop = () => {
    recognition.current?.abort();
    recognition.current = null;
    speechSynthesis.cancel();
    setStatus("idle");
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col items-center gap-4">
      <div className="h-24 w-full">
        <AiVoice01 status={status} autoFlow={false} input="microphone" transcript={false} onStart={listen} onStop={stop} />
      </div>
      {heard && <p className="text-sm text-neutral-500">{heard}</p>}
    </div>
  );
}
\`\`\`

What happens when you tap the pill:

1. The pill moves to \`listening\` and calls \`onStart\`, which starts speech recognition. The visualizer follows your voice.
2. When recognition returns a sentence, we show it, get a reply, and set \`status\` to \`speaking\`.
3. The browser reads the reply out loud; when it finishes, \`status\` goes back to \`idle\`.
4. Tapping again at any point calls \`onStop\`, which cancels everything; the \`recognition.current !== r\` checks make sure a late result from a cancelled session is ignored.

## 4. Connect a real model

Only \`getReply\` needs to change. Point it at an API route so your key stays on the server:

\`\`\`ts
async function getReply(text: string): Promise<string> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.reply;
}
\`\`\`

For lower latency and more natural voices, replace the Web Speech API with a realtime speech API (OpenAI Realtime, ElevenLabs, Deepgram and others). The component doesn't change: keep setting \`status\` from whatever your audio pipeline is doing.

## Browser support and tips

- Speech recognition works in Chrome, Edge and Safari; Firefox doesn't support it yet, so show a fallback (a text input) there.
- The microphone needs a secure context: \`localhost\` or HTTPS.
- Keep one voice control per screen, and give it a clear label (the \`idleText\` prop) so people know it's tappable.

## Other voice styles

AI Voice 01 draws flowing curves. The same API powers the rest of the family, so you can swap the look without changing your code: a waveform, a dot matrix, a 3D particle orb, or a full-size portrait card. See them all in [React AI Voice Assistant Components](/collections/react-ai-voice-components).`,
  },
  {
    slug: "build-a-website-with-your-ai-and-reactframe",
    title: "How to build a website with Claude, ChatGPT or Cursor using ReactFrame components",
    excerpt:
      "Connect your AI assistant to ReactFrame, give it a good prompt, and get a site assembled from tested components plus a price for the premium parts.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "3 min read",
    content: `You can ask Claude, ChatGPT or Cursor to build a website out of ReactFrame components the same way you'd ask a designer: describe the business, and it picks the sections, installs the components and writes the copy. This post shows the setup, a prompt that works well, and what you get back.

## What the assistant can see

ReactFrame publishes everything an AI assistant needs to work with the catalog without guessing:

- [llms.txt](/llms.txt), a plain-text map of every component, kit and collection, with prices.
- A [design guide](/ai/design-guide.md) with the tokens, type scale, spacing, image rules and page recipes the assistant should follow, so a page made of many components still looks like one design.
- An MCP server, \`reactframe-mcp\`, that lets the assistant search components, install free ones and price premium ones.
- A quote endpoint that prices a list of components in one request.

## 1. Connect your assistant

**Claude Code**, one command:

\`\`\`bash
claude mcp add reactframe -- npx -y reactframe-mcp
\`\`\`

**Cursor and other MCP clients**, add this to your MCP config:

\`\`\`json
{
  "mcpServers": {
    "reactframe": { "command": "npx", "args": ["-y", "reactframe-mcp"] }
  }
}
\`\`\`

**ChatGPT or Claude.ai** without MCP: nothing to install. Start your prompt with "Read reactframe.com/llms.txt and reactframe.com/ai/design-guide.md, then…".

## 2. Ask for the site

Be specific about the business, the audience and the sections you want. For example:

\`\`\`text
Build a one-page website for "Moda Roasters", a specialty coffee shop in Kadıköy, Istanbul,
using ReactFrame components. Warm, calm look, light mode. Sections: hero, our coffees,
gallery, Google reviews, opening hours, location and footer. Follow the ReactFrame design
guide, and tell me what any premium components would cost.
\`\`\`

## 3. What comes back

A good run looks like this:

1. **Picks a kit or recipe.** For a café the design guide suggests the local business recipe: a photo hero, a menu section, a gallery, reviews and [Business Hours](/components/business-hours).
2. **Installs the free components** with the shadcn CLI and fills them with your content, one palette and one type scale across all of them.
3. **Leaves placeholders for premium components** instead of copying them, with a comment naming the component and its link, so the page structure is complete.
4. **Ends with a quote**: which premium components the design uses, their prices, the total, and whether All-Access is the cheaper option.

## 4. Review it like a designer would

Before you ship, check the things assistants most often get wrong:

- **One accent color.** Every component should use the site's accent, not its own default.
- **One h1.** The hero heading should be the only \`<h1>\`, with your main keyword in it.
- **Real content.** Replace placeholder photos and any invented numbers.
- **Mobile.** Open it at phone width and scroll the whole page.

## Why this works better than "make me a website"

A general-purpose assistant building from scratch invents a new design system every time. Giving it a catalog of finished, tested components plus a rulebook for combining them turns the job into assembly: the assistant chooses and connects pieces, and each piece is already responsive, themeable and animated.

Start from [Build a site with your AI](/docs/ai), or browse the [kits](/kits) to see which components are designed to go together.`,
  },
  {
    slug: "spin-to-win-wheel-popup-in-react",
    title: "How to add a spin-to-win wheel popup to a React site",
    excerpt:
      "Add a gamified discount wheel to your React site as an inline block or a timed popup, then set your own prizes, odds and campaign.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A spin-to-win wheel turns an email or discount popup into a small game: visitors spin, win a code, and are far more likely to use it than a plain "10% off" banner. This tutorial adds one to a React site with ReactFrame's free [Spin to Win Wheel](/components/spin-to-win-wheel), then shows how to set your own prizes and odds.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/spin-to-win-wheel.json
\`\`\`

The component lands in \`components/spin-to-win-wheel.tsx\` with its full source, so every prize and label is yours to edit.

## 2. Drop it on the page

Inline, for example on a promotions page:

\`\`\`tsx
import { SpinToWinWheel } from "@/components/spin-to-win-wheel";

export function Promo() {
  return (
    <div className="w-full max-w-[420px]">
      <SpinToWinWheel theme="ecommerce" freeSpins={3} />
    </div>
  );
}
\`\`\`

Or as a popup that opens a few seconds after the visitor arrives:

\`\`\`tsx
<SpinToWinWheel asPopup trigger="delay" delaySeconds={8} theme="ecommerce" />
\`\`\`

The props that shape the popup:

| Prop | What it does |
|---|---|
| \`asPopup\` | Shows a corner launcher and opens the wheel in a popup instead of inline. |
| \`trigger\` | \`"manual"\` (only the launcher opens it), \`"delay"\` (opens after \`delaySeconds\`) or \`"scroll"\` (opens when the spot where you placed it scrolls into view). |
| \`freeSpins\` | How many spins each visitor gets. |
| \`theme\` | One of the built-in themes, each with its own title, colors and prizes: \`ecommerce\`, \`campaign\`, \`restaurant\`, \`saas\`, \`event\`. |
| \`storageKey\` | Spins left and rewards won are saved in the visitor's browser, so a reload doesn't hand out fresh spins. Give each campaign its own key so a new campaign starts fresh. |
| \`widgetPosition\` | \`"bottom-right"\` or \`"bottom-left"\` for the launcher. |

## 3. Set your own prizes and odds

Prizes live in the \`THEMES\` object at the top of the component file. Each segment has a label, the code it reveals and a \`weight\`:

\`\`\`ts
segments: [
  { label: "5% off", code: "SPIN5", weight: 3 },
  { label: "10% off", code: "SPIN10", weight: 3 },
  { label: "15% off", code: "SPIN15", weight: 2 },
  { label: "20% off", code: "SPIN20", weight: 2 },
  // ...
],
\`\`\`

The weight is relative: a segment with weight 3 comes up three times as often as one with weight 1. Keep generous prizes rare. Every theme also has a "Try Again" slot that reveals no discount, which makes the real prizes feel earned.

Edit the theme you're using (or copy it into a new one) with your real codes, title and button text.

## 4. Make the codes real

The wheel shows codes; your checkout decides whether they're valid. Create the same codes in your store or payment provider, and validate them on the server when they're applied. Anything in the browser can be inspected, so treat the wheel as a way to hand out codes, not as the place that enforces them.

## Tips that keep it friendly

- **One popup per visit.** Don't stack a wheel on top of a newsletter popup and a cookie banner.
- **Give people a moment first.** A delay of 8 to 15 seconds, or the scroll trigger, converts better than opening instantly and annoys fewer visitors.
- **Say what you're collecting.** If you ask for an email before the spin, say so plainly and link your privacy policy.

## Other ways to gamify an offer

The same idea comes in other shapes: a scratch card, a dice roll and a ticket-style promo popup, plus an announcement bar and countdown for urgency. See them side by side in [Spin to Win Wheel and Discount Popups for React](/collections/react-discount-popups), or the [Growth kit](/kits/growth).`,
  },
  {
    slug: "welcome-to-the-reactframe-blog",
    title: "Welcome to the ReactFrame blog",
    excerpt:
      "Notes on building components, shipping fast, and what's coming next for the library.",
    category: "Announcement",
    date: "2026-08-18",
    readTime: "2 min read",
    content: `This is where component breakdowns, build notes, and everything new in the ReactFrame library will show up going forward.

Expect short, practical posts: how a component was built, what changed in an update, and the occasional look at what's next. Nothing long-winded, just notes worth reading before your next build.

More soon.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
