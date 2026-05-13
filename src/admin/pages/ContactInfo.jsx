"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Globe, Save, Info, Link as LinkIcon, Plus, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import { AdminCard, AdminButton, AdminInput, AdminToggle } from '../components/AdminShared';
import contactService from '../../services/contactService';
import toast from 'react-hot-toast';

const ContactInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    socialLinks: [],
    isVisible: true
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const data = await contactService.getInfo();
      setFormData({
        title: data.title || 'Get In Touch',
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        socialLinks: data.socialLinks || [],
        isVisible: data.isVisible !== false
      });
    } catch (err) {
      console.error('Failed to fetch contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index][field] = value;
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
    if (success) setSuccess(false);
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await toast.promise(contactService.updateInfo(formData), {
        loading: 'Saving Settings...',
        success: 'Identity & Contact Updated',
        error: 'Update failed'
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
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <p className="text-soft-dark font-black uppercase tracking-widest text-xs">Loading Contact Settings...</p>
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Contact Control</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>Configure your reachability and social presence.</p>
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
          <AdminButton className="!px-12 !py-4 shadow-xl shadow-primary/20" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Syncing...</span>
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
        {/* Left Column: Basic & Contact */}
        <div className="xl:col-span-7 space-y-8">
          <AdminCard title="Identity & Messaging" subtitle="Manage your public-facing headers">
            <div className="space-y-8">
              <AdminInput 
                label="Section Headline" 
                placeholder="e.g. Let's discuss your Project"
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Lead Description</label>
                <textarea 
                  name="description" 
                  rows="5" 
                  className="input-picto !rounded-[24px] !p-6" 
                  placeholder="Tell your visitors why they should reach out..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Communication Channels" subtitle="Direct contact endpoints">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors"><Mail size={18} /></div>
                <AdminInput 
                  label="Business Email" 
                  placeholder="hello@yourbrand.com"
                  name="email" 
                  className="!pl-14 !py-4"
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors"><Phone size={18} /></div>
                <AdminInput 
                  label="Direct Line" 
                  placeholder="+1 (555) 000-0000"
                  name="phone" 
                  className="!pl-14 !py-4"
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="mt-8 relative group">
              <div className="absolute left-5 top-[46px] text-gray-300 group-focus-within:text-primary transition-colors"><MapPin size={18} /></div>
              <AdminInput 
                label="Physical/Studio Address" 
                placeholder="New York, NY 10001, USA"
                name="address" 
                className="!pl-14 !py-4"
                value={formData.address} 
                onChange={handleInputChange} 
              />
              <p className="mt-3 text-[10px] font-bold text-soft-dark italic opacity-50 px-2">
                This address will be displayed on your portfolio's contact card.
              </p>
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Social & Visibility */}
        <div className="xl:col-span-5 space-y-8">
          <AdminCard 
            title="Social Infrastructure" 
            subtitle="Connect your digital ecosystem"
            extra={
              <button 
                onClick={addSocialLink} 
                className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/10"
              >
                <Plus size={14} /> Add Profile
              </button>
            }
          >
            <div className="space-y-4">
              {formData.socialLinks.map((link, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative bg-gray-50/50 hover:bg-white p-6 rounded-[24px] border border-gray-100 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <AdminInput 
                      label="Platform Name" 
                      placeholder="e.g. LinkedIn, GitHub, X" 
                      value={link.platform} 
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} 
                    />
                    <AdminInput 
                      label="Profile URL" 
                      placeholder="https://..." 
                      value={link.url} 
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
                    />
                  </div>
                  <button 
                    onClick={() => removeSocialLink(index)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-soft-dark hover:text-red-500 hover:scale-110 border border-gray-100 rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
              {formData.socialLinks.length === 0 && (
                <div className="text-center py-12 px-6 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/30">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
                    <LinkIcon size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">No social connections established</p>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Visibility Controls" className="bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-6">
              <AdminToggle 
                label="Make Section Publicly Visible" 
                checked={formData.isVisible} 
                onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))} 
              />
              <div className="p-4 bg-white/60 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed text-heading/70">
                  Disabling visibility will hide the contact form and details from your portfolio while preserving your data.
                </p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
