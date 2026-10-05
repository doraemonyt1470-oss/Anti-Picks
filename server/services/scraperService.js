import * as cheerio from 'cheerio';

const REALISTIC_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
];

function getRandomUserAgent() {
  return REALISTIC_USER_AGENTS[Math.floor(Math.random() * REALISTIC_USER_AGENTS.length)];
}

/**
 * Clean and normalize text
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n\t]/g, ' ')
    .trim();
}

/**
 * Extract numerical price from currency string
 */
function parsePrice(str) {
  if (!str) return null;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

/**
 * Generate a URL-friendly slug
 */
function generateSlug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

/**
 * Resolve shortened links and fetch full HTML
 */
async function fetchHtmlWithRedirects(inputUrl) {
  const headers = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8,hi;q=0.7',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  const response = await fetch(inputUrl, {
    headers,
    redirect: 'follow',
  });

  if (!response.ok && response.status !== 404) {
    // Try without fancy headers if failed
    const retryRes = await fetch(inputUrl, {
      headers: { 'User-Agent': getRandomUserAgent() },
      redirect: 'follow',
    });
    if (!retryRes.ok) {
      throw new Error(`Failed to load URL: HTTP ${retryRes.status} ${retryRes.statusText}`);
    }
    const html = await retryRes.text();
    return { html, finalUrl: retryRes.url };
  }

  const html = await response.text();
  return { html, finalUrl: response.url };
}

/**
 * Parse Amazon Product Page
 */
