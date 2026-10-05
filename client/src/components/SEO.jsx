import { useEffect } from 'react';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
}) {
  useEffect(() => {
    const siteTitle = 'ANTI PICKS';
    const finalTitle = title ? `${title} — ${siteTitle}` : 'ANTI PICKS — Discover What\'s Worth Buying';
    document.title = finalTitle;

    const metaTags = [
      { name: 'description', content: description || 'Curated products, honest ratings and smart picks for tastemakers.' },
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: description || 'Curated gear and honest editorial ratings.' },
      { property: 'og:type', content: type },
      { property: 'og:image', content: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
      { property: 'twitter:title', content: finalTitle },
      { property: 'twitter:description', content: description || 'Curated gear and honest editorial ratings.' },
      { property: 'twitter:image', content: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      let element;
      if (name) {
        element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', name);
          document.head.appendChild(element);
        }
      } else if (property) {
        element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
      }
      if (element) {
        element.setAttribute('content', content);
      }
    });
  }, [title, description, image, url, type]);

  return null;
}
