"use client";

import React, { useState, memo, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from './ui/Shared';
import projectService from '../services/projectService';

const categories = ['All', 'UI/UX', 'Branding', 'Development'];

const Portfolio = memo(() => {
  const [active, setActive] = useState('All');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll();
        const data = Array.isArray(response.projects) ? response.projects : response;
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = useMemo(
    () => active === 'All' ? projects : projects.filter((p) => p.category === active),
    [active, projects]
  );

  return (
    <section
      id="projects"
      className="py-20 min-h-[400px] flex items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}
      aria-label="Portfolio"
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body font-medium animate-pulse">Loading amazing projects...</p>
        </div>
      ) : (
        <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
          <div>
            <p
              className="font-semibold text-sm uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-soft-dark)' }}
            >
              MY WORK
            </p>
            <h2
              className="font-semibold"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)' }}
            >
              Featured Projects
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-5 py-2 text-sm font-medium rounded transition-all duration-300"
                style={{
                  backgroundColor: active === cat ? 'var(--color-primary)' : 'transparent',
                  color: active === cat ? '#fff' : 'var(--color-body)',
                  border: `1px solid ${active === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
                role="tab"
                aria-selected={active === cat}
                aria-controls="portfolio-grid"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="portfolio-grid"
          role="tabpanel"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl will-change-transform"
                style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-background-alt)' }}
              >
                <LazyImage
                  src={project.image}
                  alt={`${project.title} — ${project.category} project`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: 'linear-gradient(to top, rgba(42,55,74,0.9) 0%, transparent 100%)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
                    {project.category}
                  </p>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 text-center">
          <button className="btn-picto">
            View All Work
          </button>
        </div>
      </div>
    </section>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;
