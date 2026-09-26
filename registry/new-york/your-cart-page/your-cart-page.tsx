"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type YourCartAnimation = "blur" | "slide" | "fade" | "scale";
export type YourCartStep = 1 | 2 | 3;

export interface YourCartItem {
  title: string;
  variant?: string;
  /** Unit price as text, e.g. "$249.00". Only the digits are used for the totals. */
  price: string;
  image?: string;
}

export interface YourCartFormValues {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  region: string;
  zip: string;
  card: string;
  exp: string;
  cvc: string;
}

export interface YourCartOrder {
  items: { title: string; variant?: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  orderNumber: string;
  customer: YourCartFormValues;
}

export interface YourCartPageProps {
  items: YourCartItem[];
  heading?: string;
  checkoutLabel?: string;
  payLabel?: string;
  confirmTitle?: string;
  confirmBody?: string;
  orderNumber?: string;
  /** Flat shipping cost in the currency of the prices. 0 shows "Free" at checkout. */
  shippingAmount?: number;
  /** 0.08 = 8%. */
  taxRate?: number;
  currency?: string;
  /** Promo codes that take 10% off, compared case-insensitively. */
  promoCodes?: string[];
  defaultValues?: Partial<YourCartFormValues>;
  defaultStep?: YourCartStep;
  animation?: YourCartAnimation;
  animationDuration?: number;
  onPay?: (order: YourCartOrder) => void;
  onViewOrder?: () => void;
  onContinueShopping?: () => void;
  theme?: "dark" | "light";
  accentColor?: string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0A0A0A", title: "#FFFFFF", muted: "rgba(255,255,255,0.45)", line: "rgba(255,255,255,0.12)", thumb: "#1A1A1A", input: "rgba(255,255,255,0.04)", buttonBg: "#FFFFFF", buttonText: "#111111", track: "rgba(255,255,255,0.12)" },
  light: { bg: "#FFFFFF", title: "#111111", muted: "rgba(0,0,0,0.45)", line: "rgba(0,0,0,0.1)", thumb: "#ECECEC", input: "rgba(0,0,0,0.03)", buttonBg: "#111111", buttonText: "#FFFFFF", track: "rgba(0,0,0,0.12)" },
};

type Palette = (typeof PALETTES)["dark"];

const EMPTY_FORM: YourCartFormValues = { email: "", phone: "", fullName: "", address: "", city: "", region: "", zip: "", card: "", exp: "", cvc: "" };

const parsePrice = (value: string) => {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function stepVariants(type: YourCartAnimation): { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition } {
  switch (type) {
    case "slide":
      return { initial: { opacity: 0, y: 48 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -28 } };
    case "fade":
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    case "scale":
      return { initial: { opacity: 0, scale: 0.75 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.92 } };
    default:
      return { initial: { opacity: 0, y: 40, filter: "blur(12px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, exit: { opacity: 0, y: -16, filter: "blur(8px)" } };
  }
}

function Thumb({ src, alt, size, radius, p }: { src?: string; alt: string; size: number; radius: number; p: Palette }) {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: size, height: size, borderRadius: radius, background: p.thumb }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={alt} className="block size-full object-cover" />}
    </div>
  );
}

function Field({ label, value, onChange, p, ring, type = "text", autoComplete, inputMode, name, placeholder }: { label: string; value: string; onChange: (v: string) => void; p: Palette; ring: React.CSSProperties; type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; name?: string; placeholder?: string }) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-[7px] block text-[13.5px] leading-[1.3]" style={{ color: p.muted }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        name={name}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className="box-border w-full rounded-xl px-3.5 py-[11px] text-[15px] leading-[1.3] font-medium outline-none focus:ring-2"
        style={{ border: `1px solid ${p.line}`, background: p.input, color: p.title, ...ring }}
      />
    </label>
  );
}

