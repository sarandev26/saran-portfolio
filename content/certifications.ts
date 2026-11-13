/* Credentials — professional certification records for Saran SM. */

export type Cert = {
  no: string;
  issuer: string;
  title: string;
  logo: { src: string; aspect: number };
  skills?: string[];
  description?: string;
};

export const CERTS: Cert[] = [
  {
    no: "1.1",
    issuer: "Google",
    logo: { src: "/images/logos/google.svg", aspect: 1 },
    title: "Google UX Design",
    skills: [
      "User Experience (UX) Research",
      "Wireframing & Prototyping",
      "Design Systems & Component Design in Figma",
      "Usability Studies & Interaction Design",
    ],
  },
  {
    no: "1.2",
    issuer: "Accenture",
    logo: { src: "/images/logos/accenture.svg", aspect: 1 },
    title: "Digital Skills: User Experience",
    description:
      "Accenture digital credential focused on user-centred design foundations, user research essentials, interaction models, and digital usability.",
  },
  {
    no: "1.3",
    issuer: "Leadpro Infotech",
    logo: { src: "/images/logos/leadpro-infotech.png", aspect: 1 },
    title: "Professional Certificate in UI/UX Design",
    description:
      "Professional hands-on certification covering industry UI/UX design workflows, responsive interfaces, component libraries, and interactive prototyping.",
  },
];
