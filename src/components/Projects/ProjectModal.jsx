import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ProjectModal.css";
import { useSound } from "../../context/SoundContext";

export default function ProjectModal({ project, onClose }) {
  const { playClick, playNav } = useSound();

  useEffect(() => {
    if (!project) return;

    // ── Save scroll position & lock body ──────────────────────────────────
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Using position:fixed technique — works with Lenis and GSAP
    document.body.style.overflow   = "hidden";
    document.body.style.position   = "fixed";
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.left       = "0";
    document.body.style.width      = "100%";

    playNav();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // ── Restore body scroll ─────────────────────────────────────────────
      document.body.style.overflow  = "";
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.left      = "";
      document.body.style.width     = "";
      window.scrollTo(scrollX, scrollY);

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, playNav]);

  if (!project) return null;

  return createPortal(
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="project-modal__header">
          <div className="project-modal__category-tag">
            <span className="project-modal__id">PROJECT {project.id}</span>
            <span className="project-modal__cat">{project.category}</span>
          </div>
          <button
            className="project-modal__close-btn"
            onClick={() => {
              playClick();
              onClose();
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="project-modal__body">
          <h2 className="project-modal__title">{project.title}</h2>

          <p className="project-modal__lead">{project.desc}</p>

          {/* Interactive Abstract Mockup Visual */}
          <div className="project-modal__mockup">
            <div className="mockup-header">
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <span className="mockup-url">
                https://crimson-preview.local/{project.title.toLowerCase().replace(/\s+/g, "-")}
              </span>
            </div>
            <div className="mockup-canvas">
              <div className="mockup-mesh" />
              <div className="mockup-wireframe">
                <div className="mockup-block mockup-block--hero" />
                <div className="mockup-row">
                  <div className="mockup-block mockup-block--col" />
                  <div className="mockup-block mockup-block--col" />
                </div>
              </div>
              <span className="mockup-badge">LIVE ARCHITECTURE</span>
            </div>
          </div>

          {/* Deep Dive Description */}
          {project.fullDescription && (
            <div className="project-modal__section">
              <h4 className="project-modal__section-title">Architectural Overview</h4>
              <p className="project-modal__text">{project.fullDescription}</p>
            </div>
          )}

          {/* Key Features */}
          {project.features && (
            <div className="project-modal__section">
              <h4 className="project-modal__section-title">Key Capabilities & Features</h4>
              <ul className="project-modal__features">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="project-modal__feature-item">
                    <span className="feature-bullet">▸</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div className="project-modal__section">
            <h4 className="project-modal__section-title">Technology Matrix</h4>
            <div className="project-modal__tech">
              {project.tech.map((t) => (
                <span key={t} className="project-modal__tech-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="project-modal__actions">
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn--primary"
                onClick={playClick}
                data-cursor="explore"
                data-cursor-text="OPEN DEMO"
              >
                <span>Launch Live Application</span>
                <span className="modal-btn__arrow">↗</span>
              </a>
            ) : (
              <div className="modal-btn modal-btn--disabled" title="Demo in active staging">
                <span>Demo In Active Staging</span>
              </div>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn--secondary"
                onClick={playClick}
                data-cursor="explore"
                data-cursor-text="SOURCE"
              >
                <span>View Source Code</span>
                <span className="modal-btn__arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
