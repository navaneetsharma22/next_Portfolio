"use client";

import React, { memo } from 'react';
import { Search, PenTool, Monitor } from 'lucide-react';
import { AnimatedReveal } from './ui/Shared';

const steps = [
  {
    num: 1,
    title: 'Research',
    desc: 'Design meets function in every pixel, blending clarity with intuitive motion.',
    Icon: Search,
  },
  {
    num: 2,
    title: 'Analyze',
    desc: 'Crafting clean, thoughtful interfaces where form flows seamlessly into function and clarity.',
    Icon: PenTool,
  },
  {
    num: 3,
    title: 'Design',
    desc: 'I design seamless digital experiences with precision, purpose, and a touch of elegance.',
    Icon: PenTool,
  },
  {
    num: 4,
    title: 'Launch',
    desc: 'I craft digital products where thoughtful design meets performance-driven, responsive development.',
    Icon: Monitor,
  },
];

const Process = memo(() => {
  return (
    <section
      id="process"
      className="py-20"
      style={{ backgroundColor: 'var(--color-background-alt)' }}
      aria-label="Work process"
    >
      <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Header text */}
          <AnimatedReveal direction="left">
            <div className="lg:sticky lg:top-32">
              <h2
                className="font-semibold mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)' }}
              >
                Work Process
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-body)' }}
              >
                Driven by design and powered by code, I create digital
                interfaces that feel intuitive and perform seamlessly.
                Every layout, animation, and component is crafted with
                intention — merging usability with visual clarity.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-body)' }}
              >
                I blend clean design with efficient code to build
                engaging, user-friendly web experiences that stand out.
              </p>
            </div>
          </AnimatedReveal>

          {/* Right — 2×2 step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="list" aria-label="Process steps">
            {steps.map(({ num, title, desc, Icon }, i) => (
              <AnimatedReveal key={num} direction="up" delay={i * 0.1}>
                <div
                  className="bg-white p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg group h-full"
                  style={{ borderColor: 'var(--color-border)' }}
                  role="listitem"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                    style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                    aria-hidden="true"
                  >
                    <Icon size={26} />
                  </div>
                  <h3
                    className="font-semibold text-lg mb-3"
                    style={{ color: 'var(--color-heading)' }}
                  >
                    {num}. {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-body)' }}
                  >
                    {desc}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Process.displayName = 'Process';

export default Process;
