import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Filter } from 'lucide-react';

export default function FilterDrawer({
  isOpen,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  featuredOnly,
  onToggleFeatured,
  onResetFilters,
}) {
  const sortOptions = [
    { value: 'newest', label: 'Newest Additions' },
    { value: 'popular', label: 'Most Popular (Clicks)' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 shadow-dropdown border border-neutral-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-black" />
            <h3 className="font-display font-bold text-lg text-black">Filter & Sort</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg"
            aria-label="Close filter drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-4">
          {/* Sort Options */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelectSort(opt.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    selectedSort === opt.value
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {selectedSort === opt.value && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onSelectCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedCategory === c.slug
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <span className="text-xs font-semibold text-neutral-800">
                Show Only Staff Picks (Featured)
              </span>
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => onToggleFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-black focus:ring-black accent-black cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-neutral-500 hover:text-black py-2 px-3 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}
