"use client";

import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaReact, FaNodeJs, FaGitAlt, FaGithub, FaDatabase
} from 'react-icons/fa';
import {
  SiJavascript, SiMongodb, SiTailwindcss, SiExpress, SiFramer
} from 'react-icons/si';
import { Zap, Globe, Shield } from 'lucide-react';
import skillService from '../services/skillService';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const getImageUrl = (path) => {
  if (!path) return null;
  // If it's already a full URL (like Cloudinary), return it as is
  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

/* ─── Icon & Color Registry ─── */
const ICON_MAP = {
  'react': FaReact, 'react.js': FaReact,
  'node.js': FaNodeJs, 'nodejs': FaNodeJs,
  'express.js': SiExpress, 'express': SiExpress,
  'mongodb': SiMongodb,
  'tailwind css': SiTailwindcss, 'tailwindcss': SiTailwindcss,
  'javascript': SiJavascript,
  'gsap': Zap,
  'framer motion': SiFramer,
  'jwt': Shield,
  'rest apis': Globe, 'rest api': Globe,
  'git': FaGitAlt, 'git & github': FaGithub, 'github': FaGithub,
};

const ICON_COLORS = {
  'react': '#61DAFB', 'react.js': '#61DAFB',
  'node.js': '#339933', 'nodejs': '#339933',
  'express.js': '#68A063', 'express': '#68A063',
  'mongodb': '#47A248',
  'tailwind css': '#06B6D4', 'tailwindcss': '#06B6D4',
  'javascript': '#F7DF1E',
  'gsap': '#88CE02',
  'framer motion': '#0055FF',
  'jwt': '#D63AFF',
  'rest apis': '#FF6B6B', 'rest api': '#FF6B6B',
  'git': '#F05032', 'git & github': '#E8E8E8', 'github': '#E8E8E8',
};

const CATEGORY_META = {
  'Frontend': { from: '#06b6d4', to: '#3b82f6', label: 'Frontend' },
  'Backend': { from: '#22c55e', to: '#10b981', label: 'Backend' },
  'Database': { from: '#f59e0b', to: '#ef4444', label: 'Database' },
  'Cloud & Deployment': { from: '#3b82f6', to: '#2563eb', label: 'Cloud & Deployment' },
  'DevOps': { from: '#f97316', to: '#ea580c', label: 'DevOps' },
  'Tools': { from: '#a855f7', to: '#ec4899', label: 'Tools & Tech' },
  'Other': { from: '#6366f1', to: '#8b5cf6', label: 'Other' },
};

/* ─── Fallback Skills ─── */
const FALLBACK_SKILLS = [
  { name: 'React.js', icon: 'react.js', category: 'Frontend', isVisible: true },
  { name: 'JavaScript', icon: 'javascript', category: 'Frontend', isVisible: true },
  { name: 'Tailwind CSS', icon: 'tailwind css', category: 'Frontend', isVisible: true },
  { name: 'Framer Motion', icon: 'framer motion', category: 'Frontend', isVisible: true },
  { name: 'GSAP', icon: 'gsap', category: 'Frontend', isVisible: true },
  { name: 'Node.js', icon: 'node.js', category: 'Backend', isVisible: true },
  { name: 'Express.js', icon: 'express.js', category: 'Backend', isVisible: true },
  { name: 'REST APIs', icon: 'rest apis', category: 'Backend', isVisible: true },
  { name: 'JWT', icon: 'jwt', category: 'Backend', isVisible: true },
  { name: 'MongoDB', icon: 'mongodb', category: 'Database', isVisible: true },
  { name: 'Git & GitHub', icon: 'git & github', category: 'Tools', isVisible: true },
];

/* ─── Skill Card ─── */
const SkillCard = memo(({ skill, index, categoryColor }) => {
  const cardRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  
  const key = skill.icon?.toLowerCase() || skill.name?.toLowerCase();
  const IconComp = ICON_MAP[key] || FaDatabase;
  const iconColor = ICON_COLORS[key] || '#9929fb';
  const customIconUrl = getImageUrl(skill.customIcon);

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -10}deg) rotateY(${(x - 0.5) * 10}deg) scale3d(1.03,1.03,1.03)`;
    el.style.setProperty('--spot-x', `${x * 100}%`);
    el.style.setProperty('--spot-y', `${y * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    }
  }, []);

  // GSAP scroll reveal for skill card
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, delay: index * 0.05, ease: 'back.out(1.2)',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          onRefresh: (self) => { if (self.progress === 1) gsap.set(el, { opacity: 1, y: 0, scale: 1 }); },
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [index]);

  return (
    <div>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="skill-card group relative cursor-pointer"
         style={{ transition: 'transform 0.2s ease-out', opacity: 0, willChange: 'transform, opacity' }}
      >
        {/* Gradient glow border */}
        <div
          className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"
          style={{ background: `linear-gradient(135deg, ${categoryColor.from}, ${categoryColor.to})` }}
        />

        {/* Card body */}
        <div className="relative bg-[#111118]/90 backdrop-blur-xl border border-white/[0.06] p-5 flex flex-col items-center gap-3 h-full">
          {/* Spotlight overlay */}
          <div className="skill-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Icon with glow */}
          <div
            className="relative z-10 w-14 h-14 flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{ filter: `drop-shadow(0 0 10px ${iconColor}40)` }}
          >
            {customIconUrl && !imageError ? (
              <img 
                src={customIconUrl} 
                alt={skill.name} 
                className="w-full h-full object-contain p-1.5" 
                onError={() => setImageError(true)}
              />
            ) : (
              <IconComp size={32} style={{ color: iconColor }} />
            )}
          </div>

          {/* Name */}
          <span className="relative z-10 text-xs font-bold text-white/50 group-hover:text-white transition-colors duration-300 text-center uppercase tracking-wider">
            {skill.name}
          </span>
        </div>
      </div>
    </div>
  );
});
SkillCard.displayName = 'SkillCard';

