"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronRight, CheckCircle2, Play } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const ProjectModal = React.memo(({ isOpen, project, onClose }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isOpen]);

  if (!project) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - High Contrast */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] bg-[#0a0a0a]/90 backdrop-blur-2xl cursor-pointer"
          />

          {/* Modal Container - Premium Elevation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-2 md:inset-10 z-[99999] bg-white border border-gray-100 overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.4)] overscroll-contain"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-4 bg-white/80 backdrop-blur-md hover:bg-red-500 hover:text-white text-heading rounded-full transition-all duration-300 border border-gray-100 shadow-xl"
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Left Column: Visuals & Gallery */}
            <div 
              data-lenis-prevent
              className="w-full md:w-1/2 h-64 md:h-auto overflow-y-auto bg-[#fafafa] p-6 md:p-10 border-r border-gray-100 custom-scrollbar flex-shrink-0"
            >
              <div className="space-y-6">
                {project.images?.map((img, idx) => (
                   <div key={idx} className="relative group overflow-hidden rounded-none border border-gray-200 shadow-xl bg-white">
                     <img 
                       src={img} 
                       alt={`${project.title} screenshot ${idx + 1}`} 
                       className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                       onError={(e) => {
                         e.target.src = 'https://via.placeholder.com/800x500?text=Project+Screenshot';
                       }}
                     />
                   </div>
                ))}

                {project.secondaryImage && (
                   <div className="relative group overflow-hidden rounded-none border border-gray-200 shadow-xl bg-white">
                     <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest">Secondary View</div>
                     <img 
                       src={project.secondaryImage} 
                       alt={`${project.title} secondary view`} 
                       className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                       onError={(e) => {
                         e.target.src = 'https://via.placeholder.com/800x500?text=Secondary+View';
                       }}
                     />
                   </div>
                )}
                
                {project.videoPreviewUrl && (
                  <div className="relative aspect-video bg-white flex items-center justify-center group cursor-pointer border border-gray-200">
                    <Play className="text-gray-400 group-hover:text-primary transition-all duration-300" size={48} />
                    <p className="absolute bottom-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Watch Video Preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Project Info */}
            <div 
              data-lenis-prevent
              className="flex-1 min-h-0 p-8 md:p-20 pt-24 md:pt-32 overflow-y-auto custom-scrollbar bg-white"
            >
              <div className="max-w-xl mx-auto md:mx-0">
                <div className="flex items-center gap-3 mb-8">
                   <span className="px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
                     {project.category}
                   </span>
                   {project.status && (
                     <span className="px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] bg-gray-50 text-heading border border-gray-100">
                       {project.status}
                     </span>
                   )}
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-heading mb-10 tracking-tighter leading-tight">
                  {project.title}
                </h2>

                <div className="space-y-12">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-5 flex items-center gap-2">
                      <ChevronRight size={16} strokeWidth={3} /> Overview
                    </h4>
                    <p className="text-heading text-xl md:text-2xl leading-relaxed font-bold tracking-tight">
                      {project.shortDescription}
                    </p>
                  </div>

                  {project.fullDescription && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.3em] text-soft-dark mb-5 flex items-center gap-2">
                        <ChevronRight size={16} strokeWidth={3} /> The Mission
                      </h4>
                      <div 
                          className="text-body text-base md:text-lg leading-relaxed space-y-5"
                          dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                      />
                    </div>
                  )}

                  {project.features && project.features.length > 0 && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.3em] text-soft-dark mb-6 flex items-center gap-2">
                        <ChevronRight size={16} strokeWidth={3} /> Key Features
                      </h4>
                      <div className="grid grid-cols-1 gap-5">
                        {project.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-4 group">
                            <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              <CheckCircle2 size={14} strokeWidth={3} />
                            </div>
                            <span className="text-base md:text-lg font-bold text-body group-hover:text-heading transition-colors">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-10 py-10 border-y border-gray-100">
                    {project.clientName && (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-soft-dark">Client</p>
                        <p className="text-lg md:text-xl font-black text-heading">{project.clientName}</p>
                      </div>
                    )}
                    {project.duration && (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-soft-dark">Duration</p>
                        <p className="text-lg md:text-xl font-black text-heading">{project.duration}</p>
                      </div>
                    )}
                    {project.deploymentPlatform && (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-soft-dark">Platform</p>
                        <p className="text-lg md:text-xl font-black text-heading">{project.deploymentPlatform}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-soft-dark mb-6 flex items-center gap-2">
                      <ChevronRight size={16} strokeWidth={3} /> Stack & Tools
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack?.map((tech, i) => (
                        <span key={i} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-black uppercase tracking-widest text-heading hover:border-primary hover:text-primary transition-colors cursor-default">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 pt-10">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary-dark transition-all duration-300 shadow-[0_15px_40px_-10px_rgba(153,41,251,0.4)] hover:-translate-y-1"
                      >
                        Launch Project <ExternalLink size={18} strokeWidth={3} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-gray-50 border border-gray-200 text-heading text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:border-primary transition-all duration-300 hover:-translate-y-1"
                      >
                        GitHub Repository <FaGithub size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
});

ProjectModal.displayName = 'ProjectModal';

export default ProjectModal;
