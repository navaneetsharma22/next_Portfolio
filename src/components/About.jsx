"use client";

import React, { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Code } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaGithub, FaMediumM, FaDribbble } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { LazyImage } from './ui/Shared';
import ResumeModal from './ui/ResumeModal';
import aboutService from '../services/aboutService';
import { useCursor } from '../context/CursorContext';

/**
 * Custom Icon for Code 360 (Coding Ninjas)
 * Styled to match monochrome Picto aesthetic
 */
const Code360Icon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M18 8.5C17.2 7.4 15.8 6.8 14.2 6.8C10.8 6.8 8.5 9.4 8.5 13C8.5 16.6 10.8 19.2 14.2 19.2C15.8 19.2 17.2 18.6 18 17.5" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <path d="M12.5 12.5L14.5 13L12.5 13.5V12.5Z" fill="currentColor"/>
    <path d="M17.5 12.5L15.5 13L17.5 13.5V12.5Z" fill="currentColor"/>
  </svg>
);

const ICON_MAP = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  twitter: FaXTwitter,
  medium: FaMediumM,
  dribbble: FaDribbble,
  code360: Code360Icon,
  leetcode: SiLeetcode,
};

/**
 * About Component
 * Rebuilt to pin-point match the Picto reference:
 * - White card layout with constrained image size
 * - Overlapping social icons card with highlighted first icon
 * - Dual action buttons with icons
 */
const About = memo(() => {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { setCursor } = useCursor();

  const fetchAboutData = async () => {
    try {
      const data = await aboutService.getAboutData();
      setAboutData(data);
    } catch (err) {
      console.error('Failed to fetch about data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Only hide if NOT loading AND explicitly hidden by admin
  if (!isLoading && aboutData?.isVisible === false) return null;

  const socialLinks = [
    { platform: 'linkedin', icon: FaLinkedinIn, isPrimary: true },
    { platform: 'github', icon: FaGithub },
    { platform: 'twitter', icon: FaXTwitter, fallback: 'https://x.com/NavaneetSh79884' },
    { platform: 'leetcode', icon: SiLeetcode, fallback: 'https://leetcode.com/u/NavaneetSharma/' },
    { platform: 'code360', icon: Code360Icon, fallback: 'https://www.naukri.com/code360/profile/Navaneet' },
    { platform: 'medium', icon: FaMediumM, fallback: 'https://medium.com/@navaneetsharma26' },
    { platform: 'dribbble', icon: FaDribbble, fallback: 'https://dribbble.com/navaneet-sharma' },
  ].map(social => {
    const dynamicLink = aboutData?.socialLinks?.find(l => l.platform.toLowerCase() === social.platform);
    return {
      ...social,
      href: dynamicLink?.url || social.fallback || '#',
    };
  });

  const resumeUrl = aboutData?.resumeUrl ? 
    (aboutData.resumeUrl.startsWith('http') ? aboutData.resumeUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${aboutData.resumeUrl}`) 
    : null;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="about"
      className="pb-20 lg:pb-40 relative z-20 -mt-20 lg:-mt-40"
      aria-label="About section"
    >
      <div className="mx-auto px-6 max-w-[1320px]">
        {isLoading ? (
          <div className="bg-white overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.08)] border border-white mx-2 sm:mx-0 p-12 lg:p-24 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
            <div className="lg:col-span-5 h-[400px] bg-gray-100" />
            <div className="lg:col-span-7 space-y-6">
              <div className="h-10 w-3/4 bg-gray-100" />
              <div className="h-4 w-full bg-gray-100" />
              <div className="h-4 w-full bg-gray-100" />
              <div className="h-4 w-2/3 bg-gray-100" />
              <div className="flex gap-4 pt-8">
                <div className="h-12 w-32 bg-gray-100" />
                <div className="h-12 w-32 bg-gray-100" />
              </div>
            </div>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.08)] border border-white mx-2 sm:mx-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Side — Image Container */}
            <div className="lg:col-span-5 py-16 lg:py-28 px-8 lg:px-16 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[480px]">
                {/* Profile Image */}
                <div className="overflow-hidden">
                  <LazyImage
                    src={aboutData?.profileImage || "/assets/navaneet.jpg"}
                    alt={aboutData?.title || "About Me"}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                    style={{ aspectRatio: '3.8/5' }}
                  />
                </div>

                {/* Social Card — Fully Interactive Hover Effects */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute -bottom-6 lg:-bottom-8 left-1/2 lg:left-10 -translate-x-1/2 lg:translate-x-0 bg-white p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.1)] flex items-center gap-1 border border-border/5 w-max max-w-[90vw] overflow-x-auto no-scrollbar"
                >
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={() => setCursor('default')}
                      className="w-10 h-10 flex items-center justify-center text-[#1a1a1a]/60 hover:bg-[#9929fb] hover:text-white transition-all duration-300"
                      aria-label={`Social link ${social.platform}`}
                    >
                      <social.icon size={16} />
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right Side — Content */}
            <div className="lg:col-span-7 py-20 lg:py-28 px-6 lg:px-16 lg:pl-4 text-center lg:text-left">
              <div className="max-w-[580px]">
                <h2 className="text-3xl md:text-[44px] font-bold text-heading leading-[1.1] mb-8 tracking-tight">
                  {aboutData?.title || "I am Professional User Experience Designer"}
                </h2>

                <div className="space-y-6 text-base md:text-lg text-body leading-relaxed mb-10 opacity-80">
                  <p>
                    {aboutData?.description || 
                      "I design and develop services for customers specializing creating stylish, modern websites, web services and online stores. My passion is to design digital user experiences."}
                  </p>
                  <p>
                    I design and develop services for customers specializing creating stylish, modern websites, web services.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => scrollToSection('projects')}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={() => setCursor('default')}
                    className="btn-picto !rounded-none py-3.5 px-8"
                  >
                    My Projects
                  </button>
                  
                  <button 
                    onClick={() => setIsResumeOpen(true)}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={() => setCursor('default')}
                    className="btn-picto-outline"
                  >
                    <FileText size={20} />
                    View Resume
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
        )}
      </div>

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={resumeUrl}
      />
    </section>
  );
});

About.displayName = 'About';

export default About;
