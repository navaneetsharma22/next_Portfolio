"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Briefcase, GraduationCap, MapPin, UploadCloud } from 'lucide-react';
import { AdminCard, AdminButton, AdminInput, AdminModal } from '../components/AdminShared';
import experienceService from '../../services/experienceService';
import toast from 'react-hot-toast';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    category: 'Job',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await experienceService.getExperiences();
      setExperiences(res.data);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp = null) => {
    setLogoFile(null);
    setPreviewUrl(null);
    if (exp) {
      setIsEditing(true);
      setCurrentId(exp._id);
      setFormData({
        company: exp.company,
        role: exp.role,
        category: exp.category || 'Job',
        location: exp.location || '',
        startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
        endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
        isCurrent: exp.isCurrent || false,
        description: exp.description || '',
        order: exp.order || 0
      });
      if (exp.companyLogo) setPreviewUrl(exp.companyLogo);
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        company: '',
        role: '',
        category: 'Job',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        order: experiences.length
      });
    }
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (logoFile) {
        data.append('companyLogo', logoFile);
      }

      const promise = isEditing 
        ? experienceService.updateExperience(currentId, data) 
        : experienceService.createExperience(data);

      await toast.promise(promise, {
        loading: isEditing ? 'Updating Milestone...' : 'Adding Milestone...',
        success: isEditing ? 'Journey Updated' : 'New Milestone Added',
        error: (err) => err.response?.data?.message || 'Operation failed'
      });

      await fetchExperiences();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await toast.promise(experienceService.deleteExperience(id), {
          loading: 'Removing Milestone...',
          success: 'Milestone Deleted',
          error: 'Delete failed'
        });
        await fetchExperiences();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Experience</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>
            Manage your professional journey. ({experiences.length} total)
          </p>
        </div>
        <AdminButton onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Experience
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center font-bold text-soft-dark animate-pulse uppercase tracking-widest">
            Loading...
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-20 text-center font-bold text-soft-dark uppercase tracking-widest">
            No experiences found.
          </div>
        ) : (
          experiences.map((exp) => (
            <AdminCard key={exp._id} className="group">
              <div className="flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden p-2 shadow-sm">
                    {exp.companyLogo ? (
                      <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-primary opacity-50">
                        {exp.category === 'Job' ? <Briefcase size={28} /> : <GraduationCap size={28} />}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-heading">{exp.role}</h3>
                    <p className="text-primary font-bold text-lg mb-2">{exp.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-soft-dark uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg">
                        <Calendar size={14} />
                        {new Date(exp.startDate).toLocaleDateString()} — {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                      <span className={`px-3 py-1 rounded-lg border ${
                        exp.category === 'Job' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {exp.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(exp)} className="p-2 text-soft-dark hover:text-primary transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(exp._id)} className="p-2 text-soft-dark hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-soft-dark leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Experience' : 'Add Experience'}
        footer={
          <>
            <AdminButton variant="ghost" onClick={handleCloseModal}>Cancel</AdminButton>
            <AdminButton onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Experience'}
            </AdminButton>
          </>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Logo Upload Section */}
          <div className="p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-2 shadow-sm relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-gray-300">
                    <UploadCloud size={32} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setLogoFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                      toast.success('Logo selected', {
                        icon: '🏢',
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
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-heading mb-1">Company Logo</h4>
                <p className="text-xs text-soft-dark font-medium max-w-[200px]">
                  Upload logo in SVG, PNG, or JPEG format. Click the box to browse.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput label="Company" name="company" value={formData.company} onChange={handleInputChange} required />
            <AdminInput label="Role" name="role" value={formData.role} onChange={handleInputChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-soft-dark">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="input-picto">
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <AdminInput label="Location" name="location" value={formData.location} onChange={handleInputChange} />
            <AdminInput label="Order" name="order" type="number" value={formData.order} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <AdminInput label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
            <AdminInput label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} disabled={formData.isCurrent} />
            <div className="flex items-center gap-2 pb-4">
              <input type="checkbox" name="isCurrent" id="isCurrent" checked={formData.isCurrent} onChange={handleInputChange} className="w-5 h-5 accent-primary" />
              <label htmlFor="isCurrent" className="text-xs font-bold uppercase tracking-widest text-soft-dark cursor-pointer">I currently work here</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-soft-dark">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="input-picto" required placeholder="Describe your responsibilities and achievements..."></textarea>
          </div>
        </form>
      </AdminModal>
    </motion.div>
  );
};

export default AdminExperience;
