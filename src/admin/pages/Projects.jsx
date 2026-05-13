"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, ExternalLink, Search, 
  Upload, X, Eye, EyeOff, Star, Hash, 
  Globe, Image as ImageIcon, Briefcase, 
  Clock, Server, Tag, Info, Layout, FileCode
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { AdminCard, AdminButton, AdminInput, AdminModal, AdminToggle } from '../components/AdminShared';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';

const CATEGORIES = ['MERN Stack', 'React Apps', 'Dashboards', 'SaaS', 'Backend APIs', 'Full Stack', 'Other'];
const STATUSES = ['Completed', 'In Progress', 'Maintenance'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Full Stack',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    caseStudyUrl: '',
    documentationUrl: '',
    videoPreviewUrl: '',
    isFeatured: false,
    isVisible: true,
    order: 0,
    status: 'Completed',
    clientName: '',
    deploymentPlatform: '',
    duration: '',
    features: '',
    seoTitle: '',
    seoDescription: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  const [secondaryImageFile, setSecondaryImageFile] = useState(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState('');
  const [existingSecondaryImage, setExistingSecondaryImage] = useState('');
  
  const fileInputRef = useRef(null);
  const secondaryFileInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(Array.isArray(data.projects) ? data.projects : data);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setIsEditing(true);
      setCurrentId(project._id);
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        category: project.category || 'Full Stack',
        techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        caseStudyUrl: project.caseStudyUrl || '',
        documentationUrl: project.documentationUrl || '',
        videoPreviewUrl: project.videoPreviewUrl || '',
        isFeatured: project.isFeatured || false,
        isVisible: project.isVisible !== false,
        order: project.order || 0,
        status: project.status || 'Completed',
        clientName: project.clientName || '',
        deploymentPlatform: project.deploymentPlatform || '',
        duration: project.duration || '',
        features: Array.isArray(project.features) ? project.features.join('\n') : '',
        seoTitle: project.seoTitle || '',
        seoDescription: project.seoDescription || ''
      });
      setExistingImages(project.images || []);
      setExistingSecondaryImage(project.secondaryImage || '');
      setImagePreviews([]);
      setSecondaryImagePreview('');
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        category: 'Full Stack',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        caseStudyUrl: '',
        documentationUrl: '',
        videoPreviewUrl: '',
        isFeatured: false,
        isVisible: true,
        order: projects.length,
        status: 'Completed',
        clientName: '',
        deploymentPlatform: '',
        duration: '',
        features: '',
        seoTitle: '',
        seoDescription: ''
      });
      setExistingImages([]);
      setExistingSecondaryImage('');
      setImagePreviews([]);
      setSecondaryImagePreview('');
    }
    setImageFiles([]);
    setSecondaryImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
      toast.success(`${files.length} images staged for upload`, {
        icon: '📸',
        style: {
          borderRadius: '15px',
          background: '#333',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
    }
  };

  const handleSecondaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSecondaryImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSecondaryImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Secondary visual ready', {
        icon: '🎨',
        style: {
          borderRadius: '15px',
          background: '#333',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
    }
  };

  const removeImagePreview = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeSecondaryImage = (isExisting = false) => {
    if (isExisting) {
      setExistingSecondaryImage('');
    } else {
      setSecondaryImageFile(null);
      setSecondaryImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'techStack') {
        const techArray = formData[key].split(',').map(t => t.trim()).filter(t => t !== '');
        data.append(key, JSON.stringify(techArray));
      } else if (key === 'features') {
        const featureArray = formData[key].split('\n').map(f => f.trim()).filter(f => f !== '');
        data.append(key, JSON.stringify(featureArray));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Handle images
    imageFiles.forEach(file => data.append('images', file));
    existingImages.forEach(img => data.append('existingImages', img));

    if (secondaryImageFile) {
      data.append('secondaryImage', secondaryImageFile);
    }
    if (existingSecondaryImage) {
      data.append('existingSecondaryImage', existingSecondaryImage);
    }

    try {
      const promise = isEditing 
        ? projectService.update(currentId, data) 
        : projectService.create(data);

      await toast.promise(promise, {
        loading: isEditing ? 'Updating Artifact...' : 'Deploying Project...',
        success: isEditing ? 'Project Updated Successfully' : 'Project Deployed to Vault',
        error: (err) => err.response?.data?.message || 'Operation failed'
      }, {
        style: {
          borderRadius: '20px',
          background: '#fff',
          color: '#1a1a1a',
          fontWeight: 'bold',
          border: '1px solid #f0f0f0',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
        }
      });

      fetchProjects();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await toast.promise(projectService.delete(id), {
          loading: 'Removing Artifact...',
          success: 'Project Removed from Vault',
          error: 'Delete failed'
        });
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Project Vault</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>Curate and manage your development portfolio.</p>
        </div>
        <AdminButton className="!px-10 !py-4" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add New Project
        </AdminButton>
      </div>

      <AdminCard>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-soft-dark opacity-40 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects by name or niche..." 
              className="input-picto !pl-12 !rounded-2xl !py-4 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border">
             <span className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-soft-dark">Filter: All</span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-10">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50">Project Detail</th>
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50">Niche</th>
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50">Technologies</th>
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50">Status</th>
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50">Visibility</th>
                <th className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-soft-dark opacity-50 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan="6" className="p-24 text-center font-black text-soft-dark animate-pulse uppercase tracking-[0.3em] text-xs">Decrypting Vault...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan="6" className="p-24 text-center font-black text-soft-dark uppercase tracking-[0.3em] text-xs opacity-50">No artifacts found</td></tr>
                ) : filteredProjects.map((project) => (
                  <motion.tr 
                    key={project._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50/80 transition-all duration-300 group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[20px] overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500 shrink-0 bg-gray-100">
                          <img 
                            src={getImageUrl(project.images?.[0]) || 'https://via.placeholder.com/150'} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-black text-heading group-hover:text-primary transition-colors duration-300 text-lg leading-tight">{project.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold text-soft-dark opacity-40">/{project.slug}</span>
                            {project.isFeatured && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">{project.category}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[8px] font-black uppercase tracking-tight text-gray-500 bg-white border border-gray-100 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.techStack?.length > 3 && (
                          <span className="text-[8px] font-black text-gray-300">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                         <span className="text-xs font-bold text-heading">{project.status}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm ${
                        project.isVisible !== false ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {project.isVisible !== false ? 'Live' : 'Archived'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenModal(project)}
                          className="w-11 h-11 flex items-center justify-center text-soft-dark hover:text-primary hover:bg-white hover:shadow-xl hover:shadow-primary/10 rounded-[14px] transition-all duration-300"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(project._id)}
                          className="w-11 h-11 flex items-center justify-center text-soft-dark hover:text-red-500 hover:bg-white hover:shadow-xl hover:shadow-red-500/10 rounded-[14px] transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Modify Project' : 'New Project Artifact'}
        footer={
          <>
            <AdminButton variant="ghost" onClick={handleCloseModal}>Cancel</AdminButton>
            <AdminButton className="!px-12" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : isEditing ? 'Update Artifact' : 'Deploy Project'}
            </AdminButton>
          </>
        }
      >
        <form className="space-y-10 pb-12" onSubmit={handleSubmit}>
          {/* Section: Project Images (REFINED UPLOAD) */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <ImageIcon size={14} /> Project Visuals
              </h4>
              <span className="text-[10px] font-black text-soft-dark opacity-30 uppercase tracking-widest">SVG, PNG, JPG, WebP supported</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div key={`exist-${idx}`} className="relative group aspect-video rounded-[24px] overflow-hidden border-2 border-white shadow-xl">
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeImagePreview(idx, true)}
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {/* New Previews */}
              {imagePreviews.map((img, idx) => (
                <div key={`new-${idx}`} className="relative group aspect-video rounded-[24px] overflow-hidden border-2 border-primary/20 shadow-xl">
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">New Upload</div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeImagePreview(idx)}
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {/* High-End Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group text-soft-dark hover:text-primary bg-gray-50/50"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                  <Upload size={20} className="group-hover:animate-bounce" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Upload Assets</span>
              </button>
            </div>
            <input 
              type="file" 
              hidden 
              multiple 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept=".png,.svg,.jpg,.jpeg,.webp" 
            />
          </div>

          {/* Secondary Image Section */}
          <div className="space-y-6 pt-10 border-t border-gray-100">
            <div className="flex justify-between items-end">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <ImageIcon size={14} /> Secondary Visual (Overlay/Hover)
              </h4>
              <span className="text-[10px] font-black text-soft-dark opacity-30 uppercase tracking-widest">Optional single image</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5">
              {existingSecondaryImage && (
                <div className="relative group aspect-video rounded-[24px] overflow-hidden border-2 border-white shadow-xl">
                  <img src={getImageUrl(existingSecondaryImage)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeSecondaryImage(true)}
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
              {secondaryImagePreview && (
                <div className="relative group aspect-video rounded-[24px] overflow-hidden border-2 border-primary/20 shadow-xl">
                  <img src={secondaryImagePreview} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">New Upload</div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeSecondaryImage(false)}
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
              {!existingSecondaryImage && !secondaryImagePreview && (
                <button
                  type="button"
                  onClick={() => secondaryFileInputRef.current?.click()}
                  className="aspect-video rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group text-soft-dark hover:text-primary bg-gray-50/50"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                    <Upload size={20} className="group-hover:animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Add Secondary</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              hidden 
              ref={secondaryFileInputRef} 
              onChange={handleSecondaryImageChange} 
              accept=".png,.svg,.jpg,.jpeg,.webp" 
            />
          </div>

          {/* Section: Basic Info */}
          <div className="space-y-8 pt-10 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Info size={14} /> Core Context
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminInput 
                label="Project Title" 
                placeholder="e.g. Nexus Dashboard v2" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required
              />
              <AdminInput 
                label="Public Slug" 
                placeholder="nexus-dashboard" 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Project Niche</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  className="input-picto !rounded-[18px] !py-4 shadow-sm"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Current Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange}
                  className="input-picto !rounded-[18px] !py-4 shadow-sm"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <AdminInput 
              label="Elevator Pitch (Short Description)" 
              placeholder="High-performance dashboard for neural network monitoring..." 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleInputChange} 
              required
            />
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Technical Narrative (Full Description)</label>
              <textarea 
                name="fullDescription" 
                rows="8" 
                className="input-picto !rounded-[24px] !p-6 shadow-sm" 
                placeholder="Break down the technical challenges, architecture, and results..."
                value={formData.fullDescription}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Core Features (One per line)</label>
              <textarea 
                name="features" 
                rows="5" 
                className="input-picto !rounded-[24px] !p-6 shadow-sm border-primary/20" 
                placeholder="Secure Authentication&#10;Real-time Chat with Socket.io&#10;Cloudinary Image Uploads..."
                value={formData.features}
                onChange={handleInputChange}
              ></textarea>
              <p className="text-[9px] text-soft-dark opacity-40 font-bold uppercase tracking-widest">These will appear as highlights in the project details modal.</p>
            </div>
          </div>

          {/* Section: Technical Stack */}
          <div className="space-y-8 pt-10 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <FileCode size={14} /> Stack & Tools
            </h4>
            <AdminInput 
              label="Stack Composition (Comma Separated)" 
              placeholder="React, Redux, Node.js, GSAP, Tailwind..." 
              name="techStack" 
              value={formData.techStack} 
              onChange={handleInputChange} 
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminInput label="Project Live Experience URL" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} />
              <AdminInput label="Source Code (GitHub URL)" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AdminInput label="Client Origin" name="clientName" value={formData.clientName} onChange={handleInputChange} />
              <AdminInput label="Deployment" placeholder="Vercel, AWS" name="deploymentPlatform" value={formData.deploymentPlatform} onChange={handleInputChange} />
              <AdminInput label="Timeline" placeholder="4 Months" name="duration" value={formData.duration} onChange={handleInputChange} />
            </div>
          </div>

          {/* Section: Connectivity */}
          <div className="space-y-8 pt-10 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Globe size={14} /> Documentation & Previews
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AdminInput label="Case Study" name="caseStudyUrl" value={formData.caseStudyUrl} onChange={handleInputChange} />
              <AdminInput label="Documentation" name="documentationUrl" value={formData.documentationUrl} onChange={handleInputChange} />
              <AdminInput label="Motion Preview (Video)" name="videoPreviewUrl" value={formData.videoPreviewUrl} onChange={handleInputChange} />
            </div>
          </div>

          {/* Section: Metadata & Controls */}
          <div className="space-y-8 pt-10 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Layout size={14} /> SEO & Orchestration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminInput label="Meta Title" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} />
              <AdminInput label="Meta Description" name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} />
            </div>
            <div className="flex flex-wrap items-center gap-12 bg-gray-50 p-8 rounded-[24px] border border-gray-100">
              <AdminToggle label="Feature in Hero Gallery" checked={formData.isFeatured} onChange={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))} />
              <AdminToggle label="Publish to World" checked={formData.isVisible} onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))} />
              <div className="flex items-center gap-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark">Sequence Order:</label>
                <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-24 input-picto !rounded-xl !py-2 shadow-sm text-center" />
              </div>
            </div>
          </div>
        </form>
      </AdminModal>
    </motion.div>
  );
};

export default Projects;
