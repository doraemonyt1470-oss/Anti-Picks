import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Generate a cryptographically signed HMAC-SHA256 session token for admin.
 * The master ADMIN_SECRET never leaves the server!
 */
export function generateAdminSessionToken(user = {}) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id || 'admin-master',
      email: user.email || 'admin@antipicks.com',
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days valid
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', config.adminSecret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify signed admin session token.
 * Returns decoded payload if valid and unexpired, null otherwise.
 */
export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  // Direct backend fallback comparison (e.g. for server scripts)
  if (token === config.adminSecret) {
    return { role: 'admin', email: 'admin@antipicks.com' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', config.adminSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.exp || decoded.exp < Date.now()) return null;
    if (decoded.role !== 'admin') return null;

    return decoded;
  } catch {
    return null;
  }
}
