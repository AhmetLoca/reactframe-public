"use client";

import { TestimonialPills } from "../../registry/new-york/testimonial-pills/testimonial-pills";
import { Stage } from "./stage";

const TESTIMONIAL_PILLS_AVATARS = [49, 50, 51, 53, 54, 55, 43, 44, 45, 46].map(
  (n) => `/demo/${n}.webp`,
);
const TESTIMONIAL_PILLS_TEXTS = [
  "Very easy to follow",
  "Eye opening",
  "Very insightful",
  "Loved it",
  "Feeling positive",
  "It was useful",
  "Thanks!",
  "Great",
  "So far, so good",
  "Impressed",
  "I'm feeling hopeful",
  "Highly recommend",
  "Super helpful",
  "Worth it",
  "Mind blowing",
  "Couldn't be easier",
];

const TESTIMONIAL_PILLS_ITEMS = TESTIMONIAL_PILLS_TEXTS.map((text, i) => ({
  text,
  avatar: TESTIMONIAL_PILLS_AVATARS[i % TESTIMONIAL_PILLS_AVATARS.length],
}));

// Premium Bento Grid preview: ten motion-blur sport photos, one per cell of the custom layout.
const PREMIUM_BENTO_SLOTS = [
  { image: "/demo/107.webp", label: "Motorsport", badge: "Full throttle" },
  { image: "/demo/102.webp", label: "Rowing", badge: "Sculling" },
  { image: "/demo/103.webp", label: "Weightlifting", badge: "Strength" },
  { image: "/demo/104.webp", label: "The Team", badge: "Together" },
  { image: "/demo/105.webp", label: "Trail Hiking", badge: "Uphill" },
  { image: "/demo/106.webp", label: "Sled Push", badge: "Conditioning" },
  { image: "/demo/108.webp", label: "Cycling", badge: "Road" },
  { image: "/demo/109.webp", label: "Sprint", badge: "Track" },
  { image: "/demo/110.webp", label: "Swimming", badge: "Freestyle" },
  { image: "/demo/111.webp", label: "Alpine Skiing", badge: "Downhill" },
].map((slot) => ({ mediaType: "image" as const, ...slot }));

// Glide Carousel preview: five motion-blur sport photos with copy that matches each one.
const GLIDE_CAROUSEL_ITEMS = [
  {
    src: "/demo/101.webp",
    title: "Full Gallop",
    description: "Rider and horse in one breath.",
  },
  {
    src: "/demo/102.webp",
    title: "First Stroke",
    description: "One sculler, glassy water, no wake yet.",
  },
  {
    src: "/demo/105.webp",
    title: "Above the Tree Line",
    description: "A steady climb on loose ground.",
  },
  {
    src: "/demo/108.webp",
    title: "Tailwind",
    description: "Low and fast on an empty road.",
  },
  {
    src: "/demo/109.webp",
    title: "Off the Line",
    description: "The first ten strides decide the race.",
  },
];

// The registry preview (1100px wide, 24px padding) drawn at 0.9x.
export function TestimonialPillsStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.9)" }}>
        <div className="overflow-hidden" style={{ width: 1100, padding: 24 }}>
          <TestimonialPills rowCount={4} items={TESTIMONIAL_PILLS_ITEMS} spotlight={false} depthBlur={false} />
        </div>
      </div>
    </Stage>
  );
}
