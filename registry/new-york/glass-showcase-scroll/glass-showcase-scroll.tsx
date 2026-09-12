"use client";

// A scroll-driven 3D glass box with particle-explosion transitions between
// images. The box expands vertically based on image count and rotates one
// half-turn per image as the visitor scrolls through it.

import * as React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { useScroll, useMotionValueEvent } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PI = Math.PI;
const TWO_PI = PI * 2;
const HDR_URL = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr";

function smoothstep(mn: number, mx: number, v: number) {
  const x = Math.max(0, Math.min(1, (v - mn) / (mx - mn)));
  return x * x * (3 - 2 * x);
}

function makeFallback(color: string) {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 2;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 2, 2);
  return new THREE.CanvasTexture(c);
}

interface ParticleUniforms {
  [key: string]: THREE.IUniform<unknown>;
  uExplode: { value: number };
  uMix: { value: number };
  uPower: { value: number };
  uOpacity: { value: number };
  uPointSize: { value: number };
  uBoxLimit: { value: THREE.Vector3 };
  uTexCurrent: { value: THREE.Texture };
  uTexNext: { value: THREE.Texture };
}

export interface GlassShowcaseScrollProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  images?: string[];
  alt?: string;
  boxWidth?: number;
  boxHeight?: number;
  boxDepth?: number;
  particleCountX?: number;
  particleCountY?: number;
  particleSize?: number;
  explosionPower?: number;
  fadeRange?: number;
  imageFill?: number;
  hdrEnabled?: boolean;
  scrollDirection?: "left-to-right" | "right-to-left";
  floatEnabled?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  backgroundColor?: string;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
];

