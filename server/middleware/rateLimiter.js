import rateLimit from 'express-rate-limit';

// Global public API rate limiter (150 requests per 5 minutes per IP)
export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a few moments.' },
});

// View tracking rate limiter (60 view calls per minute per IP)
export const viewTrackingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'View recording limit reached.' },
});

// Click tracking & redirect rate limiter (60 click redirects per minute per IP)
export const clickTrackingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Click redirect rate limit reached.' },
});

// Admin endpoint rate limiter (100 requests per minute)
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin operations, please slow down.' },
});
