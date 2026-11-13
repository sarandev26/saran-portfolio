"use client";

/*
 * Featured Work — the curved project track.
 * Desktop: vertical scroll scrubs the cards along a perspective arc.
 * Touch / reduced motion: a native horizontal snap row.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { sceneScrub } from "@/lib/scene";
import { PROJECTS, type Project } from "@/content/projects";
import styles from "./Work.module.css";

const SPREAD = 330; /* px between card centers on the arc */

/* two-digit counter */
const pad = (n: number) => String(n).padStart(2, "0");

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Filter = "All" | "Animated" | "TFrenzy" | "Brillium";

function CardCover({ project }: { project: Project }) {
  const [error, setError] = useState(false);

  if (error || !project.cover?.src) {
    return (
      <div className={styles.coverFallback}>
        <span className={styles.coverFallbackTag}>{project.category}</span>
        <span className={styles.coverFallbackTitle}>{project.title}</span>
      </div>
    );
  }

  return (
    <img
      className={styles.coverPhoto}
      src={project.cover.src}
      alt={project.title}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
      style={{
        aspectRatio: "300 / 258",
        objectPosition: project.cover.position || "center",
      }}
    />
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const renderRef = useRef<((progress: number) => void) | null>(null);
  const isTransitioningRef = useRef(false);

  const [filter, setFilter] = useState<Filter>("All");
  const [displayedFilter, setDisplayedFilter] = useState<Filter>("All");

  const getFiltered = (f: Filter) => {
    return PROJECTS.filter((p) => {
      if (f === "All") return true;
      if (f === "Animated") return !p.origin || p.category === "Animated";
      if (f === "TFrenzy") return p.origin === "TFrenzy";
      return p.origin === "Brillium Tech Solutions";
    });
  };

  const displayedProjects = getFiltered(displayedFilter);

  // Listen for external filter requests (e.g. from Experience panel links)
  useEffect(() => {
    const onSetFilter = (e: Event) => {
      const custom = e as CustomEvent<Filter>;
      if (custom.detail) {
        setFilter(custom.detail);
      }
    };
    window.addEventListener("set-work-filter", onSetFilter);
    return () => window.removeEventListener("set-work-filter", onSetFilter);
  }, []);

  // Restore scroll position to target project when returning from a case study (?project=slug#work)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetSlug = params.get("project");
    if (!targetSlug) return;

    const targetIndex = PROJECTS.findIndex((p) => p.slug === targetSlug);
    if (targetIndex === -1) return;

    const restore = () => {
      const isDesktop = window.matchMedia("(min-width: 1000.1px) and (prefers-reduced-motion: no-preference)").matches;
      if (isDesktop && stRef.current) {
        ScrollTrigger.refresh();
        const st = stRef.current;
        const n = PROJECTS.length;
        const progressRatio = targetIndex / Math.max(1, n - 1);
        const targetY = st.start + progressRatio * (st.end - st.start);

        console.log("[WORK RESTORE]", {
          targetSlug,
          targetIndex,
          n,
          progressRatio,
          start: st.start,
          end: st.end,
          targetY,
        });

        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts: unknown) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true });
        } else {
          window.scrollTo({ top: targetY, behavior: "instant" });
        }
        applyCardPositions(progressRatio);
      } else {
        const track = trackRef.current;
        if (track) {
          const cardEl = (track.querySelector(`#card-${targetSlug}`) || track.children[targetIndex]) as HTMLElement;
          if (cardEl) {
            cardEl.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
          }
        }
      }
    };

    const timer = setTimeout(restore, 350);
    return () => clearTimeout(timer);
  }, []);

  const applyCardPositions = (progressRatio: number) => {
    const el = root.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const isDesktop = window.matchMedia("(min-width: 1000.1px) and (prefers-reduced-motion: no-preference)").matches;
    if (!isDesktop) return;

    const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(`.${styles.card}`));
    const n = cards.length;
    if (n === 0) return;

    const p = progressRatio * Math.max(0, n - 1);
    cards.forEach((card, i) => {
      const d = i - p;
      const ad = Math.abs(d);
      gsap.set(card, {
        x: d * SPREAD,
        y: Math.min(ad * ad * 8, 85),
        z: Math.max(10, Math.round(100 - ad * 12)),
        rotationY: gsap.utils.clamp(-34, 34, -d * 10),
        scale: 1 - Math.min(ad * 0.065, 0.38),
        autoAlpha: ad <= 2 ? 1 : Math.max(0.55, 1 - (ad - 2) * 0.22),
        zIndex: Math.round(100 - ad * 10),
      });
    });

    const counter = el.querySelector<HTMLElement>(`.${styles.count}`);
    const dots = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(`.${styles.dot}`));
    const active = Math.round(gsap.utils.clamp(0, Math.max(0, n - 1), p));
    if (counter) {
      counter.textContent = `${pad(active + 1)} / ${pad(n)}`;
    }
    dots.forEach((dot, i) => dot.classList.toggle(styles.dotOn, i === active));
  };

  // Set up desktop ScrollTrigger scrubbing once
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    renderRef.current = applyCardPositions;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1000.1px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        ...sceneScrub(el),
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyCardPositions(self.progress);
        },
        onRefresh: (self) => {
          applyCardPositions(self.progress);
        },
      });
      stRef.current = st;
      (window as unknown as { __workST?: ScrollTrigger }).__workST = st;

      // Apply positions immediately upon ScrollTrigger creation!
      applyCardPositions(st.progress);

      // Header reveal
      gsap.from(`.${styles.header} > *`, {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.outExpo,
        stagger: 0.09,
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });

      return () => {
        st.kill();
        stRef.current = null;
      };
    });

    // Window resize / orientation change listener to guarantee cards never stay collapsed
    const onResize = () => {
      const isDesktop = window.matchMedia("(min-width: 1000.1px) and (prefers-reduced-motion: no-preference)").matches;
      if (isDesktop) {
        const p = stRef.current ? stRef.current.progress : 0;
        applyCardPositions(p);
      } else {
        const track = trackRef.current;
        if (track) {
          const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(`.${styles.card}`));
          cards.forEach((card) => {
            gsap.set(card, { clearProps: "transform,opacity,zIndex" });
          });
        }
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
    };
  }, []);

  // Update layout and positions BEFORE paint whenever displayedFilter changes
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isDesktop = window.matchMedia("(min-width: 1000.1px) and (prefers-reduced-motion: no-preference)").matches;
    if (!isDesktop) {
      track.style.opacity = "1";
      track.style.transform = "none";
      const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(`.${styles.card}`));
      cards.forEach((card) => {
        gsap.set(card, { clearProps: "transform,opacity,zIndex" });
      });
      isTransitioningRef.current = false;
      return;
    }

    renderRef.current = applyCardPositions;
    const currentProgress = stRef.current ? stRef.current.progress : 0;
    applyCardPositions(currentProgress);

    ScrollTrigger.refresh();

    // Smoothly fade the new card set in
    gsap.fromTo(
      track,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      }
    );
  }, [displayedFilter]);

  const handleFilterClick = (newFilter: Filter) => {
    if (newFilter === filter || isTransitioningRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setFilter(newFilter);
      setDisplayedFilter(newFilter);
      return;
    }

    isTransitioningRef.current = true;
    setFilter(newFilter);

    if (trackRef.current) {
      gsap.to(trackRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.16,
        ease: "power2.inOut",
        onComplete: () => {
          setDisplayedFilter(newFilter);
        },
      });
    } else {
      setDisplayedFilter(newFilter);
    }
  };

  return (
    <section className={styles.work} id="work" ref={root}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Work
        </p>
        <div className={styles.headContent}>
          <h2 className={styles.h2}>
            Selected <em className={styles.serif}>work &amp; digital products</em>
          </h2>
          <p className={styles.lede}>
            25+ projects in industrial software, dashboards, web and mobile platforms, 3D animated experiences, and interactive websites.
          </p>
          <div className={styles.filterRow} role="tablist" aria-label="Filter projects by origin">
            <button
              type="button"
              role="tab"
              className={`${styles.filterBtn} ${filter === "All" ? styles.filterBtnActive : ""}`}
              onClick={() => handleFilterClick("All")}
              aria-selected={filter === "All"}
            >
              All ({PROJECTS.length})
            </button>
            <button
              type="button"
              role="tab"
              className={`${styles.filterBtn} ${filter === "Animated" ? styles.filterBtnActive : ""}`}
              onClick={() => handleFilterClick("Animated")}
              aria-selected={filter === "Animated"}
            >
              Animated ({PROJECTS.filter((p) => !p.origin || p.category === "Animated").length})
            </button>
            <button
              type="button"
              role="tab"
              className={`${styles.filterBtn} ${filter === "TFrenzy" ? styles.filterBtnActive : ""}`}
              onClick={() => handleFilterClick("TFrenzy")}
              aria-selected={filter === "TFrenzy"}
            >
              TFrenzy ({PROJECTS.filter((p) => p.origin === "TFrenzy").length})
            </button>
            {PROJECTS.some((p) => p.origin === "Brillium Tech Solutions") && (
              <button
                type="button"
                role="tab"
                className={`${styles.filterBtn} ${filter === "Brillium" ? styles.filterBtnActive : ""}`}
                onClick={() => handleFilterClick("Brillium")}
                aria-selected={filter === "Brillium"}
              >
                Brillium ({PROJECTS.filter((p) => p.origin === "Brillium Tech Solutions").length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.track} ref={trackRef}>
          {displayedProjects.map((p, i) => {
            const isAnimated = !p.origin || p.category === "Animated";
            const targetHref = isAnimated
              ? (p.liveUrl && p.liveUrl !== "#" ? p.liveUrl : `/work/${p.slug}`)
              : `/work/${p.slug}`;
            const isExternal = isAnimated && !!p.liveUrl && p.liveUrl !== "#";

            return (
              <article
                className={styles.card}
                key={p.slug}
                id={`card-${p.slug}`}
                style={{
                  zIndex: 100 - i,
                  transform: `translate3d(${i * SPREAD}px, 0px, 0px)`,
                }}
              >
                <div className={styles.inner}>
                  <a
                    className={styles.coverLink}
                    href={targetHref}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <div className={styles.cover}>
                      <CardCover project={p} />
                    </div>
                  </a>
                  <div className={styles.meta}>
                    <h3>
                      <a
                        href={targetHref}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={styles.titleLink}
                      >
                        {p.title}
                      </a>
                    </h3>
                    <p className={styles.contribution}>{p.hook}</p>
                    <div className={styles.cardAction}>
                      {isAnimated ? (
                        <a
                          href={targetHref}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className={styles.actionBtn}
                        >
                          View Demo ↗
                        </a>
                      ) : (
                        <a href={`/work/${p.slug}`} className={styles.actionBtn}>
                          Case study →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.foot}>
        <span className={styles.count}>01 / {pad(displayedProjects.length)}</span>
        <div className={styles.dots}>
          {displayedProjects.map((p, i) => (
            <span key={p.slug} className={`${styles.dot} ${i === 0 ? styles.dotOn : ""}`} />
          ))}
        </div>
        <span className={styles.hint}>Scroll to explore projects</span>
      </div>
    </section>
  );
}
