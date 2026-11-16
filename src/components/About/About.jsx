import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  { year: '2021', title: 'Started Coding', desc: 'Began the journey with HTML, CSS, and JavaScript. Fell in love with building for the web.' },
  { year: '2022', title: 'React & Beyond', desc: 'Dived deep into React ecosystem, building projects and mastering component architecture.' },
  { year: '2023', title: 'Full Stack Journey', desc: 'Expanded into Node.js, databases, and cloud services. Built real-world applications.' },
  { year: '2024', title: 'Creative Dev', desc: 'Discovered GSAP, Three.js, and advanced animations. Merged design thinking with engineering.' },
  { year: '2025+', title: 'Going Further', desc: 'Pursuing excellence in creative development, UI/UX and cutting-edge web experiences.' },
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header reveal
      gsap.from('.about__label, .about__heading, .about__desc', {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__header', start: 'top 80%', once: true },
      });

      // Timeline items stagger in
      gsap.from('.timeline__item', {
        x: -60, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__timeline', start: 'top 75%', once: true },
      });

      // Right panel — dual photo gallery
      gsap.from('.about__photo-primary', {
        x: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__right', start: 'top 75%', once: true },
      });
      gsap.from('.about__photo-secondary', {
        x: 40, opacity: 0, duration: 0.9, delay: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__right', start: 'top 75%', once: true },
      });

      // Traits
      gsap.from('.about__trait', {
        y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__traits', start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about">
      <div className="about__ambient" />

      <div className="section-container">
        <div className="about__header">
          <span className="about__label section-label">About Me</span>
          <h2 className="about__heading section-heading">
            Code is my <span className="text-crimson">craft</span>.<br />
            Design is my <span className="text-stroke">language</span>.
          </h2>
          <p className="about__desc">
            I'm a passionate software engineering student who builds digital experiences 
            that feel alive. I obsess over every pixel, every animation, every interaction — 
            because I believe great software should feel as good as it works.
          </p>
        </div>

        <div className="about__layout">
          {/* Left — Timeline */}
          <div className="about__left">
            <div className="about__timeline">
              {TIMELINE.map((item, i) => (
                <div key={i} className="timeline__item">
                  <div className="timeline__year">{item.year}</div>
                  <div className="timeline__content">
                    <h4 className="timeline__title">{item.title}</h4>
                    <p className="timeline__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="about__right">
            {/* Dual-photo cinematic gallery */}
            <div className="about__photo-gallery" data-cursor="explore" data-cursor-text="ABOUT">
              <div className="about__photo-primary">
                <img src="/portrait.webp" alt="Portrait — metro" className="about__img" />
                <div className="about__img-overlay" />
                <div className="about__img-border" />
                <div className="about__photo-label">
                  <span className="about__photo-label-dot" />
                  <span>In transit</span>
                </div>
              </div>
              <div className="about__photo-secondary">
                <img src="/portrait.jpg" alt="Portrait — focused" className="about__img" />
                <div className="about__img-overlay" />
                <div className="about__img-border" />
                <div className="about__photo-label">
                  <span className="about__photo-label-dot" />
                  <span>In the zone</span>
                </div>
              </div>
            </div>

            <div className="about__traits">
              {['Problem Solver', 'Creative Thinker', 'Detail Obsessed', 'Fast Learner', 'Team Player'].map((t) => (
                <span key={t} className="about__trait">
                  <span className="about__trait-dot" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