function parseAmazon($ , html, finalUrl, originalUrl) {
  // Title
  let title = cleanText(
    $('#productTitle').text() ||
    $('#title').text() ||
    $('meta[name="title"]').attr('content') ||
    $('meta[property="og:title"]').attr('content')
  );

  // Clean trailing amazon branding
  title = title.replace(/\s*:\s*Amazon\.[a-z.]+$/i, '').trim();

  // Brand
  let brand = cleanText(
    $('#bylineInfo').text() ||
    $('#brand').text() ||
    $('tr.po-brand td.a-span9 span').text()
  );
  brand = brand.replace(/^Brand:\s*/i, '').replace(/^Visit the\s*/i, '').replace(/\s*Store$/i, '').trim();

  // Price extraction
  let price = null;
  let originalPrice = null;
  let currency = 'INR';

  const priceSelectors = [
    '.priceToPay span.a-offscreen',
    '.apexPriceToPay span.a-offscreen',
    '#corePrice_desktop .a-price .a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '.a-price .a-offscreen',
  ];

  for (const sel of priceSelectors) {
    const txt = $(sel).first().text();
    if (txt) {
      price = parsePrice(txt);
      if (txt.includes('$')) currency = 'USD';
      if (txt.includes('₹')) currency = 'INR';
      if (txt.includes('£')) currency = 'GBP';
      if (txt.includes('€')) currency = 'EUR';
      if (price !== null) break;
    }
  }

  const originalPriceSelectors = [
    '.basisPrice span.a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-text-price span.a-offscreen',
    '.a-text-price span.a-offscreen',
    '#priceblock_saleprice',
  ];

  for (const sel of originalPriceSelectors) {
    const txt = $(sel).first().text();
    if (txt) {
      originalPrice = parsePrice(txt);
      if (originalPrice !== null) break;
    }
  }

  if (price && !originalPrice) {
    // If discount percentage is shown, approximate or keep equal
    originalPrice = price;
  }

  // Distinct High-Resolution Gallery Image Extraction (Guaranteed Unique Photos)
  const distinctImageKeys = new Set();
  const imageUrls = [];

  function addAmazonImage(rawUrl) {
    if (!rawUrl || !rawUrl.startsWith('http')) return;
    if (rawUrl.includes('play-icon-overlay') || rawUrl.includes('video-slate')) return;

    // Extract unique Amazon image identifier (e.g. 51I9oDD+qSL from /I/51I9oDD+qSL._SY355_.jpg)
    const match = rawUrl.match(/\/images\/[IG]\/([A-Za-z0-9+_-]+?)(?:\._[A-Za-z0-9_,+-]+_\.|\.)(jpg|jpeg|png|webp)/i);
    if (match) {
      const imageId = match[1];
      const ext = match[2];
      if (!distinctImageKeys.has(imageId)) {
        distinctImageKeys.add(imageId);
        // Master clean high-resolution image URL on Amazon CDN:
        const cleanHiRes = `https://m.media-amazon.com/images/I/${imageId}._AC_SL1500_.${ext}`;
        imageUrls.push(cleanHiRes);
      }
    } else {
      if (!distinctImageKeys.has(rawUrl)) {
        distinctImageKeys.add(rawUrl);
        imageUrls.push(rawUrl);
      }
    }
  }

  // A. Main Landing Image
  addAmazonImage($('#landingImage').attr('data-old-hires') || $('#landingImage').attr('src'));

  // B. Gallery Thumbnails in #altImages (Contains all distinct product photos!)
  $('#altImages ul li img').each((_, el) => {
    addAmazonImage($(el).attr('src'));
  });

  // C. Color images JSON (if present)
  const colorMatch = html.match(/'colorImages':\s*\{\s*'initial':\s*(\[[^\]]+\])/);
  if (colorMatch && colorMatch[1]) {
    try {
      const hiResMatches = colorMatch[1].matchAll(/"(?:hiRes|large)":\s*"([^"]+)"/g);
      for (const m of hiResMatches) {
        if (m[1]) addAmazonImage(m[1].replace(/\\u002F/g, '/').replace(/\\/g, ''));
      }
    } catch {}
  }

  // Bullet points / Features (Pros)
  const bullets = [];
  $('#feature-bullets ul li span.a-list-item').each((_, el) => {
    const text = cleanText($(el).text());
    if (text && !text.toLowerCase().includes('make sure this fits') && text.length > 5) {
      bullets.push(text);
    }
  });

  // Description
  let description = cleanText($('#productDescription p').text() || $('#productDescription').text());
  if (!description && bullets.length > 0) {
    description = bullets.slice(0, 3).join('. ') + '.';
  }

  // Ratings
  let rating = 4.5;
  const ratingText = $('#acrPopover span.a-icon-alt, span[data-hook="rating-out-of-text"]').first().text();
  if (ratingText) {
    const rMatch = ratingText.match(/([0-9.]+)\s*out of/i);
    if (rMatch) rating = parseFloat(rMatch[1]);
  }

  let ratingCount = 1;
  const reviewCountText = $('#acrCustomerReviewText, span[data-hook="total-review-count"]').first().text();
  if (reviewCountText) {
    const cMatch = reviewCountText.replace(/,/g, '').match(/([0-9]+)/);
    if (cMatch) ratingCount = parseInt(cMatch[1], 10);
  }

  // Specifications (Carefully sanitized - NO scripts, NO reviews in specs)
  const specs = [];
  const excludedKeys = [
    'customer reviews',
    'customer review',
    'ratings',
    'rating',
    'best sellers rank',
    'asin',
    'date first available',
    'feedback',
  ];

  $('#productDetails_techSpec_section_1 tr, #prodDetails tr, .po-row').each((_, el) => {
    // Clone and remove all script, style, popovers and metrics code
    const row = $(el).clone();
    row.find('script, style, noscript, .a-popover-preload, .a-declarative, iframe').remove();

    const key = cleanText(row.find('th, .po-break-word:first-child').text());
    let val = cleanText(row.find('td, .po-break-word:last-child').text());

    // If this row is customer reviews, extract the rating and count if not yet found
    if (key.toLowerCase().includes('customer review') || key.toLowerCase().includes('ratings')) {
      const matchR = val.match(/([0-9.]+)\s*out of 5/i);
      if (matchR && rating === 4.5) {
        rating = parseFloat(matchR[1]);
      }
      const matchC = val.match(/\(([0-9,]+)\)/);
      if (matchC && ratingCount === 1) {
        ratingCount = parseInt(matchC[1].replace(/,/g, ''), 10);
      }
      return; // DO NOT add to specs!
    }

    // Skip non-technical metadata and rankings
    if (excludedKeys.some((ex) => key.toLowerCase().includes(ex))) {
      return;
    }

    // Strictly discard any string with JavaScript or click tracking noise
    if (
      val.includes('function(') ||
      val.includes('var ') ||
      val.includes('P.when') ||
      val.includes('dpAcrHasRegistered') ||
      val.includes('window.ue') ||
      val.includes('<script')
    ) {
      return;
    }

    if (key && val && key !== val && val.length < 350) {
      specs.push({ key, val });
    }
  });

  // Top Verified Real Customer Reviews Extraction
  const customerReviews = [];
  $('[data-hook="review"]').each((i, rEl) => {
    const r$ = $(rEl).clone();
    r$.find('script, style, noscript').remove();

    const reviewerName = cleanText(
      r$.find('.a-profile-name').first().text() ||
      r$.find('[data-hook="review-by-line"]').first().text().replace(/^By\s*/i, '') ||
      'Verified Customer'
    );

    const rStarText = r$.find('[data-hook*="star-rating"] .a-icon-alt, [data-hook="review-star-rating"]').first().text();
    let rRating = rating || 5;
    if (rStarText) {
      const m = rStarText.match(/([0-9.]+)/);
      if (m) rRating = parseFloat(m[1]);
    }

    const rTitle = cleanText(
      r$.find('[data-hook="reviewTitle"], [data-hook="review-title"] span:not(.a-icon-alt)').last().text() ||
      r$.find('[data-hook="reviewTitle"], [data-hook="review-title"]').first().text()
    );

    let rBody = cleanText(
      r$.find('[data-hook="reviewText"], [data-hook="review-body"], .review-text-content').first().text()
    );

    // Clean Amazon UI noise from review body
    rBody = rBody
      .replace(/Brief content visible, double tap to read full content\./gi, '')
      .replace(/Full content visible, double tap to read brief content\./gi, '')
      .replace(/Read more\s*Read less/gi, '')
      .trim();

    const rDate = cleanText(r$.find('[data-hook="review-date"]').first().text());

    if (rBody && rBody.length > 5 && !rBody.includes('function(') && !rBody.includes('var ')) {
      customerReviews.push({
        id: `rev-${Date.now()}-${i}`,
        reviewer_name: reviewerName,
        rating: rRating,
        title: rTitle || 'Verified Customer Review',
        review: rBody.slice(0, 500),
        date: rDate || 'Verified Purchase',
        verified: true,
      });
    }
  });

  return {
    title,
    brand,
    price,
    originalPrice,
    currency,
    description,
    bullets,
    specs,
    rating,
    ratingCount,
    images: Array.from(imageUrls).slice(0, 8),
    affiliateUrl: originalUrl,
    reviews: customerReviews.slice(0, 5),
  };
}

