"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquareText,
  Mail,
  LogOut,
  Menu,
  X,
  Briefcase,
  FileText,
  Wrench,
  LayoutDashboard,
  FolderKanban,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Projects', icon: FolderKanban, path: '/admin/projects' },
  { name: 'Experience', icon: Briefcase, path: '/admin/experience' },
  { name: 'Skills', icon: Sparkles, path: '/admin/skills' },
  { name: 'Resume', icon: FileText, path: '/admin/resume' },
  { path: '/admin/messages', name: 'Messages', icon: MessageSquareText },
  { path: '/admin/contact-info', name: 'Contact Info', icon: Mail },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div 
      className={`flex flex-col h-full bg-white/40 backdrop-blur-[50px] border-r border-white/60 relative overflow-hidden transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${isCollapsed ? 'w-[120px]' : 'w-[320px]'}`}
    >
      {/* Brand */}
      <div className={`h-32 flex items-center border-b border-black/5 bg-white/20 transition-all duration-700 ${isCollapsed ? 'px-0 justify-center' : 'px-12'}`}>
        <div className="flex items-center gap-6 group cursor-pointer" onClick={() => !isCollapsed && router.push('/admin/dashboard')}>
          <div className="w-14 h-14 rounded-[24px] bg-primary flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-primary/40 transition-all duration-500">
            N
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-black text-3xl block leading-none tracking-tighter" style={{ color: 'var(--color-heading)' }}>
                Portf<span className="text-primary">.</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-soft-dark opacity-30 mt-1 block">
                Core Control
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Desktop) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-36 -right-3 w-8 h-8 bg-heading text-white rounded-full flex items-center justify-center shadow-xl z-20 hover:scale-110 transition-all active:scale-95 hidden lg:flex"
      >
        {isCollapsed ? <Sparkles size={14} /> : <X size={14} />}
      </button>

      {/* User Info */}
      <div className={`py-10 transition-all duration-700 ${isCollapsed ? 'px-4' : 'px-10'}`}>
        <div className={`rounded-[32px] bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-gray-100/20 flex items-center group cursor-default overflow-hidden transition-all duration-700 ${isCollapsed ? 'p-4 justify-center' : 'p-6 gap-5'}`}>
          <div className="w-14 h-14 min-w-[56px] rounded-full bg-heading p-0.5 shadow-lg group-hover:rotate-12 transition-all duration-700">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-heading text-xl">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="font-black text-lg truncate tracking-tight" style={{ color: 'var(--color-heading)' }}>{user?.name || 'Admin User'}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">System Overlord</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav className={`flex-1 space-y-3 overflow-y-auto no-scrollbar transition-all duration-700 ${isCollapsed ? 'px-4' : 'px-8'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.4em] text-soft-dark mb-6 opacity-30 transition-all ${isCollapsed ? 'text-center' : 'px-5'}`}>
          {isCollapsed ? 'HUB' : 'Neural Hub'}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center rounded-[28px] transition-all duration-700 font-bold group relative ${
                isActive 
                  ? 'bg-heading text-white shadow-2xl shadow-heading/20' 
                  : 'text-soft-dark hover:bg-white/80 hover:text-heading hover:shadow-xl hover:shadow-gray-200/40'
              } ${isCollapsed ? 'p-5 justify-center' : 'px-6 py-5 gap-6'}`}
            >
              <Icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-120'} transition-transform duration-700`} />
              {!isCollapsed && (
                <span className="text-[13px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100">
                  {item.name}
                </span>
              )}
              {isActive && (
                <div className={`absolute rounded-full bg-primary shadow-[0_0_15px_var(--color-primary)] ${isCollapsed ? 'bottom-2 w-1.5 h-1.5' : 'right-4 w-2 h-2'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`p-10 transition-all duration-700 ${isCollapsed ? 'px-4' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-[28px] bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-700 font-black text-[11px] uppercase tracking-[0.25em] shadow-sm hover:shadow-red-500/40 group active:scale-95 ${isCollapsed ? 'p-5 justify-center' : 'gap-5 px-8 py-5 w-full'}`}
        >
          <LogOut size={20} className="group-hover:-translate-x-2 transition-transform duration-700" />
          {!isCollapsed && <span>Exit System</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-heading)' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
