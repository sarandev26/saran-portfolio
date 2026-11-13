"use client";

/*
 * EXPERIENCE — centred stacked panel composition.
 * Stack geometry: waiting panels recede up + right + back; active panel centered;
 * passing panels dissolve down + back.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { sceneScrub } from "@/lib/scene";
import { ROLES } from "@/content/experience";
import styles from "./Experience.module.css";

const DEPTH = 3;

const UP = 52;
const RIGHT = 18;
const BACK = 72;
const TILT = 6;

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () => {
      const boards = gsap.utils.toArray<HTMLElement>(`.${styles.board}`);
      const navItems = gsap.utils.toArray<HTMLElement>(`.${styles.navItem}`);
      const counter = el.querySelector<HTMLElement>(`.${styles.count}`);
      const tint = el.querySelector<HTMLElement>(`.${styles.tint}`);
      const n = boards.length;
      let active = -1;

      el.classList.add(styles.deckMode);

      const setActive = (idx: number) => {
        if (idx === active) return;
        active = idx;
        boards.forEach((b, i) => b.classList.toggle(styles.on, i === idx));
        navItems.forEach((it, i) => it.classList.toggle(styles.navOn, i === idx));
        if (counter) counter.textContent = `0${idx + 1} / 0${n}`;
        if (tint) tint.style.background = `${ROLES[idx].color}12`;
      };

      const place = (p: number) => {
        for (let i = 0; i < n; i++) {
          const d = i - p;
          const b = boards[i];

          if (d > DEPTH + 0.6 || d < -1.1) {
            b.style.visibility = "hidden";
            continue;
          }
          b.style.visibility = "visible";

          if (d >= 0) {
            const k = Math.min(d, DEPTH);
            b.style.transform =
              `translate3d(${(k * RIGHT).toFixed(1)}px, ${(-k * UP).toFixed(1)}px, ${(-k * BACK).toFixed(1)}px)` +
              ` scale(${(1 - k * 0.028).toFixed(3)})`;
            b.style.opacity = String(Math.max(0, 1 - k * 0.16));
            b.style.filter = k > 1.2 ? `blur(${Math.min(3, (k - 1.2) * 1.2).toFixed(2)}px)` : "";
            b.style.zIndex = String(200 - Math.round(k * 10));
          } else {
            const t = Math.min(1, -d / 1.1);
            b.style.transform =
              `translate3d(${(-t * 40).toFixed(1)}px, ${(t * 230).toFixed(1)}px, ${(-t * 320).toFixed(1)}px)` +
              ` scale(${(1 - t * 0.06).toFixed(3)})`;
            b.style.opacity = String(Math.max(0, 1 - t * 1.35));
            b.style.filter = t > 0.25 ? `blur(${((t - 0.25) * 5).toFixed(2)}px)` : "";
            b.style.zIndex = "250";
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

      /* pointer parallax */
      const stage = el.querySelector<HTMLElement>(`.${styles.stage}`);
      const setRx = stage ? gsap.quickTo(stage, "rotationX", { duration: 0.8, ease: "power2.out" }) : null;
      const setRy = stage ? gsap.quickTo(stage, "rotationY", { duration: 0.8, ease: "power2.out" }) : null;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        setRx?.(TILT - ny * 3.5);
        setRy?.(nx * 4.5);
      };
      el.addEventListener("pointermove", onMove);

      /* nav clicks: scroll to the exact chapter */
      const lenis = getLenis();
      const handlers: Array<[HTMLElement, () => void]> = [];
      navItems.forEach((btn, i) => {
        const h = () => {
          const top = st.start + (st.end - st.start) * (i / (n - 1));
          if (lenis) lenis.scrollTo(top);
          else window.scrollTo({ top, behavior: "smooth" });
        };
        btn.addEventListener("click", h);
        handlers.push([btn, h]);
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        el.removeEventListener("pointermove", onMove);
        handlers.forEach(([elm, h]) => elm.removeEventListener("click", h));
        el.classList.remove(styles.deckMode);
      };
    });

    mm.add("(max-width: 1000px), (prefers-reduced-motion: reduce)", () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(`.${styles.board}`).forEach((b) => {
        gsap.from(b, {
          y: 40,
          autoAlpha: 0,
          duration: 0.85,
          ease: EASE.outExpo,
          immediateRender: false,
          scrollTrigger: { trigger: b, start: "top 88%" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className={styles.experience} id="experience" ref={root}>
      <div className={styles.tint} aria-hidden="true" />

      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Experience
        </p>
        <h2 className={styles.h2}>
          Where I&apos;ve <em className={styles.serif}>designed &amp; delivered</em>
        </h2>
      </div>

      {/* the stack */}
      <div className={styles.stageWrap}>
        <div className={styles.stage}>
          {ROLES.map((r, i) => (
            <article
              className={`${styles.board} ${r.fg === "dark" ? styles.dark : ""} ${i === 0 ? styles.on : ""}`}
              key={r.company}
              style={{ background: r.color, zIndex: 200 - i }}
            >
              <div className={styles.strip}>
                <span className={styles.year}>{r.period}</span>
                <span className={styles.company}>{r.company}</span>
                <span className={styles.type}>{r.type}</span>
              </div>

              <div className={styles.detailCol}>
                {/* Left Column: Overview & Responsibilities */}
                <div className={styles.leftCol}>
                  <h3 className={styles.role}>{r.role}</h3>
                  <div className={styles.block}>
                    <p className={styles.lbl}>Overview &amp; Responsibilities</p>
                    <p className={styles.summary}>{r.summary}</p>
                  </div>
                  {r.learned && (
                    <div className={styles.block}>
                      <p className={styles.lbl}>What I learned</p>
                      <p className={styles.learnedText}>&ldquo;{r.learned}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Focus Areas & Selected Projects */}
                <div className={styles.rightCol}>
                  <div className={styles.block}>
                    <p className={styles.lbl}>Focus areas</p>
                    <div className={styles.focusList}>
                      {r.focusAreas.map((f) => (
                        <span key={f} className={styles.focusTag}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {r.selectedProjects && r.selectedProjects.length > 0 && (
                    <div className={styles.block}>
                      <p className={styles.lbl}>Selected projects</p>
                      <ul className={styles.projectList}>
                        {r.selectedProjects.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {r.projectFilter && r.projectCount && (
                    <div className={styles.actionBlock}>
                      <a
                        href="#work"
                        className={styles.filterBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          const workEl = document.querySelector("#work");
                          if (workEl) {
                            const top =
                              workEl.getBoundingClientRect().top +
                              window.scrollY -
                              96;
                            window.scrollTo({ top, behavior: "smooth" });
                          }
                          window.dispatchEvent(
                            new CustomEvent("set-work-filter", {
                              detail: r.projectFilter,
                            })
                          );
                        }}
                      >
                        View {r.projectFilter} projects ({r.projectCount}) <i>→</i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <span className={styles.count}>01 / 0{ROLES.length}</span>
        <div className={styles.nav} role="list">
          {ROLES.map((r) => (
            <button className={styles.navItem} key={r.company} type="button">
              <i style={{ background: r.color }} />
              {r.company}
            </button>
          ))}
        </div>
        <span className={styles.hintFoot}>Scroll to cycle roles</span>
      </div>
    </section>
  );
}
