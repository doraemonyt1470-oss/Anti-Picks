import React from 'react';
import SEO from '../components/SEO.jsx';
import { ShieldCheck, Info } from 'lucide-react';

export default function AffiliateDisclosurePage() {
  return (
    <>
      <SEO
        title="Affiliate Disclosure & Transparency"
        description="Transparent affiliate disclosure for ANTI PICKS. How we earn commissions and maintain complete editorial independence."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
            Compliance & Transparency
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-black tracking-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-xs text-neutral-400 font-mono">Last updated: October 2026</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 flex items-start gap-3 text-xs sm:text-sm text-neutral-800">
          <Info className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <p>
            <strong>Plain English Summary:</strong> When you click a "Buy Now" button on ANTI PICKS and make a purchase on an external merchant website, we may receive a small affiliate commission. This never adds any cost to your purchase.
          </p>
        </div>

        <div className="prose prose-neutral max-w-none text-neutral-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <h2 className="font-display font-bold text-xl text-black">How Affiliate Linking Operates</h2>
          <p>
            ANTI PICKS participates in various affiliate marketing programs designed to provide a means for websites to earn advertising fees by linking to external retail sites (such as Amazon, brand webstores, and authorized distributors).
          </p>
          <p>
            When you click an outbound link on our website, a tracking code or cookie is provided to the retailer to credit ANTI PICKS if a qualifying purchase is completed.
          </p>

          <h2 className="font-display font-bold text-xl text-black">Zero Commercial Bias in Editorial Choices</h2>
          <p>
            Our product curation, editorial opinions, ratings, pros, and cons are determined entirely by our editorial team before any commercial affiliate link is created. We do not accept payment to feature specific items, nor do we alter our evaluations to prioritize products with higher affiliate payout rates.
          </p>

          <h2 className="font-display font-bold text-xl text-black">No Affiliation with Retailers as an Agent</h2>
          <p>
            ANTI PICKS is an independent product discovery platform and is not Amazon, Apple, Teenage Engineering, Sony, or any other mentioned brand or retailer. All trademarks, logos, and brand names are the property of their respective owners. Product prices and availability are subject to change on the merchant's site.
          </p>


        </div>
      </div>
    </>
  );
}
