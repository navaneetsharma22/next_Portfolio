"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import experienceService from '../services/experienceService';
import { Section, SectionHeader } from './ui/Shared';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Experience = ({ initialData }) => {
  const [experiences, setExperiences] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const timelineRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (initialData) return;
    const fetchExperiences = async () => {
      try {
        const res = await experienceService.getExperiences();
        // Sort by order or date
        const sorted = (res.data || []).sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return new Date(b.startDate) - new Date(a.startDate);
        });
        setExperiences(sorted);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [initialData]);

  // ── GSAP ScrollTrigger Animations ──
  useEffect(() => {
    if (loading || experiences.length === 0) return;

    const ctx = gsap.context(() => {
      // Timeline line — grow from top to bottom
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.5, ease: 'power2.inOut',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 80%',
              end: 'bottom 30%',
              scrub: 0.8,
            },
          }
        );
      }

      // Experience cards — staggered fade-up with slide
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll('.exp-card');
        cards.forEach((card, index) => {
          const isEven = index % 2 === 0;
          gsap.fromTo(card,
            { opacity: 0, x: isEven ? 50 : -50, y: 30 },
            {
              opacity: 1, x: 0, y: 0,
              duration: 0.8, ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Timeline dots — pop in
        const dots = cardsContainerRef.current.querySelectorAll('.timeline-dot');
        dots.forEach((dot) => {
          gsap.fromTo(dot,
            { opacity: 0, scale: 0 },
            {
              opacity: 1, scale: 1,
              duration: 0.5, ease: 'back.out(2)',
              scrollTrigger: {
                trigger: dot,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Opposite side labels — fade in
        const labels = cardsContainerRef.current.querySelectorAll('.exp-label');
        labels.forEach((label) => {
          gsap.fromTo(label,
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0,
              duration: 0.6, delay: 0.2, ease: 'power2.out',
              scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, timelineRef);

    return () => ctx.revert();
  }, [loading, experiences]);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Section id="experience" bg="alt">
      <SectionHeader 
        subtitle="Professional Path"
        title="Work Experience"
        description="A comprehensive look at my professional journey, including full-time roles and internships."
        align="center"
      />

      <div ref={timelineRef} className="max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20 opacity-50 font-bold uppercase tracking-widest animate-pulse">
            Loading Journey...
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 text-body/50">
            My professional journey is being updated. Stay tuned!
          </div>
        ) : (
          <div ref={cardsContainerRef} className="relative">
            {/* Main Timeline Line */}
            <div 
              ref={lineRef}
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 hidden md:block" 
            />

            <div className="space-y-16">
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={exp._id}
                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Dot/Icon */}
                    <div className="timeline-dot absolute left-8 md:left-1/2 md:ml-[-20px] w-10 h-10 rounded-full bg-white border-4 border-primary/20 shadow-xl flex items-center justify-center z-10 hidden md:flex overflow-hidden">
                       {exp.companyLogo ? (
                         <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-contain p-1.5" />
                       ) : (
                         <div className="text-primary">
                           {exp.category === 'Job' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                         </div>
                       )}
                    </div>

                    {/* Content Card */}
                    <div className={`exp-card w-full md:w-[45%] group`}>
                      <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        
                        {/* Floating Company Badge */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                                exp.category === 'Job' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                              }`}>
                                {exp.category}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-soft-dark/60">
                                <Calendar size={12} className="text-primary/50" />
                                {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                              </div>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-heading leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight">
                              {exp.role}
                            </h3>
                            <p className="text-lg font-bold text-primary mt-1 flex items-center gap-2">
                              {exp.company}
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                              <span className="text-sm font-medium text-soft-dark/40">{exp.location}</span>
                            </p>
                          </div>

                          {/* Large Professional Logo Badge */}
                          <div className="hidden sm:flex shrink-0 w-28 h-28 rounded-[2rem] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] items-center justify-center p-2 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
                            {exp.companyLogo ? (
                              <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-contain relative z-10 p-1" />
                            ) : (
                              <div className="text-primary/10 font-black text-5xl select-none relative z-10">
                                {exp.company.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <p className="text-body leading-relaxed text-[15px] opacity-70 font-medium border-l-2 border-primary/10 pl-6">
                            {exp.description}
                          </p>
                        </div>

                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                      </div>
                    </div>

                    {/* Desktop Date/Company Label (Opposite Side) */}
                    <div className={`exp-label hidden md:block md:w-[45%] ${isEven ? 'text-right' : 'text-left'}`}>
                       <div className={`flex flex-col ${isEven ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-3 mb-2">
                             {!isEven && <div className="w-10 h-[2px] bg-primary/20" />}
                             <span className="text-3xl font-black text-heading/10 group-hover:text-primary/10 transition-colors duration-500 uppercase tracking-tighter italic">
                               {exp.company}
                             </span>
                             {isEven && <div className="w-10 h-[2px] bg-primary/20" />}
                          </div>
                          <p className="text-sm font-bold text-soft-dark opacity-50 max-w-[200px]">
                            Contributing expertise as a {exp.role.toLowerCase()} in {exp.location}.
                          </p>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Experience;
