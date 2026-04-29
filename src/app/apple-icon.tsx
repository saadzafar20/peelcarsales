import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 130,
        background: "#0b1b2b",
        color: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        letterSpacing: "-0.06em",
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderRadius: 40,
      }}
    >
      <span style={{ color: "#c8102e" }}>P</span>
    </div>,
    size,
  );
}
