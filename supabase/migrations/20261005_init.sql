-- ANTI PICKS Supabase PostgreSQL Migration
-- Created: 2026-10-05
-- Complete schema with RLS, foreign keys, triggers, and analytics indexes

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admin users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  affiliate_url TEXT NOT NULL,
  price NUMERIC(10, 2),
  original_price NUMERIC(10, 2),
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
  rating_count INT NOT NULL DEFAULT 1,
  views INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  brand TEXT,
  sku TEXT,
  tags TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}'::jsonb,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT VIEWS (Deduplicated analytics tracking)
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AFFILIATE CLICKS (Conversion & CTR analytics)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  referrer TEXT,
  session_id TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. RATINGS / REVIEWS
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL DEFAULT 'Verified Buyer',
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  title TEXT,
  review TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'ANTI PICKS',
  tagline TEXT NOT NULL DEFAULT 'DISCOVER WHAT''S WORTH BUYING.',
  site_description TEXT NOT NULL DEFAULT 'Curated products, honest ratings and smart picks for modern tastemakers.',
  logo_url TEXT,
  favicon_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'support@antipicks.com',
  accent_color TEXT DEFAULT '#000000',
  social_links JSONB NOT NULL DEFAULT '{"twitter":"https://x.com","instagram":"https://instagram.com","github":"https://github.com"}'::jsonb,
  footer_text TEXT NOT NULL DEFAULT '© 2026 ANTI PICKS. Curated products, honest ratings and smart picks.',
  affiliate_disclosure TEXT NOT NULL DEFAULT 'ANTI PICKS may use affiliate links. When a user purchases through an affiliate link, ANTI PICKS may receive a commission at no additional cost to the user.',
  seo_title TEXT NOT NULL DEFAULT 'ANTI PICKS — Premium Affiliate Product Discovery',
  seo_description TEXT NOT NULL DEFAULT 'Discover what''s worth buying. Handpicked modern tech, audio, workspace gear, and lifestyle essentials.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_views ON products (views DESC);
CREATE INDEX IF NOT EXISTS idx_products_clicks ON products (clicks DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products (rating DESC);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories (status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories (sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images (sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views (product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks (product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON affiliate_clicks (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ratings_product_id ON ratings (product_id);
CREATE INDEX IF NOT EXISTS idx_ratings_status ON ratings (status);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_products_timestamp ON products;
CREATE TRIGGER trigger_update_products_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_categories_timestamp ON categories;
CREATE TRIGGER trigger_update_categories_timestamp
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_settings_timestamp ON site_settings;
CREATE TRIGGER trigger_update_settings_timestamp
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins have full access to categories"
  ON categories FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Products RLS
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Product Images RLS
CREATE POLICY "Public can view images for published products"
  ON product_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.status = 'published'));

CREATE POLICY "Admins have full access to product images"
  ON product_images FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Ratings RLS
CREATE POLICY "Public can view approved ratings"
  ON ratings FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Authenticated users can submit ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins have full access to ratings"
  ON ratings FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Site Settings RLS
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins have full access to site settings"
  ON site_settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Analytics Insert Policies (Server service_role or API route record)
CREATE POLICY "Service role can record views"
  ON product_views FOR ALL
  USING (true);

CREATE POLICY "Service role can record clicks"
  ON affiliate_clicks FOR ALL
  USING (true);

-- Profiles RLS
CREATE POLICY "Admins can view and edit profiles"
  ON profiles FOR ALL
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'service_role');
