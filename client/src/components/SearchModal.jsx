import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight, Star } from 'lucide-react';
import { api } from '../lib/api.js';
import { formatCurrency } from '../utils/formatters.js';
import { modalMotion } from '../animations/presets.js';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await api.getProducts({ search: query.trim(), limit: 6 });
        setResults(data.products || []);
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <motion.div
        variants={modalMotion}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-dropdown border border-neutral-200 overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your product here..."
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none placeholder:text-neutral-400 text-black font-sans"
          />
          {loading && <Loader2 className="w-4 h-4 text-neutral-400 animate-spin shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold px-2 py-1 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-neutral-500 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Close search"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Empty / Initial States */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-neutral-400 space-y-2">
              <p className="font-semibold text-neutral-600 text-sm">Quick Search</p>
              <p>Type keywords like "synthesizer", "headphones", "desk shelf", or "rangefinder"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-neutral-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                          {product.category?.name || 'Pick'}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <p className="font-display font-semibold text-sm text-black truncate mt-0.5">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {product.brand} • {formatCurrency(product.price, product.currency)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : !loading ? (
            <div className="p-8 text-center space-y-2">
              <p className="font-display font-semibold text-base text-black">No products found.</p>
              <p className="text-xs text-neutral-500">
                Try searching for different keywords or check out categories.
              </p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
