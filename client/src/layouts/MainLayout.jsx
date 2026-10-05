import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SearchModal from '../components/SearchModal.jsx';
import ShareModal from '../components/ShareModal.jsx';
import { api } from '../lib/api.js';

export default function MainLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareProduct, setShareProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories in MainLayout:', err);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0A0A0A] font-sans antialiased">

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-grow">{children}</main>

      <Footer categories={categories} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <ShareModal
        isOpen={Boolean(shareProduct)}
        product={shareProduct}
        onClose={() => setShareProduct(null)}
      />
    </div>
  );
}
