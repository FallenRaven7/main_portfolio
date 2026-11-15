import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    title: 'Neural Dashboard',
    category: 'Full Stack App',
    tech: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    desc: 'Real-time analytics dashboard with live data streaming, interactive charts, and AI-powered insights. Built with scalability and performance in mind.',
    color: '#dc143c',
    featured: true,
  },
  {
    id: '02',
    title: 'E-Commerce Platform',
    category: 'Web Application',
    tech: ['Next.js', 'Stripe', 'MongoDB', 'Redux'],
    desc: 'Complete e-commerce solution with cart management, payment processing, inventory system, and admin panel.',
    color: '#8b1a2e',
    featured: false,
  },
  {
    id: '03',
    title: 'Portfolio CMS',
    category: 'SaaS Product',
    tech: ['React', 'Firebase', 'Tailwind', 'GSAP'],
    desc: 'No-code portfolio builder with drag-and-drop editor, custom themes, and one-click deployment for creatives.',
    color: '#dc143c',
    featured: false,
  },
  {
    id: '04',
    title: 'DevChat App',
    category: 'Real-time App',
    tech: ['Socket.io', 'Express', 'React', 'JWT'],
    desc: 'Developer-focused chat application with code syntax highlighting, file sharing, and channel management.',
    color: '#6b0f1a',
    featured: false,
  },
  {
    id: '05',
    title: 'Task Management AI',
    category: 'AI-Powered App',
    tech: ['React', 'OpenAI API', 'Node.js', 'Redis'],
    desc: 'Intelligent task manager that uses AI to prioritize, categorize, and schedule your work for maximum productivity.',
    color: '#dc143c',
    featured: false,
  },
  {
    id: '06',
    title: 'Weather Universe',
    category: 'Interactive Web',
    tech: ['Three.js', 'React', 'REST API', 'GSAP'],
    desc: '3D interactive weather visualization using Three.js with real-time weather data and stunning particle effects.',
    color: '#990f24',
    featured: false,
  },
];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 12,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    });
    // Glow follow
    const glowEl = card.querySelector('.project-card__glow');
    if (glowEl) {
      glowEl.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(220,20,60,0.2) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.7)',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--accent': project.color }}
      data-cursor="view"
      data-cursor-text="VIEW"
    >
      {/* Glow layer */}
      <div className="project-card__glow" />

      {/* Top bar */}
      <div className="project-card__top">
        <span className="project-card__id">{project.id}</span>
        <span className="project-card__cat">{project.category}</span>
        <div className="project-card__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L16 4M16 4H7M16 4V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.desc}</p>
      </div>

      {/* Tech stack */}
      <div className="project-card__tech">
        {project.tech.map((t) => (
          <span key={t} className="project-card__tech-item">{t}</span>
        ))}
      </div>

      {/* Bottom line */}
      <div className="project-card__line" />
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects__label, .projects__heading, .projects__sub', {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects__header', start: 'top 80%', once: true },
      });

      gsap.from('.project-card', {
        y: 80, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects__grid', start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects">
      <div className="projects__bg-gradient" />

      <div className="section-container">
        <div className="projects__header">
          <span className="projects__label section-label">Selected Work</span>
          <h2 className="projects__heading section-heading">
            Projects that <span className="text-crimson">push</span><br />
            the boundary
          </h2>
          <p className="projects__sub">
            A curated selection of my most impactful work — each one a challenge solved with 
            creativity and engineering precision.
          </p>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="projects__more">
          <a
            className="projects__more-link"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="explore"
            data-cursor-text="GITHUB"
          >
            <span>View All Projects on GitHub</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
