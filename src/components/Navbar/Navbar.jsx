import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MagneticButton from "../MagneticButton/MagneticButton";
import "./Navbar.css";
import { useTheme } from "../../context/ThemeContext";
import { useSound } from "../../context/SoundContext";

const NAV_LINKS = ["About", "Projects", "GitHub", "Skills", "Resume", "Contact"];

export default function Navbar({ onOpenPalette, onLogoEasterEgg }) {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick, playHover, playNav } = useSound();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav__logo, .nav__link, .nav__ctrl, .nav__cta", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 3.2,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    playNav();
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // Logo Easter Egg: clicking 3 times triggers special interaction
  const handleLogoClick = (e) => {
    e.preventDefault();
    playClick();
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 3) {
      setLogoClicks(0);
      if (onLogoEasterEgg) onLogoEasterEgg();
    } else {
      scrollTo("hero");
    }
  };

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          {/* Logo with Easter Egg Trigger */}
          <a
            className="nav__logo"
            href="#hero"
            onClick={handleLogoClick}
            data-cursor="magnetic"
            title="Click 3 times for a secret surprise"
          >
            <span className="nav__logo-bracket">&lt;</span>
            Dev
            <span className="nav__logo-bracket">/&gt;</span>
          </a>

          {/* Center Links */}
          <div className="nav__links">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="nav__link"
                onClick={() => scrollTo(link)}
                onMouseEnter={playHover}
                data-cursor="link"
              >
                <span className="nav__link-text">{link}</span>
                <span className="nav__link-line" />
              </button>
            ))}
          </div>

          {/* Right Controls: Command Palette Search, Sound, Theme, CTA */}
          <div className="nav__actions">
            {/* Ctrl + K Palette Trigger */}
            <button
              className="nav__ctrl nav__ctrl--search"
              onClick={() => {
                playClick();
                if (onOpenPalette) onOpenPalette();
              }}
              onMouseEnter={playHover}
              title="Search & Quick Actions (Ctrl + K)"
              data-cursor="magnetic"
            >
              <span className="nav__ctrl-icon">🔍</span>
              <kbd className="nav__kbd">⌘K</kbd>
            </button>

            {/* Sound Toggle */}
            <button
              className={`nav__ctrl nav__ctrl--sound ${soundEnabled ? "nav__ctrl--active" : ""}`}
              onClick={toggleSound}
              onMouseEnter={playHover}
              title={soundEnabled ? "Mute Synthesizer SFX" : "Enable Sound Effects"}
              data-cursor="magnetic"
              aria-label="Toggle sound"
            >
              <span className="nav__ctrl-icon">{soundEnabled ? "🔊" : "🔇"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              className="nav__ctrl nav__ctrl--theme"
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              onMouseEnter={playHover}
              title={`Switch to ${isDark ? "Light" : "Dark"} Theme`}
              data-cursor="magnetic"
              aria-label="Toggle theme"
            >
              <span className="nav__ctrl-icon">{isDark ? "☀️" : "🌙"}</span>
            </button>

            {/* Let's Talk CTA */}
            <MagneticButton className="nav__cta" onClick={() => scrollTo("Contact")}>
              <span className="nav__cta-inner">Let's Talk</span>
              <span className="nav__cta-bg" />
            </MagneticButton>

            {/* Mobile Hamburger */}
            <button
              className={`nav__hamburger ${menuOpen ? "nav__hamburger--open" : ""}`}
              onClick={() => {
                playClick();
                setMenuOpen((v) => !v);
              }}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__inner">
          {NAV_LINKS.map((link, idx) => (
            <button
              key={link}
              className="mobile-menu__link"
              onClick={() => scrollTo(link)}
            >
              <span className="mobile-menu__num">0{idx + 1}</span>
              {link}
            </button>
          ))}

          {/* Mobile Preferences */}
          <div className="mobile-menu__ctrls">
            <button
              className="mobile-ctrl-btn"
              onClick={() => {
                toggleTheme();
                playClick();
              }}
            >
              {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              className="mobile-ctrl-btn"
              onClick={toggleSound}
            >
              {soundEnabled ? "🔇 Mute Audio" : "🔊 Enable SFX"}
            </button>
            <button
              className="mobile-ctrl-btn"
              onClick={() => {
                setMenuOpen(false);
                if (onOpenPalette) onOpenPalette();
              }}
            >
              ⌘ Command Menu (Ctrl + K)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
