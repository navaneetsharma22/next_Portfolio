"use client";

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

export default function HomePage() {
  return (
    <CursorProvider>
      <SmoothScroll>
        <MouseFollower />
        <div className="bg-background">
          <Navbar />
          <main id="main-content">
            <Hero />
            <About />
            <ProjectSection />
            <Experience />
            <Skills />
            <Services />
            <Process />
            <CTA />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </SmoothScroll>
    </CursorProvider>
  );
}
