import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../MagneticButton/MagneticButton";
import "./Hero.css";
import { useSound } from "../../context/SoundContext";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onTriggerEasterEgg }) {
  const heroRef = useRef(null);
  const portraitRef = useRef(null);
  const noiseRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  const { playClick, playHover, playGlitch } = useSound();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.4 });

      // Cinematic reveal sequence
      tl.from(".hero__eyebrow span", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.out",
      })
        .from(
          ".hero__title .word",
          {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .from(
          ".hero__sub",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero__ctas",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".hero__portrait-wrap",
          {
            scale: 1.1,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          ".hero__scroll-hint",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          ".hero__stat",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      // Parallax portrait on scroll
      gsap.to(".hero__portrait-wrap", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade out hero text on scroll
      gsap.to(".hero__content", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "center top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Animated grain noise
      const animNoise = () => {
        if (noiseRef.current) {
          noiseRef.current.style.backgroundPosition = `${Math.random() * 100}% ${
            Math.random() * 100
          }%`;
        }
        requestAnimationFrame(animNoise);
      };
      requestAnimationFrame(animNoise);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    playClick();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    playClick();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Easter egg: Clicking portrait or headline 5 times
  const handleEasterEggClick = () => {
    playClick();
    const next = clickCount + 1;
    setClickCount(next);

    if (next >= 5) {
      setClickCount(0);
      playGlitch();
      if (onTriggerEasterEgg) {
        onTriggerEasterEgg("Curiosity Rewarded! Secret Developer Protocol Activated.");
      }
    }
  };

  return (
    <section ref={heroRef} id="hero" className="hero">
      {/* Animated gradient ambient */}
      <div className="hero__ambient" />
      <div ref={noiseRef} className="hero__noise" />

      {/* Grid overlay */}
      <div className="hero__grid" />

      <div className="hero__layout">
        {/* Left — text content */}
        <div className="hero__content">
          <div className="hero__eyebrow">
            {["Creative", "·", "Developer", "·", "Designer"].map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <h1
            className="hero__title"
            onClick={handleEasterEggClick}
            title="Click repeatedly to trigger an easter egg"
          >
            {["Crafting", "Digital", "Experiences"].map((word) => (
              <span key={word} className="word">
                {word}
              </span>
            ))}
          </h1>

          <p className="hero__sub">
            Building award-winning interfaces with cutting-edge React, GSAP animations, and
            obsessive attention to detail. Where code meets cinematic artistry.
          </p>

          <div className="hero__ctas">
            <MagneticButton
              className="btn-primary"
              onClick={scrollToProjects}
              onMouseEnter={playHover}
            >
              <span className="btn-primary__inner">
                <span>View Selected Work</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="btn-primary__glow" />
            </MagneticButton>

            <MagneticButton
              className="btn-secondary"
              onClick={scrollToContact}
              onMouseEnter={playHover}
            >
              <span>Get In Touch</span>
            </MagneticButton>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {[
              { num: "3+", label: "Years Experience" },
              { num: "15+", label: "Systems Shipped" },
              { num: "100%", label: "Obsessive Craft" },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-num">{s.num}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — portrait */}
        <div
          ref={portraitRef}
          className="hero__portrait-wrap"
          data-cursor="explore"
          data-cursor-text="EXPLORE"
          onClick={handleEasterEggClick}
        >
          <div className="hero__portrait-frame">
            <img
              src="/portrait.webp"
              alt="Developer portrait"
              className="hero__portrait-img"
              draggable="false"
            />
            <div className="hero__portrait-overlay" />
            <div className="hero__portrait-border" />
          </div>

          {/* Floating badge */}
          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span>Available for innovative projects</span>
          </div>

          {/* Decoration ring */}
          <div className="hero__portrait-ring" />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}
