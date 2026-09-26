"use client";

import * as React from "react";
import { Skeleton } from "../../registry/new-york/skeleton/skeleton";
import { Stage } from "./stage";

const AMBER = "#F59E0B";

// Each #video-reset press flips between the shimmering placeholder and the loaded profile row.
export function SkeletonStage() {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <Stage onReset={() => setLoaded((v) => !v)}>
      <div style={{ display: "flex", alignItems: "center", gap: 15, width: 350 }}>
        <Skeleton variant="circle" width={55} height={55} accentColor={AMBER} loading={!loaded}>
          <div style={{ width: 55, height: 55, borderRadius: 999, background: "linear-gradient(135deg,#F59E0B,#EF4444)", display: "grid", placeItems: "center", color: "#111", fontWeight: 700, fontSize: 20 }}>JC</div>
        </Skeleton>
        <div style={{ display: "flex", flexDirection: "column", gap: 12.5, flex: 1 }}>
          <Skeleton width={280} height={17.5} radius={999} accentColor={AMBER} loading={!loaded}>
            <div style={{ height: 17.5, display: "flex", alignItems: "center", color: "#F5F4F1", fontSize: 17, fontWeight: 600 }}>Jane Cooper</div>
          </Skeleton>
          <Skeleton width={173} height={17.5} radius={999} accentColor={AMBER} loading={!loaded}>
            <div style={{ height: 17.5, display: "flex", alignItems: "center", color: "rgba(245,244,241,0.55)", fontSize: 14 }}>Product designer at Acme</div>
          </Skeleton>
        </div>
      </div>
    </Stage>
  );
}
