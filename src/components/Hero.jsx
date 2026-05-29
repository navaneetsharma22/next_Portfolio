"use client";

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Send, FileText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LazyImage } from './ui/Shared';
import ResumeModal from './ui/ResumeModal';
import heroService from '../services/heroService';
import { useCursor } from '../context/CursorContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * TypingAnimation Component
 * Handles the dynamic text rotation for the hero section
 */
const TypingAnimation = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const typingSpeed = isDeleting ? 50 : 100;
  const pauseTime = 2000;

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[index];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        if (displayText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, phrases]);

  return (
    <span className="text-primary font-bold min-h-[1.5em] inline-block">
      {displayText}
      <span className="animate-pulse ml-1 text-primary">|</span>
    </span>
  );
};

const Hero = memo(({ initialData }) => {
  const [heroData, setHeroData] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { setCursor } = useCursor();

  // Refs for GSAP entrance animations
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const typingRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  const fetchHeroData = async () => {
    try {
      const data = await heroService.getHeroData();
      setHeroData(data);
    } catch (err) {
      console.error('Failed to fetch hero data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) return;
    fetchHeroData();
  }, [initialData]);

  // ── GSAP Entrance Animations (ThoughtWorks-style) ──
  useEffect(() => {
    if (isLoading) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Badge — scale + fade
      if (badgeRef.current) {
        tl.fromTo(badgeRef.current,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6 },
          0.2
        );
      }

      // Heading — clip-path reveal from bottom
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1 },
          0.3
        );
      }

      // Typing area — fade up
      if (typingRef.current) {
        tl.fromTo(typingRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.55
        );
      }

      // Description — fade up
      if (descRef.current) {
        tl.fromTo(descRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.65
        );
      }

      // Buttons — staggered fade up
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        tl.fromTo(buttons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          0.8
        );
      }

      // Image — slide from right + scale
      if (imageContainerRef.current) {
        tl.fromTo(imageContainerRef.current,
          { opacity: 0, x: 60, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 1 },
          0.3
        );
      }

      // Parallax on image while scrolling
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const phrases = [
    'MERN Stack Developer',
    'React Developer',
    'Full Stack Engineer',
    'Node.js Developer'
  ];

  const resumeUrl = heroData?.resumeUrl ? 
    (heroData.resumeUrl.startsWith('http') ? heroData.resumeUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${heroData.resumeUrl}`) 
    : null;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen flex items-center overflow-hidden relative pt-24 pb-32 lg:pt-40 lg:pb-60"
      style={{
        background: `
          radial-gradient(circle at 12% 100%, rgba(255, 226, 176, 0.96) 1%, rgba(255, 226, 176, 0.96) 5px, transparent 15%),
          radial-gradient(circle at 95% -15%, rgba(218, 77, 241, 0.4) 5%, transparent 30%),
          radial-gradient(circle at 100%, rgba(196, 245, 233, 0.7) 2%, transparent 35%),
          #ffffff
        `,
      }}
      aria-label="Navaneet Sharma — MERN Stack Developer Portfolio"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div
        className="mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full relative z-10"
        style={{ maxWidth: '1320px' }}
      >
        {/* Left — Content */}
        <div className="flex flex-col h-full justify-center items-center lg:items-start text-center lg:text-left">
          {isLoading ? (
            <div className="space-y-8 w-full flex flex-col items-center lg:items-start">
              <div className="w-48 h-8 bg-gray-100 animate-pulse" />
              <div className="w-full max-w-[600px] h-24 bg-gray-100 animate-pulse" />
              <div className="w-64 h-6 bg-gray-100 animate-pulse" />
              <div className="flex gap-4">
                <div className="w-40 h-14 bg-gray-100 animate-pulse" />
                <div className="w-40 h-14 bg-gray-100 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center lg:items-start">
              <div 
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-border/50 backdrop-blur-sm w-fit mb-8"
                style={{ opacity: 0 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-body">Available for Projects</span>
              </div>

              {/* Hidden SEO text — read by Google, invisible to users */}
              <span className="sr-only">
                Navaneet Sharma (navaneetsharma22) — MERN Stack Developer and Full Stack Web Developer from India.
                GitHub: github.com/navaneetsharma22 | LinkedIn: linkedin.com/in/navaneet-sharma-750b50357
              </span>

              <h1 
                ref={headingRef}
                className="font-bold leading-[1.1] mb-6 tracking-tighter text-heading text-4xl sm:text-5xl lg:text-7xl"
                style={{ opacity: 0, willChange: 'clip-path, transform' }}
              >
                Hello, I&apos;m <br />
                <span itemProp="name">{heroData?.title || 'Navaneet Sharma'}</span>
              </h1>

              <div 
                ref={typingRef}
                className="text-lg sm:text-xl md:text-2xl font-bold text-heading/80 mb-8 flex items-center gap-3"
                style={{ opacity: 0 }}
              >
                I'm a <TypingAnimation phrases={phrases} />
              </div>

              <p 
                ref={descRef}
                className="text-lg leading-relaxed text-body mb-12 max-w-[520px]"
                style={{ opacity: 0 }}
              >
                {heroData?.description || "Crafting high-performance web applications with the MERN stack. I turn complex problems into elegant, scalable digital solutions."}
              </p>

              {/* Action Buttons */}
              <div ref={buttonsRef} className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                <button
                  onClick={() => window.open('https://www.linkedin.com/in/navaneet-sharma-750b50357/', '_blank')}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                  className="btn-picto !rounded-none py-4 px-10 group"
                  style={{ opacity: 0 }}
                >
                  Hire Me
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => setIsResumeOpen(true)}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                  className="btn-picto-outline"
                  style={{ opacity: 0 }}
                >
                  <FileText size={20} />
                  View Resume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Photo Card */}
        <div className="relative flex justify-center items-center">
          <div
            ref={imageContainerRef}
            className="relative"
            style={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />
            <div
              ref={imageRef}
              className="bg-white overflow-hidden w-full max-w-[500px] lg:max-w-none"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.06)', aspectRatio: '4/5' }}
            >
              <LazyImage
                src={heroData?.profileImage || "/assets/navaneet.jpg"}
                alt={heroData?.title || "Navaneet Sharma"}
                className="w-full h-full object-cover object-top"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={resumeUrl}
      />
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
