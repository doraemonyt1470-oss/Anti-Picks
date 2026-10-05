import React from 'react';
import SEO from '../components/SEO.jsx';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms and Conditions for using the ANTI PICKS product discovery platform."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
            Terms of Use
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-black tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-neutral-400 font-mono">Effective: October 2026</p>
        </div>

        <div className="prose prose-neutral max-w-none text-neutral-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            By accessing or browsing ANTI PICKS, you agree to comply with and be bound by these Terms and Conditions.
          </p>

          <h2 className="font-display font-bold text-xl text-black">1. Informational and Editorial Purpose</h2>
          <p>
            ANTI PICKS provides product recommendations and curated links for discovery purposes only. We do not manufacture, warehouse, ship, or process customer payments for external products. Any order you place with a third-party retailer constitutes a contract directly between you and that retailer.
          </p>

          <h2 className="font-display font-bold text-xl text-black">2. Pricing and Stock Availability</h2>
          <p>
            While we strive to keep prices, original prices, and product details updated, prices and inventory fluctuate frequently on merchant websites. The actual price displayed on the checkout page of the retailer is the official price.
          </p>

          <h2 className="font-display font-bold text-xl text-black">3. Intellectual Property</h2>
          <p>
            The ANTI PICKS brand, logo, website design, curation copy, and software are the exclusive intellectual property of ANTI PICKS. Product trademarks, logos, and manufacturer photography belong to their respective copyright holders.
          </p>

          <h2 className="font-display font-bold text-xl text-black">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, ANTI PICKS is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of products purchased via external affiliate links.
          </p>

          <h2 className="font-display font-bold text-xl text-black">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the website following any update signifies your acceptance of the revised terms.
          </p>
        </div>
      </div>
    </>
  );
}
