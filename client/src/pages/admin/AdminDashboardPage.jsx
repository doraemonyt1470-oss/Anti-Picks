import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Eye,
  MousePointerClick,
  TrendingUp,
  Award,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Star,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { formatCompactNumber, formatCurrency, calculateCTR } from '../../utils/formatters.js';
import SEO from '../../components/SEO.jsx';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getDashboardAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-neutral-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, timeSeries = [], categoryStats = [], productAnalytics = [] } = data || {};

  // Calculate highest metric for the chart scaling
  const maxVal = Math.max(...timeSeries.map((d) => Math.max(d.views, d.clicks)), 100);

  return (
    <>
      <SEO title="Admin Dashboard" description="Overview of real views, clicks, products, and categories." />

      <div className="space-y-8">
        {/* Header Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Real-time analytics engine powered by your active database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/adashishmin/categories"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-black transition-colors"
            >
              <FolderTree className="w-4 h-4 text-neutral-500" />
              <span>Categories</span>
            </Link>
            <Link
              to="/adashishmin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Real Metrics Cards Grid (PRD Section 24) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Products */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
              <Package className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-2xl sm:text-3xl text-black">
                {summary?.totalProducts || 0}
              </span>
              <Link to="/adashishmin/products" className="text-xs font-semibold text-neutral-500 hover:text-black">
                Manage →
              </Link>
            </div>
          </div>

          {/* Total Categories */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Categories</span>
              <FolderTree className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-2xl sm:text-3xl text-black">
                {summary?.totalCategories || 0}
              </span>
              <Link to="/adashishmin/categories" className="text-xs font-semibold text-neutral-500 hover:text-black">
                Manage →
              </Link>
            </div>
          </div>

          {/* Total Views */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
              <Eye className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-2xl sm:text-3xl text-black">
                {formatCompactNumber(summary?.totalViews || 0)}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">Deduplicated</span>
            </div>
          </div>

          {/* Total Affiliate Clicks */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Affiliate Clicks</span>
              <MousePointerClick className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-2xl sm:text-3xl text-black">
                {formatCompactNumber(summary?.totalClicks || 0)}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                CTR: {summary?.overallCTR || '0.00%'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Product & Top Category Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Top Product */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div className="min-w-0 flex-grow">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Highest Converting Product
              </span>
              <h3 className="font-display font-bold text-base text-black truncate">
                {summary?.topProduct?.name || 'No conversions yet'}
              </h3>
              <p className="text-xs text-neutral-500">
                {summary?.topProduct?.clicks || 0} clicks • {summary?.topProduct?.views || 0} views •{' '}
                <strong className="text-black">
                  {calculateCTR(summary?.topProduct?.clicks, summary?.topProduct?.views)} CTR
                </strong>
              </p>
            </div>
            {summary?.topProduct && (
              <Link
                to={`/products/${summary.topProduct.slug}`}
                target="_blank"
                className="p-2 text-neutral-400 hover:text-black rounded-lg"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Top Category */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="min-w-0 flex-grow">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Top Performing Category
              </span>
              <h3 className="font-display font-bold text-base text-black truncate">
                {summary?.topCategory?.name || 'All'}
              </h3>
              <p className="text-xs text-neutral-500">
                {summary?.topCategory?.product_count || 0} products • {summary?.topCategory?.clicks || 0} clicks •{' '}
                <strong className="text-black">{summary?.topCategory?.ctr || '0.00'}% CTR</strong>
              </p>
            </div>
            {summary?.topCategory && (
              <Link
                to={`/?category=${summary.topCategory.slug}`}
                target="_blank"
                className="p-2 text-neutral-400 hover:text-black rounded-lg"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Real Database Analytics Visual Chart */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display font-bold text-lg text-black">Traffic & Affiliate Conversions</h2>
              <p className="text-xs text-neutral-500">Views vs. Outbound Affiliate Clicks trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-black" />
                <span className="text-neutral-700 font-medium">Views</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-neutral-700 font-medium">Clicks</span>
              </span>
            </div>
          </div>

          {/* Bar Comparison Chart */}
          <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-neutral-200">
            {timeSeries.map((item, index) => {
              const viewHeight = Math.max(10, (item.views / maxVal) * 100);
              const clickHeight = Math.max(8, (item.clicks / maxVal) * 100);

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                    {/* View Bar */}
                    <div
                      style={{ height: `${viewHeight}%` }}
                      className="w-full max-w-[20px] bg-black rounded-t-sm transition-all group-hover:bg-neutral-800"
                      title={`${item.views} Views`}
                    />
                    {/* Click Bar */}
                    <div
                      style={{ height: `${clickHeight}%` }}
                      className="w-full max-w-[20px] bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-600"
                      title={`${item.clicks} Clicks`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products Analytics Table */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-black">Product Performance Overview</h2>
              <p className="text-xs text-neutral-500">Real clicks, views, and CTR by product</p>
            </div>
            <Link
              to="/adashishmin/products"
              className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Views</th>
                  <th className="pb-3 text-right">Clicks</th>
                  <th className="pb-3 text-right">CTR</th>
                  <th className="pb-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {productAnalytics.slice(0, 6).map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50">
                    <td className="py-3 font-semibold text-black max-w-[200px] truncate">
                      {prod.name}
                    </td>
                    <td className="py-3 text-neutral-600">{prod.category}</td>
                    <td className="py-3 text-right text-neutral-700 font-mono">
                      {formatCompactNumber(prod.views)}
                    </td>
                    <td className="py-3 text-right text-neutral-700 font-mono font-bold">
                      {formatCompactNumber(prod.clicks)}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">{prod.ctr}%</td>
                    <td className="py-3 text-right text-neutral-700">
                      ★ {parseFloat(prod.rating).toFixed(1)}
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
