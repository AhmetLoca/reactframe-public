"use client";

import * as React from "react";
import { Button } from "../../registry/new-york/button/button";
import { Stage } from "./stage";

export function ButtonStage() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Stage onReset={() => setLoading(false)}>
      <Button
        label="Get started"
        loading={loading}
        onClick={() => setLoading(true)}
        height={50}
        paddingX={32}
        fontSize={18}
        radius={14}
        accentColor="#F59E0B"
        accentTextColor="#111111"
      />
    </Stage>
  );
}
