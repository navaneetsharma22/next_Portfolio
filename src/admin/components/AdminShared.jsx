"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AdminCard = ({ children, className = '', title, subtitle, extra, floating = false }) => (
  <motion.div 
    whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.08)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className={`bg-white/80 backdrop-blur-[20px] rounded-[36px] border border-white/60 overflow-hidden transition-all duration-700 ${floating ? 'floating' : ''} ${className}`}
    style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
  >
    {(title || subtitle || extra) && (
      <div className="px-10 py-8 border-b border-black/5 flex justify-between items-center bg-white/20 backdrop-blur-md">
        <div>
          {title && <h3 className="text-xl font-black tracking-tight leading-none mb-2" style={{ color: 'var(--color-heading)' }}>{title}</h3>}
          {subtitle && <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 leading-none" style={{ color: 'var(--color-soft-dark)' }}>{subtitle}</p>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    )}
    <div className="p-10">
      {children}
    </div>
  </motion.div>
);

export const AdminButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: "bg-primary text-white shadow-[0_20px_40px_-10px_rgba(153,41,251,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(153,41,251,0.6)] rounded-[30px] py-5 px-12 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 active:scale-95",
    outline: "bg-white/40 backdrop-blur-md border border-black/5 text-heading hover:bg-heading hover:text-white rounded-[30px] py-5 px-12 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 active:scale-95",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-10 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 active:scale-95",
    ghost: "text-soft-dark hover:bg-black/5 px-10 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.25em] transition-all active:scale-95",
  };

  return (
    <button className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const AdminInput = ({ label, error, ...props }) => (
  <div className="space-y-4">
    {label && (
      <label className="block text-[11px] font-black uppercase tracking-[0.3em] pl-4 opacity-40" style={{ color: 'var(--color-soft-dark)' }}>
        {label}
      </label>
    )}
    <input 
      className={`w-full bg-white/50 backdrop-blur-xl border border-white focus:border-primary/40 p-6 rounded-[32px] text-lg font-medium transition-all focus:ring-[15px] focus:ring-primary/5 outline-none shadow-sm ${error ? 'border-red-500 ring-[15px] ring-red-500/5' : ''}`}
      {...props}
    />
    {error && <p className="text-[10px] font-bold text-red-500 mt-2 pl-6 uppercase tracking-widest">{error}</p>}
  </div>
);

export const AdminModal = ({ isOpen, onClose, title, children, footer, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-heading/40 backdrop-blur-[30px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 60 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`relative w-full max-w-4xl bg-white/80 backdrop-blur-[40px] rounded-[60px] overflow-hidden shadow-[0_50px_150px_-30px_rgba(0,0,0,0.4)] border border-white/60 ${className}`}
      >
        <div className="px-16 py-12 border-b border-black/5 flex justify-between items-center bg-white/30">
          <h3 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--color-heading)' }}>{title}</h3>
          <button onClick={onClose} className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center hover:bg-heading hover:text-white transition-all duration-500">
            <span className="text-3xl font-light leading-none">&times;</span>
          </button>
        </div>
        <div className="px-16 py-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="px-16 py-10 border-t border-black/5 bg-white/40 backdrop-blur-2xl flex justify-end gap-6">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const AdminToggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-8 cursor-pointer group">
    <div className="relative">
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked} 
        onChange={onChange}
      />
      <div className={`w-20 h-10 rounded-full transition-all duration-700 border-2 ${checked ? 'bg-primary border-primary' : 'bg-white/40 backdrop-blur-md border-black/10'}`} />
      <div className={`absolute top-2 left-2 w-6 h-6 rounded-full transition-all duration-700 shadow-xl ${checked ? 'translate-x-10 bg-white' : 'bg-black/10'}`} />
    </div>
    {label && <span className="text-[12px] font-black uppercase tracking-[0.3em] text-heading opacity-40 group-hover:opacity-100 transition-all">{label}</span>}
  </label>
);

export const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div 
    className="bg-white/80 backdrop-blur-[30px] rounded-[42px] p-8 border border-white/60 shadow-[0_15px_45px_rgba(0,0,0,0.02)] group transition-all duration-700 relative overflow-hidden"
  >
    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: color, opacity: 0.2 }} />
    
    <div className="flex items-center gap-6">
      <div 
        className="w-16 h-16 min-w-[64px] rounded-[22px] flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-lg"
        style={{ 
          backgroundColor: color, 
          color: 'white',
          boxShadow: `0 15px 30px ${color}40`
        }}
      >
        <Icon size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-40 mb-1 truncate">{title}</p>
        <h3 className="text-3xl font-black tracking-tight leading-none truncate" style={{ color: 'var(--color-heading)' }}>{value}</h3>
      </div>
      {trend !== undefined && (
        <div className={`flex flex-col items-end gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-[10px] font-black uppercase tracking-widest">{trend >= 0 ? '+' : ''}{trend}%</span>
          <div className="w-8 h-1 rounded-full bg-current opacity-20" />
        </div>
      )}
    </div>
  </div>
);
