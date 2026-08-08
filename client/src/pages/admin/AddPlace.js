import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { ArrowLeft, Upload } from 'lucide-react';

const AddPlace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Nature',
    address: '',
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

  const categories = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Historical', 'Adventure'];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      Array.from(images).forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.post(`${API_URL}/places`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/places');
    } catch (error) {
      console.error('Error adding place:', error);
      alert('Failed to add place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Place</h1>
          <p className="text-gray-600">Create a new attraction for tourists to explore</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
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
                  placeholder="e.g., Kudumbigala Monastery"
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
                placeholder="Describe the attraction..."
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            
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
                  className="input-field"
                  placeholder="e.g., 7.2914"
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
                  className="input-field"
                  placeholder="e.g., 81.6720"
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
                  className="input-field"
                  placeholder="e.g., 12.5"
                />
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
                placeholder="Full address"
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
                  placeholder="e.g., 60"
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
                    placeholder="e.g., 08:00 AM - 06:00 PM"
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
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Upload images of the place (up to 5 images)
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
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Adding...' : 'Add Place'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
