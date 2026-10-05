import express from 'express';
import {
  getProducts,
  getProductBySlug,
  recordView,
  recordClick,
} from '../controllers/productController.js';
import {
  viewTrackingLimiter,
  clickTrackingLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/:id/view', viewTrackingLimiter, recordView);
router.post('/:id/click', clickTrackingLimiter, recordClick);
router.get('/:id/click', clickTrackingLimiter, recordClick);

export default router;
