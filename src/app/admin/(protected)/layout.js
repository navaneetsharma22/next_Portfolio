"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CursorProvider } from '@/context/CursorContext';
import AdminSidebar from '@/admin/components/AdminSidebar';
import MouseFollower from '@/components/ui/MouseFollower';

function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" 
        />
        <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">Initializing Portal</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-[#f4f7f9]">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .aurora-blur {
            position: fixed;
            border-radius: 50%;
            filter: blur(120px);
            z-index: 0;
            pointer-events: none;
            opacity: 0.15;
            animation: aurora-pulse 10s infinite alternate;
          }
          @keyframes aurora-pulse {
            from { transform: scale(1) translate(0, 0); }
            to { transform: scale(1.2) translate(50px, 50px); }
          }
        `}
      </style>

      <div className="aurora-blur w-[60%] h-[60%] bg-primary top-[-10%] right-[-10%]"></div>
      <div className="aurora-blur w-[50%] h-[50%] bg-blue-500 bottom-[-10%] left-[-10%]" style={{ animationDelay: '-2s' }}></div>
      <div className="aurora-blur w-[40%] h-[40%] bg-pink-500 top-[20%] left-[20%]" style={{ animationDelay: '-5s' }}></div>
      <div className="aurora-blur w-[30%] h-[30%] bg-purple-500 bottom-[20%] right-[20%]" style={{ animationDelay: '-7s' }}></div>
      
      <MouseFollower />
      <AdminSidebar />
      
      <main className="flex-grow h-full min-h-0 overflow-y-auto relative z-10 no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mx-auto px-8 md:px-16 lg:px-24 py-16"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function ProtectedAdminLayout({ children }) {
  return (
    <AuthProvider>
      <CursorProvider>
        <AdminGuard>{children}</AdminGuard>
      </CursorProvider>
    </AuthProvider>
  );
}
