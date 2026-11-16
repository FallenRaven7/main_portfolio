import React, { useState, useEffect, useRef } from "react";
import "./SecretTerminal.css";
import { PORTFOLIO_CONFIG } from "../../config/portfolioConfig";
import { useSound } from "../../context/SoundContext";
import { useTheme } from "../../context/ThemeContext";

export default function SecretTerminal({ isOpen, onClose }) {
  const [history, setHistory] = useState([
    { type: "system", text: "SYSTEM DIAGNOSTICS: CRIMSON ARCHITECTURE v2.5.0" },
    { type: "system", text: "Type 'help' to inspect authorized terminal commands." },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [matrixActive, setMatrixActive] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const { playClick, playGlitch, playSuccess } = useSound();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      playGlitch();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const trimmed = inputVal.trim();
      const newHistory = [...history, { type: "input", text: `> ${inputVal}` }];

      if (trimmed) {
        setCmdHistory((prev) => [...prev, trimmed]);
        setCmdIndex(-1);
        playClick();

        const lower = trimmed.toLowerCase();
        switch (lower) {
          case "help":
            newHistory.push({
              type: "output",
              text: "AVAILABLE COMMANDS:\n  about     - Developer summary\n  skills    - Core technical stack\n  projects  - Featured software works\n  github    - Real-time GitHub info\n  theme     - Toggle light / dark mode\n  matrix    - Toggle green phosphor matrix stream\n  sudo      - Acquire root privileges\n  clear     - Wipe terminal screen\n  exit      - Close this terminal session",
            });
            break;
          case "about":
            newHistory.push({
              type: "output",
              text: `${PORTFOLIO_CONFIG.name} — ${PORTFOLIO_CONFIG.title}\nBased in ${PORTFOLIO_CONFIG.location}\n"${PORTFOLIO_CONFIG.bio}"`,
            });
            break;
          case "skills":
            newHistory.push({
              type: "output",
              text: "PRIMARY ENGINE:\n  React 19, Vite, GSAP 3, Web Audio API, Lenis, TypeScript, Node.js, Express, MongoDB, TailwindCSS.",
            });
            break;
          case "projects":
            newHistory.push({
              type: "output",
              text: PORTFOLIO_CONFIG.projects
                .map((p) => `[${p.id}] ${p.title} (${p.category}) - ${p.github}`)
                .join("\n"),
            });
            break;
          case "github":
            newHistory.push({
              type: "output",
              text: `Connected profile: @${PORTFOLIO_CONFIG.githubUsername}\nURL: ${PORTFOLIO_CONFIG.githubUrl}`,
            });
            break;
          case "theme":
            toggleTheme();
            newHistory.push({ type: "output", text: "Theme protocol toggled." });
            break;
          case "matrix":
            setMatrixActive((prev) => !prev);
            playSuccess();
            newHistory.push({
              type: "output",
              text: "Matrix cyber visual filter toggled.",
            });
            break;
          case "sudo":
            playGlitch();
            newHistory.push({
              type: "output",
              text: "PERMISSION GRANTED: You are now running with ROOT developer access. Respect the code.",
            });
            break;
          case "clear":
            setHistory([]);
            setInputVal("");
            return;
          case "exit":
          case "quit":
            onClose();
            return;
          default:
            newHistory.push({
              type: "error",
              text: `Command not recognized: '${trimmed}'. Type 'help' for directory.`,
            });
        }
      }

      setHistory(newHistory);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length > 0 && cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < cmdHistory.length) {
          setCmdIndex(nextIdx);
          setInputVal(cmdHistory[nextIdx]);
        } else {
          setCmdIndex(-1);
          setInputVal("");
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`terminal-backdrop ${matrixActive ? "terminal--matrix" : ""}`} onClick={onClose}>
      <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot--red" onClick={onClose} title="Close" />
            <span className="dot dot--yellow" title="Minimize" />
            <span className="dot dot--green" title="Maximize" />
          </div>
          <span className="terminal-title">raven@crimson-core: ~ (Terminal CLI)</span>
          <span className="terminal-shortcut">ESC / exit</span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          {history.map((item, idx) => (
            <div key={idx} className={`terminal-line terminal-line--${item.type}`}>
              <pre>{item.text}</pre>
            </div>
          ))}

          {/* Prompt line */}
          <div className="terminal-prompt-line">
            <span className="terminal-prompt">guest@crimson:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              spellCheck="false"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
