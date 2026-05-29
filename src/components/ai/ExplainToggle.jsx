"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Users, Loader2, RefreshCw } from 'lucide-react';

export default function ExplainToggle({ project }) {
  const [mode, setMode] = useState(null); // null | 'simple' | 'dev'
  const [explanations, setExplanations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExplanations = useCallback(async () => {
    if (explanations || isLoading) return;
    setIsLoading(true);

    // Check sessionStorage cache
    const cacheKey = `ai_explain_${project._id || project.title}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setExplanations(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'explain',
          payload: `Project: "${project.title}". Description: "${project.shortDescription || project.description}". Tech: ${(project.techStack || []).join(', ')}.`,
        }),
      });
      const data = await res.json();
      const result = typeof data.result === 'string'
        ? JSON.parse(data.result)
        : data.result;
      setExplanations(result);
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      setExplanations({ simple: 'Could not load explanation.', dev: 'Could not load explanation.' });
    } finally {
      setIsLoading(false);
    }
  }, [project, explanations, isLoading]);

  const handleModeClick = (newMode) => {
    if (mode === newMode) {
      setMode(null);
      return;
    }
    setMode(newMode);
    if (!explanations) fetchExplanations();
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100/80">
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Explain:</span>
        <button
          onClick={() => handleModeClick('simple')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide transition-all"
          style={
            mode === 'simple'
              ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#d97706' }
              : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#9ca3af' }
          }
        >
          <Users size={9} /> Simple
        </button>
        <button
          onClick={() => handleModeClick('dev')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide transition-all"
          style={
            mode === 'dev'
              ? { background: 'rgba(153,41,251,0.12)', border: '1px solid rgba(153,41,251,0.3)', color: '#9929fb' }
              : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#9ca3af' }
          }
        >
          <Code2 size={9} /> Dev Mode
        </button>
        {isLoading && <Loader2 size={11} className="animate-spin text-purple-400" />}
      </div>

      <AnimatePresence>
        {mode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
              style={
                mode === 'simple'
                  ? { background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: '#92400e' }
                  : { background: 'rgba(153,41,251,0.06)', border: '1px solid rgba(153,41,251,0.15)', color: '#6b21a8' }
              }
            >
              {isLoading
                ? <span className="text-gray-400">Generating explanation...</span>
                : explanations?.[mode] || 'No explanation available.'
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