/**
 * Parse Flipkart Product Page
 */
function parseFlipkart($, html, finalUrl, originalUrl) {
  let title = cleanText(
    $('h1 span.B_NuCI').text() ||
    $('h1 span').text() ||
    $('h1').first().text() ||
    $('meta[property="og:title"]').attr('content')
  );

  let brand = '';
  const brandEl = $('span.G6XhRU').text();
  if (brandEl) brand = cleanText(brandEl);

  let price = parsePrice($('div._30jeq3._16Jk6d').text() || $('div._30jeq3').first().text());
  let originalPrice = parsePrice($('div._3I9_wc._2p6lqe').text() || $('div._3I9_wc').first().text()) || price;
  const currency = 'INR';

  const imageUrls = new Set();
  $('img._396cs4, img.q6DClP, img._2r_T1I, img._53G40d').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && src.startsWith('http')) {
      const highRes = src.replace(/@[0-9]+@[0-9]+/g, '@1200@1200');
      imageUrls.add(highRes);
    }
  });

  const bullets = [];
  $('div._21AqiI li, div._241VTa li, div._21lJ10').each((_, el) => {
    const txt = cleanText($(el).text());
    if (txt) bullets.push(txt);
  });

  const description = cleanText($('div._1mXcCf').text() || $('div._1mXcCf p').text() || bullets.slice(0, 2).join(' '));

  const specs = [];
  $('table._14cfVK tr').each((_, el) => {
    const row = $(el).clone();
    row.find('script, style').remove();
    const key = cleanText(row.find('td:first-child').text());
    const val = cleanText(row.find('td:last-child').text());
    if (
      key &&
      val &&
      !key.toLowerCase().includes('review') &&
      !key.toLowerCase().includes('rating') &&
      !val.includes('function(')
    ) {
      specs.push({ key, val });
    }
  });

  let rating = 4.4;
  const ratingText = $('div._3LWZlK').first().text();
  if (ratingText) {
    const r = parseFloat(ratingText);
    if (!isNaN(r)) rating = r;
  }

  const customerReviews = [];
  $('div._27M-vq, div._16PBlm').each((_, el) => {
    const r$ = $(el).clone();
    r$.find('script, style').remove();
    const rRating = parseFloat(r$.find('div._3LWZlK').first().text()) || 4.5;
    const rTitle = cleanText(r$.find('p._2-N8zT').first().text());
    const rBody = cleanText(r$.find('div.t-ZTKy').first().text());
    const reviewerName = cleanText(r$.find('p._2sc7ZR._2V5EHH').first().text()) || 'Verified Buyer';
    if (rBody && rBody.length > 5 && !rBody.includes('function(')) {
      customerReviews.push({
        id: `rev-${Date.now()}-${customerReviews.length}`,
        reviewer_name: reviewerName,
        rating: rRating,
        title: rTitle || 'Customer Review',
        review: rBody.slice(0, 450),
        date: 'Verified Purchase',
        verified: true,
      });
    }
  });

  return {
    title,
    brand,
    price,
    originalPrice,
    currency,
    description,
    bullets,
    specs,
    rating,
    ratingCount: 150,
    images: Array.from(imageUrls).slice(0, 8),
    affiliateUrl: originalUrl,
    reviews: customerReviews.slice(0, 5),
  };
}

