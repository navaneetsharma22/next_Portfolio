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
    // Store the RAF wrapper so we can remove the exact same function on cleanup
    const rafCallback = (time) => lenis.raf(time * 1000);
    // save to ref so cleanup can access it
    lenisRef.current = lenisRef.current || {};
    lenisRef.current.rafCallback = rafCallback;
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0); // Prevent GSAP from compensating for lag

    // ── Robust Scroll Restoration on Refresh ──
    const scrollKey = `scrollPos-${pathname}`;
    const savedPosition = sessionStorage.getItem(scrollKey);
    
    if (savedPosition) {
      const pos = parseInt(savedPosition, 10);
      let retries = 0;
      
      const tryRestore = () => {
        // Wait until document is tall enough OR max retries reached (e.g., 2 seconds)
        if (document.documentElement.scrollHeight >= pos + window.innerHeight / 2 || retries > 20) {
          window.scrollTo(0, pos);
          lenis.scrollTo(pos, { immediate: true });
          setTimeout(() => ScrollTrigger.refresh(), 100);
          sessionStorage.removeItem(scrollKey); // Clear it so it doesn't apply on soft navigations
        } else {
          retries++;
          setTimeout(tryRestore, 100);
        }
      };
      
      requestAnimationFrame(tryRestore);
    }

    // Save scroll position only on actual browser refresh/unload
    const saveScrollPosition = () => {
      sessionStorage.setItem(scrollKey, String(window.scrollY));
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
      try {
        lenis.off('scroll', ScrollTrigger.update);
        // remove the exact raf callback we added
        if (lenisRef.current && lenisRef.current.rafCallback) {
          gsap.ticker.remove(lenisRef.current.rafCallback);
        } else {
          gsap.ticker.remove(lenis.raf);
        }
      } catch (e) {
        // ignore
      }
      try {
        lenis.destroy();
      } catch (e) {
        // ignore
      }
      // clear global reference
      if (window.lenis === lenis) window.lenis = null;
      lenisRef.current = null;
    };
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
