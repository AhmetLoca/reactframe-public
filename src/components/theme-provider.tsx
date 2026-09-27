"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes renders an inline <script> that sets the theme before first paint. It only needs to
// run from the server HTML; when React renders it on the client (after an error boundary resets,
// on some navigations) React 19 warns "Encountered a script tag while rendering React component".
// Typing it as a data block on the client keeps the server script intact and silences that.
const clientScriptProps = typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider scriptProps={clientScriptProps} {...props}>
      {children}
    </NextThemesProvider>
  );
}
