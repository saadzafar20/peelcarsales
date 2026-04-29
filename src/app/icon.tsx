import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 22,
        background: "#0b1b2b",
        color: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        letterSpacing: "-0.05em",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <span style={{ color: "#c8102e" }}>P</span>
    </div>,
    size,
  );
}
