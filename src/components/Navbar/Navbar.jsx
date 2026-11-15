import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import MagneticButton from '../MagneticButton/MagneticButton';
import './Navbar.css';

const NAV_LINKS = ['About', 'Projects', 'Skills', 'Contact'];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav__logo, .nav__link, .nav__cta', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 3.5,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo('.mobile-menu__link',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [menuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <a className="nav__logo" href="#hero" data-cursor="magnetic">
            <span className="nav__logo-bracket">&lt;</span>
            Dev
            <span className="nav__logo-bracket">/&gt;</span>
          </a>

          <div className="nav__links">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="nav__link"
                onClick={() => scrollTo(link)}
                data-cursor="link"
              >
                <span className="nav__link-text">{link}</span>
                <span className="nav__link-line" />
              </button>
            ))}
          </div>

          <MagneticButton
            className="nav__cta"
            onClick={() => scrollTo('Contact')}
          >
            <span className="nav__cta-inner">Let's Talk</span>
            <span className="nav__cta-bg" />
          </MagneticButton>

          <button
            className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div ref={menuRef} className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__inner">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className="mobile-menu__link"
              onClick={() => scrollTo(link)}
            >
              <span className="mobile-menu__num">0{NAV_LINKS.indexOf(link) + 1}</span>
              {link}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
