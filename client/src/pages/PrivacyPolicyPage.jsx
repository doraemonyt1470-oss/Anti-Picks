import React from 'react';
import SEO from '../components/SEO.jsx';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for ANTI PICKS. Transparency on views, click tracking, and user data."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
            Legal & Data Protection
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400 font-mono">Effective: October 2026</p>
        </div>

        <div className="prose prose-neutral max-w-none text-neutral-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            ANTI PICKS ("we", "our", or "us") is dedicated to respecting your privacy.
            This policy outlines what data we collect, why we collect it, and how your information is handled.
          </p>

          <h2 className="font-display font-bold text-xl text-black">1. Information We Collect</h2>
          <p>
            <strong>Product View Deduplication:</strong> When you open a product page, our server records a product view. To prevent artificial view inflation without tracking your identity, we generate an anonymous one-way cryptographic hash of your IP address and user agent. We do not store raw IP addresses or link views to individual user profiles.
          </p>
          <p>
            <strong>Affiliate Outbound Clicks:</strong> When you click "Buy Now", our server records an anonymous click event containing the product ID, timestamp, and referring URL, after which you are redirected to the merchant.
          </p>
          <h2 className="font-display font-bold text-xl text-black">2. Cookies and Local Storage</h2>
          <p>
            We do not use invasive tracking or cross-site advertising cookies. We use browser local storage solely for functional interface preferences:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Remembering admin session tokens (if logged into the administration panel).</li>
            <li>Tracking interface state during your browsing session.</li>
          </ul>

          <h2 className="font-display font-bold text-xl text-black">3. Third-Party Merchants</h2>
          <p>
            When you follow an outbound affiliate link, you leave ANTI PICKS and enter a third-party retailer's website (e.g. Amazon, brand webstores). That retailer's respective privacy policy governs your activity on their platform.
          </p>

          <h2 className="font-display font-bold text-xl text-black">4. Data Security</h2>
          <p>
            We enforce strict security practices, including HTTPS encryption, Row Level Security (RLS) on database tables, rate limiting to protect against abuse, and strict isolation of admin credentials.
          </p>
        </div>
      </div>
    </>
  );
}
