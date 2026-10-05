const API_BASE = '/api';

// Helper for authenticated admin requests
function getAuthHeaders() {
  const token = localStorage.getItem('antipicks_admin_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // PRODUCTS
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.featured !== undefined) query.append('featured', params.featured);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductBySlug(slug) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    return res.json();
  },

  // VIEW TRACKING (POST /api/products/:id/view)
  async recordView(productId) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/view`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err) {
      console.warn('[View tracking error]:', err.message);
      return { counted: false };
    }
  },

  // CLICK TRACKING (POST /api/products/:id/click)
  async recordClick(productId) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Click recording failed');
      return await res.json();
    } catch (err) {
      console.warn('[Click tracking error]:', err.message);
      return null;
    }
  },

  // CATEGORIES
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // SITE SETTINGS
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {}
    const adminRes = await fetch(`${API_BASE}/admin/settings`, { headers: getAuthHeaders() });
    if (!adminRes.ok) throw new Error('Failed to fetch site settings');
    return adminRes.json();
  },

  // ADMIN ENDPOINTS
  async adminLogin(email, password, rememberMe = true) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return data;
  },

  async verifyAdminSession() {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return false;
    return res.json();
  },

  async getDashboardAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getAdminProducts(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/products?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin products');
    return res.json();
  },

  async scrapeProduct(url) {
    const res = await fetch(`${API_BASE}/admin/scrape-product`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to extract product details from URL');
    return data;
  },

  async createProduct(product, images, reviews = []) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product, images, reviews }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id, product, images, reviews = null) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product, images, reviews }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id, permanent = false) {
    const res = await fetch(`${API_BASE}/admin/products/${id}?permanent=${permanent}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  async updateCategory(id, categoryData) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  async getRatings() {
    const res = await fetch(`${API_BASE}/admin/ratings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch ratings');
    return res.json();
  },

  async updateRatingStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/ratings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update rating status');
    return data;
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },
};
