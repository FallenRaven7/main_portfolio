import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../MagneticButton/MagneticButton';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { name: 'GitHub', url: 'https://github.com', icon: 'GH' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'IN' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'TW' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__label, .contact__heading, .contact__sub', {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__header', start: 'top 80%', once: true },
      });

      gsap.from('.contact__form-wrap', {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__layout', start: 'top 75%', once: true },
      });

      gsap.from('.contact__info-item', {
        x: -40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__info', start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div className="contact__glow" />

      <div className="section-container">
        <div className="contact__header">
          <span className="contact__label section-label">Get In Touch</span>
          <h2 className="contact__heading section-heading">
            Let's build something<br />
            <span className="text-crimson">extraordinary</span> together
          </h2>
          <p className="contact__sub">
            Have a project in mind? A collaboration idea? Or just want to say hello?<br />
            My inbox is always open.
          </p>
        </div>

        <div className="contact__layout">
          {/* Info */}
          <div className="contact__info">
            {[
              { label: 'Email', value: 'your@email.com', href: 'mailto:your@email.com' },
              { label: 'Location', value: 'Bangladesh 🇧🇩', href: null },
              { label: 'Availability', value: 'Open to opportunities', href: null },
            ].map((item) => (
              <div key={item.label} className="contact__info-item">
                <span className="contact__info-label">{item.label}</span>
                {item.href ? (
                  <a href={item.href} className="contact__info-value contact__info-link">
                    {item.value}
                  </a>
                ) : (
                  <span className="contact__info-value">{item.value}</span>
                )}
              </div>
            ))}

            <div className="contact__socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social"
                  data-cursor="explore"
                  data-cursor-text={s.name.toUpperCase()}
                >
                  <span className="contact__social-icon">{s.icon}</span>
                  <span className="contact__social-name">{s.name}</span>
                  <svg className="contact__social-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap">
            <form onSubmit={handleSubmit} className="contact__form">
              <div className="contact__field">
                <label className="contact__label-field" htmlFor="name">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="contact__input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field">
                <label className="contact__label-field" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="contact__input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field">
                <label className="contact__label-field" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="contact__input contact__textarea"
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <MagneticButton
                className={`contact__submit ${sending ? 'contact__submit--sending' : ''} ${sent ? 'contact__submit--sent' : ''}`}
                type="submit"
                disabled={sending}
              >
                <span className="contact__submit-inner">
                  {sent ? (
                    <>✓ Message Sent!</>
                  ) : sending ? (
                    <>
                      <span className="contact__spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </>
                  )}
                </span>
                <span className="contact__submit-glow" />
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
