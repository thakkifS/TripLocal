import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Plus, ArrowLeft, Navigation, Star, Camera, X } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToPlan, setAddingToPlan] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewPhotos, setReviewPhotos] = useState([]);

  const fetchPlaceDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/places/${id}`);
      setPlace(response.data);
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  useEffect(() => {
    axios.get(`${API_URL}/reviews/place/${id}`)
      .then((response) => {
        setReviews(response.data.reviews);
        setReviewSummary({ averageRating: response.data.averageRating, totalReviews: response.data.totalReviews });
      })
      .catch(() => {});
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!Number.isInteger(reviewForm.rating) || reviewForm.rating < 1 || reviewForm.rating > 5) {
      alert('Select a rating between 1 and 5 stars.');
      return;
    }
    const comment = reviewForm.comment.trim();
    if (comment.length < 10 || comment.length > 1000) {
      alert('Review must contain between 10 and 1000 characters.');
      return;
    }
    if (reviewPhotos.length > 3) {
      alert('You can add no more than 3 review photos.');
      return;
    }
    const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const photo of reviewPhotos) {
      if (!allowedPhotoTypes.includes(photo.type)) {
        alert(`${photo.name} must be a JPG, PNG, or WebP image.`);
        return;
      }
      if (photo.size > 1000000) {
        alert(`${photo.name} must be 1 MB or smaller.`);
        return;
      }
    }
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const reviewData = new FormData();
      reviewData.append('rating', reviewForm.rating);
      reviewData.append('comment', comment);
      reviewPhotos.forEach((photo) => reviewData.append('photos', photo));
      const response = await axios.post(`${API_URL}/reviews/place/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewPhotos([]);
      setReviewForm({ rating: 0, comment: '' });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const addToDayPlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setAddingToPlan(true);
    try {
      await axios.post(
        `${API_URL}/dayplan/add`,
        { placeId: id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Added to your day plan!');
    } catch (error) {
      console.error('Error adding to plan:', error);
      alert('Failed to add to plan. Please try again.');
    } finally {
      setAddingToPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Place not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96">
        {place.images && place.images.length > 0 ? (
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
            <MapPin className="w-24 h-24 text-primary-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {place.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                <span>{place.distanceFromHome} km away</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                <span>{place.estimatedVisitDuration} min visit</span>
              </div>
            </div>

            <button
              onClick={addToDayPlan}
              disabled={addingToPlan}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <Plus className="w-5 h-5" />
              <span>{addingToPlan ? 'Adding...' : 'Add to Day Plan'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{place.description}</p>
          </div>

          {/* Opening Hours */}
          <div className="px-4 py-8 sm:px-8 bg-gray-50 border-y border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Opening Hours</h2>
            <div className="overflow-hidden rounded-2xl border border-primary-900/10 bg-white">
              {Object.entries(place.openingHours || {}).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-[minmax(100px,1fr)_minmax(130px,1fr)] items-center gap-4 px-4 py-3.5 sm:px-5 border-b border-gray-100 last:border-0">
                  <span className="font-semibold text-primary-900 capitalize">{day}</span>
                  <span className="text-gray-600 text-right whitespace-nowrap">{hours || 'Closed'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          {place.travelTips && place.travelTips.length > 0 && (
            <div className="px-8 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Tips</h2>
              <ul className="space-y-2">
                {place.travelTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tourist Reviews */}
          {(reviews.length > 0 || !isAdmin) && <section className="border-t border-gray-100 px-4 py-8 sm:px-8">
            {reviewSummary.totalReviews > 0 && <div className="mb-6 flex justify-end">
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-bold text-amber-800">
                <Star size={19} className="fill-amber-400 text-amber-400" />
                {reviewSummary.averageRating} <span className="font-normal text-gray-500">({reviewSummary.totalReviews})</span>
              </div>
            </div>}

            {isAuthenticated && !isAdmin && !reviewSubmitted && !showReviewForm && <button onClick={() => setShowReviewForm(true)} className="btn-outline mb-8 inline-flex items-center gap-2">
              <Star size={18} /> Write a review
            </button>}

            {isAuthenticated && !isAdmin && !reviewSubmitted && showReviewForm && <form onSubmit={submitReview} noValidate className="mb-8 rounded-2xl border border-primary-900/10 bg-primary-50/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div><h3 className="font-bold text-gray-900">Review this place</h3><p className="mt-1 text-sm text-gray-600">Posting as {user?.name}</p></div>
                <button type="button" onClick={() => setShowReviewForm(false)} className="rounded-full p-2 text-gray-500 hover:bg-white" aria-label="Close review form"><X size={18} /></button>
              </div>
              <div className="mt-4 flex gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((star) => <button
                key={star}
                type="button"
                role="radio"
                aria-checked={reviewForm.rating === star}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                className="p-1"
              ><Star size={28} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} /></button>)}</div>
              <textarea
                value={reviewForm.comment}
                onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                maxLength={1000}
                rows={4}
                className="input-field mt-4"
                placeholder="Share your experience (10–1000 characters)"
              />
              <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary-900/20 bg-white px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50">
                <Camera size={18} /> Add optional photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(event) => setReviewPhotos(Array.from(event.target.files || []).slice(0, 3))}
                />
              </label>
              {reviewPhotos.length > 0 && <p className="mt-2 text-xs text-gray-500">{reviewPhotos.length} photo{reviewPhotos.length > 1 ? 's' : ''} selected · maximum 3 · 1 MB each</p>}
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-500">{reviewForm.comment.length}/1000</span>
                <button disabled={submittingReview} className="btn-primary disabled:opacity-60">{submittingReview ? 'Submitting...' : 'Submit for approval'}</button>
              </div>
            </form>}

            {!isAuthenticated && <button onClick={() => navigate('/login')} className="btn-outline mb-8">Sign in to write a review</button>}
            {reviewSubmitted && <div className="mb-8 rounded-2xl bg-green-50 p-5 text-green-800">Your review is waiting for administrator approval.</div>}

            {reviews.length > 0 && <div className="space-y-4">{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div><h3 className="font-bold text-gray-900">{review.user?.name || 'TripLocal tourist'}</h3><div className="mt-1 flex" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />)}</div></div>
                <time className="text-xs text-gray-500">{new Date(review.approvedAt || review.createdAt).toLocaleDateString()}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-gray-700">{review.comment}</p>
              {review.photos?.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{review.photos.map((photo, index) => <img key={index} src={photo} alt={`Review ${index + 1}`} className="h-32 w-full rounded-xl object-cover" />)}</div>}
            </article>)}</div>}
          </section>}

          {/* Location Map */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="h-80 rounded-xl overflow-hidden border-2 border-gray-200">
              <MapContainer
                center={[place.location.latitude, place.location.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[place.location.latitude, place.location.longitude]}>
                  <Popup>{place.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <p className="text-gray-600 mt-3 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              {place.address}
            </p>
            {place.locationUrl && (
              <a
                href={place.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center font-semibold text-primary-700 hover:text-primary-900"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open location in maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
