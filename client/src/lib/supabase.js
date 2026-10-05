// All database operations are secured and proxied through the backend /api gateway.
// No credentials or direct database connections are exposed in the client bundle.
export const supabase = null;
export const isSupabaseFrontendConfigured = () => false;
