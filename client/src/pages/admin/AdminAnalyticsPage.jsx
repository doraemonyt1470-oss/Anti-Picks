import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ArrowDown, ArrowUp, MousePointerClick, Eye, ArrowUpRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { formatCompactNumber, formatDate } from '../../utils/formatters.js';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO.jsx';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getDashboardAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs">Compiling real analytics metrics...</div>;
  }

  const { summary, productAnalytics = [], categoryStats = [] } = data || {};

  return (
    <>
      <SEO title="Product Analytics & Conversion Rates" description="In-depth conversion rate, click-through, and traffic analytics." />

      <div className="space-y-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
            Affiliate & Product Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Conversion metrics computed from raw product views and outbound affiliate clicks.
          </p>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Views</span>
            <div className="font-display font-black text-2xl text-black">
              {formatCompactNumber(summary?.totalViews || 0)}
            </div>
            <p className="text-[11px] text-neutral-500">Recorded using anonymous IP hash deduplication</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Clicks</span>
            <div className="font-display font-black text-2xl text-black">
              {formatCompactNumber(summary?.totalClicks || 0)}
            </div>
            <p className="text-[11px] text-neutral-500">Successful 302 redirects to partner merchants</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Overall Platform CTR</span>
            <div className="font-display font-black text-2xl text-emerald-600">
              {summary?.overallCTR || '0.00%'}
            </div>
            <p className="text-[11px] text-neutral-500">Calculated as (Clicks / Views) × 100</p>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-black">Category Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-black">{c.name}</h3>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{c.ctr}% CTR</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase">Items</span>
                    <p className="font-bold text-xs text-black">{c.product_count}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase">Views</span>
                    <p className="font-bold text-xs text-black">{formatCompactNumber(c.views)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase">Clicks</span>
                    <p className="font-bold text-xs text-black">{formatCompactNumber(c.clicks)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Product Analytics Table (PRD Section 28) */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden space-y-4 p-6">
          <div>
            <h2 className="font-display font-bold text-lg text-black">All Products Conversion Matrix</h2>
            <p className="text-xs text-neutral-500">Product Name, Views, Clicks, CTR, Rating, Rating Count, Created Date, Status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Views</th>
                  <th className="py-3 px-3 text-right">Clicks</th>
                  <th className="py-3 px-3 text-right">CTR (%)</th>
                  <th className="py-3 px-3 text-right">Rating</th>
                  <th className="py-3 px-3">Created Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {productAnalytics.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80">
                    <td className="py-3 px-3 font-semibold text-black max-w-xs truncate">
                      <Link to={`/products/${p.slug}`} target="_blank" className="hover:underline flex items-center gap-1">
                        <span>{p.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{p.category}</td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-700">
                      {formatCompactNumber(p.views)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                      {formatCompactNumber(p.clicks)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 font-mono">
                      {p.ctr}%
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-neutral-800">
                      ★ {parseFloat(p.rating).toFixed(1)} ({p.rating_count})
                    </td>
                    <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
