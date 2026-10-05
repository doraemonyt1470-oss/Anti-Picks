import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl sm:rounded-2xl border border-neutral-200/80 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square sm:aspect-[4/3] bg-neutral-200" />

      {/* Content Skeleton */}
      <div className="p-2.5 sm:p-5 flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-8 sm:w-12 h-3 sm:h-4 bg-neutral-200 rounded" />
          <div className="w-12 sm:w-20 h-3 sm:h-4 bg-neutral-200 rounded" />
        </div>
        <div className="w-full h-4 sm:h-5 bg-neutral-200 rounded" />
        <div className="hidden sm:block w-full h-4 bg-neutral-200 rounded" />

        <div className="pt-2 sm:pt-3 border-t border-neutral-100 flex items-center justify-between mt-1">
          <div className="w-12 sm:w-16 h-4 sm:h-6 bg-neutral-200 rounded" />
          <div className="w-14 sm:w-20 h-6 sm:h-8 bg-neutral-200 rounded-lg sm:rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full aspect-square sm:aspect-[4/3] bg-neutral-200 rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="w-24 h-5 bg-neutral-200 rounded-full" />
          <div className="w-3/4 h-8 bg-neutral-200 rounded" />
          <div className="w-32 h-6 bg-neutral-200 rounded" />
          <div className="w-24 h-8 bg-neutral-200 rounded" />
          <div className="w-full h-24 bg-neutral-200 rounded-xl" />
          <div className="w-full h-12 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
