"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Monitor, Globe, Smartphone, Palette, Zap, CheckCircle, X, UploadCloud, HelpCircle } from 'lucide-react';
import { AdminCard, AdminButton, AdminInput, AdminModal, AdminToggle } from '../components/AdminShared';
import serviceService from '../../services/serviceService';
import toast from 'react-hot-toast';

const ICON_OPTIONS = [
  { name: 'Monitor', icon: Monitor },
  { name: 'Globe', icon: Globe },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Palette', icon: Palette },
  { name: 'Zap', icon: Zap },
];

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // File Upload State
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Monitor',
    features: '',
    price: '',
    order: 0,
    isVisible: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    setIconFile(null);
    setPreviewUrl(null);
    if (service) {
      setIsEditing(true);
      setCurrentId(service._id);
      setFormData({
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || 'Monitor',
        features: service.features?.join(', ') || '',
        price: service.price || '',
        order: service.order || 0,
        isVisible: service.isVisible !== false
      });
      if (service.customIcon) {
        setPreviewUrl(getImageUrl(service.customIcon));
      }
    } else {
      setIsEditing(false);
      setFormData({
        title: '',
        description: '',
        icon: 'Monitor',
        features: '',
        price: '',
        order: services.length,
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
    setSaving(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('icon', formData.icon);
    data.append('price', formData.price);
    data.append('order', formData.order);
    data.append('isVisible', formData.isVisible);
    
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
    data.append('features', JSON.stringify(featuresArray));

    if (iconFile) {
      data.append('iconFile', iconFile);
    }

    try {
      const promise = isEditing 
        ? serviceService.update(currentId, data) 
        : serviceService.create(data);

      await toast.promise(promise, {
        loading: isEditing ? 'Reconfiguring Service...' : 'Establishing Service...',
        success: isEditing ? 'Configuration Updated' : 'Service Launched Successfully',
        error: (err) => err.response?.data?.message || 'Operation failed'
      });

      fetchServices();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await toast.promise(serviceService.delete(id), {
          loading: 'Decommissioning Service...',
          success: 'Service Removed from Matrix',
          error: 'Delete failed'
        });
        fetchServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-heading)' }}>Service Matrix</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-soft-dark)' }}>Configure and showcase your professional offerings.</p>
        </div>
        <AdminButton className="!px-10" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add New Service
        </AdminButton>
      </div>

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-soft-dark opacity-40 group-focus-within:text-primary" size={18} />
        <input 
          type="text" 
          placeholder="Search your services..." 
          className="input-picto !pl-12 !rounded-2xl shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 text-center font-black text-soft-dark animate-pulse uppercase tracking-[0.2em] text-xs">Loading Offerings...</div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-full py-20 text-center font-black text-soft-dark uppercase tracking-[0.2em] text-xs opacity-50">No services detected in the matrix</div>
          ) : filteredServices.map((service) => {
            const IconComponent = ICON_OPTIONS.find(o => o.name === service.icon)?.icon || Zap;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <AdminCard className="h-full flex flex-col group relative overflow-visible">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-[22px] bg-white border border-gray-100 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden p-3">
                      {service.customIcon ? (
                        <img src={getImageUrl(service.customIcon)} alt="" className="w-full h-full object-contain group-hover:invert transition-all" />
                      ) : (
                        <IconComponent size={32} className="group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(service)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-soft-dark hover:text-primary hover:bg-white hover:shadow-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(service._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-soft-dark hover:text-red-500 hover:bg-white hover:shadow-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-heading mb-4 leading-tight group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-body font-medium leading-relaxed mb-8 line-clamp-3 opacity-60">{service.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {service.features?.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-soft-dark">
                          <CheckCircle size={14} className="text-primary shrink-0" />
                          <span className="opacity-80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t flex justify-between items-end" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark mb-1.5 opacity-40">Artifact Price</p>
                      <p className="text-2xl font-black text-heading tracking-tight">{service.price || 'Dynamic'}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      service.isVisible !== false ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 border'
                    }`}>
                      {service.isVisible !== false ? 'Active' : 'Archived'}
                    </div>
                  </div>
                </AdminCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Modify Service Configuration' : 'Launch New Service'}
        footer={
          <>
            <AdminButton variant="ghost" onClick={handleCloseModal}>Cancel</AdminButton>
            <AdminButton className="!px-12" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Processing...</span>
                 </div>
              ) : isEditing ? 'Update Configuration' : 'Establish Service'}
            </AdminButton>
          </>
        }
      >
        <form className="space-y-10 pb-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminInput 
              label="Service Title" 
              placeholder="e.g. Full-Stack Mastery" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              required
            />
            <AdminInput 
              label="Starting Valuation (Price)" 
              placeholder="e.g. From $999" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Icon Architecture — Select Preset OR Upload Asset</label>
            
            {/* Custom SVG/PNG Upload */}
            <div className={`p-6 rounded-[24px] border-2 transition-all duration-300 ${iconFile || previewUrl ? 'bg-primary/5 border-primary/20' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-center gap-6">
                {previewUrl ? (
                  <div className="relative w-24 h-24 rounded-2xl border-2 border-white bg-white flex items-center justify-center p-4 shadow-xl">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setIconFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 group relative">
                    <div className="border-2 border-dashed border-gray-200 group-hover:border-primary group-hover:bg-white rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3">
                      <UploadCloud className="text-gray-300 group-hover:text-primary transition-colors" size={32} />
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">Upload PNG/SVG Asset</div>
                    </div>
                    <input
                      type="file"
                      accept=".svg, .png, .jpg, .jpeg, .webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIconFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                          toast.success('Service icon ready', {
                            icon: '✨',
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
                <div className="flex-1 space-y-2">
                   <p className="text-xs font-bold text-soft-dark opacity-70">Custom asset will override the preset icon. PNG and SVG are highly recommended for clarity.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {ICON_OPTIONS.map(option => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, icon: option.name }));
                    setIconFile(null);
                    setPreviewUrl(null);
                  }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    formData.icon === option.name && !iconFile && !previewUrl
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' 
                      : 'bg-gray-50 text-soft-dark hover:bg-gray-100 border border-gray-100'
                  }`}
                  title={option.name}
                >
                  <option.icon size={24} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-60">Service Narrative (Description)</label>
            <textarea 
              name="description" 
              rows="5" 
              className="input-picto !rounded-[24px] !p-6 shadow-sm" 
              placeholder="Detail your professional offering..."
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <AdminInput 
            label="Service Arsenal (Features - comma separated)" 
            placeholder="High-end UI, Backend Scaling, API Integration" 
            name="features" 
            value={formData.features} 
            onChange={handleInputChange} 
          />

          <div className="flex flex-wrap items-center gap-12 bg-gray-50 p-8 rounded-[24px] border border-gray-100">
            <AdminToggle 
              label="Publicly Active" 
              checked={formData.isVisible} 
              onChange={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))} 
            />
            <div className="flex items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark">Sequence Order:</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-24 input-picto !rounded-xl !py-2 shadow-sm text-center" />
            </div>
          </div>
        </form>
      </AdminModal>
    </motion.div>
  );
};

export default AdminServices;
