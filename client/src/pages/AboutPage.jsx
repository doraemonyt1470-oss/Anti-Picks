import React from 'react';
import SEO from '../components/SEO.jsx';
import { ShieldCheck, EyeOff, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Philosophy & Editorial Criteria"
        description="Learn why ANTI PICKS exists: pure curation, zero sponsored hype, and uncompromising standards for modern gear."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
            About ANTI PICKS
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-black tracking-tight leading-tight">
            The antidote to modern product noise.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            The internet is flooded with AI-generated review spam, paid manufacturer promotions, and disposable junk.
            ANTI PICKS was created to cut straight to what's genuinely worth your hard-earned money.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-black">Zero Paid Placements</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Brands cannot pay to appear on ANTI PICKS. Every product in our directory is hand-selected and evaluated by our editors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-black">Material Honesty</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We favor solid milled metals, repairable internals, and timeless ergonomics over cheap plastics and planned obsolescence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-black">Unbiased Economics</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We earn affiliate commissions only when you decide a product is right for you. Our financial incentive is aligned with your satisfaction.
            </p>
          </div>
        </div>

        {/* Deep Dive Philosophy */}
        <div className="prose prose-neutral max-w-none text-neutral-700 space-y-6 leading-relaxed text-sm sm:text-base border-t border-neutral-200/80 pt-12">
          <h2 className="font-display font-extrabold text-2xl text-black">Our 5 Curation Rules</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Utility before vanity:</strong> Does this object perform its intended job exceptionally well, or does it merely look good in render mockups?
            </li>
            <li>
              <strong>Sensory tactile feedback:</strong> Physical tools should feel satisfying to touch, switch, press, and carry every day.
            </li>
            <li>
              <strong>Longevity over hype:</strong> Will this device or accessory still be usable and aesthetically respected 5 years from today?
            </li>
            <li>
              <strong>Honest pricing value:</strong> Is the price justified by craftsmanship and engineering, or is it an artificial luxury markup?
            </li>
            <li>
              <strong>User autonomy:</strong> Does the product respect your privacy and ownership, avoiding unnecessary proprietary lock-in?
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
