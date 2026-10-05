import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, MessageCircle, Send, Share2 } from 'lucide-react';
import { modalMotion } from '../animations/presets.js';
import { useToast } from '../context/ToastContext.jsx';

export default function ShareModal({ isOpen, onClose, product }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const shareUrl = `${window.location.origin}/products/${product.slug}`;
  const shareText = `Check out ${product.name} on ANTI PICKS:`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        addToast({ message: 'Link copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — ANTI PICKS`,
          text: product.short_description || product.name,
          url: shareUrl,
        });
      } catch {
        // User dismissed native share
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-sky-50 text-sky-700 hover:bg-sky-100',
    },
    {
      name: 'X (Twitter)',
      icon: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-neutral-100 text-black hover:bg-neutral-200',
    },
    {
      name: 'Facebook',
      icon: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <motion.div
        variants={modalMotion}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-dropdown border border-neutral-200 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black rounded-lg"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display font-bold text-xl text-black">Share this pick</h3>
        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{product.name}</p>

        {/* Copy Link Row */}
        <div className="mt-5 flex items-center gap-2 p-2 rounded-xl bg-neutral-100 border border-neutral-200">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs text-neutral-700 outline-none px-2 font-mono truncate"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Native Web Share button (if supported) */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-black hover:bg-neutral-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Open Device Share Menu</span>
          </button>
        )}

        {/* Social Share Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors ${item.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
