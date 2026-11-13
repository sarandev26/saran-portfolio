"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, EASE } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import ContactDialog from "@/components/ui/ContactDialog";
import styles from "./Hero.module.css";

const STATS_LEFT = [
  { n: 2, suffix: "+", label: "Years of experience", icon: "/images/icons/years.png" },
];
const STATS_RIGHT = [
  { n: 3, suffix: "", label: "Roles", icon: "/images/icons/countries.png" },
];

/* ambient particles — position (vw/vh %), size px, tone */
const PARTICLES = [
  { x: 8, y: 26, s: 6, accent: true },
  { x: 14, y: 62, s: 4, accent: false },
  { x: 5, y: 78, s: 5, accent: false },
  { x: 90, y: 22, s: 5, accent: false },
  { x: 94, y: 58, s: 6, accent: true },
  { x: 86, y: 82, s: 4, accent: false },
];

function StatCard({ n, suffix, label, icon }: { n: number; suffix: string; label: string; icon: string }) {
  return (
    <div className={styles.statCard}>
      <img className={styles.statIcon} src={icon} alt="" aria-hidden="true" />
      <div className={styles.statNum} data-count={n}>
        <span className={styles.countVal}>{n}</span>
        {suffix ? <i>{suffix}</i> : null}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactAnchor, setContactAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* ---------- Entrance: plays when the hero ARRIVES (revealed by the
         tunnel opening above it), not on page load ---------- */
      const tl = gsap.timeline({
        defaults: { ease: EASE.outExpo, immediateRender: false },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.from(`.${styles.ambient} > *`, { autoAlpha: 0, duration: 1.8, stagger: 0.06, ease: "power1.out" }, 0)
        .from(`.${styles.kicker}`, { y: 22, autoAlpha: 0, duration: 0.7 }, 0.1)
        .from(`.${styles.row}`, { y: 70, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, "-=0.45")
        .from(`.${styles.sub}`, { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.7")
        .from(`.${styles.ctas} > *`, { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.55")
        .from(
          `.${styles.arch}`,
          { scaleY: 0.9, autoAlpha: 0, transformOrigin: "bottom center", duration: 1.0, ease: "power3.out" },
          "<0.08"
        )
        .from(`.${styles.portrait}, .${styles.portraitFallback}`, { y: 110, autoAlpha: 0, duration: 1.15, ease: "power3.out" }, "-=0.75")
        .from(
          `.${styles.statCard}`,
          { y: 40, autoAlpha: 0, duration: 0.85, stagger: 0.09, ease: "back.out(1.3)" },
          "-=0.75"
        )
        .from(`.${styles.scrollCue}`, { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.6");

      /* stat count-up — synced to the entrance timeline, not page load */
      tl.call(
        () => {
          gsap.utils.toArray<HTMLElement>(`.${styles.statNum}`).forEach((numEl) => {
            const target = Number(numEl.dataset.count || 0);
            const span = numEl.querySelector(`.${styles.countVal}`);
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.3,
              ease: "power2.out",
              onUpdate: () => {
                if (span) {
                  span.textContent = String(Math.round(obj.v));
                }
              },
            });
          });
        },
        [],
        "-=0.9"
      );

      /* ---------- Idle life: particles gently float ---------- */
      const particleTweens: gsap.core.Tween[] = [];
      gsap.utils.toArray<HTMLElement>(`.${styles.particle}`).forEach((p) => {
        const tw = gsap.to(p, {
          y: `+=${gsap.utils.random(-18, 18)}`,
          x: `+=${gsap.utils.random(-10, 10)}`,
          duration: gsap.utils.random(4, 7),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });
        particleTweens.push(tw);
      });

      /* ---------- Mouse: layered parallax + a breath of portrait tilt ---------- */
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");
      const setters = layers.map((layer) => ({
        depth: Number(layer.dataset.depth),
        x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      const portraitEl = el.querySelector(`.${styles.portrait}, .${styles.portraitFallback}`);
      const tilt = portraitEl
        ? gsap.quickTo(portraitEl, "rotation", { duration: 1.4, ease: "power3.out" })
        : null;
      const onMove = (e: MouseEvent) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        setters.forEach((s) => {
          s.x(cx * s.depth * 80);
          s.y(cy * s.depth * 44);
        });
        tilt?.(cx * 1.2);
      };
      window.addEventListener("mousemove", onMove);

      /* ---------- Stacked Cover Transition: hero remains 100% visible & rendered underneath.
         Only a subtle parallax translation; NEVER animate opacity or visibility mid-scroll. ---------- */
      const sceneHold = el.closest("[data-scene]") || el;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sceneHold,
            start: "top top",
            end: "+=100%",
            scrub: true,
            onLeave: () => {
              particleTweens.forEach((t) => t.pause());
            },
            onEnterBack: () => {
              particleTweens.forEach((t) => t.resume());
            },
          },
        })
        .to(`.${styles.head}`, { y: -30, ease: "none" }, 0)
        .to(`.${styles.stageRow}`, { y: -15, ease: "none" }, 0);

      return () => {
        window.removeEventListener("mousemove", onMove);
        particleTweens.forEach((t) => t.kill());
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} id="home" ref={root}>
      {/* ---- clean ambient: subtle symmetric particles and accents ---- */}
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.plusA}>+</span>
        <span className={styles.plusB}>+</span>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`${styles.particle} ${p.accent ? styles.particleAccent : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          />
        ))}
      </div>

      {/* ---- Head ---- */}
      <div className={styles.head} data-depth="0.01">
        <p className={styles.kicker}>UI/UX &amp; AI Web and Product Designer</p>
        <h1 className={styles.h1}>
          <span className={styles.row}>
            {/* Active headline: */}
            Crafting premium digital products and{" "}
            <em className={`${styles.serif} ${styles.red}`}>3D animated websites.</em>

            {/* Alternative headline options (uncomment to swap):
            Option A:
            Designing digital products and{" "}
            <em className={`${styles.serif} ${styles.red}`}>premium 3D animated websites.</em>

            Option B:
            Product design with clarity. Websites{" "}
            <em className={`${styles.serif} ${styles.red}`}>with motion.</em>

            Option C:
            UI/UX design and{" "}
            <em className={`${styles.serif} ${styles.red}`}>premium 3D websites,</em>
            {" "}crafted end to end.
            */}
          </span>
        </h1>
        <p className={styles.sub}>
          A detail-oriented designer with 2+ years of experience crafting intuitive, user-centered products across web, mobile and software. I also build premium 3D and animated websites with AI-powered vibe coding.
        </p>
        <div className={styles.ctas}>
          <Button href="#work" variant="primary" arrow>
            View my work
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              setContactAnchor(e.currentTarget);
              setContactOpen(true);
            }}
          >
            Let&apos;s chat
          </Button>
          <Button href="/Saran_Resume.pdf" variant="dark" target="_blank">
            Download CV
          </Button>
        </div>
      </div>

      {/* ---- Stage ---- */}
      <div className={styles.stageRow}>
        <div className={`${styles.side} ${styles.sideL}`}>
          {STATS_LEFT.map((s) => (
            <StatCard key={s.label} n={s.n} suffix={s.suffix} icon={s.icon} label={s.label} />
          ))}
        </div>

        <div className={styles.stage}>
          <div className={styles.arch} data-depth="0.02" aria-hidden="true" />

          {!imgFailed ? (
            <img
              className={styles.portrait}
              src="/images/saran-hero.jpg"
              alt="Saran SM — UI/UX & AI Web and Product Designer"
              onError={() => setImgFailed(true)}
              data-depth="0.03"
            />
          ) : (
            <div className={styles.portraitFallback} data-depth="0.03" aria-label="Saran SM">
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)" }}>SSM</span>
              <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em" }}>Saran SM</span>
            </div>
          )}
        </div>

        <div className={`${styles.side} ${styles.sideR}`}>
          {STATS_RIGHT.map((s) => (
            <StatCard key={s.label} n={s.n} suffix={s.suffix} icon={s.icon} label={s.label} />
          ))}
        </div>
      </div>

      {/* ---- Bottom: a single quiet cue ---- */}
      <div className={styles.scrollCue}>
        <span>Scroll to explore</span>
        <span className={styles.cueArrow} aria-hidden="true">
          ↓
        </span>
      </div>

      {/* Reusable Contact Chooser Dialog */}
      <ContactDialog
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        anchorEl={contactAnchor}
      />
    </section>
  );
}
