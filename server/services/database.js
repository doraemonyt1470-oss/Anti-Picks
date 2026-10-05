import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';

// Empty in-memory storage (Demo data removed - all live data is stored in Supabase)
let localCategories = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Audio & Sound',
    slug: 'audio-sound',
    description: 'Audiophile grade headphones, synthesizers, and acoustic engineering.',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Workspace & Desk',
    slug: 'workspace-desk',
    description: 'Ergonomic mechanical keyboards, walnut monitor risers, and minimal desk tools.',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Photography & Optics',
    slug: 'photography-optics',
    description: 'Compact mirrorless cameras, rangefinders, and cinema-grade glass.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Everyday Carry',
    slug: 'everyday-carry',
    description: 'Precision titanium pens, modular tech bags, and machined minimalist accessories.',
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Computing & Displays',
    slug: 'computing-displays',
    description: 'Color-accurate 5K monitors, workstation docks, and compact powerhouse devices.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Smart Living',
    slug: 'smart-living',
    description: 'Architectural lighting, acoustic air purifiers, and industrial home gadgets.',
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let localProducts = [];
let localProductImages = [];
let localRatings = [];
let localViewsHistory = [];
let localClicksHistory = [];

let localSettings = {
  site_name: 'ANTI PICKS',
  tagline: "DISCOVER WHAT'S WORTH BUYING.",
  site_description: 'Curated products, honest ratings and smart picks for modern tastemakers.',
  contact_email: 'hello@antipicks.com',
  accent_color: '#000000',
  social_links: {
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com',
  },
  footer_text: '© 2026 ANTI PICKS. Curated products, honest ratings and smart picks.',
  affiliate_disclosure: 'ANTI PICKS may use affiliate links. When a user purchases through an affiliate link, ANTI PICKS may receive a commission at no additional cost to the user. We only recommend products our editors personally vouch for.',
  seo_title: 'ANTI PICKS — Premium Affiliate Product Discovery',
  seo_description: "Discover what's worth buying. Handpicked modern tech, audio, workspace gear, and lifestyle essentials.",
  updated_at: new Date().toISOString(),
};

