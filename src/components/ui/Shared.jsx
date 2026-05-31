"use client";

import React, { forwardRef, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLazyImage } from '../../hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   SHARED UI PRIMITIVES
   Consistent, accessible building blocks
   Enhanced with ThoughtWorks-style GSAP ScrollTrigger
 ────────────────────────────────────────────── */

/** Reusable section wrapper with standardized spacing */
export const Section = ({ id, children, className = '', bg = 'white', ...props }) => (
  <section
    id={id}
    className={`py-20 ${className}`}
    style={{ backgroundColor: bg === 'alt' ? 'var(--color-background-alt)' : bg === 'white' ? '#ffffff' : bg }}
    {...props}
  >
    <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>
      {children}
    </div>
  </section>
);

/** Reusable section header with subtitle + title — GSAP clip-path reveal */
export const SectionHeader = ({ subtitle, title, description, align = 'left', className = '' }) => {
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const createAnim = (el, from, to, extraOpts = {}) => {
        if (!el) return;
        gsap.fromTo(el, from, {
          ...to,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            onRefresh: (self) => { if (self.progress === 1) gsap.set(el, to); },
          },
          onComplete: () => { el.style.willChange = 'auto'; },
          ...extraOpts,
        });
      };

      // Subtitle — fade up
      createAnim(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      // Title — clip-path reveal
      createAnim(titleRef.current, { opacity: 0, y: 35, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.9, delay: 0.1, ease: 'power3.out' });
      // Divider — width expand
      createAnim(dividerRef.current, { scaleX: 0, transformOrigin: align === 'center' ? 'center' : 'left' }, { scaleX: 1, duration: 0.7, delay: 0.25, ease: 'power3.inOut' });
      // Description — fade up
      createAnim(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, [align]);

  return (
    <div className={`${align === 'center' ? 'text-center' : ''} mb-14 ${className}`}>
      {subtitle && (
        <p
          ref={subtitleRef}
          className="font-semibold text-sm uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-soft-dark)' }}
        >
          {subtitle}
        </p>
      )}
      <h2
        ref={titleRef}
        className="font-semibold mb-4"
        style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)', willChange: 'clip-path, transform' }}
      >
        {title}
      </h2>
      <div
        ref={dividerRef}
        className={`w-12 h-[3px] bg-primary mb-4 ${align === 'center' ? 'mx-auto' : ''}`}
      />
      {description && (
        <p
          ref={descRef}
          className={`text-base leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}
          style={{ color: 'var(--color-body)', maxWidth: align === 'center' ? '480px' : 'none' }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

/** Accessible, optimized lazy image with placeholder and blur effect */
export const LazyImage = forwardRef(({ src, alt, className = '', style = {}, priority = false, ...props }, ref) => {
  const { imgRef, loaded: hookLoaded, currentSrc: hookSrc } = useLazyImage(priority ? null : src);
  
  // If priority is true, we load immediately
  const loaded = priority ? true : hookLoaded;
  const currentSrc = priority ? src : hookSrc;

  return (
    <div 
      ref={priority ? null : imgRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`} 
      style={style}
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-200 animate-pulse z-10"
          />
        )}
      </AnimatePresence>
      
      {currentSrc && (
        priority ? (
          <img
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
            loading="eager"
            fetchPriority="high"
            {...props}
          />
        ) : (
          <motion.img
            src={currentSrc}
            alt={alt}
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ 
              opacity: loaded ? 1 : 0, 
              scale: loaded ? 1 : 1.05,
              filter: loaded ? 'blur(0px)' : 'blur(10px)'
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full h-full object-cover ${className}`}
            loading="lazy"
            {...props}
          />
        )
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

/** 
 * Animated reveal wrapper — ThoughtWorks-style GSAP ScrollTrigger
 * Now uses GSAP for more cinematic, precise scroll-triggered animations
 * Handles scroll position restoration gracefully (no invisible elements)
 */
export const AnimatedReveal = ({ children, direction = 'up', delay = 0, className = '', stagger = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const directionConfig = {
      up:    { from: { opacity: 0, y: 60 },  to: { opacity: 1, y: 0 } },
      down:  { from: { opacity: 0, y: -60 }, to: { opacity: 1, y: 0 } },
      left:  { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
      right: { from: { opacity: 0, x: 60 },  to: { opacity: 1, x: 0 } },
      fade:  { from: { opacity: 0 },          to: { opacity: 1 } },
      scale: { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
      clipUp: { from: { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }, to: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' } },
    };

    const config = directionConfig[direction] || directionConfig.up;

    const anim = gsap.fromTo(el, config.from, {
      ...config.to,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        // If element is already past trigger point (e.g. after refresh), play immediately
        onRefresh: (self) => {
          if (self.progress === 1) {
            gsap.set(el, config.to);
          }
        },
      },
      onComplete: () => {
        // Free GPU memory after animation
        el.style.willChange = 'auto';
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [direction, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};

/** Skip-to-main-content link for screen readers */
export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none"
  >
    Skip to main content
  </a>
);
