"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroService from '../services/heroService';
import aboutService from '../services/aboutService';
import contactService from '../services/contactService';
import { FaGithub, FaLinkedinIn, FaMediumM, FaDribbble } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Icon map matching all admin-panel platforms ─── */
const FOOTER_ICON_MAP = {
  linkedin: FaLinkedinIn,
  github:   FaGithub,
  twitter:  FaXTwitter,
  x:        FaXTwitter,
  medium:   FaMediumM,
  dribbble: FaDribbble,
  leetcode: SiLeetcode,
  custom:   FaGithub, // generic fallback
};

/* ─── Fallback — shown only until DB data loads ─── */
const DEFAULT_SOCIAL_LINKS = [
  { platform: 'github',   url: '#', Icon: FaGithub },
  { platform: 'linkedin', url: '#', Icon: FaLinkedinIn },
  { platform: 'twitter',  url: '#', Icon: FaXTwitter },
];

const Footer = memo(({ initialData }) => {
  const currentYear = new Date().getFullYear();
  const [heroData, setHeroData] = useState(initialData?.hero || null);
  const [socialLinks, setSocialLinks] = useState(() => {
    // Initialize social links synchronously from SSR data if available
    const about = initialData?.about;
    const linkSource = (about?.socialLinks?.length > 0 && about.socialLinks) || null;
    if (linkSource) {
      return linkSource.map(link => ({
        platform: link.platform?.toLowerCase() || 'custom',
        url:      link.url || '#',
        customIcon: link.customIcon || null,
        Icon:     FOOTER_ICON_MAP[link.platform?.toLowerCase()] || FaGithub,
      }));
    }
    return DEFAULT_SOCIAL_LINKS;
  });
  const footerRef  = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (initialData?.hero && initialData?.about) return;
    
    const fetchData = async () => {
      try {
        const [hero, contact, about] = await Promise.all([
          heroService.getHeroData(),
          contactService.getInfo().catch(() => null),
          aboutService.getAboutData().catch(() => null),
        ]);
        setHeroData(hero);

        // Use About Info links as primary source since it has the best Admin UI for custom icons
        const linkSource = (about?.socialLinks?.length > 0 && about.socialLinks) || null;

        if (linkSource) {
          setSocialLinks(
            linkSource.map(link => ({
              platform: link.platform?.toLowerCase() || 'custom',
              url:      link.url || '#',
              customIcon: link.customIcon || null,
              Icon:     FOOTER_ICON_MAP[link.platform?.toLowerCase()] || FaGithub,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch footer data');
      }
    };
    fetchData();
  }, [initialData]);

  // ── GSAP Footer Reveal ──
  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
            onRefresh: (self) => { if (self.progress === 1) gsap.set(contentRef.current, { opacity: 1, y: 0 }); },
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, [heroData]);

  const footerLinks = ['Home', 'About', 'Projects', 'Experience', 'Skills', 'Contact'];
  const fullName    = heroData?.title || 'Navaneet Sharma';

  // Dynamic GitHub URL for the "Developed by" credit link
  const githubLink = socialLinks.find(l => l.platform === 'github')?.url || '#';

  return (
    <footer
      ref={footerRef}
      className="relative z-0 pb-8"
      style={{ backgroundColor: '#132238', paddingTop: '200px' }}
      role="contentinfo"
    >
      <div ref={contentRef} className="mx-auto px-6 w-full" style={{ maxWidth: '1320px', opacity: 0, willChange: 'transform, opacity' }}>

        {/* Top row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-10">

          {/* Brand */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <div
              className="w-11 h-11 rounded-none flex items-center justify-center text-white font-black text-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-hidden="true"
            >
              {fullName.charAt(0)}
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">{fullName}</span>
          </div>

          {/* Nav links */}
          <nav className="flex justify-center lg:w-2/4" aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[15px] font-semibold text-white/70">
              {footerLinks.map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <div className="flex justify-center lg:justify-end lg:w-1/4">
            <p className="text-[15px] font-medium text-white/60">
              Copyright &copy; {currentYear} {fullName}.
            </p>
          </div>
        </div>

        {/* Social icons — fully dynamic from Admin › About Section */}
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {socialLinks.map((social, idx) => {
            const Icon = social.Icon;
            return (
              <a
                key={idx}
                href={social.url}
                rel="me noopener noreferrer"
                target="_blank"
                aria-label={`${fullName} on ${social.platform}`}
                className="group w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full"
              >
                {social.customIcon ? (
                  <div 
                    className="w-[18px] h-[18px] bg-current transition-all"
                    style={{
                      WebkitMaskImage: `url(${social.customIcon})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskImage: `url(${social.customIcon})`,
                      maskSize: 'contain',
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat'
                    }}
                  />
                ) : (
                  <Icon size={18} />
                )}
              </a>
            );
          })}
        </div>

        {/* Credit */}
        <div className="mt-4 text-center text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Developed with <span className="text-red-500" aria-label="love">&#9829;</span> by{' '}
          <a
            href={githubLink}
            rel="me noopener noreferrer"
            target="_blank"
            className="text-white font-bold hover:underline"
          >
            {fullName}
          </a>
        </div>
      </div>

      {/* Decorative watermark */}
      <div
        className="absolute bottom-4 left-6 leading-none select-none pointer-events-none z-[-1] font-black tracking-[0.5em] opacity-5"
        style={{
          fontSize: 'min(5vw, 70px)',
          WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.6)',
          color: 'transparent',
        }}
      >
        {fullName.toUpperCase()}
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
