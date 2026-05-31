"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CursorProvider } from '@/context/CursorContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ProjectSection from '@/components/projects/ProjectSection';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Services from '@/components/Services';
import Process from '@/components/Process';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SmoothScroll from '@/components/SmoothScroll';
import MouseFollower from '@/components/ui/MouseFollower';
import Preloader from '@/components/ui/Preloader';
import AIChatbot from '@/components/ai/AIChatbot';

export default function ClientHome({ initialData }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preloader always shows on visit to ensure it loads first
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <CursorProvider>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>
      <SmoothScroll>
        <MouseFollower />
        <div className="bg-background">
          <Navbar />
          <main id="main-content">
            <Hero initialData={initialData?.hero} />
            <About initialData={initialData?.about} />
            <ProjectSection initialData={initialData?.projects} />
            <Experience initialData={initialData?.experience} />
            <Skills initialData={initialData?.skills} />
            <Services />
            <Process />
            <CTA />
            <Contact initialData={initialData} />
          </main>
          <Footer initialData={initialData} />
          <ScrollToTop />
          <AIChatbot initialData={initialData} />
        </div>
      </SmoothScroll>
    </CursorProvider>
  );
}
