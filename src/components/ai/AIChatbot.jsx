"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Command, ChevronDown, MessageCircle, Briefcase, Loader2, CheckCircle2, FileText, Copy, CheckCheck, Wand2, Flame, RotateCcw, Languages, Calculator, BrainCircuit, Sparkles } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What tech stack does Navaneet know?",
  "Is Navaneet available for freelance?",
  "Tell me about his best projects",
];

const ROAST_EXAMPLES = ['PHP & jQuery', 'Python & Django', 'WordPress'];
const TRANSLATE_LANGUAGES = ['Spanish', 'French', 'Hindi', 'Japanese', 'German'];
const TOPIC_EXAMPLES = ['Tailwind vs Vanilla CSS', 'MongoDB vs PostgreSQL', 'React vs Angular', 'SSR vs CSR'];

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-purple-400"
        style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`@keyframes typing-dot{0%,80%,100%{opacity:.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}`}</style>
  </div>
);

export default function AIChatbot({ initialData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat State
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Navaneet's AI assistant. Ask me anything about his skills, projects, or availability! 👋" },
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Matcher State
  const [jd, setJd] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState('');

  // Letter State
  const [company, setCompany] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [letter, setLetter] = useState('');
  const [isLetterLoading, setIsLetterLoading] = useState(false);
  const [letterError, setLetterError] = useState('');
  const [copied, setCopied] = useState(false);

  // Roast State
  const [stack, setStack] = useState('');
  const [roast, setRoast] = useState('');
  const [isRoastLoading, setIsRoastLoading] = useState(false);
  const [roastError, setRoastError] = useState('');

  // Translate State
  const [language, setLanguage] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);

  // Estimator State
  const [projectSpec, setProjectSpec] = useState('');
  const [estimate, setEstimate] = useState('');
  const [isEstimateLoading, setIsEstimateLoading] = useState(false);

  // Brain State
  const [topic, setTopic] = useState('');
  const [opinion, setOpinion] = useState('');
  const [isOpinionLoading, setIsOpinionLoading] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, activeTab]);

  // Handle generic AI call
  const callAI = async (feature, payload, setLoading, setResult, setError) => {
    setLoading(true);
    if (setError) setError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, payload, portfolioData: initialData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(feature === 'recruiter' ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) : data.result);
    } catch (err) {
      if (setError) setError(err.message || 'Action failed. Please try again.');
      else setResult('Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Specific Handlers
  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg || isChatLoading) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setIsChatLoading(true);
    callAI('chatbot', msg, setIsChatLoading, (res) => {
      setMessages(prev => [...prev, { role: 'ai', text: res }]);
    });
  };

  const analyzeJob = () => {
    if (!jd.trim() || jd.trim().length < 50) return setMatchError('Please paste a complete job description.');
    setMatchResult(null);
    callAI('recruiter', `Analyze this job description and tell me how well Navaneet Sharma fits:\n\n${jd}`, setIsMatchLoading, setMatchResult, setMatchError);
  };

  const generateLetter = () => {
    if (!company.trim() || !aboutCompany.trim()) return setLetterError('Please fill in both fields.');
    setLetter('');
    callAI('coverletter', `Company Name: "${company}". What they are building / their context: "${aboutCompany}".`, setIsLetterLoading, setLetter, setLetterError);
  };

  const generateRoast = (inputStack) => {
    const target = inputStack || stack;
    if (!target.trim()) return setRoastError('Enter a tech stack first!');
    setRoast('');
    callAI('roast', `Roast this tech stack: "${target}"`, setIsRoastLoading, setRoast, setRoastError);
  };

  const generateTranslation = (lang) => {
    setLanguage(lang);
    setTranslation('');
    callAI('translate', lang, setIsTranslationLoading, setTranslation);
  };

  const generateEstimate = () => {
    if (!projectSpec.trim()) return;
    setEstimate('');
    callAI('estimate', projectSpec, setIsEstimateLoading, setEstimate);
  };

  const generateOpinion = (inputTopic) => {
    const target = inputTopic || topic;
    if (!target.trim()) return;
    setTopic(target);
    setOpinion('');
    callAI('brain', target, setIsOpinionLoading, setOpinion);
  };

  const scoreColor = matchResult
    ? matchResult.matchScore >= 80 ? '#22c55e' : matchResult.matchScore >= 60 ? '#f59e0b' : '#ef4444'
    : '#9929fb';

  const TABS = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'matcher', icon: Briefcase, label: 'Match' },
    { id: 'letter', icon: FileText, label: 'Letter' },
    { id: 'estimate', icon: Calculator, label: 'Estimate' },
    { id: 'translate', icon: Languages, label: 'Translate' },
    { id: 'brain', icon: BrainCircuit, label: 'Tech Brain' },
    { id: 'roast', icon: Flame, label: 'Roast' },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              className="absolute bottom-full mb-2 left-1/2 px-2.5 py-1 rounded-md text-[8px] font-black text-white cursor-pointer shadow-lg tracking-widest uppercase whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #9929fb 0%, #6d1fc4 100%)',
                boxShadow: '0 4px 12px rgba(153,41,251,0.3)',
              }}
              onClick={() => setIsOpen(true)}
            >
              Ask Anything
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(v => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #9929fb 0%, #6d1fc4 100%)', boxShadow: '0 8px 32px rgba(153,41,251,0.45)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={22} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Command size={22} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && <span className="absolute inset-0 rounded-full animate-ping pointer-events-none" style={{ background: 'rgba(153,41,251,0.25)' }} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 w-full h-[85dvh] rounded-t-3xl sm:bottom-40 sm:right-6 sm:w-[420px] sm:h-[560px] sm:rounded-2xl"
            onWheel={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(12,10,20,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(153,41,251,0.25)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {/* Header & Tabs */}
            <div className="flex flex-col shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9929fb, #6d1fc4)' }}>
                    <Command size={16} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0c0a14]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5">Navaneet&apos;s AI</p>
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Always Online</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="ml-auto w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <X size={14} />
                </button>
              </div>

              <div 
                className="flex px-2 pb-2 gap-1 overflow-x-auto scrollbar-none" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onWheel={(e) => {
                  if (e.currentTarget) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex shrink-0 items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                    style={activeTab === tab.id ? { background: 'rgba(255,255,255,0.08)', color: 'white' } : { color: 'rgba(255,255,255,0.4)' }}
                  >
                    <tab.icon size={13} /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                
                {/* ── CHAT TAB ── */}
                {activeTab === 'chat' && (
                  <motion.div key="chat" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed" style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #9929fb, #6d1fc4)', color: 'white', borderRadius: '16px 16px 4px 16px' } : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                      {isChatLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-white/6 border border-white/6 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px' }}><TypingIndicator /></div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    {messages.length <= 2 && (
                      <div className="px-4 pb-2 flex gap-2 flex-wrap">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                          <button key={i} onClick={() => sendMessage(q)} className="text-[10px] px-3 py-1.5 rounded-full font-medium transition-all" style={{ background: 'rgba(153,41,251,0.15)', border: '1px solid rgba(153,41,251,0.3)', color: 'rgba(153,41,251,0.9)' }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="shrink-0 px-4 py-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder="Ask about Navaneet..." className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25" />
                      <button onClick={() => sendMessage()} disabled={!input.trim() || isChatLoading} className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30" style={{ background: 'linear-gradient(135deg, #9929fb, #6d1fc4)' }}>
                        <Send size={13} className="text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── MATCHER TAB ── */}
                {activeTab === 'matcher' && (
                  <motion.div key="matcher" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!matchResult ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">Paste a job description below, and I&apos;ll analyze how well Navaneet&apos;s skills match the requirements.</p>
                        <textarea value={jd} onChange={e => { setJd(e.target.value); setMatchError(''); }} placeholder="e.g. Looking for a Full Stack Dev with React and Node.js..." className="flex-1 w-full rounded-xl p-4 bg-black/40 text-white/80 text-sm outline-none resize-none placeholder:text-white/20 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                        {matchError && <p className="text-red-400 text-xs mb-3">{matchError}</p>}
                        <button onClick={analyzeJob} disabled={isMatchLoading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #9929fb, #6d1fc4)' }}>
                          {isMatchLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          {isMatchLoading ? 'Analyzing...' : 'Analyze Match'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 mb-5 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0" style={{ background: `conic-gradient(${scoreColor} ${matchResult.matchScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`, boxShadow: `0 0 20px ${scoreColor}30` }}>
                            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#0c0a14]"><span style={{ color: scoreColor }}>{matchResult.matchScore}%</span></div>
                          </div>
                          <div><h3 className="text-white font-bold text-sm">Match Analysis</h3><p className="text-white/50 text-xs mt-1 leading-relaxed">{matchResult.summary}</p></div>
                        </div>
                        <div className="mb-5">
                          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Matching Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(matchResult.matchingSKills || matchResult.matchingSkills || []).map((skill, i) => (
                              <span key={i} className="px-2 py-1 text-[9px] font-bold uppercase tracking-wide rounded-md" style={{ background: 'rgba(153,41,251,0.15)', border: '1px solid rgba(153,41,251,0.3)', color: '#c084fc' }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                        {matchResult.keyStrengths?.length > 0 && (
                          <div className="mb-5 flex-1">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Key Strengths</p>
                            <div className="space-y-1.5">
                              {matchResult.keyStrengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-1.5"><CheckCircle2 size={12} className="text-green-400 shrink-0 mt-0.5" /><span className="text-white/60 text-xs leading-relaxed">{s}</span></div>
                              ))}
                            </div>
                          </div>
                        )}
                        <button onClick={() => { setMatchResult(null); setJd(''); }} className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>Analyze Another Job</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── LETTER TAB ── */}
                {activeTab === 'letter' && (
                  <motion.div key="letter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!letter ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-5 leading-relaxed">Tell me about your company and I&apos;ll craft a personalized cover letter instantly.</p>
                        <div className="space-y-5 mb-5">
                          <div>
                            <label className="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Company Name</label>
                            <input value={company} onChange={e => { setCompany(e.target.value); setLetterError(''); }} placeholder="e.g. Startup XYZ" className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                          <div>
                            <label className="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">What are you building?</label>
                            <textarea value={aboutCompany} onChange={e => { setAboutCompany(e.target.value); setLetterError(''); }} placeholder="e.g. A fintech SaaS platform..." rows={4} className="w-full bg-transparent text-white/80 text-sm outline-none resize-none placeholder:text-white/20 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        </div>
                        {letterError && <p className="text-red-400 text-xs mb-3">{letterError}</p>}
                        <button onClick={generateLetter} disabled={isLetterLoading} className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                          {isLetterLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                          {isLetterLoading ? 'Writing...' : 'Generate Letter'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Your Cover Letter</span>
                          <button
                            onClick={() => { navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(6,182,212,0.15)', color: copied ? '#4ade80' : '#22d3ee' }}
                          >
                            {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="flex-1 p-4 rounded-xl text-xs leading-[1.8] whitespace-pre-wrap overflow-y-auto mb-4 scrollbar-thin" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.75)' }}>
                          {letter}
                        </div>
                        <button onClick={() => { setLetter(''); setCompany(''); setAboutCompany(''); }} className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>Create Another Letter</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── ESTIMATE TAB ── */}
                {activeTab === 'estimate' && (
                  <motion.div key="estimate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!estimate ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-5 leading-relaxed">Tell me what you want to build. I&apos;ll give you a rough timeline and tech stack proposal from Navaneet.</p>
                        <textarea value={projectSpec} onChange={e => setProjectSpec(e.target.value)} placeholder="e.g. A 5-page e-commerce site with a payment gateway and admin dashboard..." rows={7} className="flex-1 w-full bg-transparent text-white/80 text-sm outline-none resize-none placeholder:text-white/20 pb-2 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                        <button onClick={generateEstimate} disabled={isEstimateLoading || !projectSpec.trim()} className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          {isEstimateLoading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                          {isEstimateLoading ? 'Estimating...' : 'Get Estimate'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.12)' }}>
                          <Calculator size={16} className="text-emerald-400 shrink-0" />
                          <span className="text-emerald-400/80 text-xs font-black uppercase tracking-widest">Project Proposal</span>
                        </div>
                        <div className="flex-1 p-4 rounded-xl text-sm leading-[1.8] whitespace-pre-wrap overflow-y-auto mb-4 scrollbar-thin" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.85)' }}>
                          {estimate}
                        </div>
                        <button onClick={() => { setEstimate(''); setProjectSpec(''); }} className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>Estimate Another Project</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── TRANSLATE TAB ── */}
                {activeTab === 'translate' && (
                  <motion.div key="translate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!translation ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-5 leading-relaxed">Select a language to see Navaneet&apos;s portfolio summary translated instantly.</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {TRANSLATE_LANGUAGES.map((lang) => (
                            <button key={lang} onClick={() => generateTranslation(lang)} className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              {lang}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input value={language} onChange={e => setLanguage(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateTranslation(language)} placeholder="Or type a language..." className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                          <button onClick={() => generateTranslation(language)} disabled={!language.trim() || isTranslationLoading} className="px-4 py-2 rounded-lg font-bold text-xs text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                            {isTranslationLoading ? <Loader2 size={14} className="animate-spin" /> : 'Translate'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', borderBottom: '1px solid rgba(59,130,246,0.12)' }}>
                          <Languages size={16} className="text-blue-400 shrink-0" />
                          <span className="text-blue-400/80 text-xs font-black uppercase tracking-widest break-all">Summary in {language}</span>
                        </div>
                        <div className="flex-1 p-4 rounded-xl text-sm leading-[1.8] overflow-y-auto mb-4 scrollbar-thin" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.85)' }}>
                          {translation}
                        </div>
                        <button onClick={() => { setTranslation(''); setLanguage(''); }} className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>Translate Another</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── BRAIN TAB ── */}
                {activeTab === 'brain' && (
                  <motion.div key="brain" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!opinion ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-5 leading-relaxed">Ask for Navaneet&apos;s "takes" on controversial tech topics to see his engineering philosophy.</p>
                        <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateOpinion()} placeholder="e.g. Tailwind vs Vanilla CSS" className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                        <div className="flex flex-wrap gap-2 mb-6">
                          {TOPIC_EXAMPLES.map((ex) => (
                            <button key={ex} onClick={() => generateOpinion(ex)} className="text-[9px] px-2.5 py-1.5 rounded-md font-bold uppercase tracking-wide transition-all" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', color: 'rgba(236,72,153,0.8)' }}>
                              {ex}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => generateOpinion()} disabled={isOpinionLoading} className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                          {isOpinionLoading ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                          {isOpinionLoading ? 'Thinking...' : 'Get Opinion'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(236,72,153,0.08)', borderBottom: '1px solid rgba(236,72,153,0.12)' }}>
                          <BrainCircuit size={16} className="text-pink-400 shrink-0" />
                          <span className="text-pink-400/80 text-xs font-black uppercase tracking-widest break-all">{topic}</span>
                        </div>
                        <div className="flex-1 p-4 rounded-xl text-sm leading-[1.8] overflow-y-auto mb-4 scrollbar-thin" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.85)' }}>
                          {opinion}
                        </div>
                        <button onClick={() => { setOpinion(''); setTopic(''); }} className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>Ask Another Topic</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── ROAST TAB ── */}
                {activeTab === 'roast' && (
                  <motion.div key="roast" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col p-5 overflow-y-auto scrollbar-thin" style={{ scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {!roast ? (
                      <div className="flex flex-col h-full">
                        <p className="text-white/60 text-sm mb-5 leading-relaxed">Tell me your tech stack and I&apos;ll give it a playful roast — then show you why MERN is legendary.</p>
                        <label className="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-3">Your Tech Stack</label>
                        <input value={stack} onChange={e => { setStack(e.target.value); setRoastError(''); }} onKeyDown={e => e.key === 'Enter' && generateRoast()} placeholder="e.g. PHP & jQuery, Java..." className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {ROAST_EXAMPLES.map((ex) => (
                            <button key={ex} onClick={() => { setStack(ex); generateRoast(ex); }} className="text-[9px] px-2.5 py-1.5 rounded-md font-bold uppercase tracking-wide transition-all" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.7)' }}>{ex}</button>
                          ))}
                        </div>
                        {roastError && <p className="text-red-400 text-xs mb-3">{roastError}</p>}
                        <button onClick={() => generateRoast()} disabled={isRoastLoading} className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                          {isRoastLoading ? <Loader2 size={16} className="animate-spin" /> : <Flame size={16} />}
                          {isRoastLoading ? 'Heating up...' : 'Roast It!'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
                          <Flame size={16} className="text-amber-400 shrink-0" />
                          <span className="text-amber-400/80 text-xs font-black uppercase tracking-widest break-all">{stack}</span>
                        </div>
                        <div className="flex-1 p-4 rounded-xl text-sm leading-[1.8] overflow-y-auto mb-4 scrollbar-thin" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.85)' }}>{roast}</div>
                        <button onClick={() => { setRoast(''); setStack(''); }} className="w-full py-2.5 flex justify-center items-center gap-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <RotateCcw size={12} /> Try Another Stack
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
