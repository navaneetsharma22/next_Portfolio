"use client";

import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedReveal } from './ui/Shared';

const testimonials = [
  {
    id: 1,
    quote:
      '"From the initial consultation to the final delivery, every step was handled professionally. The end result was a product that not only met our needs but also impressed our stakeholders. Highly recommended!"',
    name: 'Sarah Johnson',
    title: 'CEO, TechStartup Inc.',
    avatar: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 2,
    quote:
      '"Working with Brooklyn was an absolute pleasure. The attention to detail and the quality of the design work exceeded all our expectations. Our conversion rate went up by 40% after the redesign."',
    name: 'Marcus Williams',
    title: 'Marketing Director, GrowthCo',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 3,
    quote:
      '"Brooklyn delivered a world-class UI for our mobile app on time and within budget. The designs are clean, modern, and our users love them. We will definitely work together again."',
    name: 'Aisha Patel',
    title: 'Product Manager, AppVentures',
    avatar: 'https://i.pravatar.cc/80?img=36',
  },
];

const Testimonial = memo(() => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length), []);
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % testimonials.length), []);

  const t = testimonials[current];

  return (
    <section className="py-20" style={{ backgroundColor: '#ffffff' }} aria-label="Testimonials">
      <div className="mx-auto px-6 w-full" style={{ maxWidth: '720px' }}>

        <AnimatedReveal direction="up">
          <div className="text-center mb-10">
            <h2
              className="font-semibold mb-4"
              style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: 'var(--color-heading)' }}
            >
              Testimonial
            </h2>
            <p
              className="text-base leading-relaxed mx-auto"
              style={{ color: 'var(--color-body)', maxWidth: '420px' }}
            >
              Working with this team was a fantastic experience. Their attention to
              detail and commitment to quality exceeded our expectations.
            </p>
          </div>
        </AnimatedReveal>

        {/* Quote card */}
        <div className="text-center relative" style={{ minHeight: '200px' }} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: 'var(--color-body)', fontStyle: 'italic' }}
              >
                {t.quote}
              </p>

              <footer className="flex flex-col items-center gap-3">
                <img
                  src={t.avatar}
                  alt={`Photo of ${t.name}`}
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: '2px solid var(--color-primary-light)' }}
                  loading="lazy"
                  width="56"
                  height="56"
                />
                <div>
                  <cite
                    className="font-semibold text-base not-italic block"
                    style={{ color: 'var(--color-heading)' }}
                  >
                    {t.name}
                  </cite>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-soft-dark)' }}
                  >
                    {t.title}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:border-primary hover:text-primary"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-body)' }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? 'var(--color-primary)' : 'var(--color-border)',
                }}
                role="tab"
                aria-selected={i === current}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:border-primary hover:text-primary"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-body)' }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
});

Testimonial.displayName = 'Testimonial';

export default Testimonial;
