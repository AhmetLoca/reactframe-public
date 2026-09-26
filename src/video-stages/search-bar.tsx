"use client";

import { SearchBar } from "../../registry/new-york/search-bar/search-bar";
import { Stage } from "./stage";

const SUGGESTIONS = ["Button", "Card", "Carousel", "Checkbox", "Combobox", "Command Palette", "Input", "Select", "Slider", "Tabs"];

export function SearchBarStage() {
  return (
    <Stage>
      <SearchBar placeholder="Search components…" suggestions={SUGGESTIONS} maxSuggestions={4} width={375} size={18.5} radius={22} accentColor="#F59E0B" />
    </Stage>
  );
}
