"use client";

import { TreeView, type TreeNode } from "../../registry/new-york/tree-view/tree-view";
import { Stage } from "./stage";

const DATA: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "app", children: [{ id: "page", label: "page.tsx" }, { id: "layout", label: "layout.tsx" }] },
      { id: "lib", label: "lib", children: [{ id: "utils", label: "utils.ts" }] },
    ],
  },
  { id: "package", label: "package.json" },
];

export function TreeViewStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <TreeView data={DATA} selectable defaultSelectedId="page" defaultExpandedIds={["src", "app"]} showLines width={240} />
      </div>
    </Stage>
  );
}
