import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Check,
  Star,
  DollarSign,
  Link as LinkIcon,
  Layers,
  Zap,
  Loader2,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import SEO from '../../components/SEO.jsx';

export default function AdminProductEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Magic Auto-Fetch from Affiliate Link state
  const [importUrl, setImportUrl] = useState('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [fetchStats, setFetchStats] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    category_id: '',
    affiliate_url: '',
    price: '',
    original_price: '',
    currency: 'INR',
    rating: 5.0,
    rating_count: 1,
    featured: false,
    status: 'published',
    brand: '',
    sku: '',
  });

  // Images list
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Tags list
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Pros & Cons
  const [pros, setPros] = useState([]);
  const [newPro, setNewPro] = useState('');
  const [cons, setCons] = useState([]);
  const [newCon, setNewCon] = useState('');

  // Specifications
  const [specs, setSpecs] = useState([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Scraped Real Customer Reviews
  const [scrapedReviews, setScrapedReviews] = useState([]);

  // Magic Auto-Fetch Handler
  const handleAutoFetch = async (targetUrl = null) => {
    const urlToFetch = (targetUrl || importUrl || formData.affiliate_url || '').trim();
    if (!urlToFetch) {
      addToast({ message: 'Please enter a product affiliate link first.', type: 'error' });
      return;
    }

    setIsFetchingDetails(true);
    setFetchStats(null);
    try {
      const res = await api.scrapeProduct(urlToFetch);
      if (!res || !res.data) throw new Error('No product data could be parsed from the link.');

      const data = res.data;

      // Smart category auto-matching
      let matchedCatId = formData.category_id;
      if (categories.length > 0 && !matchedCatId) {
        const lowerSearch = `${data.name || ''} ${data.brand || ''} ${data.description || ''}`.toLowerCase();
        const matched = categories.find((c) =>
          lowerSearch.includes(c.name.toLowerCase()) || lowerSearch.includes(c.slug.toLowerCase())
        );
        if (matched) matchedCatId = matched.id;
      }

      setFormData((prev) => ({
        ...prev,
        name: data.name || prev.name,
        slug: data.slug || prev.slug,
        brand: data.brand || prev.brand,
        short_description: data.short_description || prev.short_description,
        description: data.description || prev.description,
        price: data.price !== '' ? data.price : prev.price,
        original_price: data.original_price !== '' ? data.original_price : prev.original_price,
        currency: data.currency || prev.currency,
        rating: data.rating || prev.rating,
        rating_count: data.rating_count || prev.rating_count,
        affiliate_url: data.affiliate_url || urlToFetch,
        category_id: matchedCatId || prev.category_id,
      }));

      // Populate Images
      if (data.images && data.images.length > 0) {
        setImages(data.images);
      }

      // Populate Real Customer Reviews
      if (data.reviews && data.reviews.length > 0) {
        setScrapedReviews(data.reviews);
      }

      // Populate Pros / Highlights
      if (data.pros && data.pros.length > 0) {
        setPros(data.pros);
      }

      // Populate Specifications (clean non-technical junk)
      if (data.specifications && Object.keys(data.specifications).length > 0) {
        const specArray = Object.entries(data.specifications)
          .filter(([key, val]) => {
            const k = (key || '').toLowerCase();
            const v = String(val || '');
            if (
              k.includes('customer review') ||
              k.includes('ratings') ||
              k.includes('rating') ||
              k.includes('best seller') ||
              k.includes('asin') ||
              k.includes('date first')
            ) {
              return false;
            }
            if (
              v.includes('dpAcrHasRegistered') ||
              v.includes('function(') ||
              v.includes('P.when') ||
              v.includes('var ') ||
              v.includes('window.ue')
            ) {
              return false;
            }
            return true;
          })
          .map(([key, val]) => ({
            key,
            val: String(val),
          }));
        setSpecs(specArray);
      }

      setFetchStats({
        title: data.name,
        imagesCount: data.images?.length || 0,
        specsCount: Object.keys(data.specifications || {}).length,
        reviewsCount: data.reviews?.length || 0,
      });

      addToast({
        message: `✨ Extracted ${data.images?.length || 0} unique images & ${data.reviews?.length || 0} real reviews!`,
        type: 'success',
      });
    } catch (err) {
      console.error('Auto-fetch error:', err);
      addToast({
        message: err.message || 'Failed to auto-fetch details. Please verify the URL or enter manually.',
        type: 'error',
      });
    } finally {
      setIsFetchingDetails(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await api.getCategories();
        setCategories(catRes.categories || []);

        if (isEditing) {
          const prodData = await api.getProductBySlug(id);
          if (prodData && prodData.product) {
            const p = prodData.product;
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              short_description: p.short_description || '',
              description: p.description || '',
              category_id: p.category_id || '',
              affiliate_url: p.affiliate_url || '',
              price: p.price !== null ? p.price : '',
              original_price: p.original_price !== null ? p.original_price : '',
              currency: p.currency || 'USD',
              rating: p.rating || 5.0,
              rating_count: p.rating_count || 1,
              featured: Boolean(p.featured),
              status: p.status || 'published',
              brand: p.brand || '',
              sku: p.sku || '',
            });

            if (p.images) setImages(p.images);
            if (p.tags) setTags(p.tags);
            if (p.pros) setPros(p.pros);
            if (p.cons) setCons(p.cons);
            if (p.specifications) {
              setSpecs(
                Object.entries(p.specifications)
                  .filter(([key, val]) => {
                    const k = (key || '').toLowerCase();
                    const v = String(val || '');
                    if (
                      k.includes('customer review') ||
                      k.includes('ratings') ||
                      k.includes('rating') ||
                      k.includes('best seller') ||
                      k.includes('asin')
                    ) {
                      return false;
                    }
                    if (
                      v.includes('dpAcrHasRegistered') ||
                      v.includes('function(') ||
                      v.includes('P.when') ||
                      v.includes('var ') ||
                      v.includes('window.ue')
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map(([key, val]) => ({ key, val: String(val) }))
              );
            }
          }
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        addToast({ message: 'Error loading product data', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEditing ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : prev.slug,
    }));
  };

  // Image Management
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        image_url: newImageUrl.trim(),
        sort_order: prev.length,
        is_primary: prev.length === 0,
      },
    ]);
    setNewImageUrl('');
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  // Tag Management
  const addTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newTag.trim() && !tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
        setNewTag('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Pros & Cons
  const addPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const addCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  // Specs
  const addSpec = () => {
    if (newSpecKey.trim() && newSpecVal.trim()) {
      setSpecs([...specs, { key: newSpecKey.trim(), val: newSpecVal.trim() }]);
      setNewSpecKey('');
      setNewSpecVal('');
    }
  };

  const handleSubmit = async (targetStatus = null) => {
    if (!formData.name || !formData.affiliate_url) {
      addToast({ message: 'Product name and Affiliate URL are required', type: 'error' });
      return;
    }

    setSaving(true);
    const specObject = {};
    specs.forEach((s) => {
      specObject[s.key] = s.val;
    });

    const payload = {
      product: {
        ...formData,
        status: targetStatus || formData.status,
        tags,
        pros,
        cons,
        specifications: specObject,
      },
      images,
    };

    try {
      if (isEditing) {
        await api.updateProduct(id, payload.product, payload.images, scrapedReviews.length > 0 ? scrapedReviews : null);
        addToast({ message: 'Product updated successfully.' });
      } else {
        await api.createProduct(payload.product, payload.images, scrapedReviews);
        addToast({ message: 'New product published successfully.' });
      }
      navigate('/adashishmin/products');
    } catch (err) {
      console.error('Save product error:', err);
      addToast({ message: err.message || 'Failed to save product', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs">Loading editor...</div>;
  }

  return (
    <>
      <SEO
        title={isEditing ? `Edit ${formData.name || 'Product'}` : 'Create New Product'}
        description="Admin product editor for ANTI PICKS."
      />

      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Header Bar with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/adashishmin/products"
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-black">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-xs text-neutral-500">Configure editorial details and affiliate metadata.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('published')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Publish Product'}</span>
            </button>
          </div>
        </div>

        {/* Editor Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info - 2 Columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Magic Auto-Fetch from Affiliate Link Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-200/90 shadow-2xs space-y-3.5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-neutral-900 flex items-center gap-2">
                      Auto-Fetch via Affiliate Link
                      <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        1-Click Import
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-600">
                      Paste an Amazon, Flipkart, or e-commerce link to auto-fill title, gallery images, description & specs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <div className="relative flex-grow">
                  <input
                    type="url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://www.amazon.in/dp/... or https://amzn.to/..."
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
                    disabled={isFetchingDetails}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAutoFetch();
                      }
                    }}
                  />
                  {importUrl && (
                    <button
                      type="button"
                      onClick={() => setImportUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAutoFetch()}
                  disabled={isFetchingDetails || !importUrl.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
                >
                  {isFetchingDetails ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting Data...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Fetch Details & Images</span>
                    </>
                  )}
                </button>
              </div>

              {/* Supported Platforms Tag line */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 pt-0.5">
                <span className="font-semibold text-neutral-700">Supported Platforms:</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700 text-[10px] font-medium">
                  Amazon (.in, .com, amzn.to)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700 text-[10px] font-medium">
                  Flipkart
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700 text-[10px] font-medium">
                  Shopify & General Stores
                </span>
              </div>

              {/* Success summary badge */}
              {fetchStats && (
                <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      Successfully extracted <strong>{fetchStats.imagesCount} unique images</strong>, <strong>{fetchStats.specsCount} specifications</strong>
                      {fetchStats.reviewsCount > 0 && <>, and <strong>{fetchStats.reviewsCount} real customer reviews</strong></>}!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFetchStats(null)}
                    className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* General Info Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-black">General Information</h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Teenage Engineering OP-1 Field"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Slug (URL Identifier)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. teenage-engineering-op-1-field"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Brand / Maker
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Teenage Engineering"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    SKU / Model Number
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. TE-OP1-FLD"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-black focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Short Editorial Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="One punchy sentence summarizing why this item is worth buying."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Editorial Review / Description
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of construction quality, real-world testing, acoustic or ergonomic performance..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-black focus:outline-none focus:border-black leading-relaxed"
                />
              </div>
            </div>

            {/* Images Manager Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-black flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Product Images Gallery ({images.length})
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (Unsplash, CDN, or Supabase Storage)..."
                  className="flex-grow px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-black"
                >
                  Add Image
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100"
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className={`p-1.5 rounded-md text-[10px] font-bold ${
                            img.is_primary ? 'bg-emerald-500 text-white' : 'bg-white text-black'
                          }`}
                          title="Set as Primary"
                        >
                          {img.is_primary ? 'Primary' : 'Make Cover'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1.5 rounded-md bg-red-600 text-white"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {img.is_primary && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black text-white text-[9px] font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pros and Cons Editor */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-black">Pros & Considerations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-700 block">Pros</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newPro}
                      onChange={(e) => setNewPro(e.target.value)}
                      placeholder="Add an advantage..."
                      className="flex-grow px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                    />
                    <button
                      type="button"
                      onClick={addPro}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-100 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 pt-1">
                    {pros.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-xs p-1.5 bg-neutral-50 rounded-md"
                      >
                        <span className="truncate">{p}</span>
                        <button
                          type="button"
                          onClick={() => setPros(pros.filter((_, idx) => idx !== i))}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-600 block">Considerations</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newCon}
                      onChange={(e) => setNewCon(e.target.value)}
                      placeholder="Add a trade-off..."
                      className="flex-grow px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                    />
                    <button
                      type="button"
                      onClick={addCon}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-100 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 pt-1">
                    {cons.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-xs p-1.5 bg-neutral-50 rounded-md"
                      >
                        <span className="truncate">{c}</span>
                        <button
                          type="button"
                          onClick={() => setCons(cons.filter((_, idx) => idx !== i))}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Specifications Key-Value Editor */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-black">Product Specifications</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g. Battery Life)"
                  className="w-1/3 px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
                <input
                  type="text"
                  value={newSpecVal}
                  onChange={(e) => setNewSpecVal(e.target.value)}
                  placeholder="Value (e.g. 24 hours)"
                  className="flex-grow px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
                <button
                  type="button"
                  onClick={addSpec}
                  className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
                >
                  Add Spec
                </button>
              </div>

              {specs.length > 0 && (
                <div className="divide-y divide-neutral-100 pt-2">
                  {specs.map((s, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-600">{s.key}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-black">{s.val}</span>
                        <button
                          type="button"
                          onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                          className="text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Settings - 1 Column */}
          <div className="space-y-6">
            {/* Affiliate & Link Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-black flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-600" />
                  Affiliate Target Link *
                </h3>
              </div>
              <div className="space-y-2">
                <input
                  type="url"
                  required
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                  placeholder="https://amazon.in/dp/... or amzn.to/..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-black"
                />
                {formData.affiliate_url && (
                  <button
                    type="button"
                    onClick={() => handleAutoFetch(formData.affiliate_url)}
                    disabled={isFetchingDetails}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isFetchingDetails ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                    )}
                    <span>⚡ Fetch Details From This Link</span>
                  </button>
                )}
                <p className="text-[10px] text-neutral-400">
                  Visitors are redirected through tracking engine to this destination.
                </p>
              </div>
            </div>

            {/* Pricing & Category */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-sm text-black">Pricing & Category</h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-black focus:outline-none focus:border-black bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1999.00"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="2199.00"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-black"
                  />
                </div>
              </div>
            </div>

            {/* Rating Controls (PRD Section 19: Admin can set/edit rating) */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-sm text-black flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Editorial Rating
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Score (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.rating_count}
                    onChange={(e) => setFormData({ ...formData, rating_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-black"
                  />
                </div>
              </div>
            </div>

            {/* Publishing & Tags */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-sm text-black">Status & Visibility</h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-black bg-white"
                >
                  <option value="published">Published (Visible to public)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                  />
                  <span className="text-xs font-semibold text-black">
                    Feature as Staff Favorite
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Product Tags
                </label>
                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Press enter to add tag..."
                    className="flex-grow px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-2.5 py-1.5 bg-neutral-100 rounded-lg text-xs font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px]"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-neutral-400 hover:text-black font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
