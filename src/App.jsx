import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { ThemeProvider } from "./context/ThemeContext";
import { SoundProvider } from "./context/SoundContext";

import CustomCursor from "./components/CustomCursor/CustomCursor";
import Loader from "./components/Loader/Loader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import GitHubShowcase from "./components/GitHubShowcase/GitHubShowcase";
import Skills from "./components/Skills/Skills";
import ResumeSection from "./components/Resume/ResumeSection";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import SecretTerminal from "./components/EasterEggs/SecretTerminal";
import KonamiCelebration from "./components/EasterEggs/KonamiCelebration";

import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// Konami Code sequence
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function PortfolioApp() {
  const [loaded, setLoaded] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState("");
  const [is404, setIs404] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      return (path !== "/" && path !== "" && !path.endsWith(".html")) || hash === "#404";
    }
    return false;
  });

  const lenisRef = useRef(null);
  const konamiIndex = useRef(0);
  const keyBuffer = useRef("");

  const handleLoaderComplete = () => {
    setLoaded(true);
    document.body.style.overflowY = "auto";

    // Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenisRef.current = lenis;

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    // Console Developer Easter Egg Greeting
    console.log(
      "%c CRIMSON SYSTEM CORE v2.5.0 %c\nGreetings, engineer! Looking under the hood?\nType 'crimson' or press ` (backtick) for the secret terminal.\nPress Ctrl+K for the quick command palette.",
      "background: #dc143c; color: #ffffff; font-weight: bold; font-size: 14px; padding: 6px 12px; border-radius: 6px;",
      "color: #ff4060; font-family: monospace; font-size: 12px; line-height: 1.6;"
    );

    // Global Keyboard Listeners: Ctrl+K, Konami code, Backtick
    const handleKeyDown = (e) => {
      // 1. Ctrl + K / Cmd + K for Command Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      // 2. Secret Backtick ` for Hacker Terminal
      if (e.key === "`" || e.key === "~") {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
          e.preventDefault();
          setTerminalOpen((prev) => !prev);
          return;
        }
      }

      // 3. Konami Code Sequence Detection
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0;
          setEasterEggMessage("🏆 KONAMI CODE CONFIRMED: CRIMSON SUPERNOVA ONLINE!");
          setKonamiActive(true);
        }
      } else {
        konamiIndex.current = 0;
      }

      // 4. Keyword "crimson" detection anywhere on page
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        keyBuffer.current += e.key.toLowerCase();
        if (keyBuffer.current.length > 20) {
          keyBuffer.current = keyBuffer.current.slice(-10);
        }
        if (keyBuffer.current.includes("crimson")) {
          keyBuffer.current = "";
          setTerminalOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Listen to hash changes for 404 testing (#404)
    const handleHashChange = () => {
      setIs404(window.location.hash === "#404");
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      document.body.style.overflowY = "auto";
      if (lenisRef.current) lenisRef.current.destroy();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const triggerCustomEasterEgg = (msg) => {
    setEasterEggMessage(msg);
    setKonamiActive(true);
  };

  return (
    <>
      {/* Global Crimson Liquid Custom Cursor */}
      <CustomCursor />

      {/* Real-Time Scroll Progress Bar & Floating Top Button */}
      <ScrollProgress />

      {/* Futuristic Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onTriggerKonami={() => triggerCustomEasterEgg("✨ CRIMSON SUPERNOVA MANUALLY ENGAGED!")}
      />

      {/* Secret Hacker Terminal (`) */}
      <SecretTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Particle Supernova & Achievement Toast Overlay */}
      <KonamiCelebration
        active={konamiActive}
        customMessage={easterEggMessage}
        onComplete={() => setKonamiActive(false)}
      />

      {/* Cinematic 0→100 Loader */}
      {!loaded && <Loader onComplete={handleLoaderComplete} />}

      {/* 404 Route View or Main Portfolio */}
      {is404 ? (
        <NotFound
          onBackHome={() => {
            window.location.hash = "";
            window.history.pushState({}, "", "/");
            setIs404(false);
          }}
        />
      ) : (
        <main
          className="portfolio-main"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease, filter 0.6s ease",
            filter: loaded ? "blur(0px)" : "blur(10px)",
          }}
        >
          <Navbar
            onOpenPalette={() => setPaletteOpen(true)}
            onLogoEasterEgg={() =>
              triggerCustomEasterEgg("⚡ LOGO WARP PROTOCOL UNLOCKED: QUANTUM FLUX +300 XP")
            }
          />
          <Hero onTriggerEasterEgg={triggerCustomEasterEgg} />
          <About />
          <Projects />
          <GitHubShowcase />
          <Skills />
          <ResumeSection />
          <Contact />
          <Footer />
        </main>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <PortfolioApp />
      </SoundProvider>
    </ThemeProvider>
  );
}
