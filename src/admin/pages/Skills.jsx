"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, GripVertical, UploadCloud } from 'lucide-react';
import {
  FaReact, FaNodeJs, FaGitAlt, FaGithub, FaDatabase
} from 'react-icons/fa';
import {
  SiJavascript, SiMongodb, SiTailwindcss, SiExpress, SiFramer,
  SiTypescript, SiNextdotjs, SiRedux, SiFirebase, SiDocker,
  SiPostgresql, SiMysql, SiPrisma, SiGraphql, SiVercel
} from 'react-icons/si';
import { Zap, Globe, Shield, Code, HelpCircle } from 'lucide-react';
import { AdminCard, AdminButton, AdminInput, AdminModal, AdminToggle } from '../components/AdminShared';
import skillService from '../../services/skillService';
import toast from 'react-hot-toast';

/* ─── Icon Registry (matches the public Skills component) ─── */
const ICON_REGISTRY = [
  { key: 'react.js', label: 'React.js', icon: FaReact, color: '#61DAFB' },
  { key: 'javascript', label: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { key: 'typescript', label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { key: 'tailwind css', label: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { key: 'next.js', label: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
  { key: 'framer motion', label: 'Framer Motion', icon: SiFramer, color: '#0055FF' },
  { key: 'gsap', label: 'GSAP', icon: Zap, color: '#88CE02' },
  { key: 'redux', label: 'Redux', icon: SiRedux, color: '#764ABC' },
  { key: 'node.js', label: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { key: 'express.js', label: 'Express.js', icon: SiExpress, color: '#68A063' },
  { key: 'mongodb', label: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { key: 'postgresql', label: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { key: 'mysql', label: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { key: 'firebase', label: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { key: 'prisma', label: 'Prisma', icon: SiPrisma, color: '#2D3748' },
  { key: 'graphql', label: 'GraphQL', icon: SiGraphql, color: '#E10098' },
  { key: 'jwt', label: 'JWT', icon: Shield, color: '#D63AFF' },
  { key: 'rest apis', label: 'REST APIs', icon: Globe, color: '#FF6B6B' },
  { key: 'git & github', label: 'Git & GitHub', icon: FaGithub, color: '#E8E8E8' },
  { key: 'git', label: 'Git', icon: FaGitAlt, color: '#F05032' },
  { key: 'docker', label: 'Docker', icon: SiDocker, color: '#2496ED' },
  { key: 'vercel', label: 'Vercel', icon: SiVercel, color: '#ffffff' },
  { key: 'other', label: 'Other', icon: Code, color: '#9929fb' },
];

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud & Deployment', 'DevOps', 'Tools', 'Other'];

const CATEGORY_BADGE_COLORS = {
  Frontend: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Backend: 'bg-green-50 text-green-700 border-green-200',
  Database: 'bg-amber-50 text-amber-700 border-amber-200',
  'Cloud & Deployment': 'bg-blue-50 text-blue-700 border-blue-200',
  DevOps: 'bg-orange-50 text-orange-700 border-orange-200',
  Tools: 'bg-purple-50 text-purple-700 border-purple-200',
  Other: 'bg-gray-50 text-gray-600 border-gray-200',
};

const SkillIcon = ({ skill, getImageUrl, getIconEntry }) => {
  const [error, setError] = useState(false);
  const entry = getIconEntry(skill.icon);
  const IconComponent = entry?.icon || HelpCircle;
  const iconColor = entry?.color || '#9929fb';

  return (
    <div className="w-14 h-14 flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform duration-300">
      {skill.customIcon && !error ? (
        <img 
          src={getImageUrl(skill.customIcon)} 
          alt={skill.name} 
          className="w-full h-full object-contain p-2"
          onError={() => setError(true)}
        />
      ) : (
        <IconComponent size={32} style={{ color: iconColor }} />
      )}
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: 'react.js',
    order: 0,
    isVisible: true
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillService.getAll();
      setSkills(Array.isArray(data) ? data : data.skills || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    setIconFile(null);
    setPreviewUrl(null);
    if (skill) {
      setIsEditing(true);
      setCurrentId(skill._id);
      setFormData({
        name: skill.name,
        category: skill.category || 'Other',
        icon: skill.icon || 'other',
        order: skill.order || 0,
        isVisible: skill.isVisible !== false
      });
      if (skill.customIcon) {
        setPreviewUrl(getImageUrl(skill.customIcon));
      }
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: '',
        category: 'Frontend',
        icon: 'react.js',
        order: skills.length,
        isVisible: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Please fill in the skill name and category.');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('icon', formData.icon);
      data.append('order', formData.order);
      data.append('isVisible', formData.isVisible);
      if (iconFile) {
        data.append('iconFile', iconFile);
      }

      const promise = isEditing 
        ? skillService.update(currentId, data) 
        : skillService.create(data);

      await toast.promise(promise, {
        loading: isEditing ? 'Syncing Skill...' : 'Creating Skill...',
        success: isEditing ? 'Skill Updated Successfully' : 'Skill Added to Arsenal',
        error: (err) => err.response?.data?.message || 'Operation failed'
      });

      await fetchSkills();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await toast.promise(skillService.delete(id), {
          loading: 'Deleting Skill...',
          success: 'Skill Deleted',
          error: 'Delete failed'
        });
        await fetchSkills();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleVisibility = async (skill) => {
    try {
      await toast.promise(skillService.update(skill._id, { ...skill, isVisible: !skill.isVisible }), {
        loading: 'Toggling Visibility...',
        success: skill.isVisible ? 'Skill Hidden' : 'Skill Now Visible',
        error: 'Toggle failed'
      });
      await fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering
  const filteredSkills = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'All' || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const getIconEntry = (key) =>
    ICON_REGISTRY.find(r => r.key === key) || ICON_REGISTRY.find(r => r.key === 'other');

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Skills</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>
            Manage your technical expertise. ({skills.length} total)
          </p>
        </div>
        <AdminButton className="!px-8" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add New Skill
        </AdminButton>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-soft-dark" size={18} />
          <input
            type="text"
            placeholder="Search skills..."
            className="input-picto !pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
              filterCategory === 'All'
                ? 'bg-primary text-white border-primary'
                : 'text-soft-dark hover:bg-gray-100 border-border'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'text-soft-dark hover:bg-gray-100 border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 text-center font-bold text-soft-dark animate-pulse uppercase tracking-widest">
              Loading Skills...
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="col-span-full py-20 text-center font-bold text-soft-dark uppercase tracking-widest">
              No skills found. Click "Add New Skill" to create one.
            </div>
          ) : filteredSkills.map((skill) => {
            const entry = getIconEntry(skill.icon);
            const IconComponent = entry?.icon || HelpCircle;
            const iconColor = entry?.color || '#9929fb';
            const badgeClass = CATEGORY_BADGE_COLORS[skill.category] || CATEGORY_BADGE_COLORS['Other'];

            return (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <AdminCard className={`group relative overflow-visible ${!skill.isVisible ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-5">
                    <SkillIcon skill={skill} getImageUrl={getImageUrl} getIconEntry={getIconEntry} />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleVisibility(skill)}
                        className="p-2 text-soft-dark hover:text-primary transition-colors"
                        title={skill.isVisible ? 'Hide skill' : 'Show skill'}
                      >
                        {skill.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(skill)}
                        className="p-2 text-soft-dark hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 text-soft-dark hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-heading mb-2">{skill.name}</h3>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${badgeClass}`}>
                      {skill.category}
                    </span>
                    <span className="text-[10px] font-bold text-soft-dark">
                      Order: {skill.order || 0}
                    </span>
                  </div>

                  {!skill.isVisible && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-gray-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                      Hidden
                    </div>
                  )}
                </AdminCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Skill' : 'Add New Skill'}
        footer={
          <>
            <AdminButton variant="ghost" onClick={handleCloseModal}>Cancel</AdminButton>
            <AdminButton onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Skill'}
            </AdminButton>
          </>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Skill Name"
              placeholder="e.g. React.js"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-soft-dark">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-picto"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-soft-dark">
              Display Order (lower = first)
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="input-picto w-32"
              min="0"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-soft-dark">
              Icon — Select a preset icon OR upload a custom one
            </label>
            
            {/* Custom File Upload */}
            <div className={`mb-6 p-4 rounded-xl border-2 transition-all duration-300 ${iconFile || previewUrl ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] font-black text-soft-dark uppercase tracking-[0.2em]">Custom Icon Upload</label>
                {(iconFile || previewUrl) && (
                  <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5">Active</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <div className="relative w-20 h-20 rounded-lg border-2 border-white bg-white flex items-center justify-center p-3 shadow-sm ring-1 ring-black/5">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setIconFile(null);
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, icon: 'other' }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 group relative">
                    <div className="border-2 border-dashed border-gray-300 group-hover:border-primary/50 group-hover:bg-white rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2">
                      <UploadCloud className="text-gray-400 group-hover:text-primary transition-colors" size={28} />
                      <div>
                        <div className="text-sm text-gray-600 font-bold">Upload Custom Image</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SVG, PNG, JPG</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".svg, .png, .jpg, .jpeg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIconFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                          setFormData(prev => ({ ...prev, icon: 'custom' }));
                          toast.success('Custom icon ready', {
                            icon: '🖼️',
                            style: {
                              borderRadius: '12px',
                              background: '#333',
                              color: '#fff'
                            }
                          });
                        }
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 text-xs text-soft-dark font-medium italic">
                  {previewUrl 
                    ? "Custom icon is currently active. To use a preset icon instead, remove this upload."
                    : "Upload your own icon image. This will override the selected preset icon below."}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Or Select Preset</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[240px] overflow-y-auto p-1">
              {ICON_REGISTRY.map(entry => {
                const isSelected = formData.icon === entry.key && !iconFile && !previewUrl;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, icon: entry.key }));
                      setIconFile(null);
                      setPreviewUrl(null);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 border transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-md scale-105'
                        : 'bg-gray-50 border-border hover:bg-gray-100'
                    }`}
                    title={entry.label}
                  >
                    <entry.icon size={22} style={{ color: isSelected ? entry.color : '#697482' }} />
                    <span className="text-[9px] font-bold text-center leading-tight truncate w-full">
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visibility */}
          <AdminToggle
            label="Visible on Portfolio"
            checked={formData.isVisible}
            onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
          />
        </form>
      </AdminModal>
    </motion.div>
  );
};

export default Skills;
