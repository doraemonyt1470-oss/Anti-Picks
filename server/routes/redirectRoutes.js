import express from 'express';
import { handleAffiliateRedirect } from '../controllers/productController.js';
import { clickTrackingLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:slug', clickTrackingLimiter, handleAffiliateRedirect);

export default router;
