"use client";

import { Pagination } from "../../registry/new-york/pagination/pagination";
import { Stage } from "./stage";

export function PaginationStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Pagination totalPages={12} defaultPage={4} size="md" accentColor="#F59E0B" />
      </div>
    </Stage>
  );
}
