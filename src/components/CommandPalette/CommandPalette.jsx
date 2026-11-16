import React, { useState, useEffect, useRef } from "react";
import "./CommandPalette.css";
import { useTheme } from "../../context/ThemeContext";
import { useSound } from "../../context/SoundContext";
import { PORTFOLIO_CONFIG } from "../../config/portfolioConfig";

export default function CommandPalette({ isOpen, onClose, onOpenTerminal, onTriggerKonami }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick, playHover, playNav } = useSound();

  const scrollTo = (id) => {
    playNav();
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id.toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const commands = [
    // Navigation
    {
      id: "nav-hero",
      title: "Jump to Hero",
      subtitle: "Return to the main introduction & portrait",
      category: "Navigation",
      icon: "⚡",
      action: () => scrollTo("hero"),
    },
    {
      id: "nav-about",
      title: "Jump to About",
      subtitle: "Read engineering biography & timeline",
      category: "Navigation",
      icon: "👤",
      action: () => scrollTo("about"),
    },
    {
      id: "nav-projects",
      title: "Jump to Selected Projects",
      subtitle: "View interactive 3D project showcases",
      category: "Navigation",
      icon: "💼",
      action: () => scrollTo("projects"),
    },
    {
      id: "nav-github",
      title: "Jump to GitHub Repositories",
      subtitle: "Live feed of active repositories",
      category: "Navigation",
      icon: "🐙",
      action: () => scrollTo("github"),
    },
    {
      id: "nav-skills",
      title: "Jump to Tech Stack",
      subtitle: "Inspect tools, languages & frameworks",
      category: "Navigation",
      icon: "🛠️",
      action: () => scrollTo("skills"),
    },
    {
      id: "nav-resume",
      title: "Jump to Resume Section",
      subtitle: "View qualifications & download CV",
      category: "Navigation",
      icon: "📄",
      action: () => scrollTo("resume"),
    },
    {
      id: "nav-contact",
      title: "Jump to Contact",
      subtitle: "Send a direct message or collaboration offer",
      category: "Navigation",
      icon: "✉️",
      action: () => scrollTo("contact"),
    },

    // Preferences
    {
      id: "pref-theme",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`,
      subtitle: `Current: ${theme.toUpperCase()} mode`,
      category: "Preferences",
      icon: theme === "dark" ? "☀️" : "🌙",
      action: () => {
        playClick();
        toggleTheme();
        onClose();
      },
    },
    {
      id: "pref-sound",
      title: `Turn Sound ${soundEnabled ? "OFF (Mute)" : "ON (Synthesized SFX)"}`,
      subtitle: soundEnabled ? "Currently enabled" : "Currently muted",
      category: "Preferences",
      icon: soundEnabled ? "🔇" : "🔊",
      action: () => {
        toggleSound();
        onClose();
      },
    },

    // Actions & External
    {
      id: "act-resume",
      title: "Download Resume / CV (PDF)",
      subtitle: "Fetch the latest curriculum vitae",
      category: "Actions",
      icon: "📥",
      action: () => {
        playClick();
        const a = document.createElement("a");
        a.href = PORTFOLIO_CONFIG.resumePath;
        a.download = "Resume_FallenRaven.pdf";
        a.click();
        onClose();
      },
    },
    {
      id: "act-github-profile",
      title: "Open GitHub Profile",
      subtitle: `https://github.com/${PORTFOLIO_CONFIG.githubUsername}`,
      category: "External",
      icon: "↗",
      action: () => {
        playClick();
        window.open(PORTFOLIO_CONFIG.githubUrl, "_blank");
        onClose();
      },
    },
    {
      id: "act-copy-email",
      title: "Copy Email Address",
      subtitle: PORTFOLIO_CONFIG.email,
      category: "Actions",
      icon: "📋",
      action: () => {
        playClick();
        navigator.clipboard.writeText(PORTFOLIO_CONFIG.email);
        alert(`Copied "${PORTFOLIO_CONFIG.email}" to clipboard!`);
        onClose();
      },
    },

    // Easter Eggs
    {
      id: "egg-terminal",
      title: "Launch Secret Terminal (Hacker Console)",
      subtitle: "Interactive CLI interface with custom commands",
      category: "Easter Eggs",
      icon: "💻",
      action: () => {
        onClose();
        if (onOpenTerminal) onOpenTerminal();
      },
    },
    {
      id: "egg-konami",
      title: "Trigger Crimson Supernova Particle Storm",
      subtitle: "Instant execution of the secret celebration mode",
      category: "Easter Eggs",
      icon: "✨",
      action: () => {
        onClose();
        if (onTriggerKonami) onTriggerKonami();
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        playHover();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        playHover();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, playHover]);

  if (!isOpen) return null;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div
        className="palette-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Header */}
        <div className="palette-search">
          <span className="palette-search__icon">⌘</span>
          <input
            ref={inputRef}
            type="text"
            className="palette-search__input"
            placeholder="Type a command or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="palette-close-btn" onClick={onClose} aria-label="Close palette">
            ESC
          </button>
        </div>

        {/* Results list */}
        <div ref={listRef} className="palette-list">
          {filtered.length === 0 ? (
            <div className="palette-empty">
              <span>No commands found matching "{query}"</span>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`palette-item ${idx === selectedIndex ? "palette-item--selected" : ""}`}
                onMouseEnter={() => {
                  setSelectedIndex(idx);
                  playHover();
                }}
                onClick={() => item.action()}
              >
                <span className="palette-item__icon">{item.icon}</span>
                <div className="palette-item__info">
                  <span className="palette-item__title">{item.title}</span>
                  <span className="palette-item__subtitle">{item.subtitle}</span>
                </div>
                <span className="palette-item__category">{item.category}</span>
              </div>
            ))
          )}
        </div>

        {/* Palette Footer Shortcuts */}
        <div className="palette-footer">
          <div className="palette-footer__hint">
            <kbd>↑</kbd> <kbd>↓</kbd> <span>Navigate</span>
          </div>
          <div className="palette-footer__hint">
            <kbd>↵</kbd> <span>Select</span>
          </div>
          <div className="palette-footer__hint">
            <kbd>ESC</kbd> <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
