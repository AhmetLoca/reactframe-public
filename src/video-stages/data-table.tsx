"use client";

import { DataTable } from "../../registry/new-york/data-table/data-table";
import { Stage } from "./stage";

// The registry preview's 900x520 table drawn at 0.7x, as in the thumbnail.
export function DataTableStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.7)" }}>
        <div style={{ width: 900, height: 520 }}>
          <DataTable />
        </div>
      </div>
    </Stage>
  );
}
