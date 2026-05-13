"use client";

import React, { memo } from 'react';
import { AnimatedReveal } from './ui/Shared';

const clients = [
  { name: 'Spotify', font: "'Work Sans', sans-serif", weight: '600', size: '18', text: 'Spotify' },
  { name: 'Google', font: "'Work Sans', sans-serif", weight: '400', size: '20', text: 'Google' },
  { name: 'Dribbble', font: 'Georgia, serif', weight: '400', size: '20', text: 'Dribbble', italic: true },
  { name: 'LinkedIn', font: "'Work Sans', sans-serif", weight: '700', size: '20', text: 'LinkedIn' },
  { name: 'Amazon', font: "'Work Sans', sans-serif", weight: '400', size: '18', text: 'amazon' },
  { name: 'Medium', font: 'Georgia, serif', weight: '400', size: '20', text: 'Medium' },
];

const Clients = memo(() => {
  return (
    <section className="py-20" style={{ backgroundColor: '#ffffff' }} aria-label="Client logos">
      <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>

        <AnimatedReveal direction="up">
          <div className="text-center mb-14">
            <h2
              className="font-semibold mb-4"
              style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: 'var(--color-heading)' }}
            >
              Happy Clients
            </h2>
            <p
              className="text-base leading-relaxed mx-auto"
              style={{ color: 'var(--color-body)', maxWidth: '380px' }}
            >
              I've had the pleasure of working with a diverse range of companies, from{' '}
              <span style={{ color: 'var(--color-primary)' }}>startups to established brands.</span>
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="up" delay={0.1}>
          <div
            className="flex flex-wrap items-center justify-center gap-10 lg:gap-14"
            role="list"
            aria-label="Client companies"
          >
            {clients.map(({ name, font, weight, size, text, italic }) => (
              <div
                key={name}
                className="opacity-40 hover:opacity-80 transition-opacity duration-300"
                style={{ color: '#697482' }}
                title={name}
                role="listitem"
              >
                <span
                  style={{
                    fontFamily: font,
                    fontWeight: weight,
                    fontSize: `${size}px`,
                    fontStyle: italic ? 'italic' : 'normal',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
});

Clients.displayName = 'Clients';

export default Clients;
