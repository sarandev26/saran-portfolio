/* Single source of truth for site-wide constants.
   Set NEXT_PUBLIC_SITE_URL in Vercel once the domain exists —
   everything (sitemap, robots, OG, JSON-LD) follows automatically. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CONTACT = {
  whatsapp: "919952875596",
  email: "smsaranx03@gmail.com",
  whatsappPrefill: "Hi Saran, I found your portfolio and I'd like to talk about a role or project.",
  emailSubject: "Portfolio enquiry",
  emailBody: "Hi Saran,\n\n",
};

export const PERSON = {
  name: "Saran SM",
  jobTitle: "UI/UX & AI Web and Product Designer",
  email: CONTACT.email,
  location: "Coimbatore, India",
  /* exact profile URLs — also consumed by JSON-LD */
  sameAs: [
    "https://www.linkedin.com/in/saran-sm-3b297725a",
  ],
};
