"use client";

import React from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────
   SKELETON UI PRIMITIVES
   Reusable loading placeholders for every context
────────────────────────────────────────────── */

const shimmer = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Base skeleton block */
export const SkeletonBlock = ({ className = '', rounded = 'rounded-md' }) => (
  <motion.div
    variants={shimmer}
    initial="hidden"
    animate="visible"
    className={`bg-gray-200 ${rounded} ${className}`}
    aria-hidden="true"
  />
);

/** Skeleton for text lines */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

/** Skeleton for card layouts */
export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl border p-8 space-y-4 ${className}`}
    style={{ borderColor: 'var(--color-border)' }}
    aria-hidden="true"
  >
    <SkeletonBlock className="h-40 w-full" rounded="rounded-xl" />
    <SkeletonBlock className="h-5 w-3/4" />
    <SkeletonText lines={2} />
    <div className="flex gap-2 pt-2">
      <SkeletonBlock className="h-6 w-16" rounded="rounded-full" />
      <SkeletonBlock className="h-6 w-20" rounded="rounded-full" />
    </div>
  </div>
);

/** Skeleton for table rows */
export const SkeletonTableRow = ({ cols = 4 }) => (
  <tr aria-hidden="true">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-8 py-5">
        <SkeletonBlock className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/** Skeleton for stat cards */
export const SkeletonStat = () => (
  <div
    className="bg-white rounded-2xl border p-8 space-y-4"
    style={{ borderColor: 'var(--color-border)' }}
    aria-hidden="true"
  >
    <SkeletonBlock className="h-14 w-14" rounded="rounded-2xl" />
    <SkeletonBlock className="h-8 w-20" />
    <SkeletonBlock className="h-4 w-28" />
  </div>
);

/** Full-page skeleton for lazy-loaded routes */
export const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading page">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full mx-auto"
        style={{ borderTopColor: 'var(--color-primary)' }}
      />
      <p className="text-sm font-medium" style={{ color: 'var(--color-soft-dark)' }}>
        Loading…
      </p>
    </div>
  </div>
);
