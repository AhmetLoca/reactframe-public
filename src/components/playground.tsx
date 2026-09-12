"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Docs-only "live playground" — lets a preview expose a couple of adjustable
// props (theme, accent color, etc.) without any of that control-panel logic
// ever touching the shipped component. The registry file a user copy-pastes
// stays exactly what ships; this wrapper only exists here, in the docs site,
// around the preview call.
export type PlaygroundControl =
  | { type: "select"; key: string; label: string; options: readonly string[]; optionLabels?: readonly string[]; defaultValue: string }
  | { type: "toggle"; key: string; label: string; defaultValue: boolean }
  | { type: "color"; key: string; label: string; defaultValue: string }
  | { type: "range"; key: string; label: string; min: number; max: number; step: number; defaultValue: number };

type PlaygroundValues = Record<string, string | boolean | number>;

export function Playground({
  controls,
  children,
}: {
  controls: readonly PlaygroundControl[];
  children: (values: PlaygroundValues) => React.ReactNode;
}) {
  const [values, setValues] = React.useState<PlaygroundValues>(() => Object.fromEntries(controls.map((c) => [c.key, c.defaultValue])));

  const setValue = (key: string, value: string | boolean | number) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-xl border border-border">{children(values)}</div>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-5">
        {controls.map((control) => (
          <PlaygroundField key={control.key} control={control} value={values[control.key]} onChange={(v) => setValue(control.key, v)} />
        ))}
      </div>
    </div>
  );
}

function PlaygroundField({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: string | boolean | number;
  onChange: (value: string | boolean | number) => void;
}) {
  if (control.type === "select") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider text-foreground/40 uppercase">{control.label}</span>
        <div className="flex gap-0.5 rounded-full border border-border p-1">
          {control.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                value === opt ? "bg-primary text-primary-foreground" : "text-foreground/55 hover:text-foreground",
              )}
            >
              {control.optionLabels?.[i] ?? opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (control.type === "toggle") {
    const checked = Boolean(value);
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider text-foreground/40 uppercase">{control.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}
        >
          <span
            className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ease-signature", checked && "translate-x-4")}
          />
        </button>
      </div>
    );
  }

  if (control.type === "range") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider text-foreground/40 uppercase">{control.label}</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 accent-white"
          />
          <span className="min-w-[2ch] text-right text-xs tabular-nums text-foreground/55">{Number(value)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold tracking-wider text-foreground/40 uppercase">{control.label}</span>
      <input
        type="color"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-11 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
      />
    </div>
  );
}
