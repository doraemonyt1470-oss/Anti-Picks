-- ANTI PICKS Seed Data
-- Curated high-end products, categories, images, and reviews

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, status, sort_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Audio & Sound', 'audio-sound', 'Audiophile grade headphones, synthesizers, and acoustic engineering.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', 'active', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Workspace & Desk', 'workspace-desk', 'Ergonomic mechanical keyboards, walnut monitor risers, and minimal desk tools.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', 'active', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Photography & Optics', 'photography-optics', 'Compact mirrorless cameras, rangefinders, and cinema-grade glass.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'active', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Everyday Carry', 'everyday-carry', 'Precision titanium pens, modular tech bags, and machined minimalist accessories.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', 'active', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Computing & Displays', 'computing-displays', 'Color-accurate 5K monitors, workstation docks, and compact powerhouse devices.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 'active', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Smart Living', 'smart-living', 'Architectural lighting, acoustic air purifiers, and industrial home gadgets.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', 'active', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PRODUCTS
INSERT INTO products (
  id, name, slug, short_description, description, category_id,
  affiliate_url, price, original_price, currency, rating, rating_count,
  views, clicks, featured, status, brand, sku, tags, specifications, pros, cons
)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Teenage Engineering OP-1 Field',
    'teenage-engineering-op-1-field',
    'The pocket synthesizer, sampler, and 4-track studio machined from a single anodized aluminum chassis.',
    'The OP-1 field is the second generation portable synthesizer from Teenage Engineering. Injected with more than a decade of ideas, user feedback and innovation, the machine boasts 100 new features including 32-bit stereo audio, Bluetooth MIDI, USB-C, 24-hour battery life, 8 replaceable tape reels, and an ultra-sharp high resolution flush glass display.',
    'c1000000-0000-0000-0000-000000000001',
    'https://amazon.com/dp/B0B5FL7GCS?tag=antipicks-20',
    1999.00,
    2199.00,
    'USD',
    4.9,
    142,
    1840,
    312,
    true,
    'published',
    'Teenage Engineering',
    'TE-OP1-FLD',
    ARRAY['Synthesizer', 'Audio Gear', 'Industrial Design', 'Portable Studio'],
    '{"Dimensions": "288 x 102 x 29 mm", "Weight": "590g", "Chassis": "Anodized Matte Aluminum", "Battery Life": "24 hours", "Display": "Color OLED 60fps", "Connectivity": "USB-C, Bluetooth LE, 3.5mm Stereo, FM Radio"}'::jsonb,
    ARRAY['Exceptional unibody aluminum engineering', '32-bit stereo signal path throughout', '24-hour uninterrupted battery life', 'Instant creative sketchpad workflow'],
    ARRAY['Premium pricing tier', 'Steep learning curve for tape workflow']
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Sony WH-1000XM5 Noise Canceling Headphones',
    'sony-wh-1000xm5-noise-canceling',
    'Industry-leading active noise cancellation with dual processors, 8 microphones, and ultra-comfortable soft fit leather.',
    'Engineered to deliver benchmark acoustic immersion, the Sony WH-1000XM5 redefines distraction-free listening. Powered by the integrated Processor V1 and HD Noise Cancelling Processor QN1, these headphones automatically optimize sound based on your atmospheric pressure and wearing condition.',
    'c1000000-0000-0000-0000-000000000001',
    'https://amazon.com/dp/B09XS7JWHH?tag=antipicks-20',
    398.00,
    449.00,
    'USD',
    4.8,
    284,
    3420,
    589,
    true,
    'published',
    'Sony',
    'SNY-WHXM5-BLK',
    ARRAY['Headphones', 'ANC', 'Wireless', 'Audiophile'],
    '{"Driver Unit": "30mm Carbon Fiber Composite", "Weight": "250g", "Battery Life": "30 hours (ANC on)", "Quick Charge": "3 mins = 3 hours playback", "Bluetooth": "Version 5.2 (LDAC / AAC / SBC)"}'::jsonb,
    ARRAY['Class-leading active noise suppression', 'Lightweight and fatigue-free for all-day wear', 'Superb call voice clarity with 4 beamforming mics', 'Rich, customizable sound profile via app'],
    ARRAY['Does not fold as compactly as older XM4 models', 'Carrying case is slightly larger']
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    'keychron-q1-pro-wireless-custom',
    'Full CNC machined 6063 aluminum body, double-gasket acoustic dampening, and programmable VIA open-source firmware.',
    'The Keychron Q1 Pro is a wireless full aluminum custom mechanical keyboard. With its 75% compact layout, double-gasket mount design, sound absorbing foam, screw-in stabilizers, and hot-swappable sockets, typing feels buttery smooth with an acoustically resonant deep thock sound.',
    'c1000000-0000-0000-0000-000000000002',
    'https://amazon.com/dp/B0BS5VXZ8Y?tag=antipicks-20',
    199.00,
    219.00,
    'USD',
    4.9,
    96,
    2100,
    384,
    true,
    'published',
    'Keychron',
    'KCH-Q1P-KSA',
    ARRAY['Mechanical Keyboard', 'Desk Setup', 'Ergonomics', 'Custom Keeb'],
    '{"Layout": "75% Exploded (81 keys)", "Frame": "Full CNC 6063 Aluminum", "Connectivity": "Bluetooth 5.1 & Type-C Wired", "Polling Rate": "1000 Hz (Wired) / 90 Hz (Wireless)", "Switches": "Keychron K Pro Pre-lubed"}'::jsonb,
    ARRAY['Solid 1.8kg unyielding aluminum weight', 'Double-gasket cushioning eliminates harsh bottoming out', 'Seamless cross-platform Mac/Windows physical toggle', 'QMK / VIA web browser configuration'],
    ARRAY['Heavy chassis not meant for travel bag mobility']
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Grovemade Walnut Desk Shelf System',
    'grovemade-walnut-desk-shelf-system',
    'Handcrafted solid American walnut and 5052 aluminum dual-shelf riser for visual ergonomics and intentional workspaces.',
    'The Grovemade Desk Shelf creates an ergonomic tier for your displays while organizing notebooks, hard drives, and desk accoutrements below. Crafted in Portland, Oregon from premium American walnut ply with hand-rubbed oil finish and solid anodized aluminum supports.',
    'c1000000-0000-0000-0000-000000000002',
    'https://grovemade.com/product/wood-desk-shelf/?ref=antipicks',
    280.00,
    310.00,
    'USD',
    4.8,
    188,
    1650,
    290,
    false,
    'published',
    'Grovemade',
    'GM-DSK-WLNT',
    ARRAY['Desk Setup', 'Minimalism', 'Woodcraft', 'Ergonomics'],
    '{"Materials": "American Walnut Ply, 5052 Anodized Aluminum, Natural Cork", "Dimensions": "46\" W x 9\" D x 4.2\" H", "Weight Capacity": "50 lbs", "Origin": "Portland, USA"}'::jsonb,
    ARRAY['Artisanal grain and tactile matte finish', 'Elevates monitor to natural eye line reducing neck strain', 'Generous clearance underneath for full-width mechanical keyboard', 'Modular trays slide seamlessly underneath'],
    ARRAY['Higher price point for desk accessories']
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Fujifilm X100VI Digital Rangefinder Camera',
    'fujifilm-x100vi-digital-camera',
    '40.2MP X-Trans CMOS 5 HR sensor, 6.0-stop in-body image stabilization, and legendary 20 film simulation modes in a timeless chassis.',
    'The 6th generation of Fujifilm''s acclaimed compact camera features a high-resolution 40.2-megapixel sensor paired with internal 5-axis image stabilization for razor-sharp handheld captures in any lighting. Featuring the renowned hybrid optical/electronic viewfinder and tactile physical exposure dials.',
    'c1000000-0000-0000-0000-000000000003',
    'https://amazon.com/dp/B0CVG8X7KL?tag=antipicks-20',
    1599.00,
    1699.00,
    'USD',
    4.9,
    312,
    4520,
    810,
    true,
    'published',
    'Fujifilm',
    'FJI-X100VI-SLV',
    ARRAY['Camera', 'Photography', 'Rangefinder', 'Everyday Carry'],
    '{"Sensor": "40.2MP APS-C X-Trans CMOS 5 HR", "Lens": "Fixed 23mm F2.0 II (35mm equivalent)", "Stabilization": "6.0 Stops 5-Axis In-Body IBIS", "Video": "6.2K/30p & 4K/60p 10-bit", "Weight": "521g with battery"}'::jsonb,
    ARRAY['Soulful film simulation color chemistry straight out of camera', 'Hybrid optical rangefinder delivers visceral shooting experience', 'Compact form factor slips into everyday sling bags', 'Sharp corner-to-corner pancake optic'],
    ARRAY['Fixed focal length requires framing with your feet', 'High market demand']
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Peak Design Everyday Backpack V2 20L',
    'peak-design-everyday-backpack-20l',
    'Weatherproof 100% recycled 400D nylon canvas with MagLatch magnetic hardware and customizable FlexFold origami dividers.',
    'An iconic bag engineered for everyday carry, camera gear, and daily commute. The Peak Design Everyday Backpack V2 combines rapid dual side access, dedicated protective sleeves for up to a 15-inch laptop, and external slip pockets for bottles or tripods.',
    'c1000000-0000-0000-0000-000000000004',
    'https://amazon.com/dp/B07ZTQ7N9F?tag=antipicks-20',
    279.95,
    299.95,
    'USD',
    4.7,
    215,
    2400,
    412,
    false,
    'published',
    'Peak Design',
    'PD-EBD-20-BK',
    ARRAY['Bags', 'EDC', 'Travel', 'Camera Carry'],
    '{"Capacity": "17L min to 20L max via MagLatch", "Laptop Compartment": "Fits 15.6\" laptops", "Shell": "Weatherproof 400D double poly-coated nylon", "Weight": "2.01 kg", "Warranty": "Lifetime"}'::jsonb,
    ARRAY['Patented origami dividers protect sensitive camera bodies and lenses', 'Ultra-clean exterior with no flapping straps or exposed zippers', 'Lightning-quick dual-side entry points', 'Guaranteed for life by Peak Design'],
    ARRAY['Firm structural shell does not compress flat when empty']
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'Apple Studio Display 27-inch 5K Retina',
    'apple-studio-display-5k-retina',
    '5120 x 2880 resolution, 600 nits brightness, P3 wide color, 12MP Ultra Wide camera with Center Stage, and studio-quality 6-speaker sound.',
    'A transformative window for your creative workflow. The Apple Studio Display features an expansive 27-inch 5K Retina screen with True Tone technology, anti-reflective coating, three studio-quality microphones, and an A13 Bionic chip powering spatial audio and camera tracking.',
    'c1000000-0000-0000-0000-000000000005',
    'https://amazon.com/dp/B09V3HMZ6N?tag=antipicks-20',
    1499.00,
    1599.00,
    'USD',
    4.7,
    173,
    3120,
    490,
    true,
    'published',
    'Apple',
    'APL-STD-5K-27',
    ARRAY['Display', '5K', 'Monitor', 'Creative Workstation'],
    '{"Panel Size": "27-inch IPS Retina", "Resolution": "5120 x 2880 at 218 ppi", "Brightness": "600 nits", "Audio": "High-fidelity 6-speaker system with force-cancelling woofers", "Ports": "1x Thunderbolt 3 (96W Host Charge), 3x USB-C"}'::jsonb,
    ARRAY['Crystal razor-sharp macOS native 218 PPI scaling', 'Unmatched built-in audio system eliminates need for external desk speakers', 'All-metal aluminum chassis and slim silhouette', 'Single Thunderbolt cable provides display and 96W fast laptop charging'],
    ARRAY['Stand height adjustment is a costly tier upgrade', 'Standard 60Hz refresh rate']
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Dyson Solarcycle Morph Desk Light',
    'dyson-solarcycle-morph-desk-light',
    'Intelligent daylight tracking, heat pipe cooling technology for 60-year light quality, and 4-in-1 magnetic transformable modes.',
    'The Dyson Solarcycle Morph intelligently tracks local daylight and adjusts its color temperature and brightness every 60 seconds. Its 360-degree magnetic head rotates effortlessly, transforming between task light, ambient glow, feature spotlight, and indirect architectural illumination.',
    'c1000000-0000-0000-0000-000000000006',
    'https://amazon.com/dp/B0852P4Q1K?tag=antipicks-20',
    649.99,
    749.99,
    'USD',
    4.8,
    88,
    1420,
    215,
    false,
    'published',
    'Dyson',
    'DYS-SCM-BLK',
    ARRAY['Lighting', 'Smart Home', 'Design Object', 'Productivity'],
    '{"Light Source": "3 Warm + 3 Cool LEDs with Heat Pipe Cooling", "Color Temp": "2700K - 6500K", "CRI": "90+", "Connectivity": "Bluetooth via MyDyson App", "USB Port": "Integrated USB-C Charging Port"}'::jsonb,
    ARRAY['Seamless magnetic 3-point rotation mechanism', 'Tracks local sun coordinates to sync circadian rhythm', 'Precision glare-free optical task beam', 'Perforated stem creates glowing ambient nightlight pillar'],
    ARRAY['Luxury tier investment for a desk lamp']
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCT IMAGES (Multiple images per product for interactive gallery)
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary)
VALUES
  -- OP-1 Field
  ('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=85', 1, false),
  ('i1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85', 2, false),

  -- Sony XM5
  ('i1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85', 1, false),
  ('i1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85', 2, false),

  -- Keychron Q1 Pro
  ('i1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000008', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=85', 1, false),
  ('i1000000-0000-0000-0000-000000000009', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85', 2, false),

  -- Grovemade Walnut Desk Shelf
  ('i1000000-0000-0000-0000-000000000010', 'p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000011', 'p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=85', 1, false),

  -- Fujifilm X100VI
  ('i1000000-0000-0000-0000-000000000012', 'p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000013', 'p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=85', 1, false),

  -- Peak Design Backpack
  ('i1000000-0000-0000-0000-000000000014', 'p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000015', 'p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85', 1, false),

  -- Apple Studio Display
  ('i1000000-0000-0000-0000-000000000016', 'p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000017', 'p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=85', 1, false),

  -- Dyson Solarcycle
  ('i1000000-0000-0000-0000-000000000018', 'p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85', 0, true),
  ('i1000000-0000-0000-0000-000000000019', 'p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85', 1, false)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED REVIEWS
INSERT INTO ratings (id, product_id, reviewer_name, rating, title, review, status)
VALUES
  ('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Julian V.', 5.0, 'An industrial masterpiece', 'Building music on the OP-1 Field is unlike any computer DAW. The physical knobs feel sublime and the aluminum body is razor sharp.', 'approved'),
  ('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000002', 'Elena R.', 5.0, 'Best travel headphones ever made', 'Noise cancellation makes transatlantic flights completely silent. Battery life lasts an entire week of work calls.', 'approved'),
  ('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000003', 'Marcus T.', 5.0, 'Heaviest, most satisfying keyboard', 'The CNC aluminum frame doesn''t budge. Lubricated switches sound like dropping heavy marbles on velvet.', 'approved')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SITE SETTINGS
INSERT INTO site_settings (
  id, site_name, tagline, site_description, contact_email, accent_color, footer_text, affiliate_disclosure, seo_title, seo_description
)
VALUES (
  's1000000-0000-0000-0000-000000000001',
  'ANTI PICKS',
  'DISCOVER WHAT''S WORTH BUYING.',
  'Curated gear, honest ratings, and smart picks. Find the best products worth buying without the noise.',
  'hello@antipicks.com',
  '#000000',
  '© 2026 ANTI PICKS. Curated products, honest ratings and smart picks.',
  'ANTI PICKS may use affiliate links. When a user purchases through an affiliate link, ANTI PICKS may receive a commission at no additional cost to the user. We only recommend products our editors personally vouch for.',
  'ANTI PICKS — Premium Affiliate Product Discovery',
  'Curated products, honest ratings and smart picks for modern tastemakers.'
)
ON CONFLICT (id) DO NOTHING;
