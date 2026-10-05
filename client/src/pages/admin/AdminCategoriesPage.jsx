import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Layers,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import SEO from '../../components/SEO.jsx';

export default function AdminCategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simplified Modal editor state - only name & status needed!
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      addToast({ message: 'Failed to load categories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      status: cat.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    if (!cleanName) {
      addToast({ message: 'Category name is required', type: 'error' });
      return;
    }

    // Auto-generate clean URL slug behind the scenes
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const payload = {
      name: cleanName,
      slug,
      status: formData.status || 'active',
    };

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        addToast({ message: `"${cleanName}" updated successfully.` });
      } else {
        await api.createCategory(payload);
        addToast({ message: `New category "${cleanName}" created.` });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error('Category save error:', err);
      addToast({ message: err.message || 'Error saving category', type: 'error' });
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? If it contains active products, deletion will be blocked.`)) {
      return;
    }

    try {
      await api.deleteCategory(cat.id);
      addToast({ message: `Category "${cat.name}" deleted.` });
      loadCategories();
    } catch (err) {
      console.error('Delete error:', err);
      addToast({ message: err.message || 'Cannot delete category with associated products', type: 'error' });
    }
  };

  return (
    <>
      <SEO title="Category Management" description="Organize and structure product categories." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
              Category Management
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Add and manage your store categories. Just enter a category name and save!
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Clean Categories Table */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4 w-32">Status</th>
                  <th className="py-3.5 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-neutral-400 font-mono">
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-neutral-500">
                      No categories found. Click "Add Category" to create one.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-black">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                            <Layers className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-neutral-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cat.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {cat.status === 'active' ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-2 text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Super Simple Category Editor Modal (No Image, No Slug, No Order, No Description!) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-display font-extrabold text-lg text-black">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Enter category name. It will be added immediately.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mobiles, Fashion, Watches, Shoes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Visibility Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-black bg-white focus:outline-none focus:border-black cursor-pointer shadow-2xs"
                >
                  <option value="active">Active (Visible on Store)</option>
                  <option value="inactive">Hidden (Draft)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-black text-white hover:bg-neutral-800 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
