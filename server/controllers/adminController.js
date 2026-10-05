import { dbService } from '../services/database.js';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';
import { config } from '../config/env.js';
import { generateAdminSessionToken } from '../services/tokenService.js';
import { scrapeProductFromUrl } from '../services/scraperService.js';

// POST /api/admin/login
export async function adminLogin(req, res) {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. If remote Supabase is configured, authenticate with Supabase Auth
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.session) {
        return res.json({
          success: true,
          token: data.session.access_token,
          user: {
            id: data.user.id,
            email: data.user.email,
            role: 'admin',
          },
        });
      }
    }

    // 2. Local fallback verification (allows immediate out-of-the-box admin access)
    // Default admin: admin@antipicks.com / admin123, or password matching ADMIN_SECRET
    const isValidLocalAdmin =
      (email === 'admin@antipicks.com' && (password === 'admin123' || password === config.adminSecret)) ||
      password === config.adminSecret;

    if (isValidLocalAdmin) {
      // Generate a signed, time-limited cryptographic token so ADMIN_SECRET is NEVER sent to browser
      const token = generateAdminSessionToken({
        id: 'admin-master',
        email: email || 'admin@antipicks.com',
      });

      return res.json({
        success: true,
        token,
        user: {
          id: 'admin-master',
          email: email || 'admin@antipicks.com',
          role: 'admin',
        },
      });
    }

    return res.status(401).json({ error: 'Invalid admin email or password credentials' });
  } catch (err) {
    console.error('[Error adminLogin]:', err);
    return res.status(500).json({ error: 'Admin authentication service error' });
  }
}

// GET /api/admin/verify
export async function verifyAdminSession(req, res) {
  return res.json({
    valid: true,
    user: req.user,
  });
}

// GET /api/admin/analytics
export async function getDashboardAnalytics(req, res) {
  try {
    const analytics = await dbService.getDashboardAnalytics();
    return res.json(analytics);
  } catch (err) {
    console.error('[Error getDashboardAnalytics]:', err);
    return res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
}

// GET /api/admin/products
export async function getAdminProducts(req, res) {
  try {
    const { category, search, status, sort, page = 1, limit = 100 } = req.query;
    const result = await dbService.getProducts({
      category,
      search,
      status: status || 'all',
      sort: sort || 'newest',
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    return res.json(result);
  } catch (err) {
    console.error('[Error getAdminProducts]:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin products' });
  }
}

// POST /api/admin/products
export async function createProduct(req, res) {
  try {
    const { product, images, reviews } = req.body;

    if (!product || !product.name || !product.affiliate_url) {
      return res.status(400).json({ error: 'Product name and affiliate URL are required' });
    }

    const created = await dbService.createProduct(product, images || [], reviews || []);
    return res.status(201).json({ success: true, product: created });
  } catch (err) {
    console.error('[Error createProduct]:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

// PUT /api/admin/products/:id
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { product, images, reviews } = req.body;

    const updated = await dbService.updateProduct(id, product, images, reviews);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, product: updated });
  } catch (err) {
    console.error('[Error updateProduct]:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

// DELETE /api/admin/products/:id
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    await dbService.deleteProduct(id, String(permanent) === 'true');
    return res.json({ success: true, message: 'Product successfully removed/archived' });
  } catch (err) {
    console.error('[Error deleteProduct]:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}

// POST /api/admin/categories
export async function createCategory(req, res) {
  try {
    const categoryData = req.body;
    if (!categoryData.name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const created = await dbService.createCategory(categoryData);
    return res.status(201).json({ success: true, category: created });
  } catch (err) {
    console.error('[Error createCategory]:', err);
    return res.status(500).json({ error: 'Failed to create category' });
  }
}

// PUT /api/admin/categories/:id
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const updated = await dbService.updateCategory(id, categoryData);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ success: true, category: updated });
  } catch (err) {
    console.error('[Error updateCategory]:', err);
    return res.status(500).json({ error: 'Failed to update category' });
  }
}

// DELETE /api/admin/categories/:id
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await dbService.deleteCategory(id);
    return res.json({ success: true, message: 'Category removed' });
  } catch (err) {
    console.error('[Error deleteCategory]:', err);
    return res.status(400).json({ error: err.message || 'Failed to delete category' });
  }
}

// GET /api/admin/ratings
export async function getRatings(req, res) {
  try {
    const ratings = await dbService.getAllRatings();
    return res.json({ ratings });
  } catch (err) {
    console.error('[Error getRatings]:', err);
    return res.status(500).json({ error: 'Failed to retrieve ratings' });
  }
}

// PUT /api/admin/ratings/:id/status
export async function updateRatingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'pending'
    const updated = await dbService.updateRatingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    return res.json({ success: true, rating: updated });
  } catch (err) {
    console.error('[Error updateRatingStatus]:', err);
    return res.status(500).json({ error: 'Failed to update rating status' });
  }
}

// GET /api/admin/settings
export async function getSettings(req, res) {
  try {
    const settings = await dbService.getSettings();
    return res.json({ settings });
  } catch (err) {
    console.error('[Error getSettings]:', err);
    return res.status(500).json({ error: 'Failed to retrieve settings' });
  }
}

// PUT /api/admin/settings
export async function updateSettings(req, res) {
  try {
    const settings = await dbService.updateSettings(req.body);
    return res.json({ success: true, settings });
  } catch (err) {
    console.error('[Error updateSettings]:', err);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}

// POST /api/admin/scrape-product
export async function scrapeProduct(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Please provide a valid product URL or affiliate link.' });
    }

    const scrapedData = await scrapeProductFromUrl(url);
    return res.json({ success: true, data: scrapedData });
  } catch (err) {
    console.error('[Error scrapeProduct]:', err);
    return res.status(500).json({ error: err.message || 'Failed to extract product details from URL.' });
  }
}

