"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Save, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import { AdminCard, AdminButton } from '../components/AdminShared';
import heroService from '../../services/heroService';
import aboutService from '../../services/aboutService';
import toast from 'react-hot-toast';

const ResumeControl = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const hero = await heroService.getHeroData();
      setCurrentResume(hero.resumeUrl || '');
      setManualUrl(hero.resumeUrl || '');
    } catch (err) {
      console.error('Failed to fetch resume data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setManualUrl(''); // Clear manual URL if file is selected
      if (success) setSuccess(false);
      toast.success('Resume file selected', {
        icon: '📄',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
          fontSize: '12px'
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile && !manualUrl) {
      toast.error('Please provide a file or a manual link');
      return;
    }

    setSaving(true);
    setSuccess(false);
    try {
      // Logic for update promise
      const updatePromise = (async () => {
        let finalUrl = manualUrl;

        if (resumeFile) {
          const resumeData = new FormData();
          resumeData.append('resume', resumeFile);
          // Upload to Hero and get the secure URL
          const updatedHero = await heroService.updateHeroData(resumeData);
          finalUrl = updatedHero.resumeUrl;
        }

        // Sync the final URL to both Hero and About sections
        await Promise.all([
          heroService.updateHeroData({ resumeUrl: finalUrl }),
          aboutService.updateAboutData({ resumeUrl: finalUrl })
        ]);

        return finalUrl;
      })();

      await toast.promise(updatePromise, {
        loading: resumeFile ? 'Uploading to Cloudinary...' : 'Syncing Link...',
        success: 'Resume Updated Everywhere',
        error: 'Update failed'
      }, {
        style: {
          borderRadius: '20px',
          fontWeight: 'bold'
        }
      });
      
      const newUrl = await updatePromise;
      setCurrentResume(newUrl);
      setResumeFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <p className="text-soft-dark font-black uppercase tracking-widest text-xs">Loading Resume Settings...</p>
        </div>
      </div>
    );
  }

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Resume Control</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>Manage your latest professional curriculum vitae.</p>
        </div>
        <div className="flex items-center gap-4">
           {success && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 text-green-500 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100"
             >
               <CheckCircle size={16} /> Updated Successfully
             </motion.div>
           )}
          <AdminButton 
            className="!px-12 !py-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleSubmit} 
            disabled={saving || (!resumeFile && !manualUrl)}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save size={18} />
                <span>Save Changes</span>
              </div>
            )}
          </AdminButton>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <AdminCard title="Upload Latest Resume" subtitle="Upload your CV in PDF or Image format">
            <div 
              className={`relative border-2 border-dashed rounded-[40px] p-16 text-center transition-all duration-500 group ${
                resumeFile ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/40 bg-gray-50/30'
              }`}
            >
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png" 
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 transition-all duration-700 ${
                  resumeFile ? 'bg-primary text-white shadow-2xl shadow-primary/40 rotate-[10deg] scale-110' : 'bg-white text-primary shadow-xl shadow-gray-200/50 group-hover:scale-110'
                }`}>
                  <Upload size={38} className={resumeFile ? 'animate-bounce' : ''} />
                </div>
                
                <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--color-heading)' }}>
                  {resumeFile ? 'Ready to Upload' : 'Drop your resume here'}
                </h3>
                
                <p className="text-lg font-bold text-soft-dark mb-6 max-w-[400px] mx-auto opacity-60">
                  {resumeFile ? `Selected: ${resumeFile.name}` : 'Click to browse or drag and drop your professional file.'}
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  {['PDF', 'JPEG', 'PNG'].map(ext => (
                    <span key={ext} className="px-4 py-1.5 bg-white rounded-full border border-gray-100 text-[10px] font-black tracking-widest text-soft-dark shadow-sm uppercase">
                      {ext}
                    </span>
                  ))}
                </div>
              </label>

              {resumeFile && (
                <button 
                  onClick={() => setResumeFile(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white text-soft-dark hover:text-red-500 rounded-full flex items-center justify-center transition-all shadow-md border"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Manual Resume Link" subtitle="Paste a direct Cloudinary URL">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={manualUrl}
                  onChange={(e) => {
                    setManualUrl(e.target.value);
                    if (e.target.value) setResumeFile(null); // Clear file if URL is pasted
                  }}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold text-heading placeholder:opacity-30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-soft-dark/30">
                  <ExternalLink size={20} />
                </div>
              </div>
              <p className="text-[11px] font-bold text-soft-dark opacity-50 px-2">
                * Note: If you provide a manual link, it will be used instead of any uploaded file.
              </p>
            </div>
          </AdminCard>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <AdminCard title="Active Status" subtitle="Currently deployed resume">
            {currentResume ? (
              <div className="space-y-6">
                <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <FileText size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-40 mb-2">Filename</p>
                  <p className="font-bold text-heading truncate w-full mb-6">{currentResume.split('/').pop()}</p>
                  
                  <div className="flex flex-col w-full gap-3">
                    <a 
                      href={getFullUrl(currentResume)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-4 bg-white hover:bg-primary hover:text-white rounded-2xl border flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm"
                    >
                      <ExternalLink size={16} />
                      View Live
                    </a>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-[11px] font-bold leading-relaxed text-blue-900/70">
                    Your resume is live and accessible via the Hero and About sections on the public site.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center opacity-40">
                <FileText size={48} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No active resume found</p>
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeControl;
