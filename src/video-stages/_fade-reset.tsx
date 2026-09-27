"use client";

import * as React from "react";

// For stages whose component keeps state from the scene (scores, history): #video-reset fades the
// component out, remounts it fresh, and fades it back in, so the clip can end on its first frame.
export function useFadeReset(ms = 250) {
  const [key, setKey] = React.useState(0);
  const [hidden, setHidden] = React.useState(false);
  const reset = React.useCallback(() => {
    setHidden(true);
    setTimeout(() => {
      setKey((k) => k + 1);
      setHidden(false);
    }, ms);
  }, [ms]);
  const style: React.CSSProperties = { opacity: hidden ? 0 : 1, transition: `opacity ${ms}ms ease` };
  return { key, reset, style };
}
