import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Share2, Eye, ArrowUpRight, Check, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '../utils/formatters.js';
import { useToast } from '../context/ToastContext.jsx';
import { cardItem, imageHover } from '../animations/presets.js';

export default function ProductCard({ product, onShareClick }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  const displayImage = product.image_url || (product.images && product.images[0]?.image_url) || fallbackImage;

  const handleQuickCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onShareClick) {
      onShareClick(product);
      return;
    }

    const shareUrl = `${window.location.origin}/products/${product.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        addToast({ message: 'Product link copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const hasDiscount =
    product.original_price &&
    product.price &&
    product.original_price > product.price;

  return (
    <motion.div
      variants={cardItem}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-neutral-200/80 overflow-hidden transition-all duration-300 hover:shadow-premium-hover hover:border-neutral-300"
    >
      {/* Image Container */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block w-full aspect-square sm:aspect-[4/3] bg-neutral-100 overflow-hidden"
      >
        <motion.img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          variants={imageHover}
          initial="rest"
          whileHover="hover"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-xs text-black border border-neutral-200/80 shadow-2xs">
            {product.category?.name || 'Curated'}
          </span>
          {product.featured && (
            <span className="hidden sm:inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wider uppercase bg-black text-white shadow-2xs">
              Staff Pick
            </span>
          )}
        </div>

        {/* Quick Share Button */}
        <button
          onClick={handleQuickCopy}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-xs text-neutral-600 hover:text-black hover:bg-white border border-neutral-200/80 shadow-2xs transition-all active:scale-90 cursor-pointer"
          title="Share product"
          aria-label="Share product"
        >
          {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* View Count Badge */}
        {product.views > 0 && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] sm:text-[11px] font-medium text-white/90">
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-300" />
            <span>{formatCompactNumber(product.views)}</span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-grow justify-between gap-2 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{parseFloat(product.rating || 5.0).toFixed(1)}</span>
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <span className="text-neutral-500 hidden sm:inline">
              {product.rating_count || 1} {product.rating_count === 1 ? 'rating' : 'ratings'}
            </span>
            {product.brand && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-600 font-medium truncate max-w-[65px] sm:max-w-[120px]">
                  {product.brand}
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block group-hover:text-black">
            <h3 className="font-display font-bold text-xs sm:text-base text-black leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-neutral-300">
              {product.name}
            </h3>
          </Link>

          {/* Short Description (Visible on tablets and desktops) */}
          <p className="hidden sm:block text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Price and CTA */}
        <div className="pt-2 sm:pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mt-auto">
          {/* Price display */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-display font-extrabold text-xs sm:text-base md:text-lg text-black">
                {product.price ? formatCurrency(product.price, product.currency) : 'Check Price'}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  {formatCurrency(product.original_price, product.currency)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600">
                Save {(100 - (product.price / product.original_price) * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Buy Now / Explore Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <Link
              to={`/products/${product.slug}`}
              className="hidden sm:inline-flex p-2 text-neutral-500 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors"
              title="View specifications & review"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-black text-white text-[11px] sm:text-xs font-semibold hover:bg-neutral-800 transition-all active:scale-95 shadow-xs"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Buy</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
