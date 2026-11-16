/**
 * Portfolio Configuration
 * Easily customize personal information, GitHub username, projects, and resume settings.
 */

export const PORTFOLIO_CONFIG = {
  name: "Fallen Raven",
  title: "Creative Developer & Interaction Engineer",
  tagline: "Crafting Digital Experiences",
  bio: "Software Engineering student building high-performance, award-winning web interfaces with React, GSAP, and cinematic design systems.",
  location: "Bangladesh 🇧🇩",
  email: "your@email.com", // Replace with your real contact email
  githubUsername: "FallenRaven7",
  githubUrl: "https://github.com/FallenRaven7",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  resumePath: "/resume.pdf", // Place your real resume PDF in public/resume.pdf

  projects: [
    {
      id: "01",
      title: "Neural Dashboard",
      category: "Full Stack App",
      featured: true,
      color: "#dc143c",
      tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
      desc: "Real-time analytics dashboard with live data streaming, interactive charts, and AI-powered insights. Built with scalability and performance in mind.",
      fullDescription: "A high-throughput enterprise dashboard built for monitoring complex distributed microservices. Features sub-100ms real-time metric visualization, custom charting pipelines via HTML5 Canvas, and anomaly detection algorithms.",
      features: [
        "Real-time WebSocket event telemetry",
        "Sub-100ms chart rendering with WebGL fallback",
        "Configurable multi-tenant role-based dashboards",
        "Automated PDF & CSV reporting engine"
      ],
      github: "https://github.com/FallenRaven7/main_portfolio",
      demo: "https://github.com/FallenRaven7", // Update with your deployed live demo
    },
    {
      id: "02",
      title: "Employee Management System",
      category: "Full Stack Platform",
      featured: false,
      color: "#8b1a2e",
      tech: ["React", "Express.js", "MongoDB", "TailwindCSS"],
      desc: "Enterprise employee records, payroll calculation, attendance tracking, and department hierarchy management system.",
      fullDescription: "A scalable HR & organizational management platform designed to streamline corporate workflows, manage employee lifecycles, and automate role permissions.",
      features: [
        "Role-based access control (Admin, HR, Employee)",
        "Automated attendance logs & leaves approval system",
        "Interactive org chart and department matrix",
        "Encrypted payroll calculation and slip generation"
      ],
      github: "https://github.com/FallenRaven7/Employee_management",
      demo: null,
    },
    {
      id: "03",
      title: "Portfolio Web Application",
      category: "Creative Dev & Showcase",
      featured: false,
      color: "#dc143c",
      tech: ["React", "GSAP", "CSS3", "Vite"],
      desc: "An avant-garde personal portfolio demonstrating fluid physics, liquid cursor, dark/light theme dynamics, and micro-interactions.",
      fullDescription: "Built with the philosophy of zero visual compromises. Combines GPU-accelerated canvas particles, custom linear interpolation cursor tracking, and modular component architecture.",
      features: [
        "Awwwards-inspired liquid crimson custom cursor",
        "Web Audio API synthesized micro-sounds",
        "Integrated developer command palette (Ctrl + K)",
        "Live GitHub REST API repository showcase"
      ],
      github: "https://github.com/FallenRaven7/portfolio_webApplication",
      demo: "https://github.com/FallenRaven7/portfolio_webApplication",
    },
    {
      id: "04",
      title: "DevChat Real-Time App",
      category: "Real-time App",
      featured: false,
      color: "#6b0f1a",
      tech: ["Socket.io", "Express", "React", "JWT"],
      desc: "Developer-focused collaborative chat application with code syntax highlighting, markdown preview, and ephemeral channels.",
      fullDescription: "Instantaneous communication tool tailored for programming teams, featuring live collaborative code snippets, end-to-end authenticated sessions, and team channels.",
      features: [
        "Sub-second message delivery via WebSockets",
        "In-line Prism.js multi-language syntax highlighting",
        "Persistent channel histories with MongoDB",
        "Custom avatar generation and user presence"
      ],
      github: "https://github.com/FallenRaven7",
      demo: null,
    },
    {
      id: "05",
      title: "Task Management AI",
      category: "AI SaaS Platform",
      featured: false,
      color: "#dc143c",
      tech: ["React", "OpenAI API", "Node.js", "Redis"],
      desc: "Intelligent task manager that uses NLP to prioritize, categorize, and schedule your work for maximum productivity.",
      fullDescription: "Smart task scheduling platform that converts conversational notes into structured kanban boards with automated time estimations and deadline warnings.",
      features: [
        "Natural language prompt to sub-task breakdown",
        "Smart priority scoring using workload analytics",
        "Drag-and-drop Kanban interface with optimistic UI",
        "Redis caching for lightning-fast queries"
      ],
      github: "https://github.com/FallenRaven7",
      demo: null,
    },
    {
      id: "06",
      title: "Weather Universe 3D",
      category: "Interactive 3D Web",
      featured: false,
      color: "#990f24",
      tech: ["Three.js", "React", "REST API", "GSAP"],
      desc: "3D interactive globe and atmospheric visualization using Three.js with real-time weather stations and particle simulations.",
      fullDescription: "An atmospheric exploration canvas combining WebGL shaders, particle velocity fields for precipitation, and live global meteorological feeds.",
      features: [
        "Interactive 3D rotating earth with bump mapping",
        "Dynamic particle weather effects (rain, snow, storm)",
        "Global city search with live OpenWeatherMap data",
        "Day/Night sun angle calculation and shadow casting"
      ],
      github: "https://github.com/FallenRaven7",
      demo: null,
    },
  ],

  easterEggs: {
    terminalCommand: "crimson",
    secretKey: "`",
    messages: [
      "🚀 Achievement Unlocked: Elite Inspector! You found the hidden engineer log.",
      "⚡ Matrix mode engaged. Follow the white rabbit.",
      "🔴 Crimson Protocol initialized. System running at 100% capacity."
    ]
  }
};
