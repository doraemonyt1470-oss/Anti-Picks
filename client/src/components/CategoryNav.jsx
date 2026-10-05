import React from 'react';
import { Layers } from 'lucide-react';

export default function CategoryNav({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) {
  return (
    <div className="w-full border-b border-neutral-200/80 bg-white sticky top-16 sm:top-20 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar scroll-smooth">
          {/* "All" Category Pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Picks</span>
          </button>

          {/* Dynamic Categories from Supabase */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200/80'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
