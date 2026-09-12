import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 42,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: "#ffffff" }} />
          REACT FRAME
        </div>

        <div style={{ display: "flex", marginTop: 36, fontSize: 68, fontWeight: 700, color: "#ffffff", lineHeight: 1.15, maxWidth: 920 }}>
          UI library for Design Engineers
        </div>

        <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "rgba(255,255,255,0.55)", maxWidth: 820 }}>
          251+ free and premium React + Tailwind components. Copy, paste, own the code.
        </div>
      </div>
    ),
    { ...size },
  );
}
