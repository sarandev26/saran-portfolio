"use client";

import { useState } from "react";
import Link from "next/link";
import { PROJECTS, type Project } from "@/content/projects";
import styles from "./case.module.css";

function CaseCover({ project }: { project: Project }) {
  const [error, setError] = useState(false);

  if (error || !project.cover?.src) {
    return (
      <div className={styles.cover}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px" }}>
            {project.category}
          </p>
          <p style={{ fontSize: "22px", fontWeight: 800 }}>{project.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cover}>
      <img
        className={styles.coverPhoto}
        src={project.cover.src}
        alt={project.title}
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function CaseView({ slug }: { slug: string }) {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;

  const idx = PROJECTS.indexOf(project);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <Link href={`/?project=${project.slug}#work`} className={styles.back}>
          ← Back to all work
        </Link>
        <div className={styles.barRight}>
          <Link href="/" className={styles.logo}>
            SARAN<i>.</i>
          </Link>
        </div>
      </div>

      <div className={styles.wrap}>
        {/* ---- hero ---- */}
        <header className={styles.hero}>
          <p className={styles.kicker}>
            {project.origin ? `${project.origin} · ` : ""}{project.category}
          </p>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.oneLiner}>&ldquo;{project.hook}&rdquo;</p>
          <div className={styles.meta}>
            {project.origin && (
              <div>
                <b>Origin</b>
                <span>{project.origin}</span>
              </div>
            )}
            <div>
              <b>Category</b>
              <span>{project.category}</span>
            </div>
            <div>
              <b>Role</b>
              <span>UI/UX Designer</span>
            </div>
          </div>

          {project.category === "Animated" && (
            <div className={styles.demoLinkWrap}>
              <a
                href={project.liveUrl && project.liveUrl !== "#" ? project.liveUrl : "#"}
                target={project.liveUrl && project.liveUrl !== "#" ? "_blank" : undefined}
                rel={project.liveUrl && project.liveUrl !== "#" ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (!project.liveUrl || project.liveUrl === "#") {
                    e.preventDefault();
                    // TODO: Live demo URL to be added
                  }
                }}
                className={styles.demoLink}
              >
                View Demo ↗
              </a>
            </div>
          )}

          <CaseCover project={project} />
        </header>

        {/* ---- overview ---- */}
        <section className={styles.section}>
          <p className={styles.secLabel}>Overview</p>
          <p className={styles.body}>{project.summary}</p>
        </section>

        {/* ---- key features ---- */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section className={styles.section}>
            <p className={styles.secLabel}>Key Features</p>
            <ul className={styles.featureList}>
              {project.keyFeatures.map((feat, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.featureBullet}>•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- screens ---- */}
        {project.screens && project.screens.length > 0 && (
          <section className={styles.section}>
            <p className={styles.secLabel}>
              {project.screens.length === 1 ? "Screen" : "Screens"}
            </p>
            <div
              className={`${styles.screensGrid} ${
                project.screens.length === 1 ? styles.screensGridSingle : ""
              }`}
            >
              {project.screens.slice(0, 2).map((src, i) => (
                <div key={src} className={styles.screenItem}>
                  <div className={styles.screenImageWrap}>
                    <img
                      src={src}
                      alt={`${project.title} - Screen ${i + 1}`}
                      className={styles.screenImg}
                      loading="lazy"
                    />
                  </div>
                  <span className={styles.screenLabel}>Screen {String(i + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---- next ---- */}
        <nav className={styles.footNav}>
          <Link href={`/?project=${project.slug}#work`} className={styles.back}>
            ← All projects
          </Link>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <small>Next project</small>
            <span>
              {next.title} <i>→</i>
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
