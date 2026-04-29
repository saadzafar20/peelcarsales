import { ImageResponse } from "next/og";

export const alt = "Peel Car Sales — Used Cars in Mississauga & Oakville";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0b1b2b 0%, #122a44 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        <span style={{ color: "#c8102e", fontSize: 56 }}>P</span>
        <span>PEEL CAR SALES</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Used Cars in Mississauga &amp; Oakville
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <span>OMVIC + UCDA Licensed</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: "#f59e0b" }}>AutoTrader Best Priced 2024 &amp; 2025</span>
        </div>
      </div>
      <div
        style={{
          fontSize: 22,
          opacity: 0.7,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span>peelcarsales.ca</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>905-678-0048</span>
      </div>
    </div>,
    size,
  );
}
