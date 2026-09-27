// Replaces Math.random with a fixed-seed generator (mulberry32) for the rest of the page, so games
// that spawn tiles or pick moves at random play out the same way on every recording.
export function seedRandom(seed = 7) {
  if (typeof window === "undefined") return;
  let a = seed >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
