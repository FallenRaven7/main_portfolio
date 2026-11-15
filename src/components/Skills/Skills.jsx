import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = {
  Frontend: [
    { name: 'React / Next.js', level: 90 },
    { name: 'JavaScript / TypeScript', level: 85 },
    { name: 'HTML5 & CSS3', level: 95 },
    { name: 'GSAP & Framer Motion', level: 80 },
    { name: 'Tailwind CSS', level: 88 },
  ],
  Backend: [
    { name: 'Node.js / Express', level: 78 },
    { name: 'Python', level: 72 },
    { name: 'REST APIs', level: 85 },
    { name: 'MongoDB / PostgreSQL', level: 75 },
    { name: 'Firebase', level: 80 },
  ],
  Tools: [
    { name: 'Git & GitHub', level: 92 },
    { name: 'Figma / Design', level: 76 },
    { name: 'Docker Basics', level: 60 },
    { name: 'Linux / Terminal', level: 70 },
    { name: 'Vite / Webpack', level: 82 },
  ],
};

const MARQUEE_ITEMS = [
  'React', 'Next.js', 'TypeScript', 'GSAP', 'Node.js', 'MongoDB',
  'Figma', 'Tailwind', 'Three.js', 'Firebase', 'PostgreSQL', 'Redux',
  'Python', 'Docker', 'Git', 'REST API', 'GraphQL', 'Framer Motion',
];

function SkillBar({ name, level, index }) {
  const barRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current) return;
    gsap.fromTo(fillRef.current,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.2,
        ease: 'power3.out',
        delay: index * 0.08,
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, [level, index]);

  return (
    <div ref={barRef} className="skill-bar">
      <div className="skill-bar__header">
        <span className="skill-bar__name">{name}</span>
        <span className="skill-bar__level">{level}%</span>
      </div>
      <div className="skill-bar__track">
        <div ref={fillRef} className="skill-bar__fill" style={{ '--level': `${level}%` }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills__label, .skills__heading', {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.skills__header', start: 'top 80%', once: true },
      });

      gsap.from('.skills__category', {
        y: 50, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.skills__grid', start: 'top 80%', once: true },
      });

      // Duplicate marquee for seamless scroll
      gsap.to('.marquee__inner', {
        xPercent: -50,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills">
      <div className="skills__top-line" />

      <div className="section-container">
        <div className="skills__header">
          <span className="skills__label section-label">Tech Stack</span>
          <h2 className="skills__heading section-heading">
            Tools I <span className="text-crimson">master</span><br />
            and <span className="text-stroke">create</span> with
          </h2>
        </div>

        <div className="skills__grid">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category} className="skills__category">
              <h4 className="skills__category-title">
                <span className="skills__cat-dot" />{category}
              </h4>
              <div className="skills__bars">
                {items.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite marquee */}
      <div className="marquee">
        <div className="marquee__inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee__item">
              {item} <span className="marquee__dot">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
