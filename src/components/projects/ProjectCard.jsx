"use client";

import React, { memo, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { ArrowUpRight } from 'lucide-react';
import { LazyImage } from '../ui/Shared';
import { useCursor } from '../../context/CursorContext';
import ExplainToggle from '../ai/ExplainToggle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProjectCard = memo(({ project, index, onOpenDetails }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const { setCursor } = useCursor();

  // ── GSAP ScrollTrigger: ThoughtWorks-style fade-up + stagger ──
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 80,
      scale: 0.96,
    });

    // Animate on scroll into view — staggered by index
    const tween = gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: index * 0.12,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        end: 'top 20%',
        toggleActions: 'play none none none',
      },
    });

    // Parallax effect on image — subtle vertical shift while scrolling
    const img = imageRef.current;
    if (img) {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === card || st.trigger === img) st.kill();
      });
    };
  }, [index]);

  // ── Mouse-driven 3D tilt ──
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    el.style.setProperty('--spot-x', `${x * 100}%`);
    el.style.setProperty('--spot-y', `${y * 100}%`);

    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setCursor('hover');
    // Image zoom — ThoughtWorks style
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.06,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
    // Overlay reveal
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [setCursor]);

  const handleMouseLeave = useCallback(() => {
    setCursor('default');
    const el = cardRef.current;
    if (el) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
    // Image un-zoom
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
    // Overlay hide
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [setCursor]);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="project-card group relative bg-white overflow-hidden will-change-transform"
      style={{
        borderRadius: '0',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* Spotlight Overlay */}
      <div className="project-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* ── Image Container ── */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          ref={imageRef}
          className="w-full h-full"
          style={{ willChange: 'transform' }}
        >
          <LazyImage
            src={project.images?.[0] || 'https://via.placeholder.com/800x500'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-white/90 backdrop-blur-md text-[#1a1a1a] border border-black/5 shadow-sm">
              {project.status}
            </span>
          </div>
        )}

        {/* Hover Overlay — ThoughtWorks gradient reveal */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(180deg, transparent 30%, rgba(25,25,25,0.85) 100%)',
            opacity: 0,
          }}
          onClick={() => onOpenDetails(project)}
        >
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              {project.category}
            </p>
            <h4 className="text-white text-xl font-bold tracking-tight">
              {project.title}
            </h4>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ArrowUpRight size={22} className="text-white" />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div ref={contentRef} className="p-7">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            {project.category}
          </p>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-[#1a1a1a] transition-colors duration-300"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
            >
              <FaGithub size={18} />
            </a>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-primary transition-colors duration-500 tracking-tight leading-tight">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-6">
          {project.shortDescription}
        </p>

        <div className="flex flex-col gap-4 pt-5 border-t border-gray-100/80">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="text-[9px] font-bold uppercase tracking-widest text-gray-400"
              >
                {tech}{i < Math.min((Array.isArray(project.techStack) ? project.techStack.length : 0), 4) - 1 ? ' •' : ''}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] py-3.5 px-5 text-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/15 active:scale-95"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                Live Demo
              </a>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] py-3.5 px-5 text-center cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}

            <button
              onClick={() => onOpenDetails(project)}
              className="flex-1 border border-gray-200 text-[#1a1a1a] text-[10px] font-black uppercase tracking-[0.2em] py-3.5 px-5 text-center hover:bg-gray-50 transition-all active:scale-95"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
            >
              Full Details
            </button>
          </div>
        </div>

        <ExplainToggle project={project} />
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
