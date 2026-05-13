"use client";

import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLazyImage } from '../../hooks';

/* ─────────────────────────────────────────────
   SHARED UI PRIMITIVES
   Consistent, accessible building blocks
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

/** Reusable section header with subtitle + title */
export const SectionHeader = ({ subtitle, title, description, align = 'left', className = '' }) => (
  <div className={`${align === 'center' ? 'text-center' : ''} mb-14 ${className}`}>
    {subtitle && (
      <p
        className="font-semibold text-sm uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-soft-dark)' }}
      >
        {subtitle}
      </p>
    )}
    <h2
      className="font-semibold mb-4"
      style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)' }}
    >
      {title}
    </h2>
    {description && (
      <p
        className={`text-base leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}
        style={{ color: 'var(--color-body)', maxWidth: align === 'center' ? '480px' : 'none' }}
      >
        {description}
      </p>
    )}
  </div>
);

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
            fetchpriority="high"
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

/** Animated reveal wrapper — respects prefers-reduced-motion */
export const AnimatedReveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const directionMap = {
    up: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  };

  const { initial, animate } = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
