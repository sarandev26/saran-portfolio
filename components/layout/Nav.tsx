"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Journey", href: "#journey", id: "journey" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Credentials", href: "#credentials", id: "credentials" },
  { label: "Connect", href: "#connect", id: "connect" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const linksContainerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  /* Update sliding highlight position based on active item */
  useLayoutEffect(() => {
    const activeEl = linkRefs.current[active || "home"];
    if (activeEl && linksContainerRef.current) {
      setIndicator({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [active]);

  /* Handle resize to update indicator position */
  useEffect(() => {
    const handleResize = () => {
      const activeEl = linkRefs.current[active || "home"];
      if (activeEl && linksContainerRef.current) {
        setIndicator({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active]);

  /* Close drawer on Escape, lock background scroll */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      getLenis()?.start();
    };
  }, [menuOpen]);

  /* Close drawer on resize to desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const close = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  /* Background scrolled styling & Single stable IntersectionObserver for scroll-spy */
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top top-=40",
        onUpdate: (self) => {
          nav.classList.toggle(styles.scrolled, self.scroll() > 40);
        },
        onLeaveBack: () => nav.classList.remove(styles.scrolled),
      });
    }, nav);

    /* Stable IntersectionObserver with hysteresis */
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickingRef.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topId = visible[0].target.id;
          setActive(topId);
        } else if (window.scrollY < 180) {
          setActive("home");
        }
      },
      {
        rootMargin: "-96px 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      ctx.revert();
      observer.disconnect();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    e.preventDefault();
    setActive(id);
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const target = document.querySelector(href);
    if (target) {
      const navOffset = 96;
      const top =
        href === "#home"
          ? 0
          : target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 900);
  };

  return (
    <header className={styles.wrap} ref={ref}>
      <div className={`${styles.cap} ${menuOpen ? styles.capOpen : ""}`}>
        <a
          href="#home"
          className={styles.logo}
          aria-label="Home"
          onClick={(e) => handleNavClick(e, "#home", "home")}
        >
          SARAN<i>.</i>
        </a>

        <nav
          className={styles.links}
          aria-label="Primary"
          ref={linksContainerRef}
        >
          <div
            className={styles.indicator}
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
              opacity: indicator.opacity,
            }}
            aria-hidden="true"
          />
          {LINKS.map((l) => {
            const isOn = (active || "home") === l.id;
            return (
              <a
                key={l.id}
                ref={(el) => {
                  linkRefs.current[l.id] = el;
                }}
                href={l.href}
                className={`${styles.navLink} ${isOn ? styles.on : ""}`}
                aria-current={isOn ? "page" : undefined}
                onClick={(e) => handleNavClick(e, l.href, l.id)}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
          aria-label={menuOpen ? "Close menu" : "Menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className={`${styles.sheet} ${menuOpen ? styles.sheetOpen : ""}`}
        id="mobile-nav"
        hidden={!menuOpen}
      >
        <nav aria-label="Primary mobile">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={l.id === active ? styles.sheetOn : ""}
              aria-current={l.id === active ? "page" : undefined}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(e, l.href, l.id);
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <button
        type="button"
        className={`${styles.scrim} ${menuOpen ? styles.scrimOn : ""}`}
        aria-label="Close navigation"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
