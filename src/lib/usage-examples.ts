// Short "how you'd actually call this after installing it" snippets for the
// Usage card — distinct from the Code tab's full source. Only written for
// components that have been backfilled; a slug with no entry here just
// skips the Usage card and shows Install + Code.
export const usageExamples: Record<string, string> = {
  "2048-game": `import { Game2048 } from "@/components/2048-game";

<div className="w-full max-w-[360px]">
  <Game2048 theme="gold" />
</div>
`,
  "badges-kit": `import { Badge } from "@/components/badges-kit";

// Dismissible status badge
<Badge label="Active" tone="success" icon="check" closable onClose={() => console.log("dismissed")} />

// Tones: neutral, success, error, warning, info, purple, orange, indigo, custom
// Icons: none, check, cross, minus, dot, spinner, custom
<Badge label="Processing" tone="info" icon="spinner" />
<Badge label="Beta" tone="orange" />

// Sizes: sm, md (default), lg, xl, 2xl. Use theme="dark" on dark backgrounds
<Badge label="Paid" tone="success" icon="check" size="xl" theme="dark" />

// Your own colours
<Badge label="Custom" tone="custom" customColors={{ bg: "#111827", text: "#f9fafb", border: "#374151" }} />
`,
  "kanban-board": `import { KanbanBoard } from "@/components/kanban-board";

<div className="h-[700px] w-full overflow-hidden rounded-xl">
  <KanbanBoard />
</div>

// Your own columns and cards; save each move
<KanbanBoard
  columns={[
    { id: "todo", title: "To do", accentColor: "#9a9a96" },
    { id: "done", title: "Done", accentColor: "#5fa874" },
  ]}
  cards={cards}
  onCardsChange={(next) => saveCards(next)}
/>
`,
  "x-twitter-widget": `import { XTwitterWidget } from "@/components/x-twitter-widget";

<div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-muted">
  <XTwitterWidget agentHandle="reactframe" fixed={false} popupDelay={0} />
</div>
`,
  "wheel-spin-discount-popup": `import { WheelSpinDiscountPopup } from "@/components/wheel-spin-discount-popup";

<div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl">
  <WheelSpinDiscountPopup />
</div>
`,
  "word-reveal": `import { WordReveal } from "@/components/word-reveal";

<div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
  <WordReveal triggerMode="inview" />
</div>
`,
  "x-post-mockup": `import { XPostMockup } from "@/components/x-post-mockup";

<div className="w-full max-w-md">
  <XPostMockup />
</div>
`,
  "bar-chart": `import { BarChart } from "@/components/bar-chart";

<BarChart theme="dark" title="Support case volume" chartHeight={380} />
`,
  "business-hours": `import { BusinessHours } from "@/components/business-hours";

<div className="h-[700px] w-full">
  <BusinessHours address="123 Main St, City" phone="+1 234 567 8900" />
</div>

// "Open now" follows the business's clock, wherever the visitor is
<BusinessHours
  timeZone="Europe/Istanbul"
  days={[
    { day: "Monday", hours: "08:00 AM - 06:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ]}
/>
`,
  "bubble-cursor": `import { BubbleCursor } from "@/components/bubble-cursor";

<div className="h-[420px] w-full">
  <BubbleCursor colorA="rgba(214, 165, 74, 1)" colorB="rgba(140, 90, 40, 1)" tint="rgba(255, 250, 240, 1)" showThemeToggle />
</div>
`,
  "browser-mockup": `import { BrowserMockup } from "@/components/browser-mockup";

<div className="h-[420px] w-full">
  <BrowserMockup browserStyle="mac" url="reactframe.com" pageTitle="ReactFrame" tabCount={2} media="/images/screenshot.jpg" />
</div>
`,
  "animated-loader": `import { AnimatedLoader } from "@/components/animated-loader";

// Variants: lines (default), ring, dual-ring, dots
<AnimatedLoader variant="lines" color="#7c3aed" size={56} />

// Bigger and slower (speed is seconds per turn), with a thicker stroke
<AnimatedLoader variant="ring" size={96} thickness={8} speed={2} />

// 12 spokes instead of 8 (lines only)
<AnimatedLoader variant="lines" lineCount={12} />

// The ring's track follows your text colour by default. Set it on a dark background if you want
<div className="bg-neutral-950 p-8 text-white">
  <AnimatedLoader variant="ring" color="#34d399" trackColor="rgba(255,255,255,0.16)" />
</div>

// Centre it in a loading state (it forwards className and style to the wrapper)
<div className="flex h-64 items-center justify-center">
  <AnimatedLoader variant="dots" color="#3b82f6" />
</div>
`,
  "animated-checkbox": `import * as React from "react";
import { AnimatedCheckbox } from "@/components/animated-checkbox";

// Uncontrolled, with a label and helper text
<AnimatedCheckbox
  label="Accept terms and conditions"
  helperText="We'll only use this to improve your experience"
  required
  onCheckedChange={(checked) => console.log(checked)}
/>

// Controlled
const [agreed, setAgreed] = React.useState(false);
<AnimatedCheckbox checked={agreed} onCheckedChange={setAgreed} label="I agree" />

// Just the box (no text), bigger, custom accent
<AnimatedCheckbox
  label=""
  size={40}
  radius={12}
  accentColor="#10b981"
  ringColor="rgba(16,185,129,0.3)"
  defaultChecked
/>

// On a dark background: the text follows your page's text colour by default,
// so only the unchecked border needs a tweak
<div className="bg-neutral-950 p-6 text-white">
  <AnimatedCheckbox label="Remember me" borderColor="rgba(255,255,255,0.35)" />
</div>
`,
  "radio-button": `import * as React from "react";
import { RadioButton } from "@/components/radio-button";

// Uncontrolled, with descriptions
<RadioButton
  label="Choose a plan"
  defaultValue="pro"
  options={[
    { value: "starter", label: "Starter", description: "For side projects" },
    { value: "pro", label: "Pro", description: "For teams shipping weekly" },
    { value: "scale", label: "Scale", description: "Unlimited seats" },
  ]}
/>

// Controlled, card variant, horizontal
const [plan, setPlan] = React.useState("pro");
<RadioButton variant="card" direction="horizontal" value={plan} onValueChange={setPlan} />
`,
  "select": `import * as React from "react";
import { Select } from "@/components/select";

// Uncontrolled, with descriptions
<Select
  label="Team"
  placeholder="Select a team"
  helperText="Pick the team you work in"
  options={[
    { value: "design", label: "Design", description: "Interfaces and motion" },
    { value: "engineering", label: "Engineering", description: "Frontend and backend" },
    { value: "product", label: "Product", description: "Strategy and research" },
  ]}
/>

// Controlled, light theme
const [team, setTeam] = React.useState("design");
<Select theme="light" value={team} onValueChange={setTeam} />
`,
  "slider": `import * as React from "react";
import { Slider } from "@/components/slider";

// Uncontrolled, with a label and unit
<Slider label="Volume" unit="%" defaultValue={40} />

// Range slider with step marks
<Slider range label="Price" unit="$" unitPosition="prefix" min={0} max={200} step={10} defaultValue={[40, 120]} showMarks />

// Controlled
const [level, setLevel] = React.useState(60);
<Slider value={level} onValueChange={(v) => setLevel(v as number)} />
`,
  "search-bar": `import * as React from "react";
import { SearchBar } from "@/components/search-bar";

// With suggestions and a search handler
<SearchBar
  placeholder="Search components..."
  suggestions={["Design systems", "Dashboard templates", "Pricing pages", "Hero sections"]}
  onSearch={(query) => console.log(query)}
/>

// Controlled, loading, light theme
const [query, setQuery] = React.useState("");
<SearchBar theme="light" value={query} onValueChange={setQuery} loading={isFetching} />
`,
  "tag": `import * as React from "react";
import { Tag } from "@/components/tag";

// Static labels
<Tag color="mint" dot pulse>Live</Tag>
<Tag variant="outline" color="blue">Design</Tag>
<Tag variant="solid" color="amber" count={12}>Open issues</Tag>

// Removable
<Tag removable onRemove={() => console.log("removed")}>Engineering</Tag>

// Selectable filter chip
const [on, setOn] = React.useState(false);
<Tag selected={on} onSelectedChange={setOn}>Product</Tag>
`,
  "tooltip": `import { Tooltip } from "@/components/tooltip";

<Tooltip content="Save changes" shortcut="⌘S">
  <button>Save</button>
</Tooltip>

// Other placements and the light theme
<Tooltip content="Copy link" placement="bottom" theme="light">
  <button>Share</button>
</Tooltip>
`,
  "skeleton": `import { Skeleton } from "@/components/skeleton";

// Presets
<Skeleton variant="card" />
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={48} />
<Skeleton width={240} height={120} animation="pulse" />

// Swap for real content when loading finishes
<Skeleton variant="card" loading={isLoading}>
  <ProfileCard user={user} />
</Skeleton>
`,
  "tabs": `import * as React from "react";
import { Tabs } from "@/components/tabs";

// Uncontrolled, with content panels
<Tabs
  items={[
    { value: "overview", label: "Overview", content: "Workspace summary" },
    { value: "analytics", label: "Analytics", count: 4, content: "Traffic and conversion" },
    { value: "settings", label: "Settings", content: "Members and billing" },
  ]}
/>

// Segmented, controlled
const [tab, setTab] = React.useState("overview");
<Tabs variant="segmented" value={tab} onValueChange={setTab} items={[{ value: "overview", label: "Overview" }, { value: "analytics", label: "Analytics" }]} />
`,
  "breadcrumb": `import { Breadcrumb } from "@/components/breadcrumb";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: "Elements", href: "/elements" },
    { label: "Breadcrumb" },
  ]}
/>

// Slash separators, home icon, collapse long trails
<Breadcrumb separator="slash" showHomeIcon maxItems={3} items={items} />
`,
  "pagination": `import * as React from "react";
import { Pagination } from "@/components/pagination";

// Uncontrolled
<Pagination totalPages={20} defaultPage={5} onPageChange={(page) => console.log(page)} />

// Controlled, soft variant with labels
const [page, setPage] = React.useState(1);
<Pagination variant="soft" showLabels totalPages={12} page={page} onPageChange={setPage} />

// Compact "Page X of Y"
<Pagination variant="compact" totalPages={8} />
`,
  "stepper": `import * as React from "react";
import { Stepper } from "@/components/stepper";

// Controlled
const [step, setStep] = React.useState(1);
<Stepper
  currentStep={step}
  steps={[
    { label: "Account", description: "Create your login" },
    { label: "Profile", description: "Tell us about you" },
    { label: "Launch", description: "Review and go live" },
  ]}
/>

// Vertical, minimal, clickable
<Stepper orientation="vertical" variant="minimal" clickable defaultStep={2} />
`,
  "modal": `import * as React from "react";
import { Modal } from "@/components/modal";

const [open, setOpen] = React.useState(false);

<button onClick={() => setOpen(true)}>Delete project</button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This permanently removes the project and its data."
  footer={
    <>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>Delete</button>
    </>
  }
>
  This action cannot be undone.
</Modal>
`,
  "popover": `import { Popover } from "@/components/popover";

<Popover
  placement="bottom"
  content={
    <div>
      <strong>Share this page</strong>
      <p>Anyone with the link can view.</p>
      <button>Copy link</button>
    </div>
  }
>
  <button>Share</button>
</Popover>

// Hover trigger, aligned to the start
<Popover trigger="hover" align="start" content="More details here">
  <button>Hover me</button>
</Popover>
`,
  "drawer": `import * as React from "react";
import { Drawer } from "@/components/drawer";

const [open, setOpen] = React.useState(false);

<button onClick={() => setOpen(true)}>Open settings</button>

<Drawer
  open={open}
  onOpenChange={setOpen}
  side="right"
  title="Settings"
  description="Manage your workspace preferences."
  footer={<button onClick={() => setOpen(false)}>Done</button>}
>
  Drawer content goes here.
</Drawer>

// From the bottom, swipe down to dismiss
<Drawer side="bottom" open={open} onOpenChange={setOpen} title="Share" />
`,
  "avatar": `import { Avatar } from "@/components/avatar";

// Image with a name fallback
<Avatar src="/team/ada.jpg" name="Ada Lovelace" size="lg" status="online" pulse />

// Initials only, rounded, with a ring
<Avatar name="Grace Hopper" shape="rounded" ring />

// No name: person icon; clickable
<Avatar size="xl" onClick={() => console.log("open profile")} />
`,
  "avatar-group": `import { AvatarGroup } from "@/components/avatar-group";

<AvatarGroup
  max={4}
  users={[
    { name: "Ada Lovelace", src: "/team/ada.jpg" },
    { name: "Grace Hopper" },
    { name: "Alan Turing" },
    { name: "Katherine Johnson" },
    { name: "Margaret Hamilton" },
  ]}
  onOverflowClick={() => console.log("show everyone")}
/>
`,
  "divider": `import { Divider } from "@/components/divider";

// Plain line
<Divider />

// With a label, accent color, draw-in animation
<Divider label="or continue with" accent animated />

// Variants and a vertical divider
<Divider variant="dashed" />
<Divider variant="gradient" label="New" labelPosition="start" />
<div className="flex h-10 items-center"><span>Docs</span><Divider orientation="vertical" /><span>Blog</span></div>
`,
  "accordion": `import { Accordion } from "@/components/accordion";

<Accordion
  type="single"
  defaultValue={["install"]}
  items={[
    { value: "install", title: "How do I install it?", content: "Copy the source or use the CLI." },
    { value: "license", title: "What license is it?", content: "MIT for free components." },
  ]}
/>

// Multiple open, card variant, plus indicator
<Accordion type="multiple" variant="card" indicator="plus" items={faqItems} />
`,
  "card": `import { Card } from "@/components/card";

<Card
  media="/images/aurora.jpg"
  badge="New"
  title="Aurora Dashboard"
  description="A clean analytics template for SaaS teams."
  footer={<button>View details</button>}
  interactive
  spotlight
/>

// Horizontal, linking somewhere
<Card orientation="horizontal" variant="elevated" href="/blog/launch" title="Launch notes" description="What shipped this month." media="/images/launch.jpg" />
`,
  "kbd": `import { Kbd } from "@/components/kbd";

// Combos use "+"; "mod" becomes ⌘ on Mac and Ctrl elsewhere
<Kbd combo="mod+k" />
<Kbd combo="mod+shift+p" separator />

// Single keys and styles
<Kbd>Esc</Kbd>
<Kbd variant="flat" size="sm" combo="enter" />

// Animate the caps while the user really presses them
<Kbd combo="mod+k" listen />
`,
  "empty-state": `import { EmptyState } from "@/components/empty-state";

// Presets ship with icon + default copy
<EmptyState preset="search" />

// Custom copy and actions, in a dashed box
<EmptyState
  preset="folder"
  variant="dashed"
  title="No projects yet"
  description="Create your first project to see it here."
  action={<button>New project</button>}
  secondaryAction={<button>Import</button>}
/>
`,
  "tag-input": `import * as React from "react";
import { TagInput } from "@/components/tag-input";

// Uncontrolled
<TagInput label="Skills" placeholder="Add a skill..." defaultValue={["React", "Tailwind"]} />

// Controlled, with suggestions, limit and validation
const [tags, setTags] = React.useState<string[]>([]);
<TagInput
  value={tags}
  onValueChange={setTags}
  suggestions={["React", "Vue", "Svelte", "Astro"]}
  maxTags={5}
  validate={(t) => (t.length < 2 ? "Tags need at least 2 characters" : null)}
/>
`,
  "combobox": `import * as React from "react";
import { Combobox } from "@/components/combobox";

// Uncontrolled
<Combobox
  label="Framework"
  placeholder="Select a framework..."
  options={[
    { value: "react", label: "React", description: "UI library" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ]}
/>

// Controlled
const [value, setValue] = React.useState<string | null>("react");
<Combobox value={value} onValueChange={setValue} clearable />
`,
  "multi-select": `import * as React from "react";
import { MultiSelect } from "@/components/multi-select";

// Uncontrolled
<MultiSelect
  label="Teams"
  placeholder="Select teams..."
  defaultValue={["design"]}
  options={[
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "product", label: "Product" },
  ]}
/>

// Controlled with a limit
const [teams, setTeams] = React.useState<string[]>([]);
<MultiSelect value={teams} onValueChange={setTeams} maxSelected={3} />
`,
  "date-picker": `import * as React from "react";
import { DatePicker } from "@/components/date-picker";

// Uncontrolled
<DatePicker label="Due date" placeholder="Pick a date" />

// Controlled
const [date, setDate] = React.useState<Date | null>(new Date());
<DatePicker value={date} onValueChange={setDate} minDate={new Date()} />

// Range
const [range, setRange] = React.useState({});
<DatePicker mode="range" range={range} onRangeChange={setRange} />
`,
  "time-picker": `import * as React from "react";
import { TimePicker } from "@/components/time-picker";

// Uncontrolled
<TimePicker label="Meeting time" placeholder="Pick a time" />

// Controlled, 24-hour, 15-minute steps
const [time, setTime] = React.useState<string | null>("14:30");
<TimePicker value={time} onValueChange={setTime} hourCycle={24} minuteStep={15} />

// Business hours only
<TimePicker label="Pickup" minTime="09:00" maxTime="17:00" />
`,
  "phone-input": `import * as React from "react";
import { PhoneInput } from "@/components/phone-input";

// Uncontrolled, Türkiye by default
<PhoneInput label="Phone" defaultCountry="TR" preferredCountries={["TR", "US", "GB"]} />

// Controlled: value is E.164, meta says whether the length is valid
const [phone, setPhone] = React.useState("");
<PhoneInput value={phone} onValueChange={(value, { isValid }) => setPhone(value)} />

// Plain form post: a hidden input named "phone" carries "+905321234567"
<PhoneInput name="phone" countries={["TR", "DE", "NL"]} />
`,
  "credit-card-input": `import * as React from "react";
import { CreditCardInput, type CreditCardValue } from "@/components/credit-card-input";

// Uncontrolled
<CreditCardInput label="Card details" />

// Controlled, with the cardholder name; enable Pay once every part checks out
const [card, setCard] = React.useState<CreditCardValue | null>(null);
<CreditCardInput showName onValueChange={setCard} />
<button disabled={!card?.isComplete}>Pay</button>
`,
  "currency-input": `import * as React from "react";
import { CurrencyInput } from "@/components/currency-input";

// Uncontrolled
<CurrencyInput label="Budget" defaultValue={2500} />

// Controlled, euros with German separators (1.234,56)
const [amount, setAmount] = React.useState<number | null>(1234.56);
<CurrencyInput value={amount} onValueChange={(value) => setAmount(value)} defaultCurrency="EUR" locale="de-DE" />

// Fixed currency, whole lira only above 100
<CurrencyInput defaultCurrency="TRY" currencies={["TRY"]} locale="tr-TR" min={100} step={50} />
`,
  "form-field": `import * as React from "react";
import { FormField } from "@/components/form-field";

// Built-in input with validation
<FormField
  label="Email"
  required
  type="email"
  placeholder="you@company.com"
  validate={(v) => (/^\\S+@\\S+\\.\\S+$/.test(v) ? null : "Enter a valid email address")}
/>

// Async check with a success message
<FormField
  label="Username"
  successText="Username is available"
  validate={async (v) => ((await isTaken(v)) ? "That username is taken" : null)}
/>

// Wrap your own control; it gets id and aria props
<FormField label="Country" description="Used for tax and invoices">
  <select>{/* ... */}</select>
</FormField>
`,
  "rich-text-editor": `import * as React from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

// Uncontrolled
<RichTextEditor label="Description" placeholder="Describe the product…" />

// Controlled: keep the HTML, and the plain text for search or previews
const [html, setHtml] = React.useState("<p>Hello <strong>world</strong></p>");
<RichTextEditor value={html} onValueChange={(nextHtml, text) => setHtml(nextHtml)} maxLength={2000} />

// A smaller toolbar for comments
<RichTextEditor tools={["bold", "italic", "code", "link"]} minHeight={90} showCount={false} />
`,
  "signature-pad": `import * as React from "react";
import { SignaturePad, type SignatureResult } from "@/components/signature-pad";

const [signature, setSignature] = React.useState<SignatureResult | null>(null);

<SignaturePad label="Signature" onChange={setSignature} helperText="By signing you agree to the terms above" />
<button disabled={!signature || signature.isEmpty}>Submit</button>

// Send signature.dataUrl (PNG) or signature.svg to your server with the form
`,
  "image-cropper": `import * as React from "react";
import { ImageCropper, type CropResult } from "@/components/image-cropper";

// Cover photo with aspect presets
const [crop, setCrop] = React.useState<CropResult | null>(null);
<ImageCropper src="/photos/team.jpg" defaultAspect={16 / 9} onChange={setCrop} />
// crop.area is in the image's own pixels; crop.dataUrl is the cropped image

// Round avatar from a file the user picks
<ImageCropper shape="circle" label="Profile photo" maxOutputSize={512} onChange={(r) => uploadAvatar(r.dataUrl)} />
`,
  "input-otp": `import * as React from "react";
import { InputOTP } from "@/components/input-otp";

// Uncontrolled
<InputOTP label="Verification code" length={6} onComplete={(code) => verify(code)} />

// Grouped like 123-456, controlled
const [code, setCode] = React.useState("");
<InputOTP value={code} onValueChange={setCode} groupSize={3} />

// Error state
<InputOTP status="error" errorText="That code is incorrect" />
`,
  "number-input": `import * as React from "react";
import { NumberInput } from "@/components/number-input";

// Uncontrolled
<NumberInput label="Quantity" defaultValue={2} min={1} max={10} />

// Currency, controlled
const [price, setPrice] = React.useState<number | null>(1200);
<NumberInput value={price} onValueChange={setPrice} prefix="$" step={0.5} thousandSeparator />

// Stacked steppers with a unit
<NumberInput layout="stacked" suffix="kg" defaultValue={72} step={0.5} />
`,
  "password-input": `import * as React from "react";
import { PasswordInput } from "@/components/password-input";

// Uncontrolled
<PasswordInput label="Password" placeholder="Enter your password" />

// Controlled, longer minimum
const [pw, setPw] = React.useState("");
<PasswordInput value={pw} onValueChange={setPw} minLength={12} />

// Sign-in field: no strength meter or checklist
<PasswordInput
  label="Password"
  autoComplete="current-password"
  showStrength={false}
  showRequirements={false}
/>
`,
  "segmented-control": `import * as React from "react";
import { SegmentedControl } from "@/components/segmented-control";

// Uncontrolled
<SegmentedControl defaultValue="week" />

// Controlled with custom options
const [view, setView] = React.useState("list");
<SegmentedControl
  value={view}
  onValueChange={setView}
  options={[
    { value: "list", label: "List" },
    { value: "board", label: "Board" },
    { value: "calendar", label: "Calendar", disabled: true },
  ]}
/>

// Soft, full width
<SegmentedControl variant="soft" fullWidth size="lg" />
`,
  "color-picker": `import * as React from "react";
import { ColorPicker } from "@/components/color-picker";

// Uncontrolled
<ColorPicker label="Brand color" defaultValue="#F2A841" />

// Controlled, with opacity
const [color, setColor] = React.useState("#87FFE3");
<ColorPicker value={color} onValueChange={setColor} showAlpha />

// Custom presets
<ColorPicker presets={["#0A0A0A", "#F5F4F1", "#FF7A6B"]} />
`,
  "file-upload": `import { FileUpload } from "@/components/file-upload";

// Basic
<FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} onFilesChange={(files) => console.log(files)} />

// With a real upload function (progress reported 0-100)
<FileUpload
  maxFiles={4}
  upload={async (file, onProgress) => {
    await sendToServer(file, onProgress);
  }}
/>

// Single file
<FileUpload multiple={false} accept="image/png,image/jpeg" title="Upload an avatar" />
`,
  "callout": `import { Callout } from "@/components/callout";

// Basic
<Callout variant="info" title="Heads up">
  Your trial ends in 3 days. Upgrade to keep your projects.
</Callout>

// Dismissible with an action
<Callout
  variant="warning"
  appearance="bar"
  title="Storage almost full"
  dismissible
  action={{ label: "Manage storage", onClick: () => console.log("manage") }}
>
  You have used 92% of your 10 GB plan.
</Callout>

// Controlled
const [open, setOpen] = React.useState(true);
<Callout variant="danger" open={open} onOpenChange={setOpen} dismissible title="Payment failed" />
`,
  "meter": `import { Meter } from "@/components/meter";

// Bar with threshold zones (high usage is bad)
<Meter label="Disk usage" value={72} unit="%" low={50} high={80} goodDirection="down" />

// Semicircle gauge
<Meter variant="gauge" label="Health score" value={82} low={40} high={70} />

// Segments with a custom formatter
<Meter variant="segments" label="Battery" value={34} low={20} high={50} formatValue={(v) => Math.round(v) + " pct"} />
`,
  "command-palette": `import * as React from "react";
import { CommandPalette, DEFAULT_COMMANDS } from "@/components/command-palette";

// Global Cmd/Ctrl+K palette
<CommandPalette items={DEFAULT_COMMANDS} onSelectItem={(item) => console.log(item.id)} />

// Controlled, opened from a button
const [open, setOpen] = React.useState(false);
<button onClick={() => setOpen(true)}>Search...</button>
<CommandPalette open={open} onOpenChange={setOpen} items={myCommands} />
`,
  "menubar": `import * as React from "react";
import { Menubar, type MenubarMenu } from "@/components/menubar";

const menus: MenubarMenu[] = [
  {
    id: "file",
    label: "File",
    items: [
      { id: "new", kind: "item", label: "New file", shortcut: "\u2318N" },
      { id: "open", kind: "item", label: "Open...", shortcut: "\u2318O" },
      { id: "sep1", kind: "separator" },
      { id: "close", kind: "item", label: "Close", danger: true },
    ],
  },
  {
    id: "view",
    label: "View",
    items: [
      { id: "sidebar", kind: "checkbox", label: "Show sidebar", checked: true },
      { id: "minimap", kind: "checkbox", label: "Show minimap", checked: false },
    ],
  },
];

<Menubar menus={menus} onSelect={(menuId, item) => console.log(menuId, item.id)} />
`,
  "sidebar": `import * as React from "react";
import { Sidebar, type SidebarSection } from "@/components/sidebar";

const sections: SidebarSection[] = [
  {
    id: "main",
    items: [
      { id: "home", label: "Home", icon: <HomeIcon /> },
      { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 4 },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "projects", label: "Projects", icon: <FolderIcon /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon /> },
    ],
  },
];

// Uncontrolled
<Sidebar
  header="Acme"
  sections={sections}
  defaultActiveId="home"
  user={{ name: "Ada Lovelace", subtitle: "ada@acme.com" }}
/>

// Controlled collapse
const [collapsed, setCollapsed] = React.useState(false);
<Sidebar sections={sections} collapsed={collapsed} onCollapsedChange={setCollapsed} />
`,
  "dock": `import { Dock } from "@/components/dock";

<Dock
  items={[
    { id: "finder", label: "Finder", icon: <FinderIcon />, active: true },
    { id: "mail", label: "Mail", icon: <MailIcon /> },
    { id: "calendar", label: "Calendar", icon: <CalendarIcon /> },
    { id: "sep", kind: "separator" },
    { id: "trash", label: "Trash", icon: <TrashIcon /> },
  ]}
  onSelect={(item) => console.log(item.id)}
/>
`,
  "confirm-dialog": `import * as React from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Uncontrolled, destructive action
const [open, setOpen] = React.useState(false);
<button onClick={() => setOpen(true)}>Delete project</button>
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete this project?"
  description="This can't be undone. All files and history will be permanently removed."
  confirmLabel="Delete"
  onConfirm={() => deleteProject(id)}
/>

// Async confirm, the button spins until the promise settles
<ConfirmDialog
  variant="warning"
  title="Publish changes?"
  onConfirm={async () => {
    await api.publish();
  }}
/>
`,
  "hover-card": `import { HoverCard } from "@/components/hover-card";

<HoverCard
  content={
    <div className="flex gap-3">
      <div className="h-10 w-10 shrink-0 rounded-full bg-foreground/10" />
      <div>
        <p className="font-semibold">Ada Lovelace</p>
        <p className="text-sm text-foreground/60">Mathematician & writer. Wrote the first algorithm.</p>
      </div>
    </div>
  }
>
  <a href="#" className="underline">@ada</a>
</HoverCard>
`,
  "context-menu": `import { ContextMenu, type ContextMenuItem } from "@/components/context-menu";

const items: ContextMenuItem[] = [
  { id: "back", kind: "item", label: "Back", shortcut: "\u2318[" },
  { id: "reload", kind: "item", label: "Reload", shortcut: "\u2318R" },
  { id: "sep", kind: "separator" },
  { id: "inspect", kind: "item", label: "Inspect" },
  { id: "delete", kind: "item", label: "Delete", danger: true },
];

<ContextMenu items={items} onSelect={(item) => console.log(item.id)}>
  <div className="rounded-xl border border-dashed p-10 text-center">Right-click me</div>
</ContextMenu>
`,
  "timeline": `import { Timeline } from "@/components/timeline";

<Timeline
  items={[
    { id: "1", date: "Jan 2024", title: "Project kicked off", status: "done" },
    { id: "2", date: "Mar 2024", title: "Beta launched", description: "Invited 200 early users.", status: "done" },
    { id: "3", date: "Jun 2024", title: "Public launch", status: "active" },
    { id: "4", date: "Sep 2024", title: "v2.0", status: "pending" },
  ]}
/>

// Alternating layout, dashed line
<Timeline items={events} align="alternate" lineStyle="dashed" accentColor="#87FFE3" />
`,
  "tree-view": `import { TreeView, type TreeNode } from "@/components/tree-view";

const data: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "app.tsx" },
      { id: "utils", label: "utils.ts" },
    ],
  },
  { id: "readme", label: "README.md" },
];

// Single-select file explorer
<TreeView data={data} defaultExpandedIds={["src"]} />

// Multi-select with checkboxes
<TreeView data={data} checkable defaultCheckedIds={["app"]} onCheckedChange={(ids) => console.log(ids)} />
`,
  "stat-card": `import { StatCard } from "@/components/stat-card";

// Revenue: up is good
<StatCard label="Revenue" value={48200} prefix="$" previousValue={41500} deltaLabel="vs last month" />

// Error rate: up is bad
<StatCard label="Error rate" value={2.1} suffix="%" previousValue={1.4} goodDirection="down" />

// With a sparkline, hover or focus + arrow keys to scrub
<StatCard
  label="Active users"
  value={12480}
  previousValue={11020}
  sparkline={[9800, 10200, 10500, 11020, 11400, 12100, 12480]}
  sparklineStyle="smooth"
/>
`,
  "code-block": `import { CodeBlock } from "@/components/code-block";

<CodeBlock
  filename="button.tsx"
  language="tsx"
  code={\`export function Button({ label }: { label: string }) {
  return <button className="rounded-full px-4 py-2">{label}</button>;
}\`}
  highlightLines={[2]}
/>

// Long snippet, capped with a "Show more" toggle
<CodeBlock language="bash" maxHeight={160} code={installScript} />
`,
  "description-list": `import { DescriptionList } from "@/components/description-list";

<DescriptionList
  title="Order summary"
  layout="inline"
  items={[
    { id: "order", term: "Order ID", description: "ORD-48213", copyable: true },
    { id: "date", term: "Date", description: "Sep 24, 2026" },
    { id: "status", term: "Status", description: "Delivered" },
    { id: "total", term: "Total", description: "$248.00" },
  ]}
/>

// Specs in a 2-column grid
<DescriptionList layout="grid" columns={2} bordered={false} items={specs} />
`,
  "splitter": `import { Splitter } from "@/components/splitter";

<Splitter
  direction="horizontal"
  height={320}
  panels={[
    { id: "sidebar", content: <div className="p-4">Sidebar</div>, defaultSize: 25, minSize: 15, maxSize: 40 },
    { id: "main", content: <div className="p-4">Main content</div> },
  ]}
/>

// Controlled, three panels
const [sizes, setSizes] = React.useState([25, 50, 25]);
<Splitter
  sizes={sizes}
  onSizesChange={setSizes}
  panels={[
    { id: "a", content: <PanelA /> },
    { id: "b", content: <PanelB /> },
    { id: "c", content: <PanelC /> },
  ]}
/>
`,
  "back-to-top": `import { BackToTop } from "@/components/back-to-top";

// Tracks the window by default
<BackToTop />

// Inside a scrollable panel instead of the whole page
const scrollRef = React.useRef<HTMLDivElement>(null);
<div ref={scrollRef} className="relative h-[500px] overflow-y-auto">
  {/* long content */}
  <BackToTop containerRef={scrollRef} contained position="bottom-right" />
</div>
`,
  "copy-button": `import { CopyButton } from "@/components/copy-button";

// Icon-only, with a tooltip
<CopyButton value="npm install @acme/ui" />

// Labeled, outline variant
<CopyButton value="npm install @acme/ui" label="Copy install command" variant="outline" />

// Value resolved lazily
<CopyButton value={() => generateShareLink()} label="Copy link" variant="solid" />
`,
  "terminal": `import { Terminal } from "@/components/terminal";

<Terminal
  title="~/project"
  lines={[
    { id: "1", type: "command", text: "npm install @acme/ui" },
    { id: "2", type: "output", text: "added 12 packages in 1.2s" },
    { id: "3", type: "command", text: "npm run build" },
    { id: "4", type: "comment", text: "compiling..." },
    { id: "5", type: "output", text: "Build complete." },
  ]}
/>

// Plays once, shows a replay button when done
<Terminal loop={false} lines={deployScript} />
`,
  "inline-edit": `import { InlineEdit } from "@/components/inline-edit";

// Uncontrolled
<InlineEdit defaultValue="Q3 Roadmap" onSave={(value) => console.log("saved", value)} />

// Validated, async save
<InlineEdit
  defaultValue="ada@acme.com"
  validate={(v) => (v.includes("@") ? null : "Enter a valid email")}
  onSave={async (value) => {
    await api.updateEmail(value);
  }}
/>

// Multiline, pencil-only trigger
<InlineEdit multiline editOnClick={false} defaultValue="" emptyText="Add a description..." onSave={handleSave} />
`,
  "aspect-ratio": `import { AspectRatio } from "@/components/aspect-ratio";

// A 16:9 video thumbnail, the <img> is auto-filled and cropped
<AspectRatio preset="video">
  <img src="/thumbnail.jpg" alt="" />
</AspectRatio>

// Custom ratio, arbitrary content
<AspectRatio ratio={4 / 3} bordered>
  <iframe src="https://maps.example.com/embed" className="h-full w-full" />
</AspectRatio>

// Square avatar-style crop
<AspectRatio preset="square" radius={999} objectFit="cover">
  <img src="/avatar.jpg" alt="" />
</AspectRatio>

// Any content keeps the ratio too, e.g. a labelled placeholder
<AspectRatio ratio={21 / 9} bordered>
  <div className="flex h-full items-center justify-center text-2xl font-semibold">21:9</div>
</AspectRatio>
`,
  "scroll-area": `import { ScrollArea } from "@/components/scroll-area";

<ScrollArea height={320}>
  <div className="flex flex-col gap-3 p-4">
    {items.map((item) => (
      <div key={item.id}>{item.label}</div>
    ))}
  </div>
</ScrollArea>

// Horizontal filmstrip
<ScrollArea direction="horizontal" width={480}>
  <div className="flex gap-3 p-4">
    {images.map((src) => <img key={src} src={src} className="h-32 w-48 rounded-lg object-cover" />)}
  </div>
</ScrollArea>
`,
  "toolbar": `import { Toolbar, type ToolbarEntry } from "@/components/toolbar";

const items: ToolbarEntry[] = [
  { type: "toggle", id: "bold", label: "Bold", icon: "bold", shortcut: "⌘B" },
  { type: "toggle", id: "italic", label: "Italic", icon: "italic", shortcut: "⌘I" },
  { type: "separator" },
  { type: "toggle", id: "left", label: "Align left", icon: "alignLeft", group: "align" },
  { type: "toggle", id: "center", label: "Align center", icon: "alignCenter", group: "align" },
  { type: "separator" },
  { type: "button", id: "share", label: "Share", icon: "share", text: "Share", onClick: () => {} },
];

<Toolbar
  items={items}
  defaultValue={["left"]}
  onValueChange={(pressed) => console.log(pressed)}
/>

// Vertical, floating
<Toolbar items={items} orientation="vertical" variant="floating" />
`,
  "panel": `import { Panel } from "@/components/panel";

<Panel
  title="Notifications"
  description="Choose what you get alerted about."
  actions={<button>Reset</button>}
  footer={<button>Save changes</button>}
>
  <p>Panel body content goes here.</p>
</Panel>

// Collapsible, starts closed
<Panel title="Advanced" collapsible defaultCollapsed variant="filled">
  <p>Hidden until expanded.</p>
</Panel>

// Controlled
const [collapsed, setCollapsed] = useState(false);
<Panel title="Details" collapsible collapsed={collapsed} onCollapsedChange={setCollapsed}>
  …
</Panel>
`,
  "your-cart-page": `import { YourCartPage } from "@/components/your-cart-page";

<YourCartPage
  items={[
    { title: "Nova Headphones", variant: "Black / Medium", price: "$249.00", image: "/nova.webp" },
    { title: "Orbit Sneakers", variant: "White / 9 (US)", price: "$129.00", image: "/orbit.webp" },
  ]}
  shippingAmount={0}
  taxRate={0.08}
  promoCodes={["SAVE10"]}
  animation="blur" // "blur" | "slide" | "fade" | "scale"
  onPay={(order) => console.log(order.total, order.customer.email)}
  onContinueShopping={() => router.push("/shop")}
/>
`,
  "stat-feature": `import { StatFeature } from "@/components/stat-feature";

<StatFeature
  badge="INSIGHTS"
  title="Numbers That Tell the Real Story"
  description="Clear metrics that help you understand performance, growth and trust at a glance."
  rings={[
    { value: 88, color: "#3B82F6" },
    { value: 72, color: "#60A5FA" },
    { value: 55, color: "#93C5FD" },
    { value: 40, color: "#BFDBFE" },
  ]}
  trendText="Up 7.4% compared to last period"
  chartCaption="Growing steadily this quarter"
  chartSubcaption="Based on activity across the last 90 days"
  stats={[
    { number: "100", suffix: "%", label: "SEO ready out of the box" },
    { number: "620", suffix: "+", label: "Ready-to-use components" },
    { number: "42", suffix: "k+", label: "Builders who rely on us" },
  ]}
  animation="blur" // "blur" | "slide" | "fade" | "scale"
  theme="dark"
/>
`,
  "product-list": `import { ProductList } from "@/components/product-list";

<ProductList
  products={[
    { title: "Minimal Watch", price: "$79.00", compareAtPrice: "$129.00", category: "Accessories", tier: "premium", badge: "sale", image: "/watch.webp", url: "/products/minimal-watch" },
    { title: "Premium Notebook", price: "$24.00", category: "Books", tier: "free", badge: "new", image: "/notebook.webp", url: "/products/notebook" },
  ]}
  accentColor="#7CDE6A"
  onProductClick={(product) => console.log(product.title)}
/>
`,
  "product-detail": `import { ProductDetail } from "@/components/product-detail";

<ProductDetail
  breadcrumb={["Home", "Shop", "Accessories", "Minimal Watch"]}
  title="Minimal Watch"
  rating={5}
  reviewCount={124}
  price="$79.00"
  compareAtPrice="$129.00"
  description="A quiet, matte-black watch with a slim case and a soft leather strap."
  gallery={[
    { src: "/watch-1.webp", alt: "Minimal Watch, front" },
    { src: "/watch-2.webp", alt: "Dial close-up" },
    { src: "/watch-3.webp", alt: "Upper strap" },
    { src: "/watch-4.webp", alt: "Lower strap" },
  ]}
  colors={[
    { name: "Black", color: "#2a2a2a" },
    { name: "Silver", color: "#c8c8c8" },
  ]}
  sizes={["36mm", "38mm", "40mm", "42mm"]}
  defaultSizeIndex={2}
  specs={[
    { label: "Case", value: "Stainless steel, matte black" },
    { label: "Strap", value: "Vegetable-tanned leather" },
  ]}
  badge="Free shipping"
  onAddToCart={({ color, size, quantity }) => addToCart({ color, size, quantity })}
/>
`,
  "button": `import { Button } from "@/components/button";

<Button label="Get Started" onClick={() => console.log("clicked")} />

// Variants
<Button label="Secondary" variant="secondary" />
<Button label="Outline" variant="outline" />
<Button label="Ghost" variant="ghost" />

// Loading / disabled
<Button label="Saving..." loading />
<Button label="Unavailable" disabled />

// Custom accent, icon, full width
<Button
  label="Continue"
  accentColor="#10b981"
  ringColor="rgba(16,185,129,0.3)"
  icon={<ArrowRightIcon />}
  iconPosition="right"
  fullWidth
/>
`,
  "input": `import * as React from "react";
import { Input } from "@/components/input";

// Uncontrolled, with a label, helper text, and required marker
<Input
  label="Email address"
  placeholder="you@example.com"
  helperText="We'll never share your email"
  required
  onChange={(value) => console.log(value)}
/>

// Controlled
const [name, setName] = React.useState("");
<Input label="Full name" value={name} onChange={setName} />

// Password field, the show/hide toggle appears automatically
<Input label="Password" type="password" variant="filled" />

// Error state
<Input label="Username" defaultValue="taken_handle" errorText="This username is already taken" />

// Custom accent, underline variant
<Input label="Search" variant="underline" accentColor="#10b981" ringColor="rgba(16,185,129,0.3)" />
`,
  "textarea": `import * as React from "react";
import { Textarea } from "@/components/textarea";

// Uncontrolled, with a character counter
<Textarea
  label="Message"
  placeholder="Write your message..."
  helperText="Keep it under 200 characters"
  maxLength={200}
  showCounter
  onChange={(value) => console.log(value)}
/>

// Controlled
const [bio, setBio] = React.useState("");
<Textarea label="Bio" value={bio} onChange={setBio} />

// Grows to fit its content instead of scrolling
<Textarea label="Notes" variant="filled" autoResize />

// Error state
<Textarea label="Feedback" required errorText="Feedback is required" />
`,
  "alert-toast": `import { AlertToast } from "@/components/alert-toast";

// It fills its container's width, so wrap it in something with a max width
<div className="w-full max-w-sm">
  <AlertToast
    content={{ title: "Successfully uploaded!", layout: "inline" }}
    appearance={{ tone: "success", background: "tinted", icon: "success" }}
    dismiss={{ dismissible: true }}
  />
</div>

// Stacked layout with actions
<AlertToast
  content={{ title: "New update available", description: "A new version of the app is ready to install.", layout: "stacked" }}
  appearance={{ tone: "info", background: "tinted", accentBar: true, icon: "info", theme: "dark" }}
  actions={{ showPrimary: true, primaryLabel: "Update now", showSecondary: true, secondaryLabel: "Later" }}
  onPrimaryClick={() => console.log("update")}
  onDismiss={() => console.log("closed")}
/>

// Dismisses itself after 5 seconds
<AlertToast
  content={{ title: "Saved", layout: "inline" }}
  appearance={{ tone: "success", icon: "success" }}
  dismiss={{ autoDismiss: true, duration: 5 }}
/>
`,
  "ai-asistant": `import { AIAsistant } from "@/components/ai-asistant";

<div className="h-[280px] w-full">
  <AIAsistant theme="mesh" state="waiting" shape="square" size={200} />
</div>
`,
  "ai-voice-01": `import { AiVoice01 } from "@/components/ai-voice-01";

// Cycles idle → listening → speaking on its own (tap to start)
<div className="h-24 w-full max-w-[380px]">
  <AiVoice01 />
</div>

// Driven externally instead of the built-in demo flow
<AiVoice01 status="listening" interactive={false} autoFlow={false} />

// Brushed-metal "silver" theme
<AiVoice01 theme="silver" />

// Real microphone input instead of the simulated waveform
<AiVoice01 input="microphone" sensitivity={1.6} />
`,
  "ai-voice-05": `import { AiVoice05 } from "@/components/ai-voice-05";

// Cycles idle → listening → speaking on its own (tap to start)
<div className="h-40 w-full max-w-[420px]">
  <AiVoice05 />
</div>

// Driven externally instead of the built-in demo flow
<AiVoice05 status="listening" interactive={false} autoFlow={false} />

// Real microphone input instead of the simulated waveform
<AiVoice05 input="microphone" sensitivity={1.6} />
`,
  "ai-image-loader-03": `import { AiImageLoader03 } from "@/components/ai-image-loader-03";

// Generates for 5s, then a top-to-bottom sweep reveals the picture
<div className="aspect-[3/4] h-[420px]">
  <AiImageLoader03 />
</div>

// Your own result image, and a caption line for the "done" state
<AiImageLoader03 image={{ src: "/my-image.jpg", alt: "A generated portrait" }} doneText="Portrait ready" />

// Keeps generating forever, useful for a hero/marketing loop
<AiImageLoader03 showResult={false} />

// Replays the generate-and-reveal cycle on its own
<AiImageLoader03 loop loopDelay={3} />
`,
  "ai-dynamic-island-01": `import { AIDynamicIsland01 } from "@/components/ai-dynamic-island-01";

// Plays the whole idle → listening → thinking → working → done story on its own
<div className="h-24 w-full max-w-sm">
  <AIDynamicIsland01 />
</div>

// A fixed status pinned in place, not auto-playing
<AIDynamicIsland01 status="working" steps={["Reading the ticket", "Drafting a fix", "Running tests"]} />

// Not tappable, a picture that only plays the story
<AIDynamicIsland01 interactive={false} />

// Custom copy and a "View" button once it's done
<AIDynamicIsland01 doneText="Answer ready" viewLabel="View answer" onView={() => console.log("view")} />
`,
  "ai-answer-03": `import { AiAnswer03 } from "@/components/ai-answer-03";

// Researches through a step tracker, then streams a markdown-style answer
<div className="h-[560px] w-full max-w-lg">
  <AiAnswer03 />
</div>

// The sunset accent instead of the default custom colors
<AiAnswer03 theme="sunset" />

// Your own steps, answer (- bullets, **bold**, [1] citations) and sources
<AiAnswer03
  steps={["Reading the codebase", "Checking the docs", "Writing"]}
  answer={"Ship small, **reversible** changes.\\n- Guard risky code behind a flag [1]."}
  sources={[{ title: "Feature flags 101", domain: "launchdarkly.com" }]}
/>

// Follow-up chips that call back into your own chat flow
<AiAnswer03 onFollowUp={() => console.log("follow up clicked")} />
`,
  "ai-edit-review": `import { AIEditReview } from "@/components/ai-edit-review";

// Auto-plays writing -> review -> applied on a loop
<div className="h-[340px] w-full max-w-md">
  <AIEditReview />
</div>

// Your own passage and edit options
<AIEditReview
  selected="We made a new dashboard that is really fast."
  actions={[
    { label: "Improve", result: "Our new dashboard is built for speed." },
    { label: "Shorten", result: "A fast new dashboard." },
  ]}
  onAccept={() => console.log("accepted")}
  onReject={() => console.log("rejected")}
/>

// Pin one state instead of auto-playing, e.g. to drive it from your own AI call
<AIEditReview status="review" interactive={false} />
`,
  "airbnb-reviews": `import { AirbnbReviews } from "@/components/airbnb-reviews";

<AirbnbReviews
  badgeTitle="Airbnb Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "The place was even better than the photos. Spotless, well stocked, and the host checked in at just the right moments." },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Loved the location, walkable to everything we wanted to see. Check-in was seamless." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Cozy, clean and exactly as described. Would absolutely stay here again." },
  ]}
/>
`,
  "ebay-reviews": `import { EbayReviews } from "@/components/ebay-reviews";

<EbayReviews
  badgeTitle="eBay Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "Item arrived exactly as described and much faster than expected." },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Packaging is careful, shipping is fast, matches the listing photos." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Much better than I expected. Great condition and reasonable price." },
  ]}
/>
`,
  "eternal-glow-card": `import { EternalGlowCard } from "@/components/eternal-glow-card";

<div className="h-[480px] w-[640px]">
  <EternalGlowCard
    image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
    title="Eternal Glow"
    price="$48.00"
    buttonText="Shop the Glow"
    theme="dark"
  />
</div>
`,
  "etsy-reviews": `import { EtsyReviews } from "@/components/etsy-reviews";

<EtsyReviews
  badgeTitle="Etsy Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "Beautiful piece, exactly as pictured! Highly recommend this shop!" },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Quality is consistently excellent and every order feels handmade." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Much better than I expected. Great craftsmanship." },
  ]}
/>
`,
  "expand-card-grid": `import { ExpandCardGrid } from "@/components/expand-card-grid";

<div className="h-[600px] w-full">
  <ExpandCardGrid
    items={[
      { title: "Mountains", description: "High-altitude trails and quiet ridgelines.", buttonText: "Explore Now" },
      { title: "Forest", description: "Dense canopy, moss, and filtered light.", buttonText: "Explore Now" },
      { title: "Coast", description: "Tide pools and salt air at dawn.", buttonText: "Explore Now" },
      { title: "Desert", description: "Wide horizons and shifting dunes.", buttonText: "Explore Now" },
    ]}
  />
</div>
`,
  "footer-premium": `import { FooterPremium } from "@/components/footer-premium";

<FooterPremium logoLabel="Loca" description="Premium, shadcn-compatible components for your next project." />
`,
  "footer-section": `import { FooterSection } from "@/components/footer-section";

<FooterSection theme="dark" />
`,
  "gallery-flow": `import { GalleryFlow } from "@/components/gallery-flow";

<div className="h-[500px] w-full">
  <GalleryFlow />
</div>
`,
  "glare-card": `import { GlareCard } from "@/components/glare-card";

<div className="h-[420px] w-[320px]">
  <GlareCard />
</div>
`,
  "glass-navigation": `import { GlassNavigation } from "@/components/glass-navigation";

<GlassNavigation />
`,
  "glide-carousel": `import { GlideCarousel } from "@/components/glide-carousel";

<div className="h-[520px] w-full">
  <GlideCarousel />
</div>
`,
  "glow-card": `import { GlowCard } from "@/components/glow-card";

<div className="h-[280px] w-[320px]">
  <GlowCard />
</div>
`,
  "glow-jump-widget": `import { GlowJumpWidget } from "@/components/glow-jump-widget";

// Renders directly on the page (default)
<GlowJumpWidget />

// As a floating popup instead, bottom-right by default
<GlowJumpWidget asPopup position="bottom-right" />
`,
  "header-simple": `import { HeaderSimple } from "@/components/header-simple";

<HeaderSimple
  logoText="Acme"
  navItems={[
    { label: "Product", url: "#" },
    { label: "Pricing", url: "#" },
    { label: "Docs", url: "#" },
  ]}
/>
`,
  "image-deck-3d": `import { ImageDeck3D } from "@/components/image-deck-3d";

<div className="h-[420px] w-[420px]">
  <ImageDeck3D
    image="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
    enable3D
  />
</div>
`,
  "image-showcase": `import { ImageShowcase } from "@/components/image-showcase";

<ImageShowcase
  images={[
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80", alt: "Sneaker detail" },
    { src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80", alt: "Sneaker side" },
    { src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80", alt: "Sneaker sole" },
  ]}
/>
`,
  "instagram-post-mockup": `import { InstagramPostMockup } from "@/components/instagram-post-mockup";

<div className="max-w-[420px]">
  <InstagramPostMockup
    media={[
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80",
    ]}
  />
</div>
`,
  "line-chart": `import { LineChart } from "@/components/line-chart";

<LineChart theme="dark" title="Release-room health index" chartHeight={380} />
`,
  "linkedin-post-mockup": `import { LinkedInPostMockup } from "@/components/linkedin-post-mockup";

<div className="w-full max-w-md">
  <LinkedInPostMockup />
</div>
`,
  "liquid-text": `import { LiquidText } from "@/components/liquid-text";

<div className="h-[420px] w-full">
  <LiquidText text="Liquid" preset="liquid" />
</div>
`,
  "memory-cards-widget": `import { MemoryCardsWidget } from "@/components/memory-cards-widget";

<MemoryCardsWidget defaultOpen />
`,
  "memory-match-game": `import { MemoryMatchGame } from "@/components/memory-match-game";

<div className="w-full max-w-[420px]">
  <MemoryMatchGame theme="gold" />
</div>
`,
  "messenger-widget": `import { MessengerWidget } from "@/components/messenger-widget";

<MessengerWidget pageId="yourpagename" fixed={false} />
`,
  "minesweeper-game": `import { MinesweeperGame } from "@/components/minesweeper-game";

<div className="w-full max-w-[420px]">
  <MinesweeperGame theme="gold" />
</div>
`,
  "motion-gallery-grid": `import { MotionGalleryGrid } from "@/components/motion-gallery-grid";

<div className="h-[640px] w-full">
  <MotionGalleryGrid />
</div>
`,
  "noise-background": `import { NoiseBackground } from "@/components/noise-background";

<div className="h-[420px] w-full">
  <NoiseBackground />
</div>
`,
  "phone-mockup": `import { PhoneMockup } from "@/components/phone-mockup";

<div className="h-[700px] w-full">
  <PhoneMockup />
</div>
`,
  "pie-chart": `import { PieChart } from "@/components/pie-chart";

<PieChart theme="dark" title="ARR by plan tier" chartHeight={280} />
`,
  "pong-game": `import { PongGame } from "@/components/pong-game";

<div className="w-full max-w-[420px]">
  <PongGame theme="tournament" />
</div>
`,
  "product-grid-section": `import { ProductGridSection } from "@/components/product-grid-section";

<div className="w-full">
  <ProductGridSection />
</div>
`,
  "qr-code-widget": `import { QrCodeWidget } from "@/components/qr-code-widget";

<QrCodeWidget />
`,
  "radar-chart": `import { RadarChart } from "@/components/radar-chart";

<RadarChart theme="dark" title="Security posture comparison" chartHeight={320} />
`,
  "range-area-chart": `import { RangeAreaChart } from "@/components/range-area-chart";

<RangeAreaChart theme="dark" title="Latency envelope" chartHeight={320} />
`,
  "review-card-portrait": `import { ReviewCardPortrait } from "@/components/review-card-portrait";

<div className="h-[520px] w-[380px]">
  <ReviewCardPortrait />
</div>
`,
  "sales-ticket-popup": `import { SalesTicketPopup } from "@/components/sales-ticket-popup";

<div className="flex h-[420px] w-full items-center justify-center">
  <SalesTicketPopup fixed={false} />
</div>
`,
  "scratch-card-popup": `import { ScratchCardPopup } from "@/components/scratch-card-popup";

<div className="flex h-[560px] w-full items-center justify-center">
  <ScratchCardPopup />
</div>
`,
  "snake-game": `import { SnakeGame } from "@/components/snake-game";

<div className="w-full max-w-[360px]">
  <SnakeGame theme="violet" />
</div>
`,
  "space-invaders-game": `import { SpaceInvadersGame } from "@/components/space-invaders-game";

<div className="w-full">
  <SpaceInvadersGame lightMode />
</div>
`,
  "spin-to-win-wheel": `import { SpinToWinWheel } from "@/components/spin-to-win-wheel";

<div className="w-full max-w-[420px]">
  <SpinToWinWheel theme="campaign" freeSpins={3} />
</div>

// As a corner popup instead
<SpinToWinWheel asPopup trigger="delay" delaySeconds={5} />
`,
  "tearable-reveal": `import { TearableReveal } from "@/components/tearable-reveal";

<div className="h-[500px] w-full">
  <TearableReveal backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80" />
</div>
`,
  "telegram-widget": `import { TelegramWidget } from "@/components/telegram-widget";

<div className="relative h-[500px] w-full">
  <TelegramWidget username="yourusername" fixed={false} />
</div>
`,
  "testimonial-logos": `import { TestimonialLogos } from "@/components/testimonial-logos";

<TestimonialLogos />
`,
  "testimonial-pills": `import { TestimonialPills } from "@/components/testimonial-pills";

<TestimonialPills rowCount={3} />
`,
  "testimonial-spotlight": `import { TestimonialSpotlight } from "@/components/testimonial-spotlight";

<div className="h-[500px] w-full">
  <TestimonialSpotlight />
</div>
`,
  "tic-tac-toe-game": `import { TicTacToeGame } from "@/components/tic-tac-toe-game";

<div className="w-full max-w-[420px]">
  <TicTacToeGame />
</div>
`,
  "tiktok-post-mockup": `import { TikTokPostMockup } from "@/components/tiktok-post-mockup";

<div className="mx-auto h-[500px] max-w-[280px]">
  <TikTokPostMockup />
</div>
`,
  "tilted-carousel": `import { TiltedCarousel } from "@/components/tilted-carousel";

<div className="h-[420px] w-full">
  <TiltedCarousel />
</div>
`,
  "tilt-text": `import { TiltText } from "@/components/tilt-text";

<div className="h-[400px] w-full bg-[#0a0a0a]">
  <TiltText text="WOAH THERE" tiltStrength={60} scaleOnHover />
</div>
`,
  "countdown-timer": `import { CountdownTimer } from "@/components/countdown-timer";

<CountdownTimer
  endDate="2027-12-31T23:59:00"
  showDays
  showHours
  showSeconds
  cellShape="rounded"
  align="center"
/>
`,
  "rating-stars": `import { RatingStars } from "@/components/rating-stars";

<RatingStars
  defaultValue={4}
  maxStars={5}
  allowHalf
  showLabel
  labelStyle="fraction"
  onRatingChange={(value) => console.log(value)}
/>
`,
  "text-scramble-pro": `import { TextScramblePro } from "@/components/text-scramble-pro";

<div className="h-[240px] w-full">
  <TextScramblePro
    phrases={["The future is already here", "Reality is just a rendering", "Every detail has a purpose"]}
    revealMode="left-to-right"
    fontColor="#ffffff"
  />
</div>
`,
  "profile-flip-card": `import { ProfileFlipCard } from "@/components/profile-flip-card";

<div className="h-[420px] w-[340px]">
  <ProfileFlipCard
    src="/images/zara-osei.jpg"
    name="Zara Osei"
    role="Creative Director"
    bio="Design is like a perfect strike, you only get one shot to make an impression."
    tag="Design"
    flipOnHover
  />
</div>
`,
  "video-glow-lightbox": `import { VideoGlowLightbox } from "@/components/video-glow-lightbox";

<div className="h-[400px] w-full max-w-lg">
  <VideoGlowLightbox
    videoType="url"
    videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    thumbnailImage="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80"
    glowColor="#3633FF"
  />
</div>
`,
  "progress-circle-bars": `import { ProgressCircleBars } from "@/components/progress-circle-bars";

<ProgressCircleBars sizePreset="xl" percentage={75} label="Storage Used" />
`,
  "linear-progress-bars": `import { LinearProgressBars } from "@/components/linear-progress-bars";

// The card fills its container's width, so wrap it in something with a max width
<div className="w-full max-w-sm">
  <LinearProgressBars
    rows={[
      { kind: "ratio", label: "Progress A", value: 368, maxValue: 500, colorStart: "#34d399", colorEnd: "#10b981", height: 9 },
      { kind: "bar", label: "brand-assets.zip", labelRight: "67%", pct: 67, colorStart: "#6366f1", colorEnd: "#8b5cf6", height: 8, capStyle: "glow", shimmer: true },
    ]}
  />
</div>

// Just one bar, no card: drop the background, shadow and padding
<LinearProgressBars
  cardBg="transparent"
  cardShadow="none"
  cardPaddingX={0}
  cardPaddingY={0}
  rows={[{ kind: "bar", label: "Uploading", labelRight: "42%", pct: 42, colorStart: "#3b82f6", colorEnd: "#06b6d4", height: 10, capStyle: "dot" }]}
/>

// Dark theme, and start filling as soon as it mounts instead of on scroll
<LinearProgressBars
  theme="dark"
  cardBg="#141414"
  cardBorderWidth={1}
  cardBorderColor="#2a2a2a"
  scrollReveal={false}
/>

// A bar with an icon, subtitle and milestone ticks (icon: spinner, check, x or close)
<LinearProgressBars
  rows={[
    {
      kind: "bar",
      label: "quarterly-report.pdf",
      labelRight: "100%",
      pct: 100,
      colorStart: "#10b981",
      colorEnd: "#10b981",
      icon: "check",
      subtitle: "12.8 MB · Saved to Cloud Storage",
      milestones: 4,
    },
  ]}
/>
`,
  "cosmic-background": `import { CosmicBackground } from "@/components/cosmic-background";

<div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
  <CosmicBackground backgroundColor="#050c1a" />
</div>
`,
  "cylinder-gallery": `import { CylinderGallery } from "@/components/cylinder-gallery";

<div className="w-full overflow-hidden rounded-2xl bg-[#0a0a0a] p-10">
  <CylinderGallery />
</div>
`,
  "data-table": `import { DataTable } from "@/components/data-table";

<div className="h-[460px] w-full">
  <DataTable />
</div>
`,
  "desktop-mockup-carousel": `import { DesktopMockupCarousel } from "@/components/desktop-mockup-carousel";

<div className="h-[560px] w-full overflow-hidden rounded-2xl bg-[#050505]">
  <DesktopMockupCarousel
    image1="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80"
    image2="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1600&q=80"
    mediaOrder={["I1", "I2"]}
    frameColor="Silver"
    ambientGlow
  />
</div>
`,
  "diagonal-carousel": `import { DiagonalCarousel } from "@/components/diagonal-carousel";

<div className="h-[560px] w-full overflow-hidden rounded-2xl">
  <DiagonalCarousel theme="glass" titleAlign="center" initialIndex={2} />
</div>
`,
  "dice-discount-popup": `import { DiceDiscountPopup } from "@/components/dice-discount-popup";

<div className="h-[560px] w-full overflow-hidden rounded-2xl">
  <DiceDiscountPopup theme="campaign" accentColor="#facc15" />
</div>
`,
  "dice-roll-discount-popup": `import { DiceRollDiscountPopup } from "@/components/dice-roll-discount-popup";

<div className="h-[560px] w-full overflow-hidden rounded-2xl">
  <DiceRollDiscountPopup theme="saas" accentColor="#818cf8" />
</div>
`,
  "dino-runner-game": `import { DinoRunnerGame } from "@/components/dino-runner-game";

<div className="w-full overflow-hidden rounded-2xl border">
  <DinoRunnerGame />
</div>
`,
  "discord-chat-widget": `import { DiscordChatWidget } from "@/components/discord-chat-widget";

<div className="relative h-[560px] w-full overflow-hidden rounded-2xl bg-[#0b0d12]">
  <DiscordChatWidget inviteCode="reactframe" fixed={false} position="bottom-right" />
</div>
`,
  "dot-image-slider": `import { DotImageSlider } from "@/components/dot-image-slider";

<div className="h-[500px] w-full overflow-hidden rounded-2xl">
  <DotImageSlider />
</div>
`,
  "compare-slider": `import { CompareSlider } from "@/components/compare-slider";

<div className="h-[420px] w-full">
  <CompareSlider
    beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    afterImage="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80"
  />
</div>
`,
  "coin-flip-game": `import { CoinFlipGame } from "@/components/coin-flip-game";

<div className="h-[600px] w-full overflow-hidden rounded-2xl border">
  <CoinFlipGame theme="gold" />
</div>
`,
  "cinematic-stacked-gallery": `import { CinematicStackedGallery } from "@/components/cinematic-stacked-gallery";

<div className="h-[600px] w-full overflow-hidden rounded-2xl">
  <CinematicStackedGallery ctaLabel="View Collection" />
</div>
`,
  "infinite-marquee": `import { InfiniteMarquee } from "@/components/infinite-marquee";

<InfiniteMarquee text="Welcome to Framer" separator="✦" fontSize={32} />
`,
  "toggle-pro": `import * as React from "react";
import { TogglePro } from "@/components/toggle-pro";

// Uncontrolled, with a label and helper text
<TogglePro label="Enable notifications" helperText="Get notified about important updates" />

// Controlled, label on the left
const [on, setOn] = React.useState(true);
<TogglePro checked={on} onCheckedChange={setOn} label="Auto-save" labelPosition="left" />

// Bigger, custom colours (the label and helper text scale with the height)
<TogglePro
  defaultChecked
  height={44}
  width={76}
  padding={5}
  trackOnColor="#7c3aed"
  trackOffColor="#d1d5db"
  ringColor="rgba(124,58,237,0.3)"
  label="Dark mode"
/>
`,
  "logo-marquee": `import { LogoMarquee } from "@/components/logo-marquee";

<div className="h-[120px] w-full">
  <LogoMarquee />
</div>
`,
  "error-404-page-section": `import { Error404PageSection } from "@/components/error-404-page-section";

// app/not-found.tsx
export default function NotFound() {
  return (
    <Error404PageSection
      heading="Page not found"
      description="The page you're looking for doesn't exist or may have been moved."
      buttonLabel="Back to home"
      buttonHref="/"
      secondaryLabel="Browse components"
      secondaryHref="/components"
      className="min-h-[70vh]"
    />
  );
}
`,
};
