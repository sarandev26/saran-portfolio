"use client";

/*
 * CONNECT — the closing scene.
 * Composed collage layout with 4 photographs around headline,
 * slight rotation and parallax drift, clean typography, direct contact channels.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import ContactDialog from "@/components/ui/ContactDialog";
import styles from "./Connect.module.css";

const COLLAGE_PHOTOS = [
  {
    id: "photo-tl",
    src: "/images/connect/connect-01.jpg",
    alt: "Saran SM wearing a pale yellow button-down shirt and black trousers, smiling with hands in pockets",
    aspectRatio: "3 / 4",
    objectPosition: "center 20%",
    rotate: -4,
    parallaxY: -35,
    posClass: styles.photoTopLeft,
  },
  {
    id: "photo-tr",
    src: "/images/connect/connect-02.jpg",
    alt: "Saran SM wearing a navy blue button-down shirt and grey trousers, standing in front of wooden paneling and green potted plants",
    aspectRatio: "3 / 4",
    objectPosition: "center 20%",
    rotate: 3.5,
    parallaxY: -45,
    posClass: styles.photoTopRight,
  },
  {
    id: "photo-br",
    src: "/images/connect/connect-03.jpg",
    alt: "Saran SM wearing a white patterned short-sleeved shirt, taking a phone mirror selfie in front of a red wall with bold typography",
    aspectRatio: "3 / 4",
    objectPosition: "center 26%",
    rotate: -3.5,
    parallaxY: 40,
    posClass: styles.photoBottomRight,
  },
  {
    id: "photo-bl",
    src: "/images/connect/connect-04.jpg",
    alt: "Saran SM wearing a black academic graduation gown with a red stole, holding a degree certificate outdoors",
    aspectRatio: "3 / 4",
    objectPosition: "center 18%",
    rotate: 2.5,
    parallaxY: 30,
    posClass: styles.photoBottomLeft,
  },
] as const;

const MARKS: Record<string, ReactNode> = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  cv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

const SOCIALS = [
  { name: "Email", mark: "email", isContact: true },
  { name: "LinkedIn", mark: "linkedin", href: "https://www.linkedin.com/in/saran-sm-3b297725a" },
  { name: "Download CV", mark: "cv", href: "/Saran_Resume.pdf" },
] as const;

export default function Connect() {
  const root = useRef<HTMLElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactAnchor, setContactAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* reveal head */
      gsap.from(`.${styles.head} > *`, {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.outExpo,
        stagger: 0.09,
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });

      /* reveal collage cards */
      gsap.from(`.${styles.collageCard}`, {
        y: 60,
        autoAlpha: 0,
        duration: 1.0,
        ease: EASE.outExpo,
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });

      /* subtle parallax drift across section scroll */
      COLLAGE_PHOTOS.forEach((photo) => {
        const card = el.querySelector<HTMLElement>(`.${photo.posClass}`);
        if (card) {
          gsap.to(card, {
            y: photo.parallaxY,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      });

      /* reveal socials */
      gsap.from(`.${styles.socials} > *`, {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE.outExpo,
        stagger: 0.07,
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.socials}`, start: "top 90%" },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.connect} id="connect" ref={root}>
      <div className={styles.stage}>
        {/* Head: Title, Subline, and Contact CTA */}
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            Connect
          </p>
          <h2 className={styles.h2}>
            Open to roles and <em className={styles.serif}>projects.</em>
          </h2>
          <p className={styles.lede}>
            Best at turning messy requirements into clean, usable interfaces.
          </p>
          <div className={styles.cta}>
            <Button
              variant="primary"
              arrow
              onClick={(e) => {
                setContactAnchor(e.currentTarget);
                setContactOpen(true);
              }}
            >
              Get in touch
            </Button>
          </div>
        </div>

        {/* The 4 composed collage cards around headline on desktop / tidy 2x2 grid on mobile & tablet */}
        <div className={styles.collageGroup}>
          {COLLAGE_PHOTOS.map((p) => (
            <div
              key={p.id}
              className={`${styles.collageCard} ${p.posClass}`}
              style={{
                ["--card-rotate" as string]: `${p.rotate}deg`,
                ["--card-rotate-mobile" as string]: `${p.rotate > 0 ? 1 : -1}deg`,
              }}
            >
              <div
                className={styles.imageWrapper}
                style={{ aspectRatio: p.aspectRatio }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: p.objectPosition }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* social channels: Email, LinkedIn, Download CV */}
      <div className={styles.socials}>
        {SOCIALS.map((s) =>
          "isContact" in s && s.isContact ? (
            <button
              type="button"
              key={s.name}
              className={`${styles.social} ${styles.socialBtn}`}
              onClick={(e) => {
                setContactAnchor(e.currentTarget);
                setContactOpen(true);
              }}
            >
              <span className={styles.glyph}>
                {MARKS[s.mark]}
              </span>
              <span className={styles.roll}>
                <span>{s.name}</span>
                <span aria-hidden="true">{s.name}</span>
              </span>
              <span className={styles.arrow}>↗</span>
            </button>
          ) : (
            <a
              key={s.name}
              href={"href" in s ? s.href : "#"}
              className={styles.social}
              target={"href" in s && (s.href.startsWith("http") || s.href.endsWith(".pdf")) ? "_blank" : undefined}
              rel={"href" in s && s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span className={styles.glyph}>
                {MARKS[s.mark]}
              </span>
              <span className={styles.roll}>
                <span>{s.name}</span>
                <span aria-hidden="true">{s.name}</span>
              </span>
              <span className={styles.arrow}>↗</span>
            </a>
          )
        )}
      </div>

      <footer className={styles.footer}>
        <span>© 2026 Saran SM · UI/UX &amp; AI Web and Product Designer</span>
        <a href="#home" className={styles.top}>
          Back to top ↑
        </a>
      </footer>

      {/* Reusable Contact Chooser Dialog */}
      <ContactDialog
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        anchorEl={contactAnchor}
      />
    </section>
  );
}
