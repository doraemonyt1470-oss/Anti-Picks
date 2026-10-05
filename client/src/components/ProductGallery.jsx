import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryList = images.length > 0 ? images : [{ image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85' }];
  const currentImage = galleryList[selectedIndex]?.image_url || galleryList[0]?.image_url;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Desktop & Mobile Main Gallery */}
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
        {galleryList.length > 1 && (
          <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[500px] no-scrollbar shrink-0 py-1">
            {galleryList.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-neutral-100 ${
                  selectedIndex === idx
                    ? 'border-black shadow-xs ring-1 ring-black'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Display Stage */}
        <div className="relative flex-grow aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={currentImage}
              alt={`${productName} view ${selectedIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-contain sm:object-cover object-center"
            />
          </AnimatePresence>

          {/* Fullscreen Zoom trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 hover:text-black hover:bg-white shadow-xs transition-all active:scale-90"
            title="View Fullscreen Lightbox"
            aria-label="View Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Previous / Next buttons */}
          {galleryList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-xs text-black hover:bg-white shadow-xs transition-transform active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-xs text-black hover:bg-white shadow-xs transition-transform active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot Counter Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">
                {galleryList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {galleryList.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white text-sm font-mono">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span>
                  {selectedIndex + 1} / {galleryList.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
