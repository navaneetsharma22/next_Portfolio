"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, 
  CheckCircle2, Play,
  Link as LinkIcon
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { CursorProvider } from '@/context/CursorContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProjectDetailClient = ({ slug, initialProject }) => {
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [copied, setCopied] = useState(false);

  // If no initialProject was passed from server, fetch client-side
  useEffect(() => {
    if (!initialProject) {
      const fetchProject = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${API_URL}/projects/${slug}`);
          if (res.ok) {
            const data = await res.json();
            setProject(data);
          }
        } catch (error) {
          console.error('Project not found:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
    window.scrollTo(0, 0);
  }, [slug, initialProject]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-bold mb-6">Project Not Found</h2>
      <Link href="/" className="btn-picto">Return Home</Link>
    </div>
  );

  return (
    <CursorProvider>
      <div className="bg-[#0a0a0f] min-h-screen text-white">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>
            
            {/* Back Button */}
            <Link 
              href="/#projects" 
              className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-12 text-xs font-black uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </Link>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-white/60 border border-white/10">
                    {project.status}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                  {project.title}
                </h1>
                <p className="text-white/60 text-xl leading-relaxed mb-10">
                  {project.shortDescription}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-picto !px-10">
                      Launch Project <ExternalLink size={16} className="ml-2" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-10 py-4 border border-white/10 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center">
                      View Source <FaGithub size={16} className="ml-2" />
                    </a>
                  )}
                  <button 
                    onClick={handleCopyLink}
                    className="p-4 border border-white/10 hover:bg-white/5 transition-all text-white/60"
                    title="Copy Link"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-video lg:aspect-auto"
              >
                <img 
                  src={project.images?.[0]} 
                  alt={project.title} 
                  className="w-full h-full object-cover border border-white/10 shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-40"></div>
              </motion.div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
              
              {/* Project Specs */}
              <div className="lg:col-span-1 space-y-12">
                 <div>
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6">Core Stack</h4>
                   <div className="flex flex-wrap gap-2">
                     {project.techStack?.map((tech, i) => (
                       <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                         {tech}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-1 gap-8 pt-10 border-t border-white/5">
                   {project.clientName && (
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Client</p>
                       <p className="text-lg font-bold text-white/80">{project.clientName}</p>
                     </div>
                   )}
                   {project.duration && (
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Duration</p>
                       <p className="text-lg font-bold text-white/80">{project.duration}</p>
                     </div>
                   )}
                   {project.deploymentPlatform && (
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Deployment</p>
                       <p className="text-lg font-bold text-white/80">{project.deploymentPlatform}</p>
                     </div>
                   )}
                 </div>
              </div>

              {/* Project Content */}
              <div className="lg:col-span-2 space-y-16">
                 <section>
                   <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <span className="w-8 h-px bg-primary"></span> Deep Dive
                   </h3>
                   <div 
                     className="text-white/50 text-lg leading-relaxed space-y-6"
                     dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                   />
                 </section>

                 {project.videoPreviewUrl && (
                   <section>
                     <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                       <span className="w-8 h-px bg-primary"></span> Preview Video
                     </h3>
                     <div className="aspect-video bg-white/[0.02] border border-white/10 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                        <Play size={64} className="text-white opacity-20 group-hover:scale-110 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     </div>
                   </section>
                 )}

                 {project.images?.length > 1 && (
                   <section>
                     <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                       <span className="w-8 h-px bg-primary"></span> Gallery
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {project.images.slice(1).map((img, i) => (
                         <div key={i} className="overflow-hidden border border-white/5 group">
                            <img src={img} alt="" className="w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="bg-primary/10 border border-primary/20 p-12 md:p-20 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
               <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Have a similar project <br /> in mind?</h2>
                 <Link href="/#contact" className="btn-picto !px-12">Let&apos;s Talk Business</Link>
               </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </CursorProvider>
  );
};

export default ProjectDetailClient;
