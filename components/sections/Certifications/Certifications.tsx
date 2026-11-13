"use client";

/*
 * CREDENTIALS — pitch-deck cascade.
 * 16:10 slide panels descending diagonally through the centre.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { sceneScrub } from "@/lib/scene";
import { CERTS } from "@/content/certifications";
import styles from "./Certifications.module.css";

const ENTER_X = 118;
const ENTER_Z = -150;
const BACK_Z = -520;
const BACK_SCALE = 0.2;
const BACK_MIN_OP = 0.18;
const CULL_IN = 1.25;
const CULL_BACK = 3.2;

type Panel = { kind: "cert"; index: number };

const PANELS: Panel[] = CERTS.map((_, index) => ({ kind: "cert", index }));
const TONE = ["dark", "light", "dark"] as const;

export default function Certifications() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`);
      const counter = el.querySelector<HTMLElement>(`.${styles.count}`);
      const n = panels.length;
      let active = -1;

      el.classList.add(styles.deckMode);

      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        panels.forEach((p, k) => p.classList.toggle(styles.on, k === i));
        if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      };

      const place = (p: number) => {
        for (let i = 0; i < n; i++) {
          const el2 = panels[i];
          const d = i - p;

          if (d > CULL_IN || d < -CULL_BACK) {
            el2.style.visibility = "hidden";
            continue;
          }
          el2.style.visibility = "visible";

          if (d >= 0) {
            const k = Math.min(1, d);
            el2.style.transform = `translate3d(${(k * ENTER_X).toFixed(2)}%, 0, ${(k * ENTER_Z).toFixed(1)}px)`;
            el2.style.opacity = "1";
            el2.style.filter = "";
            el2.style.zIndex = String(200 - i);
          } else {
            const t = Math.min(1, -d / 1.1);
            const scale = (1 - t * BACK_SCALE).toFixed(3);
            el2.style.transform = `translate3d(0, 0, ${(t * BACK_Z).toFixed(1)}px) scale(${scale})`;
            el2.style.opacity = String(Math.max(BACK_MIN_OP, 1 - t * 0.7));
            el2.style.filter = t > 0.3 ? `blur(${((t - 0.3) * 3).toFixed(1)}px)` : "";
            el2.style.zIndex = String(100 - i);
          }
        }
        setActive(Math.round(gsap.utils.clamp(0, n - 1, p)));
      };

      let targetP = 0;
      let currP = 0;
      const tick = () => {
        currP += (targetP - currP) * 0.12;
        place(currP);
      };
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({
        ...sceneScrub(el),
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetP = self.progress * (n - 1);
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        el.classList.remove(styles.deckMode);
      };
    });

    mm.add("(max-width: 1000px), (prefers-reduced-motion: reduce)", () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(`.${styles.panel}`).forEach((p) => {
        gsap.from(p, {
          y: 40,
          autoAlpha: 0,
          duration: 0.85,
          ease: EASE.outExpo,
          immediateRender: false,
          scrollTrigger: { trigger: p, start: "top 88%" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className={styles.certifications} id="credentials" ref={root}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Credentials
        </p>
        <h2 className={styles.h2}>
          Verified <em className={styles.serif}>certifications</em>
        </h2>
      </div>

      <div className={styles.stageWrap}>
        <div className={styles.stage}>
          {PANELS.map((p, i) => {
            const tone = TONE[i % TONE.length];
            const cls = `${styles.panel} ${styles[tone]} ${i === 0 ? styles.on : ""}`;
            const c = CERTS[p.index];

            return (
              <article className={cls} key={c.title} style={{ zIndex: 200 - i }}>
                <div className={styles.band}>
                  <span className={styles.no}>{c.no}</span>
                  <span className={styles.kind}>Certification</span>
                </div>

                <div className={styles.issuerRow}>
                  <span className={styles.logoPlate} title={c.issuer}>
                    <img
                      src={c.logo.src}
                      alt={`${c.issuer} logo`}
                      style={{ aspectRatio: c.logo.aspect }}
                    />
                    <span className="srOnly">{c.issuer}</span>
                  </span>
                  <span className={styles.issuerName}>{c.issuer}</span>
                </div>

                <h3 className={styles.title}>{c.title}</h3>

                <div className={styles.detail}>
                  <div className={styles.cols}>
                    <dl className={styles.record}>
                      <div>
                        <dt>Issued By</dt>
                        <dd>{c.issuer}</dd>
                      </div>
                    </dl>

                    {c.skills && c.skills.length > 0 ? (
                      <>
                        <p className={styles.colLbl}>Core competencies</p>
                        <ul className={styles.skills}>
                          {c.skills.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </>
                    ) : c.description ? (
                      <div className={styles.descBlock}>
                        <p className={styles.colLbl}>Overview</p>
                        <p className={styles.descriptionText}>{c.description}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.foot}>
        <span className={styles.brandFoot}>
          <b>06</b> Saran SM
        </span>
        <span className={styles.count}>
          01 / {String(PANELS.length).padStart(2, "0")}
        </span>
        <span className={styles.footLbl}>Scroll to cycle credentials</span>
      </div>
    </section>
  );
}
