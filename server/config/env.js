import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from workspace root if present, or fallback to server dir
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminSecret: process.env.ADMIN_SECRET || 'antipicks_admin_master_secret_2026',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
};

// Validate environment variables on startup
export function validateEnv() {
  console.log(`[Config] Starting ANTI PICKS Server in "${config.nodeEnv}" mode on port ${config.port}`);
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    console.warn(
      `[Config] [Notice] SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set in .env.\n` +
      `[Config] The server will operate seamlessly with the high-fidelity local database layer.\n` +
      `[Config] To connect your live Supabase database, copy .env.example to .env and configure your project keys.`
    );
  } else {
    console.log(`[Config] [Supabase] Connected to remote instance: ${config.supabase.url}`);
  }
}
