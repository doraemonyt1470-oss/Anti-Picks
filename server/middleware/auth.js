import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';
import { config } from '../config/env.js';
import { verifyAdminSessionToken } from '../services/tokenService.js';

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const adminSecretHeader = req.headers['x-admin-secret'];

    // 1. Direct Secret Token Header check (for internal secure CLI scripts)
    if (adminSecretHeader && adminSecretHeader === config.adminSecret) {
      req.user = { role: 'admin', email: 'admin@antipicks.com' };
      return next();
    }

    // 2. Bearer token check
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // Check signed cryptographic session token (HMAC-SHA256 verified)
      const verifiedSession = verifyAdminSessionToken(token);
      if (verifiedSession) {
        req.user = verifiedSession;
        return next();
      }

      // Check with Supabase Auth if configured
      if (isSupabaseConfigured()) {
        const { data: { user }, error } = await getSupabase().auth.getUser(token);
        if (error || !user) {
          return res.status(401).json({ error: 'Unauthorized: Invalid authentication session' });
        }

        // Verify role in profiles table or user metadata
        const { data: profile } = await getSupabase()
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin' || user.user_metadata?.role === 'admin' || user.email?.includes('admin')) {
          req.user = user;
          return next();
        }

        return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
      }
    }

    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  } catch (err) {
    console.error('[Auth Middleware Error]:', err.message);
    return res.status(500).json({ error: 'Internal security authentication error' });
  }
}
