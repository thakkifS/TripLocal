import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Check, MessageSquare, Star, X } from 'lucide-react';
import { API_URL } from '../../config';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const loadReviews = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reviews/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to load pending reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const moderate = async (reviewId, action) => {
    setProcessing(reviewId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/reviews/admin/${reviewId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews((current) => current.filter((review) => review._id !== reviewId));
    } catch (error) {
      alert(error.response?.data?.message || `Unable to ${action} review.`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" /></div>;

  return <main className="min-h-screen bg-gray-50 py-8">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="eyebrow">Administrator</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Review approvals</h1>
        <p className="mt-2 text-gray-600">Approve suitable tourist reviews before they become public.</p>
      </div>
      {reviews.length === 0 ? <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <MessageSquare className="mx-auto mb-4 h-14 w-14 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-800">No pending reviews</h2>
      </div> : <div className="space-y-5">{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{review.place?.name || 'Deleted place'}</h2>
            <p className="text-sm text-gray-500">{review.user?.name} · {review.user?.email}</p>
            <div className="mt-3 flex" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={19} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />)}</div>
          </div>
          <time className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</time>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">{review.comment}</p>
        <div className="mt-6 flex gap-3">
          <button disabled={processing === review._id} onClick={() => moderate(review._id, 'approve')} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"><Check size={18} /> Approve</button>
          <button disabled={processing === review._id} onClick={() => moderate(review._id, 'reject')} className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-3 font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"><X size={18} /> Reject</button>
        </div>
      </article>)}</div>}
    </div>
  </main>;
};

export default ManageReviews;
