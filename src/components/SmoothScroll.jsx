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
    
    // Disable on mobile/tablet for native scroll performance
    const isMobile = window.innerWidth < 1024;

    if (prefersReducedMotion || isMobile) {
      // Still refresh ScrollTrigger for GSAP animations without Lenis
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08, // Adjust for momentum smoothness (lower = smoother/more momentum)
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // ── Sync Lenis with GSAP ScrollTrigger ──
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis with GSAP Ticker for smooth scroll-driven animations
    // This eliminates jitter between GSAP animations and Lenis scrolling
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Watch for document height changes to refresh ScrollTrigger automatically
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    // Refresh ScrollTrigger after Lenis is set up so trigger positions are accurate
    requestAnimationFrame(() => ScrollTrigger.refresh());

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
      resizeObserver.disconnect();
      gsap.ticker.remove(update);
      
      try {
        lenis.off('scroll', ScrollTrigger.update);
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