export function GlassShowcaseScroll({
  className,
  style,
  images = DEFAULT_IMAGES,
  alt = "",
  boxWidth = 3.3,
  boxHeight = 3.5,
  boxDepth = 2.0,
  particleCountX = 128,
  particleCountY = 96,
  particleSize = 10,
  explosionPower = 1.0,
  fadeRange = 0.18,
  imageFill = 0.86,
  hdrEnabled = false,
  scrollDirection = "left-to-right",
  floatEnabled = true,
  floatAmplitude = 0.08,
  floatSpeed = 1.0,
  backgroundColor = "#000000",
  ...props
}: GlassShowcaseScrollProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mountRef = React.useRef<HTMLDivElement>(null);
  const updateScrollRef = React.useRef<((v: number) => void) | null>(null);
  const uniformsRef = React.useRef<ParticleUniforms | null>(null);

  const imgCount = images.length > 0 ? images.length : 1;

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    updateScrollRef.current?.(v);
  });

  React.useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let stableCount = 0;
    let currentProgress = 0;
    let smoothProgress = 0;
    let isVisible = true;
    let lastTime = performance.now();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const planeW = boxWidth * imageFill;
    const planeH = boxHeight * imageFill;
    const planeHalfW = planeW / 2;
    const planeHalfH = planeH / 2;

    const glassGeo = new RoundedBoxGeometry(boxWidth, boxHeight, boxDepth, 16, 0.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#000000",
      transmission: 1.0,
      roughness: 0.15,
      ior: 2.5,
      thickness: 1.1,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.renderOrder = 2;
    group.add(glassMesh);

    const textureLoader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy?.() ?? 1;

    const textures: THREE.Texture[] =
      images.length > 0
        ? images.map((url) => {
            const t = textureLoader.load(url, invalidate);
            t.colorSpace = THREE.SRGBColorSpace;
            t.wrapS = THREE.ClampToEdgeWrapping;
            t.wrapT = THREE.ClampToEdgeWrapping;
            t.generateMipmaps = true;
            t.minFilter = THREE.LinearMipmapLinearFilter;
            t.magFilter = THREE.LinearFilter;
            t.anisotropy = Math.min(8, maxAniso);
            return t;
          })
        : [makeFallback("#1a1a2e"), makeFallback("#2a1a3e")];

    // Guarantee at least 2 textures for particle uniforms.
    while (textures.length < 2) textures.push(textures[0]);

    const solidGeo = new THREE.PlaneGeometry(planeW, planeH);
    const solidMat = new THREE.MeshBasicMaterial({ map: textures[0], side: THREE.DoubleSide, transparent: true, opacity: 1.0 });
    const solidMesh = new THREE.Mesh(solidGeo, solidMat);
    group.add(solidMesh);

    const total = particleCountX * particleCountY;
    const invX = 1 / (particleCountX - 1);
    const invY = 1 / (particleCountY - 1);
    const pos = new Float32Array(total * 3);
    const uvArr = new Float32Array(total * 2);
    const dirs = new Float32Array(total * 3);
    const phases = new Float32Array(total);

    let pi = 0;
    let ui = 0;
    let di = 0;
    let phi = 0;

    for (let j = 0; j < particleCountY; j++) {
      const jN = j * invY;
      const y = jN * planeH - planeHalfH;
      const v = 1.0 - jN;
      for (let i = 0; i < particleCountX; i++) {
        const iN = i * invX;
        pos[pi++] = iN * planeW - planeHalfW;
        pos[pi++] = y;
        pos[pi++] = 0;
        uvArr[ui++] = iN;
        uvArr[ui++] = v;
        const rx = Math.random() * 2 - 1;
        const ry = Math.random() * 2 - 1;
        const rz = (Math.random() * 2 - 1) * 1.5;
        const len = Math.hypot(rx, ry, rz) || 1;
        dirs[di++] = rx / len;
        dirs[di++] = ry / len;
        dirs[di++] = rz / len;
        phases[phi++] = Math.random() * TWO_PI;
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.StaticDrawUsage));
    pGeo.setAttribute("aUv", new THREE.BufferAttribute(uvArr, 2).setUsage(THREE.StaticDrawUsage));
    pGeo.setAttribute("aDir", new THREE.BufferAttribute(dirs, 3).setUsage(THREE.StaticDrawUsage));
    pGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1).setUsage(THREE.StaticDrawUsage));

    const boxLimit = new THREE.Vector3(planeHalfW * 0.96, planeHalfH * 0.96, planeHalfW * 0.96);

    const pUniforms: ParticleUniforms = {
      uExplode: { value: 0 },
      uMix: { value: 0 },
      uPower: { value: explosionPower },
      uOpacity: { value: 0 },
      uPointSize: { value: particleSize },
      uBoxLimit: { value: boxLimit },
      uTexCurrent: { value: textures[0] },
      uTexNext: { value: textures[1] },
    };
    uniformsRef.current = pUniforms;

    const particleMat = new THREE.ShaderMaterial({
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        uniform float uExplode;
        uniform float uMix;
        uniform float uPower;
        uniform float uOpacity;
        uniform float uPointSize;
        uniform vec3  uBoxLimit;
        uniform sampler2D uTexCurrent;
        uniform sampler2D uTexNext;
        attribute vec2  aUv;
        attribute vec3  aDir;
        attribute float aPhase;
        varying vec3  vColor;
        varying float vAlpha;
        void main() {
          float wobble = sin(aPhase + uExplode * 3.14159265) * 0.25;
          vec3 dir = aDir + vec3(wobble, wobble, wobble * 0.5);
          vec3 target = clamp(
            position + dir * (uPower * uExplode),
            -uBoxLimit, uBoxLimit
          );
          vec4 c1 = texture2D(uTexCurrent, aUv);
          vec4 c2 = texture2D(uTexNext, aUv);
          vColor = mix(c1.rgb, c2.rgb, uMix);
          vAlpha = mix(c1.a, c2.a, uMix) * uOpacity;
          vec4 mvPos = modelViewMatrix * vec4(target, 1.0);
          gl_Position  = projectionMatrix * mvPos;
          gl_PointSize = uPointSize / -mvPos.z;
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vAlpha;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          if (dot(d, d) > 0.25) discard;
          gl_FragColor = vec4(vColor, vAlpha);
        }
      `,
    });

    const particleMesh = new THREE.Points(pGeo, particleMat);
    group.add(particleMesh);

    if (hdrEnabled) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      new RGBELoader().load(HDR_URL, (hdr: THREE.DataTexture) => {
        scene.environment = pmrem.fromEquirectangular(hdr).texture;
        hdr.dispose();
        pmrem.dispose();
        invalidate();
      });
    }

    let lastIdx0 = -1;
    let lastIdx1 = -1;
    let lastSolidMap: THREE.Texture | null = null;
    let lastUOp = -999;
    let lastUEx = -999;
    let lastUMx = -999;

    const startTime = performance.now();

    function frame() {
      rafId = 0;
      if (!isVisible) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const alpha = 1 - Math.exp(-8 * dt);
      smoothProgress += (currentProgress - smoothProgress) * alpha;

      if (floatEnabled && !reducedMotion) {
        const t = (performance.now() - startTime) / 1000;
        group.position.y = Math.sin(t * floatSpeed * TWO_PI * 0.16) * floatAmplitude;
        group.rotation.z = Math.sin(t * floatSpeed * TWO_PI * 0.11) * 0.012;
      } else {
        group.position.y = 0;
        group.rotation.z = 0;
      }

      const len = textures.length;
      const scrollIndex = smoothProgress * (len + 1);

      const rot = scrollIndex * PI;
      const sign = scrollDirection === "right-to-left" ? -1 : 1;
      group.rotation.y = sign * rot;

      const pageIndex = Math.floor(scrollIndex);
      const pageProgress = scrollIndex - pageIndex;

      const idxCur = ((pageIndex % len) + len) % len;
      const idxNxt = (idxCur + 1) % len;

      if (idxCur !== lastIdx0) {
        pUniforms.uTexCurrent.value = textures[idxCur];
        lastIdx0 = idxCur;
      }
      if (idxNxt !== lastIdx1) {
        pUniforms.uTexNext.value = textures[idxNxt];
        lastIdx1 = idxNxt;
      }

      const fd = fadeRange;
      let solidOp = 1;
      let partOp = 0;
      let expl = 0;
      let mix = 0;

      if (pageProgress < fd) {
        const t = pageProgress / fd;
        const m = textures[idxCur];
        if (lastSolidMap !== m) {
          solidMat.map = m;
          solidMat.needsUpdate = true;
          lastSolidMap = m;
        }
        solidOp = 1 - t;
        partOp = t;
      } else if (pageProgress > 1 - fd) {
        const t = (pageProgress - (1 - fd)) / fd;
        const m = textures[idxNxt];
        if (lastSolidMap !== m) {
          solidMat.map = m;
          solidMat.needsUpdate = true;
          lastSolidMap = m;
        }
        solidOp = t;
        partOp = 1 - t;
        mix = 1;
      } else {
        solidOp = 0;
        partOp = 1;
        const mid = (pageProgress - fd) / (1 - fd * 2);
        expl = reducedMotion ? 0 : Math.sin(mid * PI);
        mix = smoothstep(0.3, 0.7, mid);
      }

      if (solidMat.opacity !== solidOp) solidMat.opacity = solidOp;
      if (Math.abs(lastUOp - partOp) > 1e-4) {
        pUniforms.uOpacity.value = partOp;
        lastUOp = partOp;
      }
      if (Math.abs(lastUEx - expl) > 1e-4) {
        pUniforms.uExplode.value = expl;
        lastUEx = expl;
      }
      if (Math.abs(lastUMx - mix) > 1e-4) {
        pUniforms.uMix.value = mix;
        lastUMx = mix;
      }

      solidMesh.visible = solidOp > 0.01;
      particleMesh.visible = partOp > 0.01;

      renderer.render(scene, camera);

      if (floatEnabled && !reducedMotion) {
        rafId = requestAnimationFrame(frame);
      } else {
        stableCount = Math.abs(currentProgress - smoothProgress) < 0.0001 ? stableCount + 1 : 0;
        if (stableCount < 10) rafId = requestAnimationFrame(frame);
      }
    }

    function invalidate() {
      stableCount = 0;
      if (!rafId) rafId = requestAnimationFrame(frame);
    }

    updateScrollRef.current = (v) => {
      currentProgress = v;
      invalidate();
    };

    invalidate();

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) invalidate();
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      invalidate();
    });
    ro.observe(mount);

    return () => {
      updateScrollRef.current = null;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      pGeo.dispose();
      glassGeo.dispose();
      solidGeo.dispose();
      particleMat.dispose();
      glassMat.dispose();
      solidMat.dispose();
      textures.forEach((t) => t.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join("|"), boxWidth, boxHeight, boxDepth, imageFill, particleCountX, particleCountY, explosionPower, fadeRange, hdrEnabled, scrollDirection, floatEnabled, floatAmplitude, floatSpeed]);

  React.useEffect(() => {
    if (uniformsRef.current) uniformsRef.current.uPointSize.value = particleSize;
  }, [particleSize]);

  return (
    <div ref={containerRef} className={cn("w-full", className)} style={{ height: `${(imgCount + 1) * 100}vh`, ...style }} {...props}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: backgroundColor }}>
        <div ref={mountRef} role="img" aria-label={alt || "Interactive 3D glass box"} className="h-full w-full" />
      </div>
    </div>
  );
}
