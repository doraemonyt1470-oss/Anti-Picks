import express from 'express';
import {
  adminLogin,
  verifyAdminSession,
  getDashboardAnalytics,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getRatings,
  updateRatingStatus,
  getSettings,
  updateSettings,
  scrapeProduct,
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public admin auth
router.post('/login', adminLogin);

// Protected admin routes
router.use(adminLimiter);
router.get('/verify', requireAdmin, verifyAdminSession);
router.get('/analytics', requireAdmin, getDashboardAnalytics);
router.post('/scrape-product', requireAdmin, scrapeProduct);
router.get('/products', requireAdmin, getAdminProducts);
router.post('/products', requireAdmin, createProduct);
router.put('/products/:id', requireAdmin, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);

router.post('/categories', requireAdmin, createCategory);
router.put('/categories/:id', requireAdmin, updateCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

router.get('/ratings', requireAdmin, getRatings);
router.put('/ratings/:id/status', requireAdmin, updateRatingStatus);

router.get('/settings', getSettings); // Can be read without admin for footer/header
router.put('/settings', requireAdmin, updateSettings);

export default router;
