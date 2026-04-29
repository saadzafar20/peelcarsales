"use client";

/**
 * Last-resort root error boundary. Renders its own <html> + <body> because
 * the root layout itself failed. Keep dependencies here to a minimum — no
 * fonts, no Tailwind plugins, no third-party clients.
 */
export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0b1b2b",
          color: "#fff",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600, margin: 0 }}>We hit a wall.</h1>
          <p style={{ opacity: 0.75, margin: "1rem 0" }}>
            Something broke at the root. Please refresh the page or call us at{" "}
            <a href="tel:9056780048" style={{ color: "#fff" }}>
              905-678-0048
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "#c8102e",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "1rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
