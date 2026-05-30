"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Plus, Trash2, CheckCircle, ShieldCheck,
  Link as LinkIcon, User, ImageIcon, Star, BarChart2, GripVertical
} from 'lucide-react';
import {
  FaLinkedinIn, FaGithub, FaMediumM, FaDribbble
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { AdminCard, AdminButton, AdminInput, AdminToggle } from '../components/AdminShared';
import aboutService from '../../services/aboutService';
import toast from 'react-hot-toast';

/* ─── Social Platform Registry ─── */
const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2' },
  { key: 'github', label: 'GitHub', icon: FaGithub, color: '#1a1a1a' },
  { key: 'twitter', label: 'X / Twitter', icon: FaXTwitter, color: '#000000' },
  { key: 'medium', label: 'Medium', icon: FaMediumM, color: '#000000' },
  { key: 'dribbble', label: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
  { key: 'leetcode', label: 'LeetCode', icon: SiLeetcode, color: '#FFA116' },
  { key: 'code360', label: 'Code360', icon: LinkIcon, color: '#f07000' },
  { key: 'custom', label: 'Custom', icon: LinkIcon, color: '#9929fb' },
];

const getPlatformInfo = (key) => {
  return SOCIAL_PLATFORMS.find(p => p.key === key?.toLowerCase())
    || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
};

/* ─── Icon Name Options for Highlights ─── */
const HIGHLIGHT_ICONS = [
  'Code', 'Globe', 'Zap', 'Shield', 'Star', 'Award',
  'Briefcase', 'Heart', 'TrendingUp', 'Target', 'Layers', 'Cpu'
];

const AboutSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    profileImage: '',
    socialLinks: [],
    stats: [],
    highlights: [],
    isVisible: true,
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const data = await aboutService.getAboutData();
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          profileImage: data.profileImage || '',
          socialLinks: data.socialLinks || [],
          stats: data.stats || [],
          highlights: data.highlights || [],
          isVisible: data.isVisible !== false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch about data:', err);
      toast.error('Could not load About data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  /* ─── Social Links ─── */
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'linkedin', url: '', icon: 'linkedin' }]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'platform') updated[index].icon = value;
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  /* ─── Stats ─── */
  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '', isVisible: true }]
    }));
  };

  const updateStat = (index, field, value) => {
    const updated = [...formData.stats];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, stats: updated }));
  };

  const removeStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  /* ─── Highlights ─── */
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', description: '', icon: 'Star', isVisible: true }]
    }));
  };

  const updateHighlight = (index, field, value) => {
    const updated = [...formData.highlights];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, highlights: updated }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  /* ─── Save ─── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    setSuccess(false);
    try {
      await toast.promise(aboutService.updateAboutData(formData), {
        loading: 'Saving About Section...',
        success: 'About Section Updated!',
        error: (err) => err?.message || 'Save failed',
      });

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
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <p className="text-soft-dark font-black uppercase tracking-widest text-xs">Loading About Data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>
            About Section
          </h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>
            Manage your story — bio, social links, stats, and highlights.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-500 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100"
            >
              <CheckCircle size={16} /> Saved Successfully
            </motion.div>
          )}
          <AdminButton
            className="!px-12 !py-4 shadow-xl shadow-primary/20"
            onClick={handleSubmit}
            disabled={saving}
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
        {/* ── Left Column ── */}
        <div className="xl:col-span-7 space-y-8">

          {/* Core Bio */}
          <AdminCard title="Bio & Identity" subtitle="Main content shown in the About card">
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <AdminInput
                  label="About Title / Name"
                  placeholder="e.g. Transforming Ideas into Digital Realities"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <AdminInput
                label="Subtitle (Role / Tagline)"
                placeholder="e.g. MERN Stack Developer"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
              />

              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">
                  Bio / Description
                </label>
                <textarea
                  name="description"
                  rows="5"
                  className="input-picto !rounded-[24px] !p-6"
                  placeholder="Write a compelling bio that tells your story..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] font-medium text-soft-dark italic opacity-50 px-2">
                  This is your main paragraph shown in the About section.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors">
                  <ImageIcon size={18} />
                </div>
                <AdminInput
                  label="Profile Image URL"
                  placeholder="https://res.cloudinary.com/... or /assets/navaneet.jpg"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                />
                {formData.profileImage && (
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={formData.profileImage}
                      alt="Profile Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <p className="text-[10px] font-medium text-soft-dark italic opacity-50">
                      Image preview. If broken, check the URL.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AdminCard>

          {/* Stats */}
          <AdminCard
            title="Stats & Achievements"
            subtitle="Numbers shown below your profile image"
            extra={
              <button
                onClick={addStat}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Stat
              </button>
            }
          >
            <div className="space-y-4">
              {formData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative bg-gray-50/50 hover:bg-white p-5 rounded-[20px] border border-gray-100 hover:border-primary/20 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-gray-300 cursor-grab">
                      <GripVertical size={16} />
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart2 size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Stat #{index + 1}
                    </span>
                    <div className="ml-auto">
                      <AdminToggle
                        checked={stat.isVisible !== false}
                        onChange={() => updateStat(index, 'isVisible', !(stat.isVisible !== false))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-soft-dark opacity-50">
                        Value
                      </label>
                      <input
                        type="text"
                        className="input-picto !py-3"
                        placeholder="e.g. 50+"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-soft-dark opacity-50">
                        Label
                      </label>
                      <input
                        type="text"
                        className="input-picto !py-3"
                        placeholder="e.g. Projects Done"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeStat(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white text-soft-dark hover:text-red-500 hover:scale-110 border border-gray-100 rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))}
              {formData.stats.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[24px] bg-gray-50/30">
                  <BarChart2 size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    No stats yet. Click "Add Stat" to begin.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Highlights */}
          <AdminCard
            title="Feature Highlights"
            subtitle="Key strengths / selling points shown as cards"
            extra={
              <button
                onClick={addHighlight}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Highlight
              </button>
            }
          >
            <div className="space-y-4">
              {formData.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative bg-gray-50/50 hover:bg-white p-5 rounded-[20px] border border-gray-100 hover:border-primary/20 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Star size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-1">
                      Highlight #{index + 1}
                    </span>
                    <AdminToggle
                      checked={highlight.isVisible !== false}
                      onChange={() => updateHighlight(index, 'isVisible', !(highlight.isVisible !== false))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-soft-dark opacity-50">Title</label>
                      <input
                        type="text"
                        className="input-picto !py-3"
                        placeholder="e.g. Performance First"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-soft-dark opacity-50">Icon Name</label>
                      <select
                        className="input-picto !py-3"
                        value={highlight.icon || 'Star'}
                        onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                      >
                        {HIGHLIGHT_ICONS.map(ic => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-soft-dark opacity-50">Description</label>
                    <input
                      type="text"
                      className="input-picto !py-3"
                      placeholder="e.g. Blazing-fast apps built for scale"
                      value={highlight.description || ''}
                      onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => removeHighlight(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white text-soft-dark hover:text-red-500 hover:scale-110 border border-gray-100 rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))}
              {formData.highlights.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[24px] bg-gray-50/30">
                  <Star size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    No highlights yet. Click "Add Highlight" to begin.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* ── Right Column ── */}
        <div className="xl:col-span-5 space-y-8">

          {/* Social Links */}
          <AdminCard
            title="Social Icons"
            subtitle="Icons shown floating over your profile photo"
            extra={
              <button
                onClick={addSocialLink}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Icon
              </button>
            }
          >
            <div className="space-y-3">
              {formData.socialLinks.map((link, index) => {
                const platformInfo = getPlatformInfo(link.platform);
                const Icon = platformInfo.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group relative bg-gray-50/50 hover:bg-white p-4 rounded-[20px] border border-gray-100 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: platformInfo.color }}
                      >
                        <Icon size={14} />
                      </div>
                      <select
                        className="input-picto !py-2.5 flex-1 text-sm"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      >
                        {SOCIAL_PLATFORMS.map(p => (
                          <option key={p.key} value={p.key}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                        <LinkIcon size={13} />
                      </div>
                      <input
                        type="url"
                        className="input-picto !pl-9 !py-2.5 text-sm mb-3"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      />
                    </div>
                    
                    {/* Custom Icon Uploader */}
                    {link.platform === 'custom' && (
                      <div className="mt-2 p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center gap-4 transition-all">
                        <div className="flex-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-soft-dark opacity-70 block mb-2">
                            Upload Custom Icon
                          </label>
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-soft-dark hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all shadow-sm group">
                            <ImageIcon size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                            <span>{link.customIcon ? 'Change Icon' : 'Choose Image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    updateSocialLink(index, 'customIcon', reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {link.customIcon && (
                          <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white p-1 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative group">
                            <img src={link.customIcon} alt="Custom Icon" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-white text-soft-dark hover:text-red-500 hover:scale-110 border border-gray-100 rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                );
              })}
              {formData.socialLinks.length === 0 && (
                <div className="text-center py-8 px-6 border-2 border-dashed border-gray-100 rounded-[28px] bg-gray-50/30">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-300 shadow-sm">
                    <LinkIcon size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    No social icons yet
                  </p>
                </div>
              )}
            </div>
            {/* Social Preview */}
            {formData.socialLinks.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Icon Preview</p>
                <div className="flex flex-wrap gap-2">
                  {formData.socialLinks.map((link, i) => {
                    const p = getPlatformInfo(link.platform);
                    const Ic = p.icon;
                    return (
                      <div
                        key={i}
                        className="w-10 h-10 flex items-center justify-center text-white rounded-sm transition-all hover:scale-110"
                        style={{ backgroundColor: p.color }}
                        title={link.url || p.label}
                      >
                        <Ic size={16} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </AdminCard>

          {/* Visibility */}
          <AdminCard title="Visibility Controls" className="bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-6">
              <AdminToggle
                label="Show About Section"
                checked={formData.isVisible}
                onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
              />
              <div className="p-4 bg-white/60 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed text-heading/70">
                  Hiding the About section will remove it from your portfolio while all data remains saved.
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Quick Preview */}
          <AdminCard title="Quick Preview" subtitle="Current about section snapshot">
            <div className="bg-gray-50 rounded-[20px] p-5 space-y-4">
              {formData.profileImage && (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-lg mx-auto block"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="text-center">
                <h3 className="text-lg font-black text-heading">
                  {formData.title || 'Your About Title'}
                </h3>
                <p className="text-xs text-primary font-bold mt-1">
                  {formData.subtitle || 'Your Role'}
                </p>
              </div>
              {formData.description && (
                <p className="text-xs text-soft-dark leading-relaxed opacity-70 line-clamp-3">
                  {formData.description}
                </p>
              )}
              {formData.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.stats.slice(0, 4).map((stat, i) => (
                    <div key={i} className="text-center bg-white rounded-lg py-2 px-3">
                      <div className="text-lg font-black text-primary">{stat.value}</div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSection;
