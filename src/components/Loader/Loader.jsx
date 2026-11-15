import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Loader.css';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const overlaysRef = useRef([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            onComplete,
          });
        },
      });

      // Count up 0 → 100
      tl.to({ val: 0 }, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          setCount(v);
          if (barRef.current) barRef.current.style.width = `${v}%`;
        },
      });

      // Stagger overlay panels out
      tl.to(overlaysRef.current, {
        yPercent: -100,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power4.inOut',
      }, '-=0.1');
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="loader">
      <div className="loader__overlays">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="loader__overlay"
            ref={(el) => (overlaysRef.current[i] = el)}
          />
        ))}
      </div>
      <div className="loader__content">
        <div className="loader__logo">
          <span className="loader__logo-bracket">&lt;</span>
          <span className="loader__logo-name">Portfolio</span>
          <span className="loader__logo-bracket">/&gt;</span>
        </div>
        <div className="loader__bar-wrap">
          <div ref={barRef} className="loader__bar" />
        </div>
        <div ref={counterRef} className="loader__counter">
          {String(count).padStart(3, '0')}
        </div>
        <p className="loader__label">Initializing Experience</p>
      </div>
    </div>
  );
}
