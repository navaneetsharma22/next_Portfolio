"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [taskIndex, setTaskIndex] = useState(0);
  
  const isReadyRef = useRef(false);
  const progressRef = useRef(0);
  const taskRef = useRef(0);

  // High-precision smooth progress
  const smoothProgress = useSpring(0, {
    damping: 35,
    stiffness: 50,
    restDelta: 0.001
  });

  const displayProgress = useTransform(smoothProgress, (latest) => Math.round(latest));

  const tasks = useMemo(() => [
    "Initializing Spatial Logic",
    "Compiling Visual Shaders",
    "Optimizing Asset Bundles",
    "Syncing Neural Grid",
    "Finalizing Artifacts"
  ], []);

  useEffect(() => {
    let animationFrame;
    let currentIncrement = 0.2;
    let lastTime = performance.now();
    
    // Check for window load
    const handleLoad = () => { isReadyRef.current = true; };
    if (document.readyState === 'complete') {
      isReadyRef.current = true;
    } else {
      window.addEventListener('load', handleLoad);
    }

    const update = (currentTime) => {
      // Calculate delta time to ensure smooth progress regardless of refresh rate (60hz vs 144hz)
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const timeScale = isNaN(deltaTime) ? 1 : Math.min(deltaTime / 16.66, 2);

      // Determine target speed based on readiness
      const targetIncrement = isReadyRef.current ? 4.0 : 0.8;
      
      // Smoothly interpolate the increment (momentum)
      currentIncrement += (targetIncrement - currentIncrement) * 0.1 * timeScale;
      
      progressRef.current = Math.min(progressRef.current + (currentIncrement * timeScale), 100);
      smoothProgress.set(progressRef.current);

      // Update tasks based on progress with a slight delay/smoothness
      const nextTaskIndex = Math.min(Math.floor((progressRef.current / 100) * tasks.length), tasks.length - 1);
      if (nextTaskIndex !== taskRef.current) {
        taskRef.current = nextTaskIndex;
        setTaskIndex(nextTaskIndex);
      }

      if (progressRef.current < 100) {
        animationFrame = requestAnimationFrame(update);
      } else {
        // Final completion with a shorter ease-out pause
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('load', handleLoad);
    };
  }, [onComplete, tasks, smoothProgress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -50,
        // Removed heavy blur for better performance on exit
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-40">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_30%,rgba(153,41,251,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_70%,rgba(79,70,229,0.05)_0%,transparent_50%)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* The Morphing Logo - Now organic from the very first frame */}
        <div className="relative mb-16">
          <motion.div
            initial={{ 
              borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%",
              rotate: 0 
            }}
            animate={{
              borderRadius: [
                "40% 60% 70% 30% / 40% 40% 60% 50%",
                "50% 50% 20% 80% / 25% 80% 20% 75%",
                "67% 33% 47% 53% / 37% 20% 80% 63%",
                "40% 60% 70% 30% / 40% 40% 60% 50%"
              ],
              rotate: [0, 90, 180, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-32 h-32 flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #9929fb, #4f46e5)',
              boxShadow: '0 20px 50px rgba(153, 41, 251, 0.2)',
              borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%", // Set base style too
              willChange: "transform, border-radius"
            }}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            
            <motion.span
              style={{ opacity: useTransform(smoothProgress, [0, 80, 100], [0, 0, 1]) }}
              className="text-white text-5xl font-black tracking-tighter"
            >
              N
            </motion.span>
          </motion.div>
          
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute -inset-4 border border-primary/10 rounded-full"
          />
        </div>

        {/* Task Info & Progress Bar */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={taskIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] font-bold uppercase tracking-[0.6em] text-black mb-10 h-4"
              style={{ willChange: "transform, opacity" }}
            >
              {tasks[taskIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Minimal Loading Bar */}
          <div className="w-64 h-[2px] bg-black/5 relative overflow-hidden">
            <motion.div 
              style={{ scaleX: useTransform(smoothProgress, [0, 100], [0, 1]), originX: 0, willChange: "transform" }}
              className="absolute inset-0 bg-primary"
            />
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default Preloader;

