import React, { useEffect, useRef } from "react";
import "./NotFound.css";
import MagneticButton from "../MagneticButton/MagneticButton";
import { useSound } from "../../context/SoundContext";

export default function NotFound({ onBackHome }) {
  const canvasRef = useRef(null);
  const { playClick, playGlitch } = useSound();

  useEffect(() => {
    playGlitch();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(220, 20, 60, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#dc143c";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [playGlitch]);

  return (
    <div className="not-found">
      <canvas ref={canvasRef} className="not-found__canvas" />

      <div className="not-found__content">
        <div className="not-found__status">
          <span className="not-found__status-dot" />
          <span>ERROR CODE: 0x404_SECTOR_NOT_FOUND</span>
        </div>

        <h1 className="not-found__title">
          <span className="not-found__digit">4</span>
          <span className="not-found__digit not-found__digit--glitch">0</span>
          <span className="not-found__digit">4</span>
        </h1>

        <div className="not-found__lead">
          <p className="not-found__headline">COORDINATES UNRESOLVED IN THE QUANTUM MATRIX</p>
          <p className="not-found__sub">
            The hyper-route you navigated to does not exist in this sector or was relocated during
            system optimization.
          </p>
        </div>

        <div className="not-found__actions">
          <MagneticButton
            className="not-found__btn"
            onClick={() => {
              playClick();
              if (onBackHome) onBackHome();
              else window.location.href = "/";
            }}
            data-cursor="magnetic"
          >
            <span className="not-found__btn-text">← Return to Safety (Home)</span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
