import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit, Trash2, Search, Plus } from 'lucide-react';
import axios from 'axios';

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/places`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaces(places.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place');
    }
  };

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Places</h1>
            <p className="text-gray-600">View, edit, and delete attractions</p>
          </div>
          <Link
            to="/admin/places/add"
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Place
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Places Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredPlaces.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 'No places found matching your search' : 'No places added yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Place
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPlaces.map((place) => (
                    <tr key={place._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {place.images && place.images.length > 0 ? (
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-16 h-16 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                              <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{place.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {place.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {place.distanceFromHome} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {place.estimatedVisitDuration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/places/edit/${place._id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4 inline-flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => deletePlace(place._id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-gray-600">
          Showing {filteredPlaces.length} of {places.length} places
        </div>
      </div>
    </div>
  );
};

export default ManagePlaces;
