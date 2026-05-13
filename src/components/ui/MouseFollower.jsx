"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const MouseFollower = () => {
  const { cursorType, cursorText } = useCursor();
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth following - fast and responsive
  const springConfig = { damping: 25, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(153, 41, 251, 0.1)', // primary color with low opacity
      border: '1px solid rgba(153, 41, 251, 0.3)',
      borderRadius: '50%',
    },
    hover: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(153, 41, 251, 0.2)',
      border: '1px solid rgba(153, 41, 251, 0.5)',
      borderRadius: '50%',
    },
    text: {
      width: 120,
      height: 120,
      backgroundColor: '#9929fb',
      border: 'none',
      borderRadius: '50%',
    }
  };

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]">
      {/* Background Glow (Old functionality preserved and improved) */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Interactive Cursor Follower */}
      <motion.div
        className="absolute flex items-center justify-center text-center p-2"
        variants={variants}
        animate={cursorType}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        transition={{ type: 'spring', ...springConfig }}
      >
        <AnimatePresence>
          {cursorType === 'text' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-black uppercase tracking-widest text-white leading-tight px-4"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MouseFollower;
