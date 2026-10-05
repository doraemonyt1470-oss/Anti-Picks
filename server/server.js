import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config, validateEnv } from './config/env.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { dbService } from './services/database.js';

const __filename = fileURLToPath(import.meta.url);
// Locate production client build across standard deployment structures (cPanel Node, monorepo, etc.)
const clientDistPath = [
  path.resolve(__dirname, '../client/dist'),
  path.resolve(__dirname, './dist'),
  path.resolve(__dirname, './public'),
].find((p) => fs.existsSync(p)) || path.resolve(__dirname, '../client/dist');

validateEnv();

const app = express();

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow external image CDNs for product imagery
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Global API rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'ANTI PICKS API Engine',
    timestamp: new Date().toISOString(),
  });
});

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${config.clientUrl}/sitemap.xml\n`);
});

// Dynamic sitemap.xml (PRD Section 36)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { products } = await dbService.getProducts({ limit: 500, status: 'published' });
    const categories = await dbService.getCategories({ status: 'active' });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const coreRoutes = ['', '/about', '/contact', '/privacy-policy', '/terms', '/affiliate-disclosure'];
    coreRoutes.forEach((route) => {
      xml += `  <url>\n    <loc>${config.clientUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.7'}</priority>\n  </url>\n`;
    });

    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${config.clientUrl}/?category=${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    products.forEach((prod) => {
      xml += `  <url>\n    <loc>${config.clientUrl}/products/${prod.slug}</loc>\n    <lastmod>${prod.updated_at ? prod.updated_at.split('T')[0] : '2026-10-05'}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    console.error('[Sitemap error]:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// API Routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve site settings' });
  }
});
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/go', redirectRoutes);

// Static client assets (for single-server production deployment)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/go')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  // 404 Handler when frontend is run separately in dev mode
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const server = app.listen(config.port, () => {
  console.log(`[ANTI PICKS] Server running on http://localhost:${config.port}`);
});

export default server;
