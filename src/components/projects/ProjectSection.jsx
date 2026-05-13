"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import projectService from '../../services/projectService';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const categories = ['All', 'MERN Stack', 'React Apps', 'Dashboards', 'SaaS', 'Backend APIs', 'Full Stack'];

const ProjectSection = memo(() => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Keep projects as they are or handle error state
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    // Debounced search could be better, but let's stick to direct for now
    const timer = setTimeout(() => {
        fetchProjects();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  const handleOpenDetails = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  return (
    <section 
      id="projects" 
      className="relative py-32 overflow-hidden bg-white"
      aria-label="My Projects"
    >
      {/* Background Effects for Light Theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="mx-auto px-6 w-full relative z-10" style={{ maxWidth: '1440px' }}>
        
        {/* Section Heading at Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-[#1a1a1a]">
            Projects
          </h1>
          <div className="w-12 h-1 bg-primary mx-auto mt-4" />
        </motion.div>

        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-8 tracking-tight">
              Crafting Digital <br />
              <span className="text-[#1a1a1a]/10">Excellence.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
              A curated collection of full-stack applications, interactive dashboards, and scalable SaaS solutions built with precision.
            </p>
          </motion.div>

          {/* Search Bar - Light Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-80 group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-primary transition-colors duration-300" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 text-sm text-[#1a1a1a] placeholder:text-gray-300 focus:outline-none focus:border-primary/30 transition-all duration-300"
            />
          </motion.div>
        </div>

        {/* Filters & Sorting - Light Version */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-wrap gap-2">
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

        {/* Project Grid */}
        <div className="relative min-h-[600px]">
          {/* Subtle Loader Overlay - Appears over existing content for smoothness */}
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

        {/* View All Button */}
        <div className="mt-20 text-center">
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
