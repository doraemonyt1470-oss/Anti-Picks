import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  MousePointerClick,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { formatCurrency, formatCompactNumber, calculateCTR, formatDate } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import SEO from '../../components/SEO.jsx';

export default function AdminProductsPage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getAdminProducts({
          search: search.trim() || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          limit: 100,
        }),
        api.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      addToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  // Delete confirmation action (PRD Section 27)
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(productToDelete.id, true);
      addToast({ message: `"${productToDelete.name}" deleted successfully.` });
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      console.error('Delete product error:', err);
      addToast({ message: 'Failed to delete product', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <SEO title="Product Management" description="Add, edit, and organize curated products." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
              Product Management
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Control catalogue items, affiliate redirect links, and editorial ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/adashishmin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ Auto-Import by Link</span>
            </Link>
            <Link
              to="/adashishmin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, brand, SKU..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-black focus:outline-none focus:border-black"
            />
          </form>

          <div className="flex items-center gap-2.5 overflow-x-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table (PRD Section 28: Name, Views, Clicks, CTR, Rating, Rating Count, Created Date, Status) */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-3 text-right">Views</th>
                  <th className="py-3.5 px-3 text-right">Clicks</th>
                  <th className="py-3.5 px-3 text-right">CTR</th>
                  <th className="py-3.5 px-3">Rating</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-neutral-400 font-mono">
                      Loading catalogue data...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-neutral-500">
                      No products found. Click "Add New Product" to publish one.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const ctr = calculateCTR(prod.clicks, prod.views);
                    return (
                      <tr key={prod.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0 border border-neutral-200"
                            />
                            <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                              <p className="font-semibold text-black truncate">{prod.name}</p>
                              <p className="text-[11px] text-neutral-400 truncate">
                                {prod.brand || 'No brand'} • Created {formatDate(prod.created_at)}
                              </p>
                            </div>
                            {prod.featured && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Featured Pick" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-600 font-medium">
                          {prod.category?.name || 'Uncategorized'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-black">
                          {formatCurrency(prod.price, prod.currency)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-neutral-700">
                          {formatCompactNumber(prod.views)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                          {formatCompactNumber(prod.clicks)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">
                          {ctr}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 font-semibold text-neutral-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{parseFloat(prod.rating).toFixed(1)}</span>
                            <span className="text-[10px] text-neutral-400 font-normal">
                              ({prod.rating_count})
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              prod.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.status === 'draft'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/products/${prod.slug}`}
                              target="_blank"
                              className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
                              title="View on site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              to={`/adashishmin/products/${prod.id}/edit`}
                              className="p-1.5 text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-100"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (PRD Section 27) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-black">Delete this product?</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-black">{productToDelete.name}</strong>?
              This action cannot be undone and will permanently remove associated images and stats.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
