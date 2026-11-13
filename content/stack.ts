/* My Design Stack — Saran SM's design, AI, and vibe coding tools. */

export type Tool = {
  name: string;
  group: "Design" | "AI design & prototyping" | "Vibe coding & building";
  src?: string; // Verified SVG or 512px PNG logo path
  color?: string;
  isMissing?: boolean;
};

export const TOOLS: Tool[] = [
  /* — Design — */
  { name: "Figma", group: "Design", src: "/images/logos/figma.svg" },
  { name: "Framer", group: "Design", src: "/images/logos/framer.svg" },
  { name: "Canva", group: "Design", src: "/images/logos/canva.png" },

  /* — AI design & prototyping — */
  { name: "ChatGPT", group: "AI design & prototyping", src: "/images/logos/chatgpt.png" },
  { name: "Claude", group: "AI design & prototyping", src: "/images/logos/claude.svg" },
  { name: "Gemini", group: "AI design & prototyping", src: "/images/logos/gemini.svg" },
  { name: "Stitch", group: "AI design & prototyping", src: "/images/logos/stitch.png" },
  { name: "v0", group: "AI design & prototyping", src: "/images/logos/v0.svg" },
  { name: "Bloom", group: "AI design & prototyping", src: "/images/logos/bloom.png" },
  { name: "Rork", group: "AI design & prototyping", src: "/images/logos/rork.png" },
  { name: "Google Flow", group: "AI design & prototyping", src: "/images/logos/google-flow.png" },

  /* — Vibe coding & building — */
  { name: "Lovable", group: "Vibe coding & building", src: "/images/logos/lovable.svg" },
  { name: "Replit", group: "Vibe coding & building", src: "/images/logos/replit.svg" },
  { name: "Base44", group: "Vibe coding & building", src: "/images/logos/base44.png" },
  { name: "Antigravity", group: "Vibe coding & building", src: "/images/logos/antigravity.svg" },
  { name: "Cursor", group: "Vibe coding & building", src: "/images/logos/cursor.png" },
];
