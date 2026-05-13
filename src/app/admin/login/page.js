"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const validate = () => {
    const newErrors = {};
    if (!credentials.email) {
      newErrors.email = 'Email address required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid business email';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Security password required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError('');
    
    try {
      await login(credentials.email, credentials.password);
      router.push('/admin/dashboard');
    } catch (err) {
      setGeneralError('Invalid authentication credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050816] selection:bg-purple-500/30 selection:text-white relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Stable Background Aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050816] via-[#0B1120] to-[#050816]" />
      
      {/* Subtle Ambient Glow (Static) */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-[580px]">
        {/* Top Branding/Status Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">System Secure</span>
          </div>
        </div>

        {/* Enterprise Card */}
        <div className="bg-[#111827]/75 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500 to-blue-600 shadow-xl shadow-purple-900/20">
              <ShieldCheck size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Admin Portal</h1>
            <p className="text-sm text-[#94A3B8] font-medium">Access your enterprise dashboard</p>
          </div>

          <AnimatePresence>
            {generalError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-3"
              >
                <AlertCircle size={18} className="shrink-0" />
                {generalError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#94A3B8] ml-1">
                Business Email
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-purple-500/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-medium`}
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-[11px] font-bold text-red-400/80 ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  Security Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-5 pl-14 pr-14 text-white outline-none focus:border-purple-500/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-medium`}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-bold text-red-400/80 ml-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-white font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initialize Access
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Details */}
          <div className="mt-12 pt-10 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/20">
                <CheckCircle2 size={12} className="text-emerald-500/50" />
                End-to-End Encrypted
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/20">
                &copy; 2026 Enterprise Hub v2.0
              </div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-10 text-xs font-semibold text-white/30">
          Need assistance? <button className="text-purple-400 hover:text-purple-300 transition-colors">Contact security center</button>
        </p>
      </div>
    </div>
  );
}

// Login page has its OWN AuthProvider since it's outside the admin layout
export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
