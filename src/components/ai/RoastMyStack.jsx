"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Loader2, RotateCcw } from 'lucide-react';

const EXAMPLE_STACKS = ['PHP & jQuery', 'Python & Django', 'Ruby on Rails', 'WordPress', 'Angular & Java'];

export default function RoastMyStack() {
  const [stack, setStack] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRoasted, setHasRoasted] = useState(false);

  const roastIt = useCallback(async (inputStack) => {
    const target = inputStack || stack;
    if (!target.trim()) {
      setError('Enter your tech stack first!');
      return;
    }
    setError('');
    setRoast('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'roast',
          payload: `Roast this tech stack: "${target}"`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRoast(data.result);
      setHasRoasted(true);
    } catch {
      setError('Roast failed. The stack might be too legendary to roast! 😄');
    } finally {
      setIsLoading(false);
    }
  }, [stack]);

  const reset = () => {
    setStack('');
    setRoast('');
    setHasRoasted(false);
    setError('');
  };

  return (
    <section
      id="ai-roast"
      className="py-20 lg:py-[100px] px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0c0a06' }}
    >
      {/* Background fire glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 80%, rgba(245,158,11,0.1) 0%, transparent 60%)',
      }} />

      <div className="mx-auto w-full relative z-10" style={{ maxWidth: '700px' }}>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Flame size={13} className="text-amber-400" />
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em]">Just for Fun</span>
          </div>
          <h2 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight">
            Roast My Stack<span style={{ color: '#f59e0b' }}>🔥</span>
          </h2>
          <p className="text-white/40 text-base max-w-[420px] mx-auto leading-relaxed">
            Tell me your tech stack and I&apos;ll give it a playful roast — then show you why MERN is legendary.
          </p>
        </div>

        {/* Input Card */}
        <AnimatePresence mode="wait">
          {!hasRoasted ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <label className="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">
                Your Tech Stack
              </label>
              <input
                value={stack}
                onChange={e => { setStack(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && roastIt()}
                placeholder="e.g. PHP & jQuery, Angular & Java..."
                className="w-full bg-transparent text-white text-lg font-semibold outline-none placeholder:text-white/15 mb-5 pb-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              />

              {/* Examples */}
              <div className="flex flex-wrap gap-2 mb-6">
                {EXAMPLE_STACKS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => { setStack(ex); roastIt(ex); }}
                    className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.7)' }}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

              <button
                onClick={() => roastIt()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 12px 32px rgba(245,158,11,0.3)' }}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Flame size={18} />}
                {isLoading ? 'Heating up...' : 'Roast It!'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(245,158,11,0.25)' }}
            >
              {/* Stack badge */}
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}
              >
                <Flame size={18} className="text-amber-400" />
                <span className="text-amber-400/80 text-sm font-black uppercase tracking-widest">{stack}</span>
              </div>

              {/* Roast text */}
              <div
                className="px-6 py-8 text-base leading-[1.9]"
                style={{ background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.8)' }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ fontSize: '1.05rem' }}
                >
                  {roast}
                </motion.p>
              </div>

              {/* Reset */}
              <div
                className="px-6 py-4 flex justify-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs font-semibold uppercase tracking-widest transition-colors"
                >
                  <RotateCcw size={12} /> Try Another Stack
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
