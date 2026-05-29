"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, CheckCheck, Loader2, Wand2 } from 'lucide-react';

export default function CoverLetterGenerator() {
  const [company, setCompany] = useState('');
  const [about, setAbout] = useState('');
  const [letter, setLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    if (!company.trim() || !about.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    setLetter('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'coverletter',
          payload: `Company Name: "${company}". What they are building / their context: "${about}".`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLetter(data.result);
    } catch {
      setError('Failed to generate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [company, about]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [letter]);

  return (
    <section
      id="ai-cover"
      className="py-20 lg:py-[100px] px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: '#060410' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(153,41,251,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 50%)',
      }} />

      <div className="mx-auto w-full relative z-10" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <FileText size={13} className="text-cyan-400" />
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em]">AI Cover Letter</span>
          </div>
          <h2 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight">
            Get a Personal Letter<span style={{ color: '#06b6d4' }}>.</span>
          </h2>
          <p className="text-white/40 text-base max-w-[460px] mx-auto leading-relaxed">
            Tell me about your company and I&apos;ll craft a personalized cover letter — ready to use instantly.
          </p>
        </div>

        {/* Inputs */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6 space-y-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <label className="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Company Name</label>
            <input
              value={company}
              onChange={e => { setCompany(e.target.value); setError(''); }}
              placeholder="e.g. Google, Startup XYZ, Freelance Client..."
              className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20 pb-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">What are they building?</label>
            <textarea
              value={about}
              onChange={e => { setAbout(e.target.value); setError(''); }}
              placeholder="e.g. A fintech SaaS platform for SMBs, a React Native app, an e-commerce marketplace..."
              rows={3}
              className="w-full bg-transparent text-white/80 text-sm outline-none resize-none placeholder:text-white/20"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={generate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 8px 24px rgba(6,182,212,0.3)' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {isLoading ? 'Writing...' : 'Generate Letter'}
            </button>
          </div>
        </div>

        {/* Output */}
        <AnimatePresence>
          {letter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ background: 'rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-cyan-400" />
                  <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Your Cover Letter</span>
                </div>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(6,182,212,0.15)', color: copied ? '#4ade80' : '#22d3ee', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(6,182,212,0.3)'}` }}
                >
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div
                className="px-6 py-6 text-sm leading-[1.9] whitespace-pre-wrap"
                style={{ background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.75)' }}
              >
                {letter}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
