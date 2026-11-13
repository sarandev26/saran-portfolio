/* THE JOURNEY — the 4 chapters the light tunnel travels through for Saran SM. */

export type Chapter = {
  id: string;
  headline: string;
  date: string;
  company?: string;
  description: string;
  bridge?: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "internship",
    headline: "Internship",
    date: "April 2024 – May 2024",
    company: "CognoRise InfoTech · Chennai",
    description:
      "UI/UX Design Intern. Worked with senior designers on user research, wireframing and prototyping.",
    bridge: "Hands-on foundation in user research, empathy, and collaborative wireframing.",
  },
  {
    id: "first-role",
    headline: "First role",
    date: "June 2024 – January 2025",
    company: "Brillium Tech Solutions · Coimbatore",
    description:
      "UI/UX Design Associate. Worked on multiple client projects and launched several live websites, building strong skills in design systems, prototyping and component libraries.",
    bridge: "Bridging the gap between Figma design systems and live client websites.",
  },
  {
    id: "second-role",
    headline: "Second role",
    date: "February 2025 – Current",
    company: "TFrenzy · West Bengal",
    description:
      "UI/UX Designer and current employer. Designing industrial software, dashboards and mobile apps for the shop floor, factory safety and logistics.",
    bridge: "Turning complex industrial data and telemetry into decisive, usable interfaces.",
  },
  {
    id: "beyond-work",
    headline: "Beyond work",
    date: "Personal",
    description:
      "Outside my job, I'm learning AI-powered design and vibe coding, building premium, luxury-feel animated 3D scroll websites on my own.",
    bridge: "Merging rapid AI workflows with human craft and immersive 3D experiences.",
  },
];
