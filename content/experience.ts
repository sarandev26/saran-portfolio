/* Professional experience — Saran SM, exactly 3 roles (newest first). */

export type Role = {
  company: string;
  role: string;
  type: string;
  period: string;
  summary: string;
  color: string;
  fg: "light" | "dark";
  focusAreas: string[];
  selectedProjects?: string[];
  projectFilter?: string;
  projectCount?: number;
  learned?: string;
};

export const ROLES: Role[] = [
  {
    company: "TFrenzy Private Limited, West Bengal",
    role: "UI/UX Designer",
    type: "Current employer",
    period: "Feb 2025 – Current",
    summary:
      "Designing UI for industrial-focused applications including factory safety monitoring, machinery asset tracking and operational dashboards. Building reusable design systems and integrating AI-assisted workflows for rapid prototyping. Collaborating with developers and project teams to deliver production-ready screens.",
    color: "#0072E3",
    fg: "light",
    focusAreas: [
      "Industrial software",
      "Dashboards",
      "Desktop and mobile apps",
      "Design systems",
      "AI-assisted prototyping",
      "Developer handoff",
    ],
    selectedProjects: [
      "Asset Manager Mobile App",
      "Conveyor Belt Health Monitoring System",
      "Industrial Safety Monitoring System",
      "Plannpost Web App",
      "AI-Powered ANPR",
    ],
    projectFilter: "TFrenzy",
    projectCount: 14,
  },
  {
    company: "Brillium Tech Solutions Pvt Ltd, Coimbatore",
    role: "UI/UX Design Associate",
    type: "First role",
    period: "June 2024 – Jan 2025",
    summary:
      "Worked on multiple client projects, contributing to the successful launch of several live websites. Developed strong proficiency in design systems, prototyping, component libraries and collaborative workflows, with hands-on experience in user research and user-centered product development.",
    color: "#AB54F7",
    fg: "light",
    focusAreas: [
      "Client websites",
      "User research",
      "Wireframing and prototyping",
      "Design systems",
      "Component libraries",
    ],
    selectedProjects: [
      "Brillium Tech Solutions Website",
      "Youth Lead Voices Website",
      "Black Panda Enterprises Website",
      "Coimbatore Boardgame House Website",
      "Safer Biofuels Website",
      "AIVET Website",
    ],
  },
  {
    company: "CognoRise InfoTech, Chennai",
    role: "UI/UX Design Intern",
    type: "Internship",
    period: "April 2024 – May 2024",
    summary:
      "Worked collaboratively with senior designers, supporting user research, wireframing and prototyping.",
    color: "#FF6A00",
    fg: "light",
    focusAreas: [
      "User research",
      "Wireframing",
      "Prototyping",
      "Working with senior designers",
    ],
    learned: "My first hands-on experience of the design process alongside senior designers.",
  },
];
