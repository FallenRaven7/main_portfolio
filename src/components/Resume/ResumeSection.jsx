import React, { useState } from "react";
import "./ResumeSection.css";
import MagneticButton from "../MagneticButton/MagneticButton";
import { PORTFOLIO_CONFIG } from "../../config/portfolioConfig";
import { useSound } from "../../context/SoundContext";

export default function ResumeSection() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { playClick, playSuccess } = useSound();

  const handleDownload = () => {
    playClick();
    setDownloading(true);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = PORTFOLIO_CONFIG.resumePath;
      link.download = `Resume_${PORTFOLIO_CONFIG.name.replace(/\s+/g, "_")}.pdf`;
      link.click();

      setDownloading(false);
      setDownloadSuccess(true);
      playSuccess();

      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 600);
  };

  return (
    <section id="resume" className="resume-section">
      <div className="section-container">
        <div className="resume-card">
          <div className="resume-card__ambient" />

          {/* Left Column: Value Prop & Download */}
          <div className="resume-card__content">
            <span className="section-label">Curriculum Vitae</span>
            <h2 className="resume-heading">
              Engineering <span className="text-crimson">Credentials</span> & Background
            </h2>
            <p className="resume-desc">
              Looking for a dedicated software engineering talent? Explore comprehensive
              work history, academic milestones, technical competencies, and project leadership.
            </p>

            <div className="resume-actions">
              <MagneticButton
                className={`resume-download-btn ${downloading ? "resume-download-btn--active" : ""}`}
                onClick={handleDownload}
                data-cursor="magnetic"
              >
                <span className="resume-download-btn__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="resume-download-btn__text">
                  {downloading ? "Preparing PDF..." : "Download Official CV"}
                </span>
              </MagneticButton>

              <a
                href={PORTFOLIO_CONFIG.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-preview-link"
                onClick={playClick}
                data-cursor="explore"
                data-cursor-text="PREVIEW"
              >
                <span>Preview PDF in Tab</span>
                <span className="preview-arrow">↗</span>
              </a>
            </div>

            {/* Download Toast Feedback */}
            {downloadSuccess && (
              <div className="resume-toast">
                <span className="resume-toast__check">✓</span>
                <span>Resume downloaded successfully. Thank you for your interest!</span>
              </div>
            )}
          </div>

          {/* Right Column: Quick Highlights Matrix */}
          <div className="resume-card__matrix">
            <div className="matrix-block">
              <h4 className="matrix-block__title">ACADEMIC FOUNDATION</h4>
              <p className="matrix-block__value">B.Sc. in Software Engineering</p>
              <span className="matrix-block__sub">Active Undergraduate Degree</span>
            </div>

            <div className="matrix-block">
              <h4 className="matrix-block__title">CORE SPECIALIZATION</h4>
              <p className="matrix-block__value">Creative Frontend & Full-Stack Systems</p>
              <span className="matrix-block__sub">React · GSAP · Node.js · Cloud APIs</span>
            </div>

            <div className="matrix-block">
              <h4 className="matrix-block__title">AVAILABILITY</h4>
              <p className="matrix-block__value matrix-block__value--available">
                <span className="status-ping" /> Open for Global Opportunities
              </p>
              <span className="matrix-block__sub">Remote, Hybrid, or On-Site</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
