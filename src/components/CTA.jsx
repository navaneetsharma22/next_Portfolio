"use client";

import React, { memo, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatedReveal } from './ui/Shared';

const CTA = memo(() => {
  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      className="py-20"
      style={{ backgroundColor: '#132238' }}
      aria-label="Call to action"
    >
      <div className="mx-auto px-6 w-full text-center" style={{ maxWidth: '1320px' }}>
        <AnimatedReveal direction="up">
          <h2
            className="font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff' }}
          >
            Do you have a Project Idea?<br />
            Let's discuss your project!
          </h2>

          <p
            className="text-base leading-relaxed mb-10 mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '420px' }}
          >
            I'm always open to discussing new projects and creative ideas. Let's
            connect and build something amazing together.
          </p>

          <div className="flex flex-col items-center gap-12">
            <a
              href="mailto:navaneetsharma22@gmail.com"
              className="btn-picto inline-flex items-center gap-3 !rounded-none shadow-[0_15px_30px_rgba(153,41,251,0.3)]"
            >
              Let's work Together
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            {/* Thought of the Day Card */}
            <AnimatedReveal direction="up" delay={0.3} className="relative p-8 bg-white/[0.03] border border-white/10 max-w-2xl w-full group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary shrink-0">
                  <span className="font-black text-xl">"</span>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Developer Insight of the Day</p>
                   <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed italic">
                      {(() => {
                        const thoughts = [
                          { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
                          { text: "Websites should look good from the inside and out.", author: "Paul Cookson" },
                          { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
                          { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
                          { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
                          { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
                          { text: "A user interface is like a joke. If you have to explain it, it’s not that good.", author: "" },
                          { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
                          { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
                          { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
                          { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
                          { text: "Programming isn't about what you know; it's about what you can figure out.", author: "" },
                          { text: "The only way to go fast, is to go well.", author: "Robert C. Martin" },
                          { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
                          { text: "Deleted code is debugged code.", author: "Jeff Sickel" },
                          { text: "The most important property of a program is whether it settles the user's business.", author: "" },
                          { text: "Don't comment bad code—rewrite it.", author: "Brian Kernighan" },
                          { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
                          { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
                          { text: "Testing leads to failure, and failure leads to understanding.", author: "Burt Rutan" },
                          { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
                          { text: "A good programmer is someone who always looks both ways before crossing a one-way street.", author: "Doug Linder" },
                          { text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
                          { text: "Life is 10% what happens to you and 90% how you react to it.", author: "" },
                          { text: "One man’s constant is another man’s variable.", author: "Alan Perlis" },
                          { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "" },
                          { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
                          { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Abelson & Sussman" },
                          { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
                          { text: "Everything should be made as simple as possible, but not simpler.", author: "Albert Einstein" },
                          { text: "The digital revolution is far more significant than the invention of writing or printing.", author: "Douglas Engelbart" }
                        ];
                        const day = new Date().getDate();
                        const thought = thoughts[(day - 1) % thoughts.length];
                        return (
                          <>
                            {thought.text}
                            {thought.author && (
                              <span className="block mt-4 text-xs font-black uppercase tracking-[0.2em] text-primary not-italic">
                                — {thought.author}
                              </span>
                            )}
                          </>
                        );
                      })()}
                   </p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </AnimatedReveal>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';

export default CTA;