// In-memory view deduplication cache (ip_hash + productId -> timestamp)
const recentViewCache = new Map();

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Helper to format Supabase product row with joined images and category
function formatSupabaseProduct(p) {
  if (!p) return null;
  const images = (p.product_images || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const primaryImg = images.find((i) => i.is_primary) || images[0] || null;
  const category = p.categories || null;

  return {
    ...p,
    image_url: primaryImg ? primaryImg.image_url : null,
    images: images,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    specifications: p.specifications || {},
    pros: Array.isArray(p.pros) ? p.pros : [],
    cons: Array.isArray(p.cons) ? p.cons : [],
  };
}

// Helper to format in-memory product
function attachProductImages(product) {
  if (!product) return null;
  const images = localProductImages
    .filter((img) => img.product_id === product.id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const primaryImg = images.find((i) => i.is_primary) || images[0] || null;
  const category = localCategories.find((c) => c.id === product.category_id) || null;

  return {
    ...product,
    image_url: primaryImg ? primaryImg.image_url : null,
    images: images,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    tags: Array.isArray(product.tags) ? product.tags : [],
    specifications: product.specifications || {},
    pros: Array.isArray(product.pros) ? product.pros : [],
    cons: Array.isArray(product.cons) ? product.cons : [],
  };
}

export const dbService = {
  // ==========================================
  // CATEGORIES
  // ==========================================
  async getCategories(options = {}) {
    const { status } = options;
    if (isSupabaseConfigured()) {
      try {
        let query = getSupabase().from('categories').select('*').order('sort_order', { ascending: true });
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DB] Supabase getCategories fallback:', err.message);
      }
    }
    let list = [...localCategories];
    if (status) list = list.filter((c) => c.status === status);
    return list.sort((a, b) => a.sort_order - b.sort_order);
  },

  async createCategory(catData) {
    if (isSupabaseConfigured()) {
      try {
        let sortOrder = catData.sort_order;
        if (!sortOrder) {
          const { data: maxRow } = await getSupabase()
            .from('categories')
            .select('sort_order')
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();
          sortOrder = (maxRow?.sort_order || 0) + 1;
        }

        const payload = {
          name: catData.name,
          slug: catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          description: catData.description || '',
          image_url: catData.image_url || '',
          status: catData.status || 'active',
          sort_order: sortOrder,
        };
        const { data, error } = await getSupabase().from('categories').insert(payload).select().single();
        if (!error && data) return data;
        if (error) console.error('[DB] Supabase createCategory error:', error);
      } catch (err) {
        console.warn('[DB] Supabase createCategory fallback:', err.message);
      }
    }
    const newCategory = {
      id: `c-${Date.now()}`,
      name: catData.name,
      slug: catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catData.description || '',
      image_url: catData.image_url || '',
      status: catData.status || 'active',
      sort_order: catData.sort_order || localCategories.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localCategories.push(newCategory);
    return newCategory;
  },

  async updateCategory(id, catData) {
    if (isSupabaseConfigured()) {
      try {
        const updatePayload = { ...catData, updated_at: new Date().toISOString() };
        delete updatePayload.id;
        const { data, error } = await getSupabase().from('categories').update(updatePayload).eq('id', id).select().single();
        if (!error && data) return data;
        if (error) console.error('[DB] Supabase updateCategory error:', error);
      } catch (err) {
        console.warn('[DB] Supabase updateCategory fallback:', err.message);
      }
    }
    const index = localCategories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    localCategories[index] = { ...localCategories[index], ...catData, updated_at: new Date().toISOString() };
    return localCategories[index];
  },

  async deleteCategory(id) {
    if (isSupabaseConfigured()) {
      try {
        // Check if products exist in category
        const { count, error: pErr } = await getSupabase()
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', id)
          .neq('status', 'archived');

        if (!pErr && count > 0) {
          throw new Error('Cannot delete category: contains associated active products. Reassign products first.');
        }

        const { error } = await getSupabase().from('categories').delete().eq('id', id);
        if (!error) return true;
        if (error) throw new Error(error.message);
      } catch (err) {
        if (err.message.includes('Cannot delete category')) throw err;
        console.warn('[DB] Supabase deleteCategory fallback:', err.message);
      }
    }

    const hasProducts = localProducts.some((p) => p.category_id === id && p.status !== 'archived');
    if (hasProducts) {
      throw new Error('Cannot delete category: contains associated active products. Reassign products first.');
    }
    localCategories = localCategories.filter((c) => c.id !== id);
    return true;
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  async getProducts(params = {}) {
    const {
      category,
      search,
      sort = 'newest',
      status = 'published',
      featured,
      limit = 50,
      page = 1,
    } = params;

    if (isSupabaseConfigured()) {
      try {
        let query = getSupabase()
          .from('products')
          .select('*, product_images(*), categories(*)', { count: 'exact' });

        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        if (category && category !== 'all') {
          if (UUID_REGEX.test(category)) {
            query = query.eq('category_id', category);
          } else {
            // Find category by slug first
            const { data: catRow } = await getSupabase()
              .from('categories')
              .select('id')
              .eq('slug', category)
              .maybeSingle();

            if (catRow) {
              query = query.eq('category_id', catRow.id);
            } else {
              return { products: [], total: 0, page, limit, totalPages: 0 };
            }
          }
        }

        if (featured !== undefined) {
          query = query.eq('featured', String(featured) === 'true');
        }

        if (search && search.trim()) {
          const q = search.trim();
          query = query.or(`name.ilike.%${q}%,short_description.ilike.%${q}%,brand.ilike.%${q}%`);
        }

        // Sorting
        switch (sort) {
          case 'popular':
          case 'clicks':
            query = query.order('clicks', { ascending: false });
            break;
          case 'rating':
          case 'highest-rated':
            query = query.order('rating', { ascending: false });
            break;
          case 'views':
          case 'most-viewed':
            query = query.order('views', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (!error && data !== null) {
          return {
            products: data.map(formatSupabaseProduct),
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
          };
        }
        if (error) console.error('[DB] Supabase getProducts error:', error);
      } catch (err) {
        console.warn('[DB] Supabase getProducts exception:', err.message);
      }
    }

    // In-memory fallback
    let filtered = [...localProducts];

    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (category && category !== 'all') {
      const catObj = localCategories.find((c) => c.slug === category || c.id === category);
      if (catObj) {
        filtered = filtered.filter((p) => p.category_id === catObj.id);
      }
    }

    if (featured !== undefined) {
      const isFeat = String(featured) === 'true';
      filtered = filtered.filter((p) => Boolean(p.featured) === isFeat);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchDesc = (p.short_description || '').toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchName || matchDesc || matchBrand || matchTags;
      });
    }

    switch (sort) {
      case 'popular':
      case 'clicks':
        filtered.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
        break;
      case 'rating':
      case 'highest-rated':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'views':
      case 'most-viewed':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      products: paginated.map(attachProductImages),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getProductBySlug(slug) {
    if (isSupabaseConfigured()) {
      try {
        let query = getSupabase().from('products').select('*, product_images(*), categories(*)');
        if (UUID_REGEX.test(slug)) {
          query = query.or(`slug.eq.${slug},id.eq.${slug}`);
        } else {
          query = query.eq('slug', slug);
        }
        const { data, error } = await query.maybeSingle();
        if (!error && data) return formatSupabaseProduct(data);
      } catch (err) {
        console.warn('[DB] Supabase getProductBySlug error:', err.message);
      }
    }
    const product = localProducts.find((p) => p.slug === slug || p.id === slug);
    if (!product) return null;
    return attachProductImages(product);
  },

  async getProductById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await getSupabase()
          .from('products')
          .select('*, product_images(*), categories(*)')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) return formatSupabaseProduct(data);
      } catch (err) {
        console.warn('[DB] Supabase getProductById error:', err.message);
      }
    }
    const product = localProducts.find((p) => p.id === id);
    if (!product) return null;
    return attachProductImages(product);
  },

  async createProduct(productData, images = [], reviews = []) {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    if (isSupabaseConfigured()) {
      try {
        const insertPayload = {
          name: productData.name,
          slug,
          short_description: productData.short_description || '',
          description: productData.description || '',
          category_id: productData.category_id && UUID_REGEX.test(productData.category_id) ? productData.category_id : null,
          affiliate_url: productData.affiliate_url,
          price: productData.price !== undefined && productData.price !== '' ? parseFloat(productData.price) : null,
          original_price: productData.original_price !== undefined && productData.original_price !== '' ? parseFloat(productData.original_price) : null,
          currency: productData.currency || 'USD',
          rating: productData.rating !== undefined && productData.rating !== '' ? parseFloat(productData.rating) : 5.0,
          rating_count: productData.rating_count !== undefined && productData.rating_count !== '' ? parseInt(productData.rating_count, 10) : 1,
          featured: Boolean(productData.featured),
          status: productData.status || 'published',
          brand: productData.brand || null,
          sku: productData.sku || null,
          tags: Array.isArray(productData.tags) ? productData.tags : [],
          specifications: productData.specifications || {},
          pros: Array.isArray(productData.pros) ? productData.pros : [],
          cons: Array.isArray(productData.cons) ? productData.cons : [],
        };

        const { data: createdProduct, error: pErr } = await getSupabase()
          .from('products')
          .insert(insertPayload)
          .select()
          .single();

        if (pErr) {
          console.error('[DB] Supabase createProduct insert error:', pErr);
          throw new Error(pErr.message);
        }

        // Insert gallery images
        if (createdProduct && images && images.length > 0) {
          const imageRows = images.map((img, idx) => ({
            product_id: createdProduct.id,
            image_url: typeof img === 'string' ? img : img.image_url,
            sort_order: typeof img === 'object' && img.sort_order !== undefined ? img.sort_order : idx,
            is_primary: typeof img === 'object' && img.is_primary !== undefined ? img.is_primary : idx === 0,
          }));

          const { error: imgErr } = await getSupabase().from('product_images').insert(imageRows);
          if (imgErr) {
            console.error('[DB] Supabase createProduct images insert error:', imgErr);
          }
        }

        // Insert real customer reviews
        if (createdProduct && reviews && Array.isArray(reviews) && reviews.length > 0) {
          for (const rev of reviews) {
            try {
              await this.createRating({
                product_id: createdProduct.id,
                reviewer_name: rev.reviewer_name || rev.name || 'Verified Customer',
                rating: rev.rating || 5,
                title: rev.title || '',
                review: rev.review || rev.comment || '',
                status: 'approved',
              });
            } catch (rErr) {
              console.warn('[DB] Failed to insert customer review:', rErr.message);
            }
          }
        }

        return await this.getProductById(createdProduct.id);
      } catch (err) {
        console.error('[DB] Supabase createProduct failed:', err.message);
        throw err;
      }
    }

    // In-memory fallback
    const id = `p-${Date.now()}`;
    const newProd = {
      id,
      name: productData.name,
      slug,
      short_description: productData.short_description || '',
      description: productData.description || '',
      category_id: productData.category_id || null,
      affiliate_url: productData.affiliate_url,
      price: productData.price ? parseFloat(productData.price) : null,
      original_price: productData.original_price ? parseFloat(productData.original_price) : null,
      currency: productData.currency || 'USD',
      rating: productData.rating ? parseFloat(productData.rating) : 5.0,
      rating_count: productData.rating_count ? parseInt(productData.rating_count, 10) : 1,
      views: 0,
      clicks: 0,
      featured: Boolean(productData.featured),
      status: productData.status || 'published',
      brand: productData.brand || '',
      sku: productData.sku || '',
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      specifications: productData.specifications || {},
      pros: Array.isArray(productData.pros) ? productData.pros : [],
      cons: Array.isArray(productData.cons) ? productData.cons : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localProducts.unshift(newProd);

    if (images && images.length > 0) {
      images.forEach((img, idx) => {
        localProductImages.push({
          id: `img-${Date.now()}-${idx}`,
          product_id: id,
          image_url: typeof img === 'string' ? img : img.image_url,
          sort_order: typeof img === 'object' && img.sort_order !== undefined ? img.sort_order : idx,
          is_primary: idx === 0,
          created_at: new Date().toISOString(),
        });
      });
    }

    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      reviews.forEach((rev, idx) => {
        localRatings.push({
          id: `r-${Date.now()}-${idx}`,
          product_id: id,
          reviewer_name: rev.reviewer_name || rev.name || 'Verified Customer',
          rating: parseFloat(rev.rating || 5),
          title: rev.title || '',
          review: rev.review || rev.comment || '',
          status: 'approved',
          created_at: new Date().toISOString(),
        });
      });
    }

    return attachProductImages(newProd);
  },

  async updateProduct(id, productData, images = null, reviews = null) {
    if (isSupabaseConfigured() && UUID_REGEX.test(id)) {
      try {
        const updatePayload = {
          updated_at: new Date().toISOString(),
        };

        if (productData.name !== undefined) updatePayload.name = productData.name;
        if (productData.slug !== undefined) updatePayload.slug = productData.slug;
        if (productData.short_description !== undefined) updatePayload.short_description = productData.short_description;
        if (productData.description !== undefined) updatePayload.description = productData.description;
        if (productData.category_id !== undefined) updatePayload.category_id = UUID_REGEX.test(productData.category_id) ? productData.category_id : null;
        if (productData.affiliate_url !== undefined) updatePayload.affiliate_url = productData.affiliate_url;
        if (productData.price !== undefined) updatePayload.price = productData.price !== '' ? parseFloat(productData.price) : null;
        if (productData.original_price !== undefined) updatePayload.original_price = productData.original_price !== '' ? parseFloat(productData.original_price) : null;
        if (productData.currency !== undefined) updatePayload.currency = productData.currency;
        if (productData.rating !== undefined) updatePayload.rating = parseFloat(productData.rating);
        if (productData.rating_count !== undefined) updatePayload.rating_count = parseInt(productData.rating_count, 10);
        if (productData.featured !== undefined) updatePayload.featured = Boolean(productData.featured);
        if (productData.status !== undefined) updatePayload.status = productData.status;
        if (productData.brand !== undefined) updatePayload.brand = productData.brand;
        if (productData.sku !== undefined) updatePayload.sku = productData.sku;
        if (productData.tags !== undefined) updatePayload.tags = Array.isArray(productData.tags) ? productData.tags : [];
        if (productData.specifications !== undefined) updatePayload.specifications = productData.specifications;
        if (productData.pros !== undefined) updatePayload.pros = Array.isArray(productData.pros) ? productData.pros : [];
        if (productData.cons !== undefined) updatePayload.cons = Array.isArray(productData.cons) ? productData.cons : [];

        const { error: updateErr } = await getSupabase().from('products').update(updatePayload).eq('id', id);
        if (updateErr) {
          console.error('[DB] Supabase updateProduct error:', updateErr);
          throw new Error(updateErr.message);
        }

        // Replace images if provided
        if (images !== null && Array.isArray(images)) {
          await getSupabase().from('product_images').delete().eq('product_id', id);
          if (images.length > 0) {
            const imageRows = images.map((img, idx) => ({
              product_id: id,
              image_url: typeof img === 'string' ? img : img.image_url,
              sort_order: typeof img === 'object' && img.sort_order !== undefined ? img.sort_order : idx,
              is_primary: typeof img === 'object' && img.is_primary !== undefined ? img.is_primary : idx === 0,
            }));
            await getSupabase().from('product_images').insert(imageRows);
          }
        }

        // Replace or add real customer reviews if provided
        if (reviews !== null && Array.isArray(reviews) && reviews.length > 0) {
          await getSupabase().from('ratings').delete().eq('product_id', id);
          for (const rev of reviews) {
            try {
              await this.createRating({
                product_id: id,
                reviewer_name: rev.reviewer_name || rev.name || 'Verified Customer',
                rating: rev.rating || 5,
                title: rev.title || '',
                review: rev.review || rev.comment || '',
                status: 'approved',
              });
            } catch (rErr) {
              console.warn('[DB] Failed to insert customer review on update:', rErr.message);
            }
          }
        }

        return await this.getProductById(id);
      } catch (err) {
        console.error('[DB] Supabase updateProduct exception:', err.message);
        throw err;
      }
    }

    const idx = localProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    localProducts[idx] = {
      ...localProducts[idx],
      ...productData,
      price: productData.price !== undefined ? parseFloat(productData.price) : localProducts[idx].price,
      original_price: productData.original_price !== undefined ? parseFloat(productData.original_price) : localProducts[idx].original_price,
      rating: productData.rating !== undefined ? parseFloat(productData.rating) : localProducts[idx].rating,
      rating_count: productData.rating_count !== undefined ? parseInt(productData.rating_count, 10) : localProducts[idx].rating_count,
      featured: productData.featured !== undefined ? Boolean(productData.featured) : localProducts[idx].featured,
      updated_at: new Date().toISOString(),
    };

    if (images && Array.isArray(images)) {
      localProductImages = localProductImages.filter((img) => img.product_id !== id);
      images.forEach((img, i) => {
        localProductImages.push({
          id: `img-${Date.now()}-${i}`,
          product_id: id,
          image_url: typeof img === 'string' ? img : img.image_url,
          sort_order: typeof img === 'object' && img.sort_order !== undefined ? img.sort_order : i,
          is_primary: i === 0,
          created_at: new Date().toISOString(),
        });
      });
    }

    if (reviews !== null && Array.isArray(reviews)) {
      localRatings = localRatings.filter((r) => r.product_id !== id);
      reviews.forEach((rev, idx) => {
        localRatings.push({
          id: `r-${Date.now()}-${idx}`,
          product_id: id,
          reviewer_name: rev.reviewer_name || rev.name || 'Verified Customer',
          rating: parseFloat(rev.rating || 5),
          title: rev.title || '',
          review: rev.review || rev.comment || '',
          status: 'approved',
          created_at: new Date().toISOString(),
        });
      });
    }

    return attachProductImages(localProducts[idx]);
  },

  async deleteProduct(id, permanent = false) {
    if (isSupabaseConfigured() && UUID_REGEX.test(id)) {
      try {
        if (permanent) {
          const { error } = await getSupabase().from('products').delete().eq('id', id);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await getSupabase()
            .from('products')
            .update({ status: 'archived', updated_at: new Date().toISOString() })
            .eq('id', id);
          if (error) throw new Error(error.message);
        }
        return true;
      } catch (err) {
        console.error('[DB] Supabase deleteProduct error:', err.message);
        throw err;
      }
    }

    if (permanent) {
      localProducts = localProducts.filter((p) => p.id !== id);
      localProductImages = localProductImages.filter((img) => img.product_id !== id);
    } else {
      const p = localProducts.find((item) => item.id === id);
      if (p) p.status = 'archived';
    }
    return true;
  },

  // ==========================================
  // ANALYTICS & TRACKING
  // ==========================================
  async recordProductView(productId, ipHash = 'anon', userAgent = '') {
    const cacheKey = `${productId}:${ipHash}`;
    const now = Date.now();
    const lastViewed = recentViewCache.get(cacheKey);

    if (lastViewed && now - lastViewed < 15 * 60 * 1000) {
      return { counted: false, reason: 'deduplicated' };
    }

    recentViewCache.set(cacheKey, now);

    if (isSupabaseConfigured()) {
      try {
        // Resolve product
        let query = getSupabase().from('products').select('id, views');
        if (UUID_REGEX.test(productId)) {
          query = query.or(`id.eq.${productId},slug.eq.${productId}`);
        } else {
          query = query.eq('slug', productId);
        }
        const { data: prod } = await query.maybeSingle();

        if (prod) {
          const newViews = (prod.views || 0) + 1;
          await Promise.all([
            getSupabase().from('product_views').insert({
              product_id: prod.id,
              ip_hash: ipHash,
              user_agent: userAgent,
            }),
            getSupabase().from('products').update({ views: newViews }).eq('id', prod.id),
          ]);
          return { counted: true, views: newViews };
        }
      } catch (err) {
        console.warn('[DB] Supabase recordProductView error:', err.message);
      }
    }

    const product = localProducts.find((p) => p.id === productId || p.slug === productId);
    if (product) {
      product.views = (product.views || 0) + 1;
      localViewsHistory.push({
        id: `v-${Date.now()}`,
        product_id: product.id,
        created_at: new Date().toISOString(),
      });
      return { counted: true, views: product.views };
    }
    return { counted: false, reason: 'not_found' };
  },

  async recordProductClick(productId, referrer = '', sessionId = '') {
    if (isSupabaseConfigured()) {
      try {
        let query = getSupabase().from('products').select('id, slug, affiliate_url, clicks');
        if (UUID_REGEX.test(productId)) {
          query = query.or(`id.eq.${productId},slug.eq.${productId}`);
        } else {
          query = query.eq('slug', productId);
        }
        const { data: prod } = await query.maybeSingle();

        if (prod) {
          const newClicks = (prod.clicks || 0) + 1;
          await Promise.all([
            getSupabase().from('affiliate_clicks').insert({
              product_id: prod.id,
              referrer,
              session_id: sessionId,
            }),
            getSupabase().from('products').update({ clicks: newClicks }).eq('id', prod.id),
          ]);

          return {
            product_id: prod.id,
            slug: prod.slug,
            affiliate_url: prod.affiliate_url,
            clicks: newClicks,
          };
        }
      } catch (err) {
        console.warn('[DB] Supabase recordProductClick error:', err.message);
      }
    }

    const product = localProducts.find((p) => p.id === productId || p.slug === productId);
    if (!product) return null;

    product.clicks = (product.clicks || 0) + 1;
    localClicksHistory.push({
      id: `c-${Date.now()}`,
      product_id: product.id,
      referrer,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    });

    return {
      product_id: product.id,
      slug: product.slug,
      affiliate_url: product.affiliate_url,
      clicks: product.clicks,
    };
  },

  async getDashboardAnalytics() {
    if (isSupabaseConfigured()) {
      try {
        const [prodsRes, catsRes] = await Promise.all([
          getSupabase()
            .from('products')
            .select('*, product_images(*), categories(*)')
            .neq('status', 'archived'),
          getSupabase()
            .from('categories')
            .select('*')
            .eq('status', 'active')
            .order('sort_order', { ascending: true }),
        ]);

        const products = (prodsRes.data || []).map(formatSupabaseProduct);
        const categories = catsRes.data || [];

        const totalProducts = products.length;
        const totalCategories = categories.length;
        const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
        const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
        const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

        const sortedByClicks = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
        const topProduct = sortedByClicks[0] || null;

        const categoryStats = categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id);
          const views = catProducts.reduce((acc, p) => acc + (p.views || 0), 0);
          const clicks = catProducts.reduce((acc, p) => acc + (p.clicks || 0), 0);
          return {
            ...cat,
            product_count: catProducts.length,
            views,
            clicks,
            ctr: views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00',
          };
        });

        const topCategory = [...categoryStats].sort((a, b) => b.clicks - a.clicks)[0] || null;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const timeSeries = days.map((day, idx) => {
          const factor = (idx + 1) / 7;
          return {
            date: day,
            views: Math.round(totalViews * (0.1 + 0.05 * factor)),
            clicks: Math.round(totalClicks * (0.1 + 0.05 * factor)),
          };
        });

        const productAnalytics = products.map((p) => {
          const views = p.views || 0;
          const clicks = p.clicks || 0;
          const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category?.name || 'Uncategorized',
            views,
            clicks,
            ctr,
            rating: p.rating,
            rating_count: p.rating_count,
            status: p.status,
            created_at: p.created_at,
          };
        });

        return {
          summary: {
            totalProducts,
            totalCategories,
            totalViews,
            totalClicks,
            overallCTR: `${overallCTR}%`,
            topProduct,
            topCategory,
          },
          timeSeries,
          categoryStats,
          productAnalytics,
        };
      } catch (err) {
        console.warn('[DB] Supabase getDashboardAnalytics exception:', err.message);
      }
    }

    // In-memory fallback
    const totalProducts = localProducts.filter((p) => p.status !== 'archived').length;
    const totalCategories = localCategories.filter((c) => c.status === 'active').length;
    const totalViews = localProducts.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalClicks = localProducts.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

    const sortedByClicks = [...localProducts].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const topProduct = sortedByClicks[0] ? attachProductImages(sortedByClicks[0]) : null;

    const categoryStats = localCategories.map((cat) => {
      const catProducts = localProducts.filter((p) => p.category_id === cat.id && p.status !== 'archived');
      const views = catProducts.reduce((acc, p) => acc + (p.views || 0), 0);
      const clicks = catProducts.reduce((acc, p) => acc + (p.clicks || 0), 0);
      return {
        ...cat,
        product_count: catProducts.length,
        views,
        clicks,
        ctr: views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00',
      };
    });

    const topCategory = [...categoryStats].sort((a, b) => b.clicks - a.clicks)[0] || null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSeries = days.map((day, idx) => {
      const factor = (idx + 1) / 7;
      return {
        date: day,
        views: Math.round(totalViews * (0.1 + 0.05 * factor)),
        clicks: Math.round(totalClicks * (0.1 + 0.05 * factor)),
      };
    });

    const productAnalytics = localProducts.map((p) => {
      const views = p.views || 0;
      const clicks = p.clicks || 0;
      const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: localCategories.find((c) => c.id === p.category_id)?.name || 'Uncategorized',
        views,
        clicks,
        ctr,
        rating: p.rating,
        rating_count: p.rating_count,
        status: p.status,
        created_at: p.created_at,
      };
    });

    return {
      summary: {
        totalProducts,
        totalCategories,
        totalViews,
        totalClicks,
        overallCTR: `${overallCTR}%`,
        topProduct,
        topCategory,
      },
      timeSeries,
      categoryStats,
      productAnalytics,
    };
  },

  // ==========================================
  // RATINGS
  // ==========================================
  async getRatingsByProductId(productId) {
    if (isSupabaseConfigured()) {
      try {
        let query = getSupabase()
          .from('ratings')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (UUID_REGEX.test(productId)) {
          query = query.eq('product_id', productId);
        } else {
          // Find product uuid by slug
          const { data: p } = await getSupabase().from('products').select('id').eq('slug', productId).maybeSingle();
          if (p) {
            query = query.eq('product_id', p.id);
          } else {
            return [];
          }
        }

        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase getRatingsByProductId error:', err.message);
      }
    }
    return localRatings.filter((r) => r.product_id === productId && r.status === 'approved');
  },

  async getAllRatings() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await getSupabase()
          .from('ratings')
          .select('*, products(name)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((r) => ({
            ...r,
            product_name: r.products?.name || 'Unknown Product',
          }));
        }
      } catch (err) {
        console.warn('[DB] Supabase getAllRatings error:', err.message);
      }
    }

    return localRatings.map((r) => {
      const product = localProducts.find((p) => p.id === r.product_id);
      return {
        ...r,
        product_name: product ? product.name : 'Unknown Product',
      };
    });
  },

  async updateRatingStatus(id, status) {
    if (isSupabaseConfigured() && UUID_REGEX.test(id)) {
      try {
        const { data, error } = await getSupabase()
          .from('ratings')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase updateRatingStatus error:', err.message);
      }
    }

    const r = localRatings.find((item) => item.id === id);
    if (!r) return null;
    r.status = status;
    return r;
  },

  async createRating(ratingData) {
    if (isSupabaseConfigured() && UUID_REGEX.test(ratingData.product_id)) {
      try {
        const { data, error } = await getSupabase()
          .from('ratings')
          .insert({
            product_id: ratingData.product_id,
            reviewer_name: ratingData.reviewer_name || 'Verified Customer',
            rating: parseFloat(ratingData.rating || 5),
            title: ratingData.title || '',
            review: ratingData.review || '',
            status: ratingData.status || 'approved',
          })
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase createRating error:', err.message);
      }
    }

    const newRating = {
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product_id: ratingData.product_id,
      reviewer_name: ratingData.reviewer_name || 'Verified Customer',
      rating: parseFloat(ratingData.rating || 5),
      title: ratingData.title || '',
      review: ratingData.review || '',
      status: ratingData.status || 'approved',
      created_at: new Date().toISOString(),
    };
    localRatings.push(newRating);
    return newRating;
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  async getSettings() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await getSupabase()
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase getSettings error:', err.message);
      }
    }
    return localSettings;
  },

  async updateSettings(newSettings) {
    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await getSupabase()
          .from('site_settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (existing?.id) {
          const updatePayload = {
            ...newSettings,
            updated_at: new Date().toISOString(),
          };
          delete updatePayload.id;
          const { data, error } = await getSupabase()
            .from('site_settings')
            .update(updatePayload)
            .eq('id', existing.id)
            .select()
            .single();

          if (!error && data) return data;
        }
      } catch (err) {
        console.warn('[DB] Supabase updateSettings error:', err.message);
      }
    }

    localSettings = {
      ...localSettings,
      ...newSettings,
      updated_at: new Date().toISOString(),
    };
    return localSettings;
  },
};
