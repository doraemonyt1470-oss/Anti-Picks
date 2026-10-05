import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you requested could not be found." />
      <div className="max-w-md mx-auto py-28 text-center px-4 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-black">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3xl text-black">Page Not Found</h1>
          <p className="text-sm text-neutral-500">
            The page or product you're looking for doesn't exist or has moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </div>
    </>
  );
}
