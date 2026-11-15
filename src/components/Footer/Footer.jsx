import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__top-line" />
      <div className="footer__inner">
        <div className="footer__left">
          <span className="footer__logo">
            <span className="footer__bracket">&lt;</span>Dev
            <span className="footer__bracket">/&gt;</span>
          </span>
          <p className="footer__copy">
            Designed & built with ❤️ and ☕<br />
            © {year} All rights reserved.
          </p>
        </div>

        <div className="footer__center">
          <p className="footer__made">
            Made with <span className="text-crimson">React</span> + <span className="text-crimson">GSAP</span>
          </p>
        </div>

        <button
          className="footer__back-top"
          onClick={scrollTop}
          data-cursor="magnetic"
          aria-label="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 16V4M4 10l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </footer>
  );
}
