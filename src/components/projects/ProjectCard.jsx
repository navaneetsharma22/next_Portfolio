"use client";

import React, { memo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { LazyImage } from '../ui/Shared';
import { useCursor } from '../../context/CursorContext';

const ProjectCard = memo(({ project, index, onOpenDetails }) => {
  const cardRef = useRef(null);
  const { setCursor } = useCursor();

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    el.style.setProperty('--spot-x', `${x * 100}%`);
    el.style.setProperty('--spot-y', `${y * 100}%`);
    
    // Smooth 3D tilt
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseEnter = () => {
    setCursor('hover');
  };

  const handleMouseLeave = useCallback(() => {
    setCursor('default');
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }, [setCursor]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="project-card relative bg-white border border-gray-100 overflow-hidden will-change-transform shadow-[0_5px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
        style={{ transition: 'transform 0.2s ease-out, shadow 0.4s ease' }}
      >
        {/* Spotlight Overlay - Subtle for Light Theme */}
        <div className="project-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <LazyImage
            src={project.images?.[0] || 'https://via.placeholder.com/800x500'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-4 left-4 z-20">
               <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-white/90 backdrop-blur-md text-[#1a1a1a] border border-black/5 shadow-sm">
                {project.status}
              </span>
            </div>
          )}

          {/* Interactive Overlay on Hover - More Subtle */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30" onClick={() => onOpenDetails(project)} />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {project.category}
            </p>
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-300 hover:text-[#1a1a1a] transition-colors"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                <FaGithub size={18} />
              </a>
            )}
          </div>
          
          <h3 className="text-2xl font-black text-[#1a1a1a] mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
            {project.title}
          </h3>
          
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-8 font-medium">
            {project.shortDescription}
          </p>

          <div className="flex flex-col gap-4 pt-6 border-t border-gray-50">
            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 4).map((tech, i) => (
                <span 
                  key={i} 
                  className="text-[9px] font-black uppercase tracking-widest text-gray-400"
                >
                  {tech}{i < Math.min((Array.isArray(project.techStack) ? project.techStack.length : 0), 4) - 1 ? ' •' : ''}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {project.liveUrl ? (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 px-6 text-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                >
                  Live Demo
                </a>
              ) : (
                <button 
                  disabled
                  className="flex-1 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] py-4 px-6 text-center cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
              
              <button 
                onClick={() => onOpenDetails(project)}
                className="flex-1 border border-gray-200 text-[#1a1a1a] text-[10px] font-black uppercase tracking-[0.2em] py-4 px-6 text-center hover:bg-gray-50 transition-all active:scale-95"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
