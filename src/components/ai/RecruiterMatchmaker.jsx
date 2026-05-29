"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Zap, CheckCircle2, Loader2 } from 'lucide-react';

export default function RecruiterMatchmaker() {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = useCallback(async () => {
    if (!jd.trim() || jd.trim().length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'recruiter',
          payload: `Analyze this job description and tell me how well Navaneet Sharma fits:\n\n${jd}`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(typeof data.result === 'string' ? JSON.parse(data.result) : data.result);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [jd]);

  const scoreColor = result
    ? result.matchScore >= 80
      ? '#22c55e'
      : result.matchScore >= 60
      ? '#f59e0b'
      : '#ef4444'
    : '#9929fb';

  return (
    <section
      id="ai-match"
      className="py-20 lg:py-[100px] px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0814' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(153,41,251,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="mx-auto w-full relative z-10" style={{ maxWidth: '900px' }}>

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(153,41,251,0.12)', border: '1px solid rgba(153,41,251,0.25)' }}>
            <Briefcase size={13} className="text-purple-400" />
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.25em]">AI Recruiter Tool</span>
          </div>
          <h2 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight">
            Am I the Right Fit<span style={{ color: '#9929fb' }}>?</span>
          </h2>
          <p className="text-white/40 text-base max-w-[500px] mx-auto leading-relaxed">
            Paste any job description below — AI will instantly analyze how well my skills match your requirements.
          </p>
        </div>

        {/* Input Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <label className="block text-white/50 text-[10px] font-black uppercase tracking-[0.25em] mb-3">
            Paste Job Description
          </label>
          <textarea
            value={jd}
            onChange={e => { setJd(e.target.value); setError(''); }}
            placeholder="e.g. We're looking for a Full Stack Developer with 2+ years of React experience, Node.js backend skills, and experience with MongoDB or PostgreSQL..."
            rows={6}
            className="w-full bg-transparent text-white/70 text-sm leading-relaxed outline-none resize-none placeholder:text-white/20"
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={analyze}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #9929fb, #6d1fc4)', boxShadow: '0 8px 24px rgba(153,41,251,0.35)' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {isLoading ? 'Analyzing...' : 'Analyze Match'}
            </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                {/* Match Score Ring */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl"
                    style={{
                      background: `conic-gradient(${scoreColor} ${result.matchScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      boxShadow: `0 0 40px ${scoreColor}30`,
                    }}
                  >
                    <div className="w-18 h-18 rounded-full flex items-center justify-center" style={{ background: '#0a0814', width: '72px', height: '72px' }}>
                      <span style={{ color: scoreColor, fontSize: '24px' }}>{result.matchScore}%</span>
                    </div>
                  </div>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Match Score</span>
                </div>

                {/* Summary */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Match Analysis</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{result.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {(result.matchingSKills || result.matchingSkills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full"
                        style={{ background: 'rgba(153,41,251,0.15)', border: '1px solid rgba(153,41,251,0.3)', color: '#c084fc' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {result.keyStrengths?.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">Key Strengths</p>
                  <div className="space-y-2">
                    {result.keyStrengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                        <span className="text-white/60 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {result.recommendation && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(153,41,251,0.08)', border: '1px solid rgba(153,41,251,0.2)' }}>
                  <p className="text-purple-300 text-sm font-medium leading-relaxed">💡 {result.recommendation}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
