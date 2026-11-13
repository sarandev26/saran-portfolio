import Link from "next/link";

export default function LabBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "18px 28px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "var(--ink-3)",
      }}
    >
      <Link href="/" style={{ color: "var(--ink-2)", whiteSpace: "nowrap" }}>
        ← Back to portfolio
      </Link>
      <span style={{ textAlign: "right" }}>
        Scroll to travel · pointer leans camera
      </span>
    </div>
  );
}
