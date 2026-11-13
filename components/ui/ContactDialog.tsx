"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { CONTACT } from "@/lib/site";
import styles from "./ContactDialog.module.css";

const emptySubscribe = () => () => {};

export interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

export default function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!isOpen) {
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
        previousActiveElement.current.focus();
      }
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock page scroll while modal is open (preventing layout shift)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const origOverflow = document.body.style.overflow;
    const origPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Auto-focus first focusable element inside modal
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0]?.focus();
        }
      }
    }, 40);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = origOverflow;
      document.body.style.paddingRight = origPaddingRight;
    };
  }, [isOpen]);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyEmail = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappPrefill)}`;
  const mailtoUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.emailSubject)}&body=${encodeURIComponent(CONTACT.emailBody)}`;

  if (!isClient) return null;

  return createPortal(
    <>
      {/* Dimmed backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered modal card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        className={`${styles.dialog} ${isOpen ? styles.dialogVisible : ""}`}
      >
        <div className={styles.header}>
          <h3 id="contact-dialog-title" className={styles.title}>
            Get in touch
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close contact options"
          >
            ✕
          </button>
        </div>

        <div className={styles.options}>
          {/* Option 1: Official WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.optionCard}
            onClick={onClose}
          >
            <div className={`${styles.iconWrap} ${styles.whatsappWrap}`}>
              <svg
                className={styles.whatsappIcon}
                viewBox="0 0 175.216 175.552"
                aria-hidden="true"
              >
                <path
                  fill="#fff"
                  d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
                />
                <path
                  fill="#25D366"
                  d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
                />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
                />
              </svg>
            </div>
            <div className={styles.textGroup}>
              <span className={styles.optionTitle}>Chat on WhatsApp</span>
              <span className={styles.optionSub}>Fastest response · Message directly</span>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>

          {/* Option 2: Official Gmail + Copy Action */}
          <div className={styles.emailCardGroup}>
            <a
              href={mailtoUrl}
              className={styles.optionCard}
              onClick={onClose}
            >
              <div className={`${styles.iconWrap} ${styles.gmailWrap}`}>
                <svg
                  className={styles.gmailIcon}
                  viewBox="52 42 88 66"
                  aria-hidden="true"
                >
                  <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                  <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                  <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                  <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                  <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                </svg>
              </div>
              <div className={styles.textGroup}>
                <span className={styles.optionTitle}>Send an email</span>
                <span className={styles.optionSub}>{CONTACT.email}</span>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>

            <button
              type="button"
              className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
              onClick={handleCopyEmail}
              aria-label={copied ? "Email copied to clipboard" : "Copy email address to clipboard"}
              title="Copy email"
            >
              {copied ? (
                <>
                  <svg
                    className={styles.copyIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    className={styles.copyIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
