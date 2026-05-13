"use client";

import React, { memo } from 'react';
import { AnimatedReveal, LazyImage } from './ui/Shared';

const posts = [
  {
    id: 1,
    tag: 'Design',
    title: 'Designing Engaging User Interfaces for M...',
    date: '22 Oct, 2020 / 246 Comments',
    image: 'https://images.unsplash.com/photo-1541462608141-ad4d769421a1?auto=format&fit=crop&q=60&w=600',
  },
  {
    id: 2,
    tag: 'Development',
    title: 'Tips for Effective Dashboard Layouts and...',
    date: '22 Oct, 2020 / 246 Comments',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=60&w=600',
  },
  {
    id: 3,
    tag: 'UX',
    title: 'How to Visualize Data for Better Product...',
    date: '22 Oct, 2020 / 246 Comments',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=60&w=600',
  },
];

const Blog = memo(() => {
  return (
    <section
      id="blog"
      className="py-20"
      style={{
        background: `
          radial-gradient(circle at -10% 0, rgba(218, 77, 241, 0.25) 1%, transparent 25%),
          radial-gradient(circle at 110% 30%, rgba(196, 245, 233, 0.5) 5%, transparent 25%),
          #f0f1f3
        `,
      }}
      aria-label="Blog posts"
    >
      <div className="mx-auto px-6 w-full" style={{ maxWidth: '1320px' }}>

        <AnimatedReveal direction="up">
          <div className="text-center mb-14">
            <h2
              className="font-semibold mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-heading)' }}
            >
              Blog
            </h2>
            <p
              className="text-base leading-relaxed mx-auto"
              style={{ color: 'var(--color-body)', maxWidth: '480px' }}
            >
              Check out my recent blog posts where I share insights on design, development, and the latest industry trends.
            </p>
          </div>
        </AnimatedReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <AnimatedReveal key={post.id} direction="up" delay={i * 0.08}>
              <article
                className="bg-transparent overflow-hidden group transition-all duration-300 flex flex-col h-full"
              >
                <div className="overflow-hidden rounded-t-[10px]">
                  <LazyImage
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ aspectRatio: '4/3' }}
                  />
                </div>

                <div
                  className="p-6 bg-white border border-t-0 rounded-b-[10px] flex-grow"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <time
                    className="text-sm font-medium block mb-3"
                    style={{ color: 'var(--color-soft-dark)' }}
                  >
                    {post.date}
                  </time>

                  <h3
                    className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors duration-300"
                    style={{ color: 'var(--color-heading)' }}
                  >
                    {post.title}
                  </h3>
                </div>
              </article>
            </AnimatedReveal>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-10 gap-2" aria-label="Blog page indicators">
          <div className="w-6 h-2 rounded-full" style={{ backgroundColor: '#132238' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
        </div>
      </div>
    </section>
  );
});

Blog.displayName = 'Blog';

export default Blog;