/**
 * Universal Scraper for OpenGraph, Twitter Cards, Schema.org JSON-LD
 */
function parseUniversal($, html, finalUrl, originalUrl) {
  let title = cleanText(
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('h1').first().text() ||
    $('title').text()
  );

  let description = cleanText(
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    $('meta[name="description"]').attr('content')
  );

  let brand = cleanText($('meta[property="product:brand"]').attr('content') || '');
  let price = parsePrice($('meta[property="product:price:amount"]').attr('content') || $('meta[property="og:price:amount"]').attr('content'));
  let originalPrice = price;
  let currency = $('meta[property="product:price:currency"]').attr('content') || 'USD';

  const imageUrls = new Set();
  const ogImg = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
  if (ogImg && ogImg.startsWith('http')) imageUrls.add(ogImg);

  // Check Schema.org JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html());
      const findProduct = (obj) => {
        if (!obj) return null;
        if (obj['@type'] === 'Product') return obj;
        if (Array.isArray(obj)) {
          for (const item of obj) {
            const found = findProduct(item);
            if (found) return found;
          }
        }
        if (obj['@graph']) return findProduct(obj['@graph']);
        return null;
      };

      const prod = findProduct(json);
      if (prod) {
        if (!title && prod.name) title = cleanText(prod.name);
        if (!description && prod.description) description = cleanText(prod.description);
        if (!brand && prod.brand) {
          brand = cleanText(typeof prod.brand === 'object' ? prod.brand.name : prod.brand);
        }
        if (prod.image) {
          const imgs = Array.isArray(prod.image) ? prod.image : [prod.image];
          imgs.forEach((im) => {
            const u = typeof im === 'object' ? im.url : im;
            if (u && typeof u === 'string' && u.startsWith('http')) imageUrls.add(u);
          });
        }
        if (prod.offers) {
          const offer = Array.isArray(prod.offers) ? prod.offers[0] : prod.offers;
          if (offer) {
            if (offer.price) price = parseFloat(offer.price);
            if (offer.priceCurrency) currency = offer.priceCurrency;
          }
        }
      }
    } catch {}
  });

  return {
    title,
    brand,
    price,
    originalPrice,
    currency,
    description,
    bullets: [],
    specs: [],
    rating: 4.5,
    ratingCount: 1,
    images: Array.from(imageUrls).slice(0, 8),
    affiliateUrl: originalUrl,
  };
}

/**
 * Main Product Scraper Entry Point
 */
