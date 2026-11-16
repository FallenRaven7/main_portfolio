import React, { useState, useEffect } from "react";
import "./GitHubShowcase.css";
import { PORTFOLIO_CONFIG } from "../../config/portfolioConfig";
import { useSound } from "../../context/SoundContext";

// Language color mapping
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Rust: "#dea584",
  Go: "#00ADD8",
  PHP: "#4F5D95",
  Shell: "#89e051",
};

export default function GitHubShowcase() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { playHover, playClick } = useSound();

  const username = PORTFOLIO_CONFIG.githubUsername;

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user info
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserProfile(userData);
      }

      // Fetch repos sorted by updated
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("GitHub API rate limit exceeded. Please try again shortly.");
        }
        if (res.status === 404) {
          throw new Error(`GitHub user '@${username}' not found.`);
        }
        throw new Error(`Failed to load repositories (HTTP ${res.status}).`);
      }

      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("GitHub API error:", err);
      setError(err.message || "Failed to connect to GitHub API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, [username]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section id="github" className="github-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="github-header">
          <div className="github-header__info">
            <span className="section-label">Open Source Telemetry</span>
            <h2 className="section-heading">
              Live from <span className="text-crimson">GitHub</span>
            </h2>
            <p className="github-sub">
              Real-time synchronization with public repositories. Continuous deployment,
              clean commits, and open-source contributions.
            </p>
          </div>

          {userProfile && (
            <a
              href={userProfile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="github-badge"
              data-cursor="explore"
              data-cursor-text="GITHUB"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              <img
                src={userProfile.avatar_url}
                alt={userProfile.login}
                className="github-badge__avatar"
              />
              <div className="github-badge__meta">
                <span className="github-badge__name">@{userProfile.login}</span>
                <span className="github-badge__repos">
                  {userProfile.public_repos} public repos · {userProfile.followers} followers
                </span>
              </div>
              <span className="github-badge__arrow">↗</span>
            </a>
          )}
        </div>

        {/* Repos Grid */}
        <div className="github-grid">
          {loading ? (
            // Skeleton Cards
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="repo-card repo-card--skeleton">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc" style={{ width: "65%" }} />
                <div className="skeleton-footer">
                  <div className="skeleton-pill" />
                  <div className="skeleton-pill" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error Card
            <div className="github-error">
              <span className="github-error__icon">⚠️</span>
              <p className="github-error__msg">{error}</p>
              <button
                className="github-retry-btn"
                onClick={() => {
                  playClick();
                  fetchGitHubData();
                }}
              >
                Retry API Connection
              </button>
            </div>
          ) : repos.length === 0 ? (
            // Empty State
            <div className="github-empty">
              <span>No public repositories available for @{username} at this moment.</span>
            </div>
          ) : (
            // Real Repos
            repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card"
                data-cursor="view"
                data-cursor-text="REPO"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                <div className="repo-card__header">
                  <div className="repo-card__name-wrap">
                    <span className="repo-card__icon">📦</span>
                    <h3 className="repo-card__name">{repo.name}</h3>
                  </div>
                  <span className="repo-card__arrow">↗</span>
                </div>

                <p className="repo-card__desc">
                  {repo.description || "Public repository containing source code, modules, and architecture."}
                </p>

                <div className="repo-card__footer">
                  {repo.language && (
                    <div className="repo-lang">
                      <span
                        className="repo-lang__dot"
                        style={{ backgroundColor: LANG_COLORS[repo.language] || "#dc143c" }}
                      />
                      <span className="repo-lang__name">{repo.language}</span>
                    </div>
                  )}

                  <div className="repo-stats">
                    <span className="repo-stat" title="Stars">
                      ★ {repo.stargazers_count}
                    </span>
                    <span className="repo-stat" title="Forks">
                      ⑂ {repo.forks_count}
                    </span>
                  </div>

                  <span className="repo-date">{formatDate(repo.updated_at)}</span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
