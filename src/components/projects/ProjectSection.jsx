"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectService from '../../services/projectService';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = ['All', 'MERN Stack', 'React Apps', 'Dashboards', 'SaaS', 'Backend APIs', 'Full Stack'];

const ProjectSection = memo(({ initialData }) => {
  const [projects, setProjects] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs for GSAP animations
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const descRef = useRef(null);
  const searchRef = useRef(null);
  const filtersRef = useRef(null);
  const dividerRef = useRef(null);
  const ctaRef = useRef(null);

  // Fetch projects from backend
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll({
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchTerm || undefined
      });
      setProjects(Array.isArray(data.projects) ? data.projects : data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    // If we have initial data and haven't typed a search/changed category yet, skip fetch
    if (initialData && activeCategory === 'All' && searchTerm === '') return;
    
    const timer = setTimeout(() => {
      fetchProjects();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchProjects, initialData, activeCategory, searchTerm]);

  // ── GSAP ScrollTrigger Animations (ThoughtWorks-style) ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Section title — clip-path text reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Decorative divider line — width expand
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: 'center' },
          {
            scaleX: 1,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: dividerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Sub-heading — slide from left with fade
      if (subHeadingRef.current) {
        gsap.fromTo(
          subHeadingRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subHeadingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Description paragraph — fade up
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 5. Search bar — slide from right
      if (searchRef.current) {
        gsap.fromTo(
          searchRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: searchRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 6. Filter buttons — staggered fade-up (ThoughtWorks wave effect)
      if (filtersRef.current) {
        const buttons = filtersRef.current.querySelectorAll('button');
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: filtersRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 7. CTA button — scale + fade
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpenDetails = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-32 overflow-hidden bg-white"
      aria-label="My Projects"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="mx-auto px-6 w-full relative z-10" style={{ maxWidth: '1440px' }}>

        {/* ── Section Title — ThoughtWorks clip-path reveal ── */}
        <div className="text-center mb-16">
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-[#1a1a1a]"
            style={{ willChange: 'clip-path, transform' }}
          >
            Projects
          </h1>
          <div
            ref={dividerRef}
            className="w-12 h-1 bg-primary mx-auto mt-4"
          />
        </div>

        {/* ── Header Row ── */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-2xl">
            <h2
              ref={subHeadingRef}
              className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-8 tracking-tight"
            >
              Crafting Digital <br />
              <span className="text-[#1a1a1a]/10">Excellence.</span>
            </h2>
            <p
              ref={descRef}
              className="text-gray-500 text-lg leading-relaxed max-w-lg"
            >
              A curated collection of full-stack applications, interactive dashboards, and scalable SaaS solutions built with precision.
            </p>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-primary transition-colors duration-300" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* ── Filters & Sorting ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div ref={filtersRef} className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary shadow-[0_10px_25px_rgba(153,41,251,0.15)]'
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-300">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Sort By: <span className="text-gray-600 cursor-pointer hover:text-primary">Latest</span>
            </span>
            <span className="hidden md:block">|</span>
            <span className="text-gray-500">Showing {projects.length} results</span>
          </div>
        </div>

        {/* ── Project Grid ── */}
        <div className="relative min-h-[600px]">
          {/* Loader Overlay */}
          <AnimatePresence>
            {loading && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-start justify-center pt-20 bg-white/40 backdrop-blur-[2px]"
              >
                <div className="w-10 h-10 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {loading && projects.length === 0 ? (
            <motion.div
              key="initial-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20"
            >
              <div className="w-16 h-16 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 animate-pulse">
                Loading Gallery...
              </p>
            </motion.div>
          ) : (
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                {projects.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="py-40 text-center w-full"
                  >
                    <p className="text-gray-300 text-xl font-bold uppercase tracking-widest">No projects matching your search.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {projects.map((project, idx) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        index={idx}
                        onOpenDetails={handleOpenDetails}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── View All CTA ── */}
        <div ref={ctaRef} className="mt-20 text-center">
          <button className="group relative px-10 py-5 bg-transparent border border-gray-200 overflow-hidden transition-all duration-500 hover:border-primary/50">
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-[#1a1a1a] flex items-center justify-center gap-3">
              Explore Archive <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
});

ProjectSection.displayName = 'ProjectSection';

export default ProjectSection;
