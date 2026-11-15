import { useEffect, useRef, useState, useContext, createContext } from 'react';
import './CustomCursor.css';

// Context so child components can read cursor state
export const CursorContext = createContext(null);

const LERP_RING = 0.08;   // outer ring lag
const LERP_DOT  = 0.25;   // inner dot lag (snappier)

export default function CustomCursor() {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const textRef = useRef(null);
  const rippleContainerRef = useRef(null);

  // Live position state
  const pos = useRef({ mx: -200, my: -200, rx: -200, ry: -200, dx: -200, dy: -200 });
  const state = useRef({
    visible: false,
    clicking: false,
    type: 'default',
    text: '',
  });
  const rafId = useRef(null);
  const particles = useRef([]);

  // Particle trail pool
  const createParticle = useRef((x, y) => {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    const size = Math.random() * 5 + 2;
    const hue = 350 + Math.random() * 20; // crimson hue range
    p.style.cssText = `
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      background: hsl(${hue},90%,50%);
      box-shadow: 0 0 ${size * 3}px hsl(${hue},90%,50%);
    `;
    document.body.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 60 + 20;
    const life = { v: 1 };
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    let startTime = null;
    const duration = 400 + Math.random() * 300;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const prog = (ts - startTime) / duration;
      if (prog >= 1) { p.remove(); return; }
      const eased = 1 - prog;
      p.style.left = `${x + vx * prog}px`;
      p.style.top  = `${y + vy * prog + 30 * prog * prog}px`;
      p.style.opacity = eased;
      p.style.transform = `scale(${eased})`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const lastParticleTime = useRef(0);

  useEffect(() => {
    if (isTouchDevice || prefersReduced) return;

    const ring = ringRef.current;
    const dot  = dotRef.current;
    const textEl = textRef.current;

    const onMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      state.current.visible = true;

      // Throttle particles
      const now = performance.now();
      if (now - lastParticleTime.current > 40 && state.current.type !== 'default') {
        lastParticleTime.current = now;
        createParticle.current(e.clientX, e.clientY);
      }
    };

    const onDown = (e) => {
      state.current.clicking = true;
      // Create ripple
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top  = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    const onUp = () => { state.current.clicking = false; };

    const onLeave = () => { state.current.visible = false; };
    const onEnter = () => { state.current.visible = true; };

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      state.current.type = target ? (target.dataset.cursor || 'default') : 'default';
      state.current.text = target ? (target.dataset.cursorText || '') : '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover',  onOver);

    // RAF loop
    const tick = () => {
      const p = pos.current;
      const s = state.current;

      // Lerp ring
      p.rx += (p.mx - p.rx) * LERP_RING;
      p.ry += (p.my - p.ry) * LERP_RING;
      // Lerp dot
      p.dx += (p.mx - p.dx) * LERP_DOT;
      p.dy += (p.my - p.dy) * LERP_DOT;

      if (ring) {
        ring.style.transform = `translate(${p.rx}px, ${p.ry}px) translate(-50%, -50%)`;
        ring.style.opacity = s.visible ? '1' : '0';

        // Type-based classes
        ring.className = 'cursor-ring';
        if (s.type !== 'default') ring.classList.add(`cursor-ring--${s.type}`);
        if (s.clicking) ring.classList.add('cursor-ring--click');
      }
      if (dot) {
        dot.style.transform = `translate(${p.dx}px, ${p.dy}px) translate(-50%, -50%)`;
        dot.style.opacity = s.visible ? '1' : '0';
        dot.className = 'cursor-dot';
        if (s.clicking) dot.classList.add('cursor-dot--click');
      }
      if (textEl) {
        textEl.textContent = s.text;
        textEl.style.opacity = s.text ? '1' : '0';
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, prefersReduced]);

  if (isTouchDevice || prefersReduced) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={textRef} className="cursor-ring__text" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
