import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-xs'
            : 'bg-white border-b border-neutral-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
            {/* Left: Brand Identity */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-lg transition-transform group-hover:scale-95 duration-200 shadow-xs"
                >
                  A
                </div>
                <span
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  className="font-extrabold text-xl sm:text-2xl tracking-[-0.03em] text-black"
                >
                  ANTI PICKS
                </span>
              </Link>
            </div>

            {/* Center: Prominent Modern Search Bar */}
            <div className="flex-1 max-w-md lg:max-w-lg mx-auto hidden sm:block">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-neutral-500 bg-neutral-100/90 hover:bg-neutral-200/70 border border-neutral-200/90 hover:border-neutral-300 rounded-full transition-all cursor-pointer group shadow-2xs"
                aria-label="Search products"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors shrink-0" />
                  <span className="font-normal text-neutral-500 group-hover:text-neutral-700 truncate">
                    Search your product here...
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 group-hover:text-black bg-white px-2.5 py-0.5 rounded-full border border-neutral-200/80 shadow-2xs shrink-0 ml-2">
                  Search
                </span>
              </button>
            </div>

            {/* Right: Actions & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile-only search button */}
              <button
                onClick={onOpenSearch}
                className="sm:hidden p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-4/5 max-w-sm h-full bg-white border-l border-neutral-200 p-6 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-display font-black text-sm">
                      A
                    </div>
                    <span className="font-display font-bold text-lg">ANTI PICKS</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-neutral-500 hover:text-black rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-xl"
                  >
                    <Search className="w-4 h-4 text-neutral-500" />
                    <span>Search Products</span>
                  </button>
                </div>

                <nav className="space-y-1 text-base font-medium">
                  <Link
                    to="/"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-800 hover:bg-neutral-50"
                  >
                    <span>Curated Picks</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-800 hover:bg-neutral-50"
                  >
                    <span>Philosophy & Criteria</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500 space-y-2">
                <p className="font-semibold text-neutral-800">ANTI PICKS Platform</p>
                <p>Pure editorial curation. No sponsored placements.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
