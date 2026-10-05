import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-neutral-200/60 bg-gradient-to-b from-white via-white to-neutral-50/50">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-emerald-100/30 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Animated Centerpiece Mor Pankh with Divine Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -6, 0],
            rotate: [-1.2, 1.2, -1.2],
          }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            y: { repeat: Infinity, duration: 4.2, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' },
          }}
          className="relative flex flex-col items-center select-none cursor-pointer group z-20"
          title="श्री राधे मोर पंख"
        >
          {/* Radiant breathing divine aura */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-44 sm:h-44 divine-halo rounded-full pointer-events-none -z-10" />

          {/* Majestic single Mor Pankh centerpiece */}
          <img
            src="/mor-pankh.png"
            alt="श्री राधे मोर पंख"
            className="w-14 h-20 sm:w-20 sm:h-32 md:w-24 md:h-36 object-contain filter drop-shadow-[0_8px_20px_rgba(5,150,105,0.38)] relative z-10 transition-transform duration-500 group-hover:scale-110"
          />

          {/* Sacred 'श्री राधे' Divine Ribbon Badge */}
          <div className="flex items-center justify-center gap-2.5 mt-2.5">
            <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-amber-500/70" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-amber-800 uppercase flex items-center gap-1.5 select-none">
              <span className="divine-sparkle text-[10px]">✦</span>
              <span>श्री राधे</span>
              <span className="divine-sparkle-delayed text-[10px]">✦</span>
            </span>
            <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-amber-500/70" />
          </div>
        </motion.div>

        {/* Majestic Royal Radhe Radhe Headline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-2 sm:mt-3 flex flex-col items-center w-full"
        >
          <div className="relative inline-flex items-center justify-center px-4 sm:px-10">
            {/* Left sacred twinkle star */}
            <span className="hidden sm:inline-block absolute left-0 top-1/2 -translate-y-1/2 text-amber-500 divine-sparkle text-base select-none pointer-events-none">
              ✦
            </span>

            <h1 className="radhe-divine-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-center relative z-10 select-none px-2 whitespace-nowrap cursor-default">
              Radhe Radhe
            </h1>

            {/* Right sacred twinkle star */}
            <span className="hidden sm:inline-block absolute right-0 top-1/2 -translate-y-1/2 text-amber-500 divine-sparkle-delayed text-base select-none pointer-events-none">
              ✦
            </span>
          </div>

          {/* Pure Devanagari Inscription */}
          <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2 select-none">
            <span className="text-amber-600/70 text-sm sm:text-lg">॥</span>
            <p className="radhe-hindi-sub text-base sm:text-2xl md:text-3xl font-bold tracking-[0.22em]">
              राधे राधे
            </p>
            <span className="text-amber-600/70 text-sm sm:text-lg">॥</span>
          </div>
        </motion.div>

        {/* Welcome subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-neutral-700 max-w-xl mx-auto font-medium leading-relaxed"
        >
          Welcome to{' '}
          <strong
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-black font-extrabold tracking-tight"
          >
            ANTI PICKS
          </strong>{' '}
          — Buy your favorite products with confidence.
        </motion.p>

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer group"
          >
            <span>Explore Products</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