export function YourCartPage({
  items,
  heading = "Your Cart",
  checkoutLabel = "Checkout",
  payLabel = "Pay Now",
  confirmTitle = "Order Confirmed",
  confirmBody = "Your order has been placed successfully.",
  orderNumber = "#ORD-48291",
  shippingAmount = 0,
  taxRate = 0.08,
  currency = "$",
  promoCodes = ["SAVE10"],
  defaultValues,
  defaultStep = 1,
  animation = "blur",
  animationDuration = 0.7,
  onPay,
  onViewOrder,
  onContinueShopping,
  theme = "dark",
  accentColor = "#7CDE6A",
  className,
}: YourCartPageProps) {
  const p = PALETTES[theme];
  const reduce = useReducedMotion() ?? false;
  const [step, setStep] = React.useState<YourCartStep>(defaultStep);
  const [quantities, setQuantities] = React.useState<number[]>(() => items.map(() => 1));
  const [promo, setPromo] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState(false);
  const [form, setForm] = React.useState<YourCartFormValues>({ ...EMPTY_FORM, ...defaultValues });

  const money = (n: number) => `${currency} ${n.toFixed(2)}`;
  const setField = (key: keyof YourCartFormValues) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const ring = { ["--tw-ring-color" as string]: accentColor };
  const focus = "outline-none focus-visible:ring-2";

  const rows = items.map((item, index) => ({ ...item, index, quantity: quantities[index] ?? 0, unit: parsePrice(item.price) })).filter((row) => row.quantity > 0);
  const subtotal = rows.reduce((sum, row) => sum + row.unit * row.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * taxRate;
  const total = taxable + shippingAmount + tax;

  const changeQty = (index: number, next: number) => setQuantities((q) => q.map((v, i) => (i === index ? Math.max(0, Math.min(99, next)) : v)));
  const applyPromo = () => setPromoApplied(promoCodes.some((code) => code.toUpperCase() === promo.trim().toUpperCase()));

  const pay = () => {
    onPay?.({
      items: rows.map((row) => ({ title: row.title, variant: row.variant, quantity: row.quantity, unitPrice: row.unit })),
      subtotal,
      discount,
      shipping: shippingAmount,
      tax,
      total,
      orderNumber,
      customer: form,
    });
    setStep(3);
  };

  const variants = stepVariants(animation);
  const transition = reduce ? { duration: 0 } : { duration: animationDuration, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section aria-label={heading} className={cn("@container w-full", className)} style={{ background: p.bg, color: p.title, fontFamily: "Inter, sans-serif" }}>
      <div className="mx-auto max-w-[1164px] px-[18px] pt-5 pb-10 @[920px]:px-[22px] @[920px]:pt-[9px] @[920px]:pb-12">
        <div className="mb-[22px] flex items-center justify-end gap-3">
          <span aria-live="polite" className="text-[13.5px] leading-[1.3]" style={{ color: p.muted }}>Step {step} of 3</span>
          <div role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label="Checkout progress" className="h-2 w-[148px] overflow-hidden rounded-full" style={{ background: p.track }}>
            <motion.div initial={false} animate={{ width: `${(step / 3) * 100}%` }} transition={transition} className="h-full rounded-full" style={{ background: accentColor }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={reduce ? false : variants.initial} animate={variants.animate} exit={reduce ? undefined : variants.exit} transition={transition}>
            {step === 1 && (
              <div>
                <h1 className="m-0 mb-4 text-[38px] leading-[1.1] font-bold tracking-[-0.04em]">{heading}</h1>
                <div className="grid grid-cols-1 items-start gap-[18px] @[920px]:grid-cols-[minmax(0,1.35fr)_320px]">
                  <ul aria-label="Cart items" className="m-0 list-none overflow-hidden rounded-2xl p-0" style={{ border: `1px solid ${p.line}` }}>
                    {rows.length === 0 && <li className="p-6 text-[14px]" style={{ color: p.muted }}>Your cart is empty. Add products to continue checkout.</li>}
                    {rows.map((row, i) => (
                      <li key={`${row.title}-${row.index}`} className="grid grid-cols-[56px_1fr] items-center gap-3.5 p-4 @[920px]:grid-cols-[64px_minmax(0,1fr)_auto_auto_auto]" style={{ borderBottom: i === rows.length - 1 ? "none" : `1px solid ${p.line}` }}>
                        <Thumb src={row.image} alt={row.title} size={64} radius={12} p={p} />
                        <div className="min-w-0">
                          <div className="text-[16px] leading-[1.2] font-medium">{row.title}</div>
                          {row.variant && <div className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>{row.variant}</div>}
                        </div>
                        <div className="col-span-2 flex items-center justify-between gap-3 @[920px]:contents">
                          <div role="group" aria-label={`Quantity for ${row.title}`} className="inline-flex items-center rounded-full" style={{ border: `1px solid ${p.line}` }}>
                            <button type="button" aria-label={`Decrease quantity of ${row.title}`} onClick={() => changeQty(row.index, row.quantity - 1)} className={cn("size-8 cursor-pointer rounded-full border-none bg-transparent", focus)} style={{ color: p.title, ...ring }}>&minus;</button>
                            <span aria-live="polite" className="min-w-4 text-center text-[14px] leading-8 font-medium">{row.quantity}</span>
                            <button type="button" aria-label={`Increase quantity of ${row.title}`} onClick={() => changeQty(row.index, row.quantity + 1)} className={cn("size-8 cursor-pointer rounded-full border-none bg-transparent", focus)} style={{ color: p.title, ...ring }}>+</button>
                          </div>
                          <div className="text-right text-[15px] leading-[1.3] font-medium @[920px]:text-left">{money(row.unit * row.quantity)}</div>
                          <button type="button" aria-label={`Remove ${row.title} from cart`} onClick={() => changeQty(row.index, 0)} className={cn("size-9 cursor-pointer rounded-[10px] bg-transparent", focus)} style={{ border: `1px solid ${p.line}`, color: p.muted, ...ring }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mx-auto">
                              <path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9L3 12l6-7z" />
                              <path d="M12.5 9.5l5 5M17.5 9.5l-5 5" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <aside aria-label="Order totals" className="rounded-2xl p-[18px]" style={{ border: `1px solid ${p.line}` }}>
                    {([["Subtotal", money(subtotal)], ["Shipping", money(shippingAmount)], ...(promoApplied ? [["Discount (10%)", `− ${money(discount)}`]] : []), ["Tax", money(tax)]] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="mb-2.5 flex justify-between">
                        <span className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>{label}</span>
                        <span className="text-[15px] leading-[1.2] font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="my-[10.5px] h-px" style={{ background: p.line }} />
                    <div className="mb-[14.5px] flex justify-between text-[26px] leading-[1.2] font-bold tracking-[-0.03em]">
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <input
                        value={promo}
                        onChange={(e) => {
                          setPromo(e.target.value);
                          setPromoApplied(false);
                        }}
                        placeholder="Promo code"
                        aria-label="Promo code"
                        autoComplete="off"
                        className="min-w-0 flex-1 rounded-full bg-transparent px-3.5 py-[9px] text-[15px] leading-[1.3] font-medium outline-none focus:ring-2"
                        style={{ border: `1px solid ${p.line}`, color: p.title, ...ring }}
                      />
                      <button type="button" onClick={applyPromo} aria-label="Apply promo code" className={cn("cursor-pointer rounded-md border-none bg-transparent text-[15px] leading-[1.3] font-medium", focus)} style={{ color: p.title, ...ring }}>Apply</button>
                    </div>
                    {promoApplied && <p role="status" className="m-0 mb-3 text-[14px]" style={{ color: accentColor }}>Promo code applied.</p>}
                    <button type="button" disabled={rows.length === 0} onClick={() => setStep(2)} className={cn("w-full cursor-pointer rounded-full border-none px-4 py-3 text-[15px] leading-[1.3] font-medium disabled:cursor-not-allowed disabled:opacity-50", focus)} style={{ background: p.buttonBg, color: p.buttonText, ...ring }}>
                      {checkoutLabel}
                    </button>
                  </aside>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="m-0 mb-4 text-[38px] leading-[1.1] font-bold tracking-[-0.04em]">Contact</h1>
                <div className="grid grid-cols-1 items-start gap-6 @[920px]:grid-cols-[minmax(0,1.15fr)_340px]">
                  <div>
                    <Field label="Email address" value={form.email} onChange={setField("email")} p={p} ring={ring} type="email" autoComplete="email" name="email" placeholder="you@example.com" />
                    <Field label="Phone number" value={form.phone} onChange={setField("phone")} p={p} ring={ring} type="tel" autoComplete="tel" name="phone" placeholder="+1 (555) 123-4567" />
                    <h2 className="mx-0 mt-2.5 mb-4 text-[38px] leading-[1.1] font-bold tracking-[-0.04em]">Shipping Address</h2>
                    <Field label="Full name" value={form.fullName} onChange={setField("fullName")} p={p} ring={ring} autoComplete="name" name="name" />
                    <Field label="Address" value={form.address} onChange={setField("address")} p={p} ring={ring} autoComplete="street-address" name="address" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City" value={form.city} onChange={setField("city")} p={p} ring={ring} autoComplete="address-level2" name="city" />
                      <Field label="State" value={form.region} onChange={setField("region")} p={p} ring={ring} autoComplete="address-level1" name="state" />
                    </div>
                    <Field label="ZIP code" value={form.zip} onChange={setField("zip")} p={p} ring={ring} autoComplete="postal-code" name="zip" />
                    <h2 className="mx-0 mt-2.5 mb-4 text-[38px] leading-[1.1] font-bold tracking-[-0.04em]">Payment</h2>
                    <Field label="Card number" value={form.card} onChange={setField("card")} p={p} ring={ring} autoComplete="cc-number" inputMode="numeric" name="card" placeholder="4242 4242 4242 4242" />
                    <div className="grid grid-cols-[1fr_140px] gap-3">
                      <Field label="Expiration date" value={form.exp} onChange={setField("exp")} p={p} ring={ring} autoComplete="cc-exp" name="exp" placeholder="MM / YY" />
                      <Field label="CVC" value={form.cvc} onChange={setField("cvc")} p={p} ring={ring} autoComplete="cc-csc" inputMode="numeric" name="cvc" placeholder="123" />
                    </div>
                  </div>

                  <aside aria-label="Order summary" className="mt-[26px] rounded-2xl p-[18px]" style={{ border: `1px solid ${p.line}` }}>
                    <div className="mb-3.5 text-[13px] leading-[1.3] tracking-[0.08em]" style={{ color: p.muted }}>ORDER SUMMARY</div>
                    {rows.map((row) => (
                      <div key={`${row.title}-${row.index}`} className="mb-3.5 flex gap-2.5">
                        <Thumb src={row.image} alt={row.title} size={48} radius={10} p={p} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[16px] leading-[1.2] font-medium">{row.title}</div>
                          {row.variant && <div className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>{row.variant}</div>}
                          <div className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>Qty: {row.quantity}</div>
                        </div>
                        <div className="text-[15px] leading-[1.3] font-medium">{money(row.unit * row.quantity)}</div>
                      </div>
                    ))}
                    <div className="mt-0 mb-[13px] h-px" style={{ background: p.line }} />
                    {([["Subtotal", money(subtotal)], ["Shipping", shippingAmount === 0 ? "Free" : money(shippingAmount)], ...(promoApplied ? [["Discount (10%)", `− ${money(discount)}`]] : []), ["Tax", money(tax)]] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="mb-2 flex justify-between">
                        <span className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>{label}</span>
                        <span className="text-[12px] leading-[1.3] font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="mt-0 mb-3.5 flex justify-between text-[26px] leading-[1.2] font-bold tracking-[-0.03em]">
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                    <button type="button" onClick={pay} className={cn("w-full cursor-pointer rounded-full border-none px-4 py-3 text-[15px] leading-[1.3] font-medium", focus)} style={{ background: p.buttonBg, color: p.buttonText, ...ring }}>
                      {payLabel}
                    </button>
                    <p className="m-0 mt-2.5 text-center text-[14px] leading-[1.3]" style={{ color: p.muted }}>Secure checkout</p>
                  </aside>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-[558px] text-center">
                <svg width="84" height="84" viewBox="0 0 76 76" fill="none" aria-hidden="true" className="mx-auto mt-6 mb-7 block">
                  <motion.circle cx="38" cy="38" r="35" stroke={accentColor} strokeWidth="3.5" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
                  <motion.path d="M24 39.5l9.5 9.5L53 28" stroke={accentColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} />
                </svg>
                <h1 className="m-0 mb-2.5 text-[38px] leading-[1.1] font-bold tracking-[-0.04em]">{confirmTitle}</h1>
                <p className="m-0 text-[14px] leading-[1.6]" style={{ color: p.muted }}>{confirmBody}</p>
                <p className="m-0 mb-6 text-[14px] leading-[1.6]" style={{ color: p.muted }}>
                  Order number <strong className="font-bold" style={{ color: p.title }}>{orderNumber}</strong>.
                </p>

                <div className="mb-5 rounded-2xl p-[18px] text-left" style={{ border: `1px solid ${p.line}` }}>
                  <div className="mb-3.5 text-[13px] leading-[1.3] tracking-[0.08em]" style={{ color: p.muted }}>ORDER SUMMARY</div>
                  {rows.map((row) => (
                    <div key={`${row.title}-${row.index}`} className="mb-3 flex gap-3">
                      <Thumb src={row.image} alt={row.title} size={44} radius={9} p={p} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[16px] leading-[1.2] font-medium">{row.title}</div>
                        {row.variant && <div className="text-[14px] leading-[1.3]" style={{ color: p.muted }}>{row.variant}</div>}
                      </div>
                      <div className="text-[15px] leading-[1.3] font-medium">{money(row.unit * row.quantity)}</div>
                    </div>
                  ))}
                  <div className="mt-0 mb-2.5 h-px" style={{ background: p.line }} />
                  <div className="flex justify-between text-[26px] leading-[1.2] font-bold tracking-[-0.03em]">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5">
                  <button type="button" onClick={onViewOrder} className={cn("cursor-pointer rounded-full bg-transparent px-[22px] py-3 text-[15px] leading-[1.3] font-medium", focus)} style={{ border: `1px solid ${p.line}`, color: p.title, ...ring }}>View Order</button>
                  <button
                    type="button"
                    onClick={() => {
                      onContinueShopping?.();
                      setStep(1);
                    }}
                    className={cn("cursor-pointer rounded-full border-none px-[22px] py-3 text-[15px] leading-[1.3] font-medium", focus)}
                    style={{ background: p.buttonBg, color: p.buttonText, ...ring }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
