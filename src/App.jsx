import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CustomCursor from './components/CustomCursor/CustomCursor';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);

  const lenisRef = useRef(null);

  const handleLoaderComplete = () => {
    setLoaded(true);
    document.body.style.overflowY = 'auto';
    // Init Lenis smooth scroll after loader
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
  };

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'auto';
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return (
    <>
      {/* Global cursor — works on ALL pages */}
      <CustomCursor />

      {/* Cinematic loader */}
      {!loaded && <Loader onComplete={handleLoaderComplete} />}

      {/* Main site */}
      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
