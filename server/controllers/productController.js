import { dbService } from '../services/database.js';
import crypto from 'crypto';

// Validate that an affiliate URL is a safe HTTP/HTTPS URL
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET /api/products
export async function getProducts(req, res) {
  try {
    const {
      category,
      search,
      sort,
      featured,
      page = 1,
      limit = 24,
    } = req.query;

    const result = await dbService.getProducts({
      category,
      search,
      sort,
      featured,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status: 'published',
    });

    return res.json(result);
  } catch (err) {
    console.error('[Error getProducts]:', err);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
}

// GET /api/products/:slug
export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const product = await dbService.getProductBySlug(slug);

    if (!product || product.status === 'archived') {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = await dbService.getRatingsByProductId(product.id);

    return res.json({
      product,
      reviews,
    });
  } catch (err) {
    console.error('[Error getProductBySlug]:', err);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
}

// POST /api/products/:id/view
export async function recordView(req, res) {
  try {
    const { id } = req.params;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    // Create anonymous hash of IP to respect privacy while deduplicating
    const ipHash = crypto.createHash('sha256').update(String(clientIp)).digest('hex').substring(0, 16);

    const result = await dbService.recordProductView(id, ipHash, userAgent);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Error recordView]:', err);
    return res.status(500).json({ error: 'Failed to record view' });
  }
}

// POST /api/products/:id/click OR GET /api/products/:id/click
export async function recordClick(req, res) {
  try {
    const { id } = req.params;
    const referrer = req.headers['referer'] || req.query.ref || '';
    const sessionId = req.headers['x-session-id'] || req.query.sid || '';

    const clickData = await dbService.recordProductClick(id, referrer, sessionId);
    if (!clickData) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!isValidUrl(clickData.affiliate_url)) {
      return res.status(400).json({ error: 'Invalid affiliate destination URL' });
    }

    // Check if client expects JSON or direct HTTP redirect
    const isDirectRedirect = req.query.redirect === 'true' || req.method === 'GET';

    if (isDirectRedirect) {
      return res.redirect(302, clickData.affiliate_url);
    }

    return res.json({
      success: true,
      redirect_url: clickData.affiliate_url,
    });
  } catch (err) {
    console.error('[Error recordClick]:', err);
    return res.status(500).json({ error: 'Failed to record click' });
  }
}

// GET /go/:slug (clean affiliate redirect link)
export async function handleAffiliateRedirect(req, res) {
  try {
    const { slug } = req.params;
    const referrer = req.headers['referer'] || '';
    const clickData = await dbService.recordProductClick(slug, referrer);

    if (!clickData || !clickData.affiliate_url) {
      return res.status(404).send('<h1>Product or destination link not found</h1>');
    }

    if (!isValidUrl(clickData.affiliate_url)) {
      return res.status(400).send('<h1>Invalid affiliate destination URL</h1>');
    }

    // 302 Temporary Redirect to Affiliate Merchant
    return res.redirect(302, clickData.affiliate_url);
  } catch (err) {
    console.error('[Error handleAffiliateRedirect]:', err);
    return res.status(500).send('<h1>Internal Server Error</h1>');
  }
}
