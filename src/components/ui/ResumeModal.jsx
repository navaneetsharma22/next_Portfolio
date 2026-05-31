"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

const ResumeModal = ({ isOpen, onClose, resumeUrl }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (isOpen) {
      // Prevent layout shift by adding padding equal to scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  const handleDownload = () => {
    if (!resumeUrl) return;
    
    let downloadUrl = resumeUrl;
    
    if (downloadUrl.includes('cloudinary.com') && downloadUrl.includes('/upload/')) {
      if (!downloadUrl.includes('fl_attachment')) {
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
      }
    }
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'Resume.pdf');
    link.setAttribute('target', '_self');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render nothing if not open, but keep AnimatePresence logic
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            data-lenis-prevent
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-heading tracking-tight leading-none">Professional Resume</h3>
                  <p className="text-[9px] text-soft-dark uppercase tracking-[0.2em] font-bold opacity-40 mt-1">Document Preview</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1c20] text-white rounded-none text-[9px] font-bold uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-lg"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-none bg-gray-50 text-soft-dark hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all border border-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content - PDF Preview */}
            <div className="flex-1 bg-[#f8f9fb] relative overflow-hidden">
              {resumeUrl ? (
                isMobile ? (
                  <div className="flex flex-col items-center justify-center h-full text-soft-dark gap-8 p-10 text-center bg-white">
                    <div className="w-20 h-20 rounded-none bg-primary/5 flex items-center justify-center text-primary relative">
                      <FileText size={40} className="relative z-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl mb-3 text-heading tracking-tight">Resume Ready</h4>
                      <p className="text-sm opacity-60 max-w-xs mx-auto mb-10 font-medium leading-relaxed">
                        PDF viewing is optimized for desktop. Use the link below to view or download.
                      </p>
                      
                      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                        <button
                          onClick={handleDownload}
                          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a1c20] text-white font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all rounded-none"
                        >
                          <ExternalLink size={18} />
                          View Document
                        </button>

                        <button 
                          onClick={handleDownload}
                          className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-100 text-heading font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 active:scale-95 transition-all rounded-none"
                        >
                          <Download size={18} />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {/* Persistent Loading Background to prevent flickering */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#f8f9fb] z-0">
                      <div className="flex flex-col items-center gap-5">
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">Securely loading document...</p>
                      </div>
                    </div>
                    <iframe
                      src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-none bg-white relative z-10"
                      title="Resume Preview"
                      onLoad={(e) => {
                        // Subtle fade-in of the iframe itself
                        e.target.style.opacity = '1';
                      }}
                      style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
                    />
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-soft-dark gap-6 p-10 text-center">
                  <div className="w-24 h-24 rounded-none bg-gray-200/50 flex items-center justify-center animate-pulse">
                    <FileText size={48} className="opacity-20" />
                  </div>
                  <div>
                    <p className="font-black text-2xl mb-2">Resume Not Found</p>
                    <p className="text-sm opacity-60 max-w-xs mx-auto">The resume file hasn't been uploaded yet or the link is currently unavailable.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Mobile Info */}
            <div className="md:hidden p-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] font-black text-soft-dark uppercase tracking-[0.2em] opacity-40">
                Optimized for Professional Viewing
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

export default ResumeModal;
