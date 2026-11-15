import { useRef, useCallback } from 'react';
import './MagneticButton.css';

export default function MagneticButton({ children, className = '', strength = 0.4, ...props }) {
  const btnRef = useRef(null);
  const innerRef = useRef(null);
  const animRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = useCallback(() => {
    current.current.x = lerp(current.current.x, target.current.x, 0.1);
    current.current.y = lerp(current.current.y, target.current.y, 0.1);

    if (innerRef.current) {
      innerRef.current.style.transform =
        `translate(${current.current.x}px, ${current.current.y}px)`;
    }

    const dist = Math.hypot(current.current.x, current.current.y);
    if (dist > 0.05) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (innerRef.current) innerRef.current.style.transform = 'translate(0px, 0px)';
      animRef.current = null;
    }
  }, []);

  const onMouseMove = useCallback((e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    target.current.x = (e.clientX - cx) * strength;
    target.current.y = (e.clientY - cy) * strength;
    if (!animRef.current) animRef.current = requestAnimationFrame(animate);
  }, [animate, strength]);

  const onMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
    if (!animRef.current) animRef.current = requestAnimationFrame(animate);
  }, [animate]);

  return (
    <button
      ref={btnRef}
      className={`magnetic-btn ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor="magnetic"
      {...props}
    >
      <span ref={innerRef} className="magnetic-btn__inner">
        {children}
      </span>
    </button>
  );
}
