"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlideCarouselItem {
  src: string;
  type?: "image" | "video";
  title?: string;
  description?: string;
}

export type GlideCarouselWindMode = "wind" | "drift" | "magnetic" | "none";

export interface GlideCarouselProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items?: GlideCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  waveStrength?: number;
  bgColor?: string;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  autoPlayDirection?: "right" | "left";
  showArrows?: boolean;
  gap?: number;
  windStrength?: number;
  windMode?: GlideCarouselWindMode;
  parallaxInner?: boolean;
}

const DEFAULT_ITEMS: GlideCarouselItem[] = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", title: "Alpine Ridge", description: "A quiet trail above the clouds." },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", title: "Northern Lights", description: "Aurora over the fjord." },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", title: "Forest Path", description: "Morning light through pines." },
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", title: "Mountain Lake", description: "Still water, sharp reflection." },
  { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", title: "Desert Dunes", description: "Wind-carved lines at dusk." },
];

export function GlideCarousel({
  items: itemsProp = DEFAULT_ITEMS,
  cardWidth = 320,
  cardHeight = 420,
  cardRadius = 20,
  waveStrength = 18,
  bgColor = "#000000",
  autoPlay = true,
  autoPlaySpeed = 1,
  autoPlayDirection = "right",
  showArrows = true,
  gap = 32,
  windStrength = 1.0,
  windMode = "wind",
  parallaxInner = true,
  className,
  style,
  ...props
}: GlideCarouselProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mediaRefs = React.useRef<Record<number, HTMLImageElement | HTMLVideoElement>>({});
  const scrollXRef = React.useRef(0);
  const targetXRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef(0);
  const dragScrollRef = React.useRef(0);
  const lastTimeRef = React.useRef(0);
  const velocityRef = React.useRef(0);
  const lastDragXRef = React.useRef(0);
  const smoothMouseRef = React.useRef({ x: 0, y: 0 });
  const rawMouseRef = React.useRef({ x: 0, y: 0 });
  const hoveredIndexRef = React.useRef(-1);
  const timeRef = React.useRef(0);
  const dragDistRef = React.useRef(0);

  const propsRef = React.useRef({
    cardWidth,
    cardHeight,
    cardRadius,
    waveStrength,
    gap,
    windStrength,
    autoPlaySpeed,
    autoPlayDirection,
    autoPlay,
    parallaxInner,
    windMode,
  });
  React.useEffect(() => {
    propsRef.current = {
      cardWidth,
      cardHeight,
      cardRadius,
      waveStrength,
      gap,
      windStrength,
      autoPlaySpeed,
      autoPlayDirection,
      autoPlay,
      parallaxInner,
      windMode,
    };
  }, [cardWidth, cardHeight, cardRadius, waveStrength, gap, windStrength, autoPlaySpeed, autoPlayDirection, autoPlay, parallaxInner, windMode]);

  const [modalItem, setModalItem] = React.useState<GlideCarouselItem | null>(null);

  const activeRef = React.useRef({ windMode, autoPlay, autoPlayDir: autoPlayDirection, parallax: parallaxInner });
  React.useEffect(() => {
    activeRef.current = { windMode, autoPlay, autoPlayDir: autoPlayDirection, parallax: parallaxInner };
  }, [windMode, autoPlay, autoPlayDirection, parallaxInner]);

  const items: GlideCarouselItem[] = React.useMemo(
    () => (Array.isArray(itemsProp) ? itemsProp.filter((i) => i?.src) : []),
    [itemsProp]
  );
  const count = items.length;
  const itemsRef = React.useRef(items);
  const countRef = React.useRef(count);
  React.useEffect(() => {
    itemsRef.current = items;
    countRef.current = count;
  }, [items, count]);

  const drawRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    drawRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const { cardWidth, cardHeight, cardRadius, waveStrength, gap, windStrength } = propsRef.current;
      const { windMode: activeWindMode, parallax: activeParallax } = activeRef.current;
      const items = itemsRef.current;
      const count = countRef.current;

      if (count === 0) {
        const ph = 4,
          phW = cardWidth * 0.85,
          phH = cardHeight * 0.85,
          phGap = gap;
        const totalPh = ph * (phW + phGap) - phGap;
        for (let i = 0; i < ph; i++) {
          const bx = W / 2 - totalPh / 2 + i * (phW + phGap);
          const normX = (bx + phW / 2 - W / 2) / (W * 0.6);
          const phScale = Math.max(0.72, 1 - Math.abs(normX) * 0.22);
          const phAlpha = Math.max(0.25, 1 - Math.abs(normX) * 0.5);
          const sw = phW * phScale,
            sh = phH * phScale;
          const rx = bx + (phW - sw) / 2,
            ry = H / 2 - sh / 2,
            r = cardRadius * phScale;
          ctx.save();
          ctx.globalAlpha = phAlpha;
          ctx.beginPath();
          ctx.moveTo(rx + r, ry);
          ctx.lineTo(rx + sw - r, ry);
          ctx.quadraticCurveTo(rx + sw, ry, rx + sw, ry + r);
          ctx.lineTo(rx + sw, ry + sh - r);
          ctx.quadraticCurveTo(rx + sw, ry + sh, rx + sw - r, ry + sh);
          ctx.lineTo(rx + r, ry + sh);
          ctx.quadraticCurveTo(rx, ry + sh, rx, ry + sh - r);
          ctx.lineTo(rx, ry + r);
          ctx.quadraticCurveTo(rx, ry, rx + r, ry);
          ctx.closePath();
          ctx.fillStyle = `hsl(${i * 35 + 200},18%,28%)`;
          ctx.fill();
          ctx.restore();
        }
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#ffffff";
        ctx.font = "13px 'Helvetica Neue', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("No items", W / 2, H / 2);
        ctx.restore();
        return;
      }

      const cx = W / 2,
        cy = H / 2,
        scroll = scrollXRef.current;
      const slotW = cardWidth + gap,
        loopW = count * slotW,
        t = timeRef.current;

      for (let copy = -1; copy <= 1; copy++) {
        items.forEach((item, i) => {
          const baseX = cx - loopW / 2 + i * slotW + copy * loopW - scroll + gap / 2;
          const normX = (baseX + cardWidth / 2 - cx) / (W * 0.6);
          if (Math.abs(normX) > 2.2) return;

          const waveY = Math.sin(normX * Math.PI * 0.85) * waveStrength * -1;
          const rotY = normX * 22;
          const scale = Math.max(0.68, 1 - Math.abs(normX) * 0.22);
          const alpha = Math.max(0.2, 1 - Math.abs(normX) * 0.55);

          const p1 = i * 2.39 + copy * 1.13;
          const p2 = i * 1.17 + copy * 0.73;
          const p3 = i * 3.07 + copy * 1.51;
          let swayZ = 0,
            swayX = 0,
            swayY = 0,
            swayScale = 1;

          if (activeWindMode === "wind") {
            const ws = windStrength;
            swayZ = (Math.sin(t * 0.00045 + p1) * 3.2 + Math.sin(t * 0.00091 + p2 * 1.4) * 1.6 + Math.sin(t * 0.00173 + p3 * 0.8) * 0.7) * ws;
            swayX = (Math.cos(t * 0.00038 + p2) * 2.4 + Math.cos(t * 0.00082 + p1 * 1.2) * 1.1 + Math.sin(t * 0.00151 + p3 * 1.7) * 0.5) * ws;
            swayY = (Math.sin(t * 0.00052 + p3) * 3.8 + Math.sin(t * 0.00097 + p1 * 0.9) * 1.4 + Math.cos(t * 0.00139 + p2 * 1.6) * 0.6) * ws;
            swayScale = 1 + (Math.sin(t * 0.00061 + p2) * 0.008 + Math.sin(t * 0.00112 + p1 * 1.3) * 0.004) * ws;
          } else if (activeWindMode === "drift") {
            const ws = windStrength;
            swayZ = (Math.sin(t * 0.00018 + p1) * 6 + Math.sin(t * 0.00031 + p2) * 2.5) * ws;
            swayX = (Math.sin(t * 0.00014 + p2) * 5 + Math.cos(t * 0.00025 + p3) * 2) * ws;
            swayY = (Math.sin(t * 0.00021 + p3) * 22 + Math.sin(t * 0.00037 + p1) * 10) * ws;
            swayScale = 1 + (Math.sin(t * 0.00028 + p2) * 0.025 + Math.sin(t * 0.00019 + p1) * 0.012) * ws;
          } else if (activeWindMode === "magnetic") {
            const ws = windStrength;
            const mx = smoothMouseRef.current.x,
              my = smoothMouseRef.current.y;
            const cardNormX = (baseX + cardWidth / 2 - cx) / (W * 0.5);
            const distX = mx - cardNormX * 0.5,
              distY = my;
            const dist = Math.sqrt(distX * distX + distY * distY);
            const pull = Math.max(0, 1 - dist * 1.8);
            swayX = distX * 12 * pull * ws;
            swayZ = distX * -6 * pull * ws;
            swayY = distY * 18 * pull * ws;
            swayScale = 1 + pull * 0.04 * ws;
          }

          const cardX = baseX + cardWidth / 2,
            cardY = cy + waveY + swayY;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(cardX, cardY);
          ctx.rotate((swayZ * Math.PI) / 180);

          const totalRotY = rotY + swayX;
          const skewRad = (totalRotY * Math.PI) / 180;
          const cosV = Math.cos(skewRad),
            sinV = Math.sin(skewRad) * 0.4;
          const finalScale = scale * swayScale;
          const scaledW = cardWidth * finalScale,
            scaledH = cardHeight * finalScale;
          const rx = -scaledW / 2,
            ry = -scaledH / 2,
            r = cardRadius * finalScale;

          ctx.shadowColor = "rgba(0,0,0,0.45)";
          ctx.shadowBlur = 32 * finalScale;
          ctx.shadowOffsetY = 14 * finalScale;
          ctx.transform(cosV, sinV * 0.22, sinV * 0.08, finalScale, 0, 0);

          ctx.beginPath();
          ctx.moveTo(rx + r, ry);
          ctx.lineTo(rx + scaledW - r, ry);
          ctx.quadraticCurveTo(rx + scaledW, ry, rx + scaledW, ry + r);
          ctx.lineTo(rx + scaledW, ry + scaledH - r);
          ctx.quadraticCurveTo(rx + scaledW, ry + scaledH, rx + scaledW - r, ry + scaledH);
          ctx.lineTo(rx + r, ry + scaledH);
          ctx.quadraticCurveTo(rx, ry + scaledH, rx, ry + scaledH - r);
          ctx.lineTo(rx, ry + r);
          ctx.quadraticCurveTo(rx, ry, rx + r, ry);
          ctx.closePath();
          ctx.clip();
          ctx.shadowColor = "transparent";

          const media = mediaRefs.current[i];
          if (media) {
            const mw = media instanceof HTMLVideoElement ? media.videoWidth : (media as HTMLImageElement).naturalWidth;
            const mh = media instanceof HTMLVideoElement ? media.videoHeight : (media as HTMLImageElement).naturalHeight;
            if (mw && mh) {
              const sc = Math.max(scaledW / mw, scaledH / mh);
              const ipx = activeParallax ? smoothMouseRef.current.x * 18 : 0;
              const ipy = activeParallax ? smoothMouseRef.current.y * 12 : 0;
              const dw = mw * sc * 1.08,
                dh = mh * sc * 1.08;
              ctx.drawImage(media, rx + (scaledW - dw) / 2 + ipx, ry + (scaledH - dh) / 2 + ipy, dw, dh);
            } else {
              ctx.fillStyle = `hsl(${i * 40},30%,40%)`;
              ctx.fillRect(rx, ry, scaledW, scaledH);
            }
          } else {
            ctx.fillStyle = `hsl(${i * 40},30%,40%)`;
            ctx.fillRect(rx, ry, scaledW, scaledH);
          }

          const lightX = rx + scaledW * (0.5 + Math.sin(swayZ * 0.08) * 0.3);
          const grad = ctx.createLinearGradient(lightX - scaledW * 0.3, ry, lightX + scaledW * 0.3, ry + scaledH * 0.55);
          grad.addColorStop(0, "rgba(255,255,255,0.18)");
          grad.addColorStop(0.5, "rgba(255,255,255,0.06)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(rx, ry, scaledW, scaledH);

          const isHovered = hoveredIndexRef.current === i;
          if (isHovered && item.title) {
            const titleAlpha = Math.min(1, alpha * 1.4);
            const titleGrad = ctx.createLinearGradient(rx, ry + scaledH * 0.55, rx, ry + scaledH);
            titleGrad.addColorStop(0, "rgba(0,0,0,0)");
            titleGrad.addColorStop(1, "rgba(0,0,0,0.72)");
            ctx.fillStyle = titleGrad;
            ctx.fillRect(rx, ry, scaledW, scaledH);
            ctx.globalAlpha = titleAlpha;
            ctx.fillStyle = "#ffffff";
            ctx.font = `400 ${Math.round(15 * finalScale)}px 'Georgia', serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillText(item.title, rx + 14 * finalScale, ry + scaledH - 14 * finalScale, scaledW - 28 * finalScale);
          }
          ctx.restore();
        });
      }
    };
  });

  const hitTestRef = React.useRef((clientX: number, clientY: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left,
      my = clientY - rect.top;
    const W = canvas.width,
      H = canvas.height,
      cx = W / 2,
      cy = H / 2;
    const { cardWidth, cardHeight, gap, waveStrength, windStrength } = propsRef.current;
    const count = countRef.current;
    const slotW = cardWidth + gap,
      loopW = count * slotW;
    const scroll = scrollXRef.current,
      t = timeRef.current;
    for (let copy = -1; copy <= 1; copy++) {
      for (let i = count - 1; i >= 0; i--) {
        const baseX = cx - loopW / 2 + i * slotW + copy * loopW - scroll + gap / 2;
        const normX = (baseX + cardWidth / 2 - cx) / (W * 0.6);
        if (Math.abs(normX) > 2.2) continue;
        const waveY = Math.sin(normX * Math.PI * 0.85) * waveStrength * -1;
        const p3 = i * 3.07 + copy * 1.51;
        const swayY = Math.sin(t * 0.00052 + p3) * 3.8 * windStrength;
        const scale = Math.max(0.68, 1 - Math.abs(normX) * 0.22);
        const scaledW = cardWidth * scale,
          scaledH = cardHeight * scale;
        const cardCX = baseX + cardWidth / 2,
          cardCY = cy + waveY + swayY;
        if (mx >= cardCX - scaledW / 2 && mx <= cardCX + scaledW / 2 && my >= cardCY - scaledH / 2 && my <= cardCY + scaledH / 2) return i;
      }
    }
    return -1;
  });

  React.useEffect(() => {
    const tick = (time: number) => {
      const dt = Math.min(time - lastTimeRef.current, 32);
      lastTimeRef.current = time;
      timeRef.current = time;
      smoothMouseRef.current.x += (rawMouseRef.current.x - smoothMouseRef.current.x) * 0.06;
      smoothMouseRef.current.y += (rawMouseRef.current.y - smoothMouseRef.current.y) * 0.06;
      const { cardWidth, gap, autoPlaySpeed } = propsRef.current;
      const { autoPlay, autoPlayDir } = activeRef.current;
      const count = countRef.current;
      const loopW = count * (cardWidth + gap);
      if (!isDraggingRef.current) {
        if (autoPlay) {
          const dir = autoPlayDir === "left" ? -1 : 1;
          targetXRef.current += dir * autoPlaySpeed * dt * 0.05;
        }
        if (Math.abs(velocityRef.current) > 0.1) {
          targetXRef.current += velocityRef.current;
          velocityRef.current *= 0.92;
        }
      }
      if (loopW > 0) {
        while (targetXRef.current > loopW) targetXRef.current -= loopW;
        while (targetXRef.current < 0) targetXRef.current += loopW;
        let diff = targetXRef.current - scrollXRef.current;
        if (diff > loopW / 2) diff -= loopW;
        if (diff < -loopW / 2) diff += loopW;
        scrollXRef.current += diff * 0.09;
        if (scrollXRef.current > loopW) scrollXRef.current -= loopW;
        if (scrollXRef.current < 0) scrollXRef.current += loopW;
      }
      drawRef.current();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  React.useEffect(() => {
    const resize = () => {
      const el = containerRef.current,
        canvas = canvasRef.current;
      if (!el || !canvas) return;
      canvas.width = el.clientWidth;
      canvas.height = el.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    Object.entries(mediaRefs.current).forEach(([key, media]) => {
      const idx = Number(key);
      const currentSrc = media instanceof HTMLVideoElement ? media.src : (media as HTMLImageElement).src;
      if (!items[idx] || items[idx].src !== currentSrc) {
        if (media instanceof HTMLVideoElement) {
          media.pause();
          media.src = "";
        }
        delete mediaRefs.current[idx];
      }
    });
    const loadedRef: Record<number, boolean> = {};
    const tryLoad = () => {
      if (modalItem) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { cardWidth, gap } = propsRef.current;
      const count = countRef.current;
      const W = canvas.width,
        cx = W / 2;
      const slotW = cardWidth + gap,
        loopW = count * slotW;
      const scroll = scrollXRef.current;
      items.forEach((item, i) => {
        if (!item?.src || loadedRef[i] || mediaRefs.current[i]) return;
        const baseX = cx - loopW / 2 + i * slotW - scroll + gap / 2;
        if (Math.abs(baseX + cardWidth / 2 - cx) > W * 1.5) return;
        loadedRef[i] = true;
        if (item.type === "video") {
          const v = document.createElement("video");
          v.src = item.src;
          v.muted = true;
          v.loop = true;
          v.playsInline = true;
          v.autoplay = true;
          v.play().catch(() => {});
          mediaRefs.current[i] = v;
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = item.src;
          mediaRefs.current[i] = img;
        }
      });
    };
    tryLoad();
    const id = setInterval(tryLoad, 500);
    return () => clearInterval(id);
  }, [items, modalItem]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      rawMouseRef.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      const idx = hitTestRef.current(e.clientX, e.clientY);
      if (idx !== hoveredIndexRef.current) {
        hoveredIndexRef.current = idx;
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = idx >= 0 ? "pointer" : "grab";
      }
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const el = containerRef.current;
    if (!canvas || !el) return;

    const onDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = e.clientX;
      dragScrollRef.current = targetXRef.current;
      lastDragXRef.current = e.clientX;
      dragDistRef.current = 0;
      velocityRef.current = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = dragStartRef.current - e.clientX;
      targetXRef.current = dragScrollRef.current + dx * 1.2;
      velocityRef.current = (lastDragXRef.current - e.clientX) * 0.6;
      dragDistRef.current += Math.abs(e.movementX);
      lastDragXRef.current = e.clientX;
    };
    const onUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
      if (dragDistRef.current < 6) {
        const idx = hitTestRef.current(e.clientX, e.clientY);
        if (idx >= 0 && itemsRef.current[idx]) setModalItem(itemsRef.current[idx]);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = e.touches[0].clientX;
      dragScrollRef.current = targetXRef.current;
      lastDragXRef.current = e.touches[0].clientX;
      dragDistRef.current = 0;
      velocityRef.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const dx = dragStartRef.current - e.touches[0].clientX;
      dragDistRef.current += Math.abs(dx);
      targetXRef.current = dragScrollRef.current + dx * 1.2;
      velocityRef.current = (lastDragXRef.current - e.touches[0].clientX) * 0.6;
      lastDragXRef.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
      if (dragDistRef.current < 10) {
        const t = e.changedTouches[0];
        const idx = hitTestRef.current(t.clientX, t.clientY);
        if (idx >= 0 && itemsRef.current[idx]) setModalItem(itemsRef.current[idx]);
      }
    };
    const onLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        canvas.style.cursor = "grab";
      }
    };
    canvas.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalItem(null);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cn("flex h-full w-full flex-col", className)} style={style} {...props}>
      <style>{`
        @keyframes ${uid}_modalIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ${uid}_modalCardIn { from { opacity: 0; transform: scale(0.94) translateY(12px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
      <div ref={containerRef} tabIndex={0} className="relative min-h-0 flex-1 overflow-hidden outline-none" style={{ background: bgColor }}>
        <canvas ref={canvasRef} className="block h-full w-full" style={{ cursor: "grab" }} />

        {showArrows && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                if (!isDraggingRef.current) {
                  targetXRef.current -= propsRef.current.cardWidth + propsRef.current.gap;
                  velocityRef.current = 0;
                }
              }}
              className="absolute top-1/2 left-4 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 outline-none backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                if (!isDraggingRef.current) {
                  targetXRef.current += propsRef.current.cardWidth + propsRef.current.gap;
                  velocityRef.current = 0;
                }
              }}
              className="absolute top-1/2 right-4 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 outline-none backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {modalItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={modalItem.title || "Media preview"}
            onClick={() => setModalItem(null)}
            className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/75 p-6 backdrop-blur-2xl"
            style={{ animation: `${uid}_modalIn 0.3s cubic-bezier(0.2,0,0,1) both` }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10"
              style={{ background: "rgba(18,18,18,0.95)", animation: `${uid}_modalCardIn 0.35s cubic-bezier(0.2,0,0,1) both` }}
            >
              <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingTop: "62%" }}>
                {modalItem.type === "video" ? (
                  <video src={modalItem.src} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={modalItem.src} alt={modalItem.title || ""} className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div style={{ padding: "24px 28px 28px" }}>
                {modalItem.title && (
                  <div className="mb-2.5 text-[22px] font-normal tracking-[-0.02em] text-white" style={{ fontFamily: "'Georgia', serif" }}>
                    {modalItem.title}
                  </div>
                )}
                {modalItem.description && (
                  <div className="mb-5 text-[13px] leading-[1.65] text-white/55">{modalItem.description}</div>
                )}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setModalItem(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 outline-none"
                  >
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