/* ─── Floating Particles (GSAP) ─── */
const FloatingParticles = memo(() => {
  const ref = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random positions on client side only to avoid SSR hydration mismatch
    const generated = Array.from({ length: 18 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    if (!ref.current || particles.length === 0) return;
    const dots = ref.current.children;
    gsap.utils.toArray(dots).forEach((dot, i) => {
      gsap.to(dot, {
        y: gsap.utils.random(-35, 35),
        x: gsap.utils.random(-25, 25),
        duration: gsap.utils.random(4, 7),
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: i * 0.2,
      });
      gsap.to(dot, {
        opacity: gsap.utils.random(0.2, 0.7),
        duration: gsap.utils.random(2, 5),
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });
  }, [particles]);

  const colors = ['#9929fb', '#06b6d4', '#22c55e', '#f59e0b'];
  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            backgroundColor: colors[i % colors.length],
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = 'FloatingParticles';

/* ─── Skills Header with GSAP ─── */
const SkillsHeader = memo(() => {
  const containerRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: subtitleRef.current, start: 'top 88%', toggleActions: 'play none none none',
              onRefresh: (self) => { if (self.progress === 1) gsap.set(subtitleRef.current, { opacity: 1, y: 0 }); },
            } }
        );
      }
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, delay: 0.1, ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: titleRef.current, start: 'top 88%', toggleActions: 'play none none none',
              onRefresh: (self) => { if (self.progress === 1) gsap.set(titleRef.current, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }); },
            } }
        );
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: descRef.current, start: 'top 88%', toggleActions: 'play none none none',
              onRefresh: (self) => { if (self.progress === 1) gsap.set(descRef.current, { opacity: 1, y: 0 }); },
            } }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="text-center mb-20">
      <span ref={subtitleRef} className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary/80 mb-4" style={{ opacity: 0 }}>
        Expertise
      </span>
      <h2
        ref={titleRef}
        className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)', opacity: 0, willChange: 'clip-path, transform' }}
      >
        Technical Arsenal
      </h2>
      <p ref={descRef} className="text-white/40 text-lg max-w-[560px] mx-auto leading-relaxed" style={{ opacity: 0 }}>
        Crafting high-performance digital experiences with a modern, battle-tested technology stack.
      </p>
    </div>
  );
});
SkillsHeader.displayName = 'SkillsHeader';
const Skills = memo(({ initialData }) => {
  const [skills, setSkills] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (initialData) return;
    const fetchSkills = async () => {
      try {
        const data = await skillService.getAll();
        const list = (data.skills || data || []).filter(s => s.isVisible !== false);
        setSkills(list.length > 0 ? list : FALLBACK_SKILLS);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [initialData]);

  const categoryNames = useMemo(() => {
    const cats = [...new Set(skills.map(s => s.category || 'Other'))];
    return ['All', ...cats];
  }, [skills]);

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="relative py-32 overflow-hidden min-h-[500px]"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d15 50%, #0a0a0f 100%)' }}
      aria-label="Technical Skills"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
          <div className="relative">
            <div className="w-16 h-16 border-[3px] border-white/5 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-[3px] border-transparent border-b-primary/30 rounded-full animate-spin-slow" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 animate-pulse">Initializing technical arsenal...</p>
        </div>
      ) : (
        <>
          {/* BG effects */}
          <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(6,182,212,0.06)' }} />
      </div>

      <FloatingParticles />

      <div className="mx-auto px-6 w-full relative z-10" style={{ maxWidth: '1320px' }}>
        {/* Header — GSAP animated */}
        <SkillsHeader />

        {/* Category Tabs */}
        <div
          className="flex flex-wrap lg:justify-center gap-3 mb-16 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 lg:mx-0"
        >
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(153,41,251,0.3)]'
                  : 'bg-white/[0.03] text-white/50 border-white/[0.08] hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.15]'
              }`}
            >
              {CATEGORY_META[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4"
            >
              {filtered.map((skill, idx) => (
                <SkillCard
                  key={skill._id || skill.name}
                  skill={skill}
                  index={idx}
                  categoryColor={CATEGORY_META[skill.category] || CATEGORY_META['Other']}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </>
      )}
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;
