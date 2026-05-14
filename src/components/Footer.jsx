"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroService from '../services/heroService';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const [heroData, setHeroData] = useState(null);
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await heroService.getHeroData();
        setHeroData(data);
      } catch (err) {
        console.error('Failed to fetch hero data for footer');
      }
    };
    fetchHeroData();
  }, []);

  // ── GSAP Footer Reveal ──
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [heroData]);

  const footerLinks = ['Home', 'About', 'Projects', 'Experience', 'Skills', 'Contact'];
  const fullName = heroData?.title || 'Navaneet sharma';
  const brandName = fullName;

  return (
    <footer
      ref={footerRef}
      className="relative z-0 pb-8"
      style={{
        backgroundColor: '#132238',
        paddingTop: '200px'
      }}
      role="contentinfo"
    >
      <div ref={contentRef} className="mx-auto px-6 w-full" style={{ maxWidth: '1320px', opacity: 0 }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-10">

          {/* Brand - Left */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <div
              className="w-11 h-11 rounded-none flex items-center justify-center text-white font-black text-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-hidden="true"
            >
              {brandName.charAt(0)}
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">{brandName}</span>
          </div>

          {/* Links - Center */}
          <nav className="flex justify-center lg:w-2/4" aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[15px] font-semibold text-white/70">
              {footerLinks.map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright - Right */}
          <div className="flex justify-center lg:justify-end lg:w-1/4">
            <p className="text-[15px] font-medium text-white/60">
              Copyright © {currentYear} {brandName}.
            </p>
          </div>
        </div>

        {/* Credit Section */}
        <div className="mt-4 text-center text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Developed with <span className="text-red-500" aria-label="love">♥</span> by{' '}
          <a href="#" className="text-white font-bold hover:underline">{fullName}</a>
        </div>
      </div>

      {/* Decorative Background Text */}
      <div 
        className="absolute bottom-4 left-6 leading-none select-none pointer-events-none z-[-1] font-black tracking-[0.5em] opacity-5"
        style={{ 
          fontSize: 'min(5vw, 70px)', 
          WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.6)',
          color: 'transparent'
        }}
      >
        {fullName.toUpperCase()}
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
