import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Plus, ArrowLeft, Navigation } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToPlan, setAddingToPlan] = useState(false);

  useEffect(() => {
    fetchPlaceDetails();
  }, [id]);

  const fetchPlaceDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/places/${id}`);
      setPlace(response.data);
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
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
        `${process.env.REACT_APP_API_URL}/dayplan/add`,
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
