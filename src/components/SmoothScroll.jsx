"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SmoothScroll = ({ children }) => {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Disable smooth scroll on admin routes to prevent conflicts with independent layout
    if (pathname.startsWith('/admin')) {
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Disable on mobile for native scroll performance
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      // Still refresh ScrollTrigger for GSAP animations without Lenis
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // ── Sync Lenis with GSAP ScrollTrigger ──
    // This prevents jerk: Lenis tells ScrollTrigger where scroll is
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis instead of rAF (smoother + synced)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0); // Prevent GSAP from compensating for lag

    // ── Restore scroll position on refresh ──
    const savedPosition = sessionStorage.getItem('scrollPos');
    if (savedPosition) {
      const pos = parseInt(savedPosition, 10);
      // Wait for page layout to stabilize before restoring
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, pos);
          lenis.scrollTo(pos, { immediate: true });
          // Refresh ScrollTrigger after position restore
          setTimeout(() => ScrollTrigger.refresh(), 100);
        });
      });
    }

    // ── Save scroll position before unload ──
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPos', String(window.scrollY));
    };
    window.addEventListener('beforeunload', saveScrollPosition);

    // Refresh ScrollTrigger after fonts/images load
    const handleLoad = () => {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      window.removeEventListener('load', handleLoad);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
