"use client";

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Only register GSAP plugins on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook to trigger reveal animations on scroll using GSAP
 * @param {React.RefObject} elementRef - Reference to the element
 * @param {Object} options - GSAP configuration options
 */
export const useGsapReveal = (elementRef, options = {}) => {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const {
      delay = 0,
      duration = 1,
      y = 50,
      opacity = 0,
      stagger = 0.2,
    } = options;

    gsap.fromTo(
      el,
      { opacity, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [elementRef, options]);
};

export default gsap;
