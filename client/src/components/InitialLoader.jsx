import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InitialLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 650ms cinematic splash loading duration (within the 300ms-900ms target)
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 650);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Subtle cinematic glow in background */}
          <div className="absolute w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 text-center z-10"
          >
            {/* Logo glyph */}
            <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-2xl tracking-tighter shadow-2xl">
              A
            </div>

            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white m-0">
                ANTI PICKS
              </h1>
              <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase">
                Curated Discovery
              </p>
            </div>

            {/* Micro loading progress bar */}
            <div className="w-36 h-[2px] bg-neutral-800 rounded-full overflow-hidden mt-3">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
                className="w-1/2 h-full bg-white"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
