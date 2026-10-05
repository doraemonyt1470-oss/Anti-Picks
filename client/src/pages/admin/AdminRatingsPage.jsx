import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/formatters.js';
import SEO from '../../components/SEO.jsx';

export default function AdminRatingsPage() {
  const { addToast } = useToast();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRatings = async () => {
    setLoading(true);
    try {
      const res = await api.getRatings();
      setRatings(res.ratings || []);
    } catch (err) {
      console.error('Failed to load ratings:', err);
      addToast({ message: 'Error loading ratings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateRatingStatus(id, status);
      addToast({ message: `Rating marked as ${status}.` });
      setRatings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Update status error:', err);
      addToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  return (
    <>
      <SEO title="Ratings & Review Moderation" description="Review and moderate editorial feedback." />

      <div className="space-y-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black">
            Ratings & Review Moderation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Audit user testimonials, verify editorial scores, and suppress spam.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-3">Reviewer</th>
                  <th className="py-3.5 px-3">Score</th>
                  <th className="py-3.5 px-3">Review Content</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-400 font-mono">
                      Loading ratings...
                    </td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-500">
                      No ratings submitted yet.
                    </td>
                  </tr>
                ) : (
                  ratings.map((rev) => (
                    <tr key={rev.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-black max-w-[180px] truncate">
                        {rev.product_name}
                      </td>
                      <td className="py-3 px-3 text-neutral-700 font-medium">
                        {rev.reviewer_name}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{parseFloat(rev.rating).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs text-neutral-600">
                        {rev.title && <strong className="text-black block truncate">{rev.title}</strong>}
                        <p className="line-clamp-2">{rev.review}</p>
                      </td>
                      <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                        {formatDate(rev.created_at)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rev.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rev.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {rev.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(rev.id, 'approved')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Approve Review"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {rev.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject / Moderate Review"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
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
    </>
  );
}
