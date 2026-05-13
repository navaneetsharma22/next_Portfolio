"use client";

import React, { memo } from 'react';
import { Monitor, Smartphone, ArrowRight, Code2 } from 'lucide-react';
import { AnimatedReveal } from './ui/Shared';

const services = [
  { title: 'User Interface', desc: 'I design user-centered digital experiences that are intuitive, accessible, and beautiful.', Icon: Monitor },
  { title: 'Web Development', desc: 'I build high-performance web applications using modern technologies.', Icon: Code2 },
  { title: 'App Development', desc: 'I create mobile applications for iOS and Android platforms.', Icon: Smartphone, soon: true },
];

const Services = memo(() => {
  return (
    <section
      id="services"
      className="py-20"
      style={{ backgroundColor: 'var(--color-background-alt)' }}
      aria-label="Services"
    >
      <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Header */}
          <AnimatedReveal direction="left">
            <div className="lg:sticky lg:top-32 text-center lg:text-left">
              <p
                className="font-semibold text-sm uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-soft-dark)' }}
              >
                WHAT I DO?
              </p>
              <h2
                className="font-semibold mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)' }}
              >
                My Services
              </h2>
              <p
                className="text-base leading-relaxed mb-10 mx-auto lg:mx-0"
                style={{ color: 'var(--color-body)', maxWidth: '480px' }}
              >
                I offer a wide range of design and development services to help you build and grow your digital presence. I strive to build immersive and beautiful web applications through carefully crafted code and user-centric design.
              </p>
              <a 
                href="mailto:navaneetsharma22@gmail.com" 
                className="btn-picto inline-flex items-center" 
                aria-label="Send an email to Navaneet"
              >
                Say Hello!
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </a>
            </div>
          </AnimatedReveal>

          {/* Right — Cards */}
          <div className="flex flex-col gap-8" role="list" aria-label="Service list">
            {services.map(({ title, desc, Icon, soon }, i) => (
              <AnimatedReveal key={title} direction="right" delay={i * 0.1}>
                <div
                  className="group relative bg-white p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid var(--color-border)',
                    borderLeft: '4px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }}
                  role="listitem"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={30} />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-2xl mb-4 transition-colors duration-300 flex items-center gap-3"
                        style={{ color: 'var(--color-heading)' }}
                      >
                        {title}
                        {soon && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                            Soon
                          </span>
                        )}
                      </h3>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: 'var(--color-body)' }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Services.displayName = 'Services';

export default Services;
