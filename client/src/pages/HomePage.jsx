import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import CategoryNav from '../components/CategoryNav.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/ProductSkeleton.jsx';
import FilterDrawer from '../components/FilterDrawer.jsx';
import SEO from '../components/SEO.jsx';
import { api } from '../lib/api.js';
import { staggerContainer } from '../animations/presets.js';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const productSectionRef = useRef(null);

  // Sync category state from URL query
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products when filters or search change
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: debouncedSearch.trim() || undefined,
          sort: selectedSort,
          featured: featuredOnly ? 'true' : undefined,
          limit: 30,
        };
        const data = await api.getProducts(params);
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, debouncedSearch, selectedSort, featuredOnly]);

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedSort('newest');
    setFeaturedOnly(false);
    searchParams.delete('category');
    setSearchParams(searchParams);
    setIsFilterDrawerOpen(false);
  };

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Curated Products & Honest Ratings"
        description="ANTI PICKS — Curated products, honest ratings, and smart picks. Uncompromising review standards for physical gear."
      />

      {/* Hero Section */}
      <Hero onExploreClick={scrollToProducts} />

      {/* Dynamic Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Product Discovery Area */}
      <section ref={productSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Toolbar: Search, Sort, Filter trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200/60">
          {/* Live Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, brand, feature..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200/90 rounded-xl text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Action Tools: Sort dropdown, Mobile Filter button */}
          <div className="flex items-center gap-3">
            {/* Desktop Sort Dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-neutral-800 cursor-pointer focus:outline-none focus:border-black shadow-2xs"
              >
                <option value="newest">Sort: Newest</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="views">Sort: Most Viewed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="sm:hidden flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-black shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
              <span>Filters & Sort</span>
            </button>
          </div>
        </div>

        {/* Results Counter & Active Filters Indicator */}
        <div className="flex items-center justify-between py-4 text-xs text-neutral-500">
          <p>
            Showing <span className="font-semibold text-black">{products.length}</span> of{' '}
            <span className="font-semibold text-black">{totalCount}</span> curated picks
            {selectedCategory !== 'all' && (
              <span>
                {' '}
                in{' '}
                <span className="font-semibold text-black">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </span>
            )}
          </p>

          {(selectedCategory !== 'all' || debouncedSearch || featuredOnly) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 font-semibold text-neutral-700 hover:text-black hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Products Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          /* Empty State (PRD Section 42) */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-black">Nothing here yet</h3>
              <p className="text-sm text-neutral-500">
                No products match your current filters. Try changing your search query or selecting
                another category.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>View All Products</span>
            </button>
          </div>
        )}
      </section>


      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        featuredOnly={featuredOnly}
        onToggleFeatured={setFeaturedOnly}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}