export async function scrapeProductFromUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    throw new Error('Please provide a valid product URL or affiliate link.');
  }

  const trimmedUrl = inputUrl.trim();
  const { html, finalUrl } = await fetchHtmlWithRedirects(trimmedUrl);

  // Check if response is raw JSON (e.g. from headless/REST APIs or products.json)
  const trimmedHtml = (html || '').trim();
  if (trimmedHtml.startsWith('{')) {
    try {
      const parsedJson = JSON.parse(trimmedHtml);
      if (parsedJson.title || parsedJson.name) {
        const title = parsedJson.title || parsedJson.name;
        const desc = parsedJson.description || '';
        const price = parsedJson.price !== undefined ? parsedJson.price : '';
        const rawImgs = [];
        if (parsedJson.image && typeof parsedJson.image === 'string') rawImgs.push(parsedJson.image);
        if (Array.isArray(parsedJson.images)) {
          parsedJson.images.forEach((img) => {
            if (typeof img === 'string') rawImgs.push(img);
            else if (img && img.src) rawImgs.push(img.src);
          });
        }

        const rating = parsedJson.rating?.rate || parsedJson.rating || 4.5;
        const ratingCount = parsedJson.rating?.count || 1;

        return {
          name: title,
          slug: generateSlug(title),
          brand: parsedJson.brand || '',
          short_description: desc.slice(0, 180) + '...',
          description: desc,
          price: price !== '' ? price : '',
          original_price: price !== '' ? price : '',
          currency: 'INR',
          rating: typeof rating === 'number' ? rating : 4.5,
          rating_count: typeof ratingCount === 'number' ? ratingCount : 1,
          affiliate_url: trimmedUrl,
          pros: Array.isArray(parsedJson.features) ? parsedJson.features : [],
          cons: [],
          specifications: parsedJson.specifications || {},
          images: rawImgs.map((u, i) => ({
            id: `img-auto-${Date.now()}-${i}`,
            image_url: u,
            is_primary: i === 0,
            alt_text: `${title} - Image ${i + 1}`,
            sort_order: i,
          })),
        };
      }
    } catch {}
  }

  const $ = cheerio.load(html);

  const lowerUrl = (finalUrl || trimmedUrl).toLowerCase();

  let extracted;
  if (lowerUrl.includes('amazon.') || lowerUrl.includes('amzn.to') || lowerUrl.includes('amzn.in')) {
    extracted = parseAmazon($, html, finalUrl, trimmedUrl);
  } else if (lowerUrl.includes('flipkart.com') || lowerUrl.includes('fkrt.it')) {
    extracted = parseFlipkart($, html, finalUrl, trimmedUrl);
  } else {
    extracted = parseUniversal($, html, finalUrl, trimmedUrl);
  }

  // Ensure title fallback
  if (!extracted.title) {
    extracted.title = $('h1').first().text().trim() || 'New Imported Product';
  }

  // Generate clean slug
  const slug = generateSlug(extracted.title);

  // Format images array into our database schema [{ id, image_url, is_primary, alt_text, sort_order }]
  const formattedImages = extracted.images.map((imgUrl, index) => ({
    id: `img-auto-${Date.now()}-${index}`,
    image_url: imgUrl,
    is_primary: index === 0,
    alt_text: `${extracted.title} - Image ${index + 1}`,
    sort_order: index,
  }));

  // Build specifications object
  const specifications = {};
  extracted.specs.forEach((s) => {
    if (s.key && s.val) {
      specifications[s.key] = s.val;
    }
  });

  return {
    name: extracted.title,
    slug,
    brand: extracted.brand || '',
    short_description: extracted.description ? extracted.description.slice(0, 180) + '...' : '',
    description: extracted.description || '',
    price: extracted.price !== null ? extracted.price : '',
    original_price: extracted.originalPrice !== null ? extracted.originalPrice : '',
    currency: extracted.currency || 'INR',
    rating: extracted.rating || 4.5,
    rating_count: extracted.ratingCount || 1,
    affiliate_url: extracted.affiliateUrl,
    pros: extracted.bullets.slice(0, 6),
    cons: [],
    specifications,
    images: formattedImages,
    reviews: extracted.reviews || [],
  };
}
