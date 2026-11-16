import React, { useEffect, useRef, useState } from "react";
import "./KonamiCelebration.css";
import { useSound } from "../../context/SoundContext";

export default function KonamiCelebration({ active, onComplete, customMessage }) {
  const canvasRef = useRef(null);
  const { playSuccess, playGlitch } = useSound();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!active) return;

    playSuccess();
    setTimeout(() => playGlitch(), 400);

    setToastMessage(
      customMessage || "🏆 ACHIEVEMENT UNLOCKED: CRIMSON OVERDRIVE PROTOCOL (+500 XP)"
    );

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#dc143c", "#ff4060", "#ffffff", "#8b1a2e", "#ffd700"];
    const particles = [];
    const numParticles = 140;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        gravity: 0.25,
      });
    }

    let start = performance.now();
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (performance.now() - start < 4500) {
        animId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [active, onComplete, customMessage, playSuccess, playGlitch]);

  if (!active) return null;

  return (
    <div className="konami-overlay">
      <canvas ref={canvasRef} className="konami-canvas" />
      <div className="konami-toast">
        <span className="konami-toast__icon">⚡</span>
        <span className="konami-toast__text">{toastMessage}</span>
      </div>
    </div>
  );
}
