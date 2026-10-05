import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] text-white border-t border-neutral-800/80 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Row: Brand on Left, Essential Compliance Links on Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-800/60">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm"
            >
              A
            </div>
            <span
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="font-extrabold text-lg sm:text-xl tracking-[-0.03em] text-white"
            >
              ANTI PICKS
            </span>
          </Link>

          <span className="text-xs text-neutral-500 font-mono">Curated Product Discovery</span>
        </div>

        {/* Mandatory FTC Affiliate Disclosure Notice */}
        <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed text-center sm:text-left max-w-4xl">
          <span className="font-semibold text-neutral-300">Affiliate Disclosure:</span> ANTI PICKS participates in affiliate marketing programs. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you. Product selections are curated independently.
        </p>

        {/* Bottom Row: Copyright */}
        <div className="pt-4 border-t border-neutral-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} ANTI PICKS. All rights reserved.</p>
          <p>Curated Affiliate Product Discovery</p>
        </div>
      </div>
    </footer>
  );
}
