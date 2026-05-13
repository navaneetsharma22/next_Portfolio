"use client";

import React from 'react';
import { useCursor } from '../context/CursorContext';

/**
 * NavLinkItem component for individual navbar links
 * @param {string} id - Target section ID
 * @param {string} label - Display text
 * @param {boolean} isActive - Whether the link is currently active
 * @param {function} onClick - Click handler for smooth scroll
 */
import { motion } from 'framer-motion';

const NavLinkItem = ({ id, label, isActive, onClick }) => {
  const { setCursor } = useCursor();

  return (
    <button
      onClick={() => onClick(id)}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={() => setCursor('default')}
      className={`relative px-6 py-3 text-[13px] font-black tracking-[0.15em] transition-all duration-300 !rounded-none uppercase ${
        isActive 
          ? 'text-primary' 
          : 'text-[#1a1a1a]/60 hover:text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary z-0"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
};

export default NavLinkItem;
