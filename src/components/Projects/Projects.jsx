import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Projects.css";
import { PORTFOLIO_CONFIG } from "../../config/portfolioConfig";
import { useSound } from "../../context/SoundContext";
import ProjectModal from "./ProjectModal";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index, onSelect }) {
  const cardRef = useRef(null);
  const { playHover, playClick } = useSound();

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 1000,
      duration: 0.35,
      ease: "power2.out",
    });
    const glowEl = card.querySelector(".project-card__glow");
    if (glowEl) {
      glowEl.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${
        (y + 0.5) * 100
      }%, rgba(220,20,60,0.22) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.7)",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${project.featured ? "project-card--featured" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
        onSelect(project);
      }}
      style={{ "--accent": project.color }}
      data-cursor="view"
      data-cursor-text="VIEW"
    >
      <div className="project-card__glow" />

      {/* Top Bar */}
      <div className="project-card__top">
        <span className="project-card__id">{project.id}</span>
        <span className="project-card__cat">{project.category}</span>
        <div className="project-card__badges">
          {project.demo && <span className="project-badge project-badge--demo">LIVE DEMO</span>}
          <div className="project-card__arrow">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 16L16 4M16 4H7M16 4V13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.desc}</p>
      </div>

      {/* Tech Stack */}
      <div className="project-card__tech">
        {project.tech.map((t) => (
          <span key={t} className="project-card__tech-item">
            {t}
          </span>
        ))}
      </div>

      {/* Quick Action Footer */}
      <div className="project-card__footer">
        <span className="project-card__cta">Inspect Case Study →</span>
        <div className="project-card__links" onClick={(e) => e.stopPropagation()}>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-quick-link"
              title="Launch Live Demo"
              onClick={playClick}
            >
              Demo ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-quick-link"
              title="View GitHub Source"
              onClick={playClick}
            >
              Code ↗
            </a>
          )}
        </div>
      </div>

      <div className="project-card__line" />
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".projects__label, .projects__heading, .projects__sub", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects__header", start: "top 80%", once: true },
      });

      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects__grid", start: "top 80%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects">
      <div className="projects__bg-gradient" />

      <div className="section-container">
        <div className="projects__header">
          <span className="projects__label section-label">Selected Works & Case Studies</span>
          <h2 className="projects__heading section-heading">
            Projects that <span className="text-crimson">push</span>
            <br />
            the boundary
          </h2>
          <p className="projects__sub">
            Interactive software architectures designed for resilience, speed, and immersive
            visual delight. Click any card to inspect full system specs.
          </p>
        </div>

        <div className="projects__grid">
          {PORTFOLIO_CONFIG.projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        <div className="projects__more">
          <a
            className="projects__more-link"
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="explore"
            data-cursor-text="GITHUB"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <span>Explore All Repositories on GitHub</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Case Study Deep Dive Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
