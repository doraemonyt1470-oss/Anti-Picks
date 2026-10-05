import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import SEO from '../../components/SEO.jsx';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    site_name: 'ANTI PICKS',
    tagline: "DISCOVER WHAT'S WORTH BUYING.",
    site_description: 'Curated products, honest ratings and smart picks for modern tastemakers.',
    logo_url: '',
    favicon_url: '',
    contact_email: 'editorial@antipicks.com',
    accent_color: '#000000',
    footer_text: '© 2026 ANTI PICKS. Curated products, honest ratings and smart picks.',
    affiliate_disclosure: 'ANTI PICKS may use affiliate links. When a user purchases through an affiliate link, ANTI PICKS may receive a commission at no additional cost to the user.',
    seo_title: 'ANTI PICKS — Discover What\'s Worth Buying',
    seo_description: 'Curated gear, honest ratings, and smart picks. Find the best products worth buying without the noise.',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        if (res && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      addToast({ message: 'Settings successfully updated.' });
    } catch (err) {
      console.error('Save settings error:', err);
      addToast({ message: 'Failed to update settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs">Loading settings...</div>;
  }

  return (
    <>
      <SEO title="Platform Settings" description="Configure site identity, disclosures, and SEO metadata." />

      <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Control branding identity, affiliate disclosure notices, and global SEO metadata.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* Brand & Identity */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <h2 className="font-display font-bold text-base text-black flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-display font-bold text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Editorial Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Site Description
            </label>
            <textarea
              rows={2}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800"
            />
          </div>
        </div>

        {/* Affiliate Disclosure Notice (PRD Section 31 & 34) */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <h2 className="font-display font-bold text-base text-black flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-neutral-700" />
            Affiliate Disclosure Text
          </h2>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Global Footer Disclosure Notice
            </label>
            <textarea
              rows={3}
              value={settings.affiliate_disclosure}
              onChange={(e) => setSettings({ ...settings, affiliate_disclosure: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800"
            />
          </div>
        </div>

        {/* Search Engine Optimization (SEO) */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <h2 className="font-display font-bold text-base text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Global SEO Defaults
          </h2>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Default Page Title
            </label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Default Meta Description
            </label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800"
            />
          </div>
        </div>
      </form>
    </>
  );
}
