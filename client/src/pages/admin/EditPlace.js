import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';
import { extractCoordinates, validateMapUrl } from '../../utils/location';
import { validatePlaceForm } from '../../utils/placeValidation';

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Nature',
    address: '',
    locationUrl: '',
    latitude: '',
    longitude: '',
    distanceFromHome: '',
    estimatedVisitDuration: 60,
    openingHours: {
      monday: '08:00 AM - 06:00 PM',
      tuesday: '08:00 AM - 06:00 PM',
      wednesday: '08:00 AM - 06:00 PM',
      thursday: '08:00 AM - 06:00 PM',
      friday: '08:00 AM - 06:00 PM',
      saturday: '08:00 AM - 06:00 PM',
      sunday: '08:00 AM - 06:00 PM'
    },
    travelTips: ['']
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const categories = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Historical', 'Adventure'];

  const fetchPlaceDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const place = response.data;
      setFormData((current) => ({
        name: place.name,
        description: place.description,
        category: place.category,
        address: place.address,
        locationUrl: place.locationUrl || '',
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        distanceFromHome: place.distanceFromHome,
        estimatedVisitDuration: place.estimatedVisitDuration,
        openingHours: place.openingHours || current.openingHours,
        travelTips: place.travelTips || ['']
      }));
      setExistingImages(place.images || []);
    } catch (error) {
      console.error('Error fetching place details:', error);
      alert('Failed to load place details');
      navigate('/admin/places');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('openingHours.')) {
      const day = name.split('.')[1];
      setFormData({
        ...formData,
        openingHours: {
          ...formData.openingHours,
          [day]: value
        }
      });
    } else if (name === 'travelTips') {
      const tips = value.split('\n').filter(tip => tip.trim());
      setFormData({ ...formData, travelTips: tips });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const calculateCoordinates = async () => {
    if (!validateMapUrl(formData.locationUrl)) {
      alert('Enter a valid HTTPS Google Maps or OpenStreetMap link.');
      return;
    }
    const coordinates = extractCoordinates(formData.locationUrl);
    if (!coordinates) {
      alert('This link does not contain coordinates. In Google Maps, copy the full browser URL containing @latitude,longitude.');
      return;
    }
    setCalculatingDistance(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/places/calculate-distance`, coordinates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData((current) => ({
        ...current,
        ...coordinates,
        distanceFromHome: response.data.distanceKm
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to calculate the road distance.');
    } finally {
      setCalculatingDistance(false);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePlaceForm(formData, images, existingImages.length);
    if (validationError) {
      alert(validationError);
      return;
    }
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'openingHours') {
          Object.keys(formData.openingHours).forEach(day => {
            formDataToSend.append(`openingHours[${day}]`, formData.openingHours[day]);
          });
        } else if (key === 'travelTips') {
          formData.travelTips.forEach((tip, index) => {
            formDataToSend.append(`travelTips[${index}]`, tip);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      Array.from(images).forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.put(`${API_URL}/places/${id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/places');
    } catch (error) {
      console.error('Error updating place:', error);
      alert(error.response?.data?.message || 'Failed to update place. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Place</h1>
          <p className="text-gray-600">Update attraction information</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-lg p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps or OpenStreetMap Link
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  name="locationUrl"
                  value={formData.locationUrl}
                  onChange={handleChange}
                  maxLength={2000}
                  className="input-field"
                  placeholder="https://www.google.com/maps/place/.../@7.29,81.67,15z"
                />
                <button type="button" disabled={calculatingDistance} onClick={calculateCoordinates} className="btn-outline whitespace-nowrap disabled:opacity-60">
                  {calculatingDistance ? 'Calculating...' : 'Calculate location'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Calculates coordinates and driving distance from New Mosque Road, Sainthamaruthu.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  min="-90"
                  max="90"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  min="-180"
                  max="180"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance from Home (km) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="distanceFromHome"
                  value={formData.distanceFromHome}
                  onChange={handleChange}
                  required
                  min="0"
                  max="25"
                  readOnly
                  className="input-field"
                />
                <p className="mt-2 text-xs text-gray-500">Calculated from the fastest available driving route.</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Visit Details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visit Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Visit Duration (minutes)
                </label>
                <input
                  type="number"
                  name="estimatedVisitDuration"
                  value={formData.estimatedVisitDuration}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  max="1440"
                  required
                />
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Opening Hours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData.openingHours).map(day => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {day}
                  </label>
                  <input
                    type="text"
                    name={`openingHours.${day}`}
                    value={formData.openingHours[day]}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Tips</h2>
            <textarea
              name="travelTips"
              value={formData.travelTips.join('\n')}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Enter each tip on a new line"
            />
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
            
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Existing ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Upload additional images (up to 5 images)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-primary"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlace;
