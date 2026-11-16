import React, { useEffect, useState } from "react";
import "./ScrollProgress.css";
import { useSound } from "../../context/SoundContext";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const { playHover, playClick } = useSound();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = (window.scrollY / totalHeight) * 100;
            const clamped = Math.min(100, Math.max(0, current));
            setProgress(Math.round(clamped));
            setVisible(window.scrollY > 250);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Thin Glowing Progress Line */}
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />

      {/* Floating Percentage & Scroll-To-Top Widget */}
      <button
        className={`scroll-widget ${visible ? "scroll-widget--visible" : ""}`}
        onClick={scrollToTop}
        onMouseEnter={playHover}
        title="Scroll to Top"
        aria-label="Scroll to top"
        data-cursor="magnetic"
      >
        <svg className="scroll-widget__svg" viewBox="0 0 44 44">
          <circle className="scroll-widget__circle-bg" cx="22" cy="22" r="18" />
          <circle
            className="scroll-widget__circle-bar"
            cx="22"
            cy="22"
            r="18"
            style={{
              strokeDasharray: 113.1,
              strokeDashoffset: 113.1 - (113.1 * progress) / 100,
            }}
          />
        </svg>
        <span className="scroll-widget__text">{progress}%</span>
        <span className="scroll-widget__arrow">↑</span>
      </button>
    </>
  );
}
