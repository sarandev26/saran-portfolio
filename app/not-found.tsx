import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        gap: 0,
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.2em",
          color: "var(--ink-3)",
        }}
      >
        404 · Page Not Found
      </p>
      <h1
        style={{
          marginTop: 18,
          fontWeight: 900,
          fontSize: "clamp(40px, 7vw, 88px)",
          letterSpacing: "-0.035em",
          lineHeight: 1,
        }}
      >
        You&apos;ve wandered into
        <br />
        <em
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--accent)",
          }}
        >
          the void.
        </em>
      </h1>
      <Link
        href="/"
        style={{
          marginTop: 34,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 13,
          padding: "12px 22px",
          borderRadius: 999,
        }}
      >
        Return to home →
      </Link>
    </main>
  );
}
