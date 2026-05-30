"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Plus, Trash2, Eye, EyeOff, CheckCircle, ShieldCheck,
  Link as LinkIcon, User, Type, ImageIcon, Zap, Send, GripVertical
} from 'lucide-react';
import {
  FaLinkedinIn, FaGithub, FaMediumM, FaDribbble, FaTwitter
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { AdminCard, AdminButton, AdminInput, AdminToggle } from '../components/AdminShared';
import heroService from '../../services/heroService';
import toast from 'react-hot-toast';

/* ─── Social Platform Registry ─── */
const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2' },
  { key: 'github', label: 'GitHub', icon: FaGithub, color: '#1a1a1a' },
  { key: 'twitter', label: 'X / Twitter', icon: FaXTwitter, color: '#000000' },
  { key: 'medium', label: 'Medium', icon: FaMediumM, color: '#000000' },
  { key: 'dribbble', label: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
  { key: 'leetcode', label: 'LeetCode', icon: SiLeetcode, color: '#FFA116' },
  { key: 'custom', label: 'Custom', icon: LinkIcon, color: '#9929fb' },
];

const getPlatformIcon = (key) => {
  const found = SOCIAL_PLATFORMS.find(p => p.key === key?.toLowerCase());
  return found || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
};

const HeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    profileImage: '',
    hireMeUrl: '',
    typingPhrases: ['MERN Stack Developer', 'React Developer', 'Full Stack Engineer'],
    socialLinks: [],
    isVisible: true,
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const data = await heroService.getHeroData();
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          profileImage: data.profileImage || '',
          hireMeUrl: data.hireMeUrl || '',
          typingPhrases: data.typingPhrases?.length > 0
            ? data.typingPhrases
            : ['MERN Stack Developer', 'React Developer', 'Full Stack Engineer'],
          socialLinks: data.socialLinks || [],
          isVisible: data.isVisible !== false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch hero data:', err);
      toast.error('Could not load hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  /* ─── Typing Phrases ─── */
  const addPhrase = () => {
    setFormData(prev => ({ ...prev, typingPhrases: [...prev.typingPhrases, ''] }));
  };

  const updatePhrase = (index, value) => {
    const updated = [...formData.typingPhrases];
    updated[index] = value;
    setFormData(prev => ({ ...prev, typingPhrases: updated }));
  };

  const removePhrase = (index) => {
    setFormData(prev => ({
      ...prev,
      typingPhrases: prev.typingPhrases.filter((_, i) => i !== index)
    }));
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
      const payload = {
        ...formData,
        typingPhrases: formData.typingPhrases.filter(p => p.trim()),
      };

      await toast.promise(heroService.updateHeroData(payload), {
        loading: 'Saving Hero Section...',
        success: 'Hero Section Updated!',
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
          <p className="text-soft-dark font-black uppercase tracking-widest text-xs">Loading Hero Data...</p>
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
            Hero Section
          </h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>
            Control your first impression — title, phrases, links, and more.
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

          {/* Basic Info */}
          <AdminCard title="Core Identity" subtitle="Main hero headline & intro text">
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <AdminInput
                  label="Your Name / Title"
                  placeholder="e.g. Navaneet Sharma"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors">
                  <Type size={18} />
                </div>
                <AdminInput
                  label="Subtitle (optional)"
                  placeholder="e.g. Building digital experiences"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">
                  Hero Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="input-picto !rounded-[24px] !p-6"
                  placeholder="Crafting high-performance web applications with the MERN stack..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
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
                <p className="text-[10px] font-medium text-soft-dark italic opacity-50 mt-2 px-2">
                  Enter a direct image URL. Cloudinary URLs recommended for best performance.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors">
                  <Send size={18} />
                </div>
                <AdminInput
                  label="'Hire Me' Button URL"
                  placeholder="https://www.linkedin.com/in/yourprofile/"
                  name="hireMeUrl"
                  value={formData.hireMeUrl}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] font-medium text-soft-dark italic opacity-50 mt-2 px-2">
                  URL opened when visitors click the "Hire Me" button.
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Typing Phrases */}
          <AdminCard
            title="Typing Animation Phrases"
            subtitle="Rotating text shown under your name"
            extra={
              <button
                onClick={addPhrase}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Phrase
              </button>
            }
          >
            <div className="space-y-4">
              {formData.typingPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex items-center gap-3"
                >
                  <div className="text-gray-300 cursor-grab">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                      <Zap size={14} />
                    </div>
                    <input
                      type="text"
                      className="input-picto !pl-10 !py-4"
                      placeholder={`Phrase ${index + 1}, e.g. MERN Stack Developer`}
                      value={phrase}
                      onChange={(e) => updatePhrase(index, e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => removePhrase(index)}
                    className="p-2 text-soft-dark hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    disabled={formData.typingPhrases.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
              {formData.typingPhrases.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-[24px] bg-gray-50/30">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    No phrases added. Click "Add Phrase" to get started.
                  </p>
                </div>
              )}
            </div>
            <p className="text-[10px] font-medium text-soft-dark italic opacity-50 mt-4">
              These phrases cycle in the typing animation below "I'm a ___" on the hero section.
            </p>
          </AdminCard>
        </div>

        {/* ── Right Column ── */}
        <div className="xl:col-span-5 space-y-8">

          {/* Social Links */}
          <AdminCard
            title="Social Links"
            subtitle="Links shown in the hero or 'Hire Me' flow"
            extra={
              <button
                onClick={addSocialLink}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Link
              </button>
            }
          >
            <div className="space-y-4">
              {formData.socialLinks.map((link, index) => {
                const platformInfo = getPlatformIcon(link.platform);
                const Icon = platformInfo.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group relative bg-gray-50/50 hover:bg-white p-5 rounded-[24px] border border-gray-100 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5"
                  >
                    {/* Platform Picker */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: platformInfo.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <select
                        className="input-picto !py-3 flex-1"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      >
                        {SOCIAL_PLATFORMS.map(p => (
                          <option key={p.key} value={p.key}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* URL */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                        <LinkIcon size={14} />
                      </div>
                      <input
                        type="url"
                        className="input-picto !pl-10 !py-3"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      />
                    </div>
                    {/* Remove */}
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
                <div className="text-center py-10 px-6 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/30">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-300 shadow-sm">
                    <LinkIcon size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    No social links yet
                  </p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Visibility */}
          <AdminCard title="Visibility Controls" className="bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-6">
              <AdminToggle
                label="Show Hero Section"
                checked={formData.isVisible}
                onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
              />
              <div className="p-4 bg-white/60 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed text-heading/70">
                  Hiding the hero section will remove it from your portfolio, but all data will be preserved for future use.
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Live Preview Card */}
          <AdminCard title="Live Preview" subtitle="How it looks on your portfolio">
            <div className="bg-gray-50 rounded-[20px] p-6 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available for Projects</div>
              <div className="text-2xl font-black text-heading tracking-tight">
                Hello, I'm <span className="text-primary">{formData.title || 'Your Name'}</span>
              </div>
              <div className="text-sm font-bold text-heading/60">
                I'm a <span className="text-primary">{formData.typingPhrases[0] || 'Developer'}</span>|
              </div>
              <p className="text-xs text-soft-dark leading-relaxed opacity-70 line-clamp-2">
                {formData.description || 'Your hero description will appear here...'}
              </p>
              <div className="flex gap-2 pt-2">
                <div className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-sm">
                  Hire Me
                </div>
                <div className="px-4 py-2 border border-gray-200 text-[10px] font-black uppercase rounded-sm text-gray-600">
                  View Resume
                </div>
              </div>
              {formData.socialLinks.length > 0 && (
                <div className="flex gap-2 pt-1 flex-wrap">
                  {formData.socialLinks.slice(0, 5).map((link, i) => {
                    const p = getPlatformIcon(link.platform);
                    const Ic = p.icon;
                    return (
                      <div key={i} className="w-7 h-7 rounded flex items-center justify-center text-white" style={{ backgroundColor: p.color }}>
                        <Ic size={12} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
