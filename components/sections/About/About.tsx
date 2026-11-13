"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, EASE } from "@/lib/gsap";
import VelocityMarquee from "@/components/ui/VelocityMarquee";
import styles from "./About.module.css";

const MARQUEE_ROWS = [
  {
    items: [
      "UI/UX",
      "Product Design",
      "Web Design",
      "Mobile Apps",
      "Dashboards",
    ],
    velocity: 32,
  },
  {
    items: [
      "Vibe Coding",
      "3D Scroll Websites",
      "AI Design",
      "Prototyping",
      "UX Strategy",
    ],
    velocity: -28,
    outline: true,
  },
];

const PHILOSOPHY = [
  {
    num: "01",
    title: "Story first",
    body: "Every great design begins with an even better story.",
  },
  {
    num: "02",
    title: "Clarity over noise",
    body: "Messy requirements become clean, usable interfaces.",
  },
  {
    num: "03",
    title: "Design with AI",
    body: "Design it, then build it with AI. AI speeds up prototyping and building — human judgment decides what ships.",
  },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* shared reveal grammar: y + fade, soft expo, no visibility flipping */
      const reveal = (targets: gsap.TweenTarget, trigger: Element, vars: gsap.TweenVars = {}) =>
        gsap.from(targets, {
          y: 44,
          opacity: 0,
          duration: 1,
          ease: EASE.outExpo,
          stagger: 0.1,
          immediateRender: false,
          scrollTrigger: { trigger, start: "top 82%" },
          ...vars,
        });

      reveal([`.${styles.eyebrow}`, `.${styles.h2}`, `.${styles.bodyText}`], el.querySelector(`.${styles.header}`)!);
      reveal(`.${styles.philoItem}`, el.querySelector(`.${styles.philoCards}`)!, { stagger: 0.12 });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.about} id="about" ref={root}>
      <VelocityMarquee rows={MARQUEE_ROWS} />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            About
          </p>
          <h2 className={styles.h2}>
            I&apos;m Saran, a <em className={styles.serif}>UI/UX and AI</em> web and product designer based in Coimbatore.
          </h2>
          <p className={styles.bodyText}>
            I&apos;m a detail-oriented designer skilled in design thinking, prototyping, UX strategy, AI-powered designing, no-code development and creative problem-solving. I transform complex ideas and messy requirements into clean, usable products, from industrial software and dashboards to websites and mobile apps. Now I also vibe-code, building premium, luxury-feel 3D scroll websites with AI tools.
          </p>
        </div>

        <div className={styles.philoCards}>
          {PHILOSOPHY.map((card) => (
            <div className={styles.philoItem} key={card.num}>
              <span className={styles.philoNum}>{card.num}</span>
              <h3 className={styles.philoTitle}>{card.title}</h3>
              <p className={styles.philoBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
