"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaGithub, FaMediumM, FaDribbble } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LazyImage } from './ui/Shared';
import ResumeModal from './ui/ResumeModal';
import aboutService from '../services/aboutService';
import contactService from '../services/contactService';
import { useCursor } from '../context/CursorContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  x: FaXTwitter,
  medium: FaMediumM,
  dribbble: FaDribbble,
  code360: Code360Icon,
  leetcode: SiLeetcode,
  instagram: FaInstagram,
  custom: FaLinkedinIn, // generic fallback
};


/**
 * About Component — ThoughtWorks-style GSAP ScrollTrigger animations
 */
const About = memo(({ initialData }) => {
  const [aboutData, setAboutData] = useState(initialData || null);
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { setCursor } = useCursor();

  // GSAP refs
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const socialRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  const fetchAboutData = async () => {
    try {
      // Fetch both in parallel — bio from About model, social links from Contact model
      const [aboutResult, contactResult] = await Promise.all([
        aboutService.getAboutData(),
        contactService.getInfo().catch(() => null),
      ]);
      setAboutData(aboutResult);
      setContactInfo(contactResult);
    } catch (err) {
      console.error('Failed to fetch about data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) return;
    fetchAboutData();
  }, [initialData]);

  // ── GSAP ScrollTrigger Animations ──
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Card — slide up from below
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      }

      // Image — reveal with scale
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, scale: 1.1, clipPath: 'inset(100% 0 0 0)' },
          {
            opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)',
            duration: 1.2, delay: 0.2, ease: 'power4.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }

      // Social card — pop up
      if (socialRef.current) {
        gsap.fromTo(socialRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.6, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: socialRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }

      // Title — clip-path reveal
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: 0.9, delay: 0.3, ease: 'power4.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }

      // Description — fade up
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: descRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }

      // Buttons — staggered
      if (buttonsRef.current) {
        const btns = buttonsRef.current.children;
        gsap.fromTo(btns,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: buttonsRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Only hide if NOT loading AND explicitly hidden by admin
  if (!isLoading && aboutData?.isVisible === false) return null;

  // Build social links — synced with Contact section (same source of truth)
  // Priority: Contact Info links → About model links → empty (no broken hardcoded URLs)
  const socialLinks = (() => {
    const source = (aboutData?.socialLinks?.length > 0 && aboutData.socialLinks) || [];

    return source.map(link => {
      const platform = link.platform?.toLowerCase() || 'custom';
      const IconComponent = ICON_MAP[platform] || FaLinkedinIn;
      return {
        platform,
        icon: IconComponent,
        customIcon: link.customIcon || null,
        href: link.url || '#',
      };
    });
  })();



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
      ref={sectionRef}
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
        <div
          ref={cardRef}
          className="bg-white overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.08)] border border-white mx-2 sm:mx-0"
          style={{ opacity: 0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Side — Image Container */}
            <div className="lg:col-span-5 py-16 lg:py-28 px-8 lg:px-16 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[480px]">
                {/* Profile Image */}
                <div ref={imageRef} className="overflow-hidden" style={{ opacity: 0 }}>
                  <LazyImage
                    src={aboutData?.profileImage || "/assets/navaneet.jpg"}
                    alt={aboutData?.title || "About Me"}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                    style={{ aspectRatio: '3.8/5' }}
                  />
                </div>

                {/* Social Card */}
                <div
                  ref={socialRef}
                  className="absolute -bottom-6 lg:-bottom-8 left-1/2 -translate-x-1/2 bg-white p-2 shadow-[0_15px_35px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 border border-border/5 w-max max-w-[95%] overflow-x-auto no-scrollbar rounded-none"
                  style={{ opacity: 0 }}
                >
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={() => setCursor('default')}
                      className="group w-10 h-10 flex items-center justify-center rounded-full text-[#1a1a1a]/60 hover:bg-[#9929fb] hover:text-white transition-all duration-300"
                      aria-label={`Social link ${social.platform}`}
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
                        <social.icon size={16} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side — Content */}
            <div className="lg:col-span-7 py-20 lg:py-28 px-6 lg:px-16 lg:pl-4 text-center lg:text-left">
              <div className="w-full max-w-[700px]">
                <h2 
                  ref={titleRef}
                  className="text-3xl md:text-[44px] font-bold text-heading leading-[1.1] mb-8 tracking-tight"
                  style={{ opacity: 0, willChange: 'clip-path, transform' }}
                >
                  {aboutData?.title || "Transforming Ideas into Seamless Digital Realities"}
                </h2>

                <div 
                  ref={descRef}
                  className="space-y-6 text-base md:text-[17px] text-body leading-relaxed mb-10 opacity-80 text-justify"
                  style={{ opacity: 0 }}
                >
                  <p>
                    {(aboutData?.description || 
                      "I am a Full Stack MERN Developer specializing in high-performance web applications, cinematic UI designs, and scalable full-stack solutions. With a focus on modern technologies like Next.js, React, and Node.js, I bridge the gap between complex backend logic and pixel-perfect frontend experiences."
                    ).replace(/\*\*/g, '')}
                  </p>
                  <p>
                    {(aboutData?.description2 || "Passionate about creating stylish, modern websites and digital user experiences that leave a lasting impression.").replace(/\*\*/g, '')}
                  </p>
                </div>

                <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => scrollToSection('projects')}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={() => setCursor('default')}
                    className="btn-picto !rounded-none py-3.5 px-8"
                    style={{ opacity: 0 }}
                  >
                    My Projects
                  </button>
                  
                  <button 
                    onClick={() => setIsResumeOpen(true)}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={() => setCursor('default')}
                    className="btn-picto-outline"
                    style={{ opacity: 0 }}
                  >
                    <FileText size={20} />
                    View Resume
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
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
