"use client";

import React, { memo, useState, useEffect, useCallback } from 'react';
import { useScrollPosition } from '../hooks';
import NavLinkItem from './NavLinkItem';
import { useCursor } from '../context/CursorContext';

/**
 * Navbar component for the Navaneet Portfolio
 * Redesigned to match Picto premium aesthetics using Tailwind CSS
 */
const Navbar = memo(() => {
  const scrollY = useScrollPosition();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { setCursor } = useCursor();

  const scrolled = scrollY > 50;

  // Optimized menu items as per user request
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Skills', id: 'skills' },
    { name: 'Contact', id: 'contact' },
  ];

  // Section observer to update active state on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Detect when section is in the upper part of the viewport
      threshold: 0,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        // Only update if the intersecting element is one of our nav items
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (navLinks.some(link => link.id === id)) {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all sections mentioned in navLinks
    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  const scrollToSection = useCallback((id) => {
    setActiveSection(id); // Immediately update active state for visual feedback
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md py-3 lg:py-4 shadow-lg shadow-black/5' 
          : 'bg-[#f8f9fa]/80 backdrop-blur-sm py-4 lg:py-6'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto px-6 lg:px-10 flex justify-between items-center max-w-[1320px]">
        
        {/* Logo Section */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onMouseEnter={() => setCursor('hover')}
          onMouseLeave={() => setCursor('default')}
          className="flex items-center gap-3 group focus-visible:outline-none"
          aria-label="Navaneet Home"
        >
          <div
            className="w-10 h-10 flex items-center justify-center text-white font-black text-xl group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-primary/30"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            N
          </div>
          <span className="font-bold text-2xl tracking-tight text-heading">
            Navaneet
          </span>
        </a>

        {/* Desktop Menu: Modern Flexbox layout with Sharp Corners */}
        <div className="hidden lg:flex items-center gap-1 bg-white/40 p-1 border border-border/10 !rounded-none">
          {navLinks.map((link) => (
            <NavLinkItem
              key={link.name}
              id={link.id}
              label={link.name}
              isActive={activeSection === link.id}
              onClick={scrollToSection}
            />
          ))}
        </div>

        {/* Action Button: Styled as per reference */}
        <div className="hidden lg:block">
          <button 
            className="btn-picto !rounded-none !py-2.5 !px-7"
            onClick={() => scrollToSection('contact')}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            Let's Talk
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2.5 bg-white border border-border/50 text-heading transition-all active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        className={`fixed top-0 left-0 w-full h-screen bg-white/98 backdrop-blur-lg z-[-1] lg:hidden transition-all duration-500 ease-[0.16, 1, 0.3, 1] flex flex-col justify-center items-center ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center p-6 gap-6 w-full">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className={`text-left px-5 py-4 text-base font-bold transition-all ${
                activeSection === link.id 
                  ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                  : 'text-heading hover:bg-background-alt'
              }`}
            >
              {link.name}
            </button>
          ))}
          <button 
            className="btn-picto w-full justify-center mt-4 !rounded-none py-4" 
            onClick={() => scrollToSection('contact')}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
