import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, LayoutDashboard, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    categories: 0
  });
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const placesResponse = await axios.get(`${API_URL}/places`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const places = placesResponse.data;
      const categories = new Set(places.map(p => p.category));
      
      setStats({
        totalPlaces: places.length,
        categories: categories.size
      });
      
      setRecentPlaces(places.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      await axios.delete(`${API_URL}/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage places and categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Places</p>
                <p className="text-4xl font-bold">{stats.totalPlaces}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Categories</p>
                <p className="text-4xl font-bold">{stats.categories}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <LayoutDashboard className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/places/add"
              className="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Add New Place</h3>
                <p className="text-gray-600 text-sm">Create a new attraction</p>
              </div>
            </Link>

            <Link
              to="/admin/places"
              className="flex items-center p-4 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Manage Places</h3>
                <p className="text-gray-600 text-sm">View and edit all places</p>
              </div>
            </Link>

            <Link
              to="/admin/reviews"
              className="flex items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mr-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Review Approvals</h3>
                <p className="text-gray-600 text-sm">Approve tourist reviews</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Places */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Places</h2>
          </div>
          
          {recentPlaces.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No places added yet</p>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPlaces.map((place) => (
                    <tr key={place._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {place.images && place.images.length > 0 ? (
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{place.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {place.distanceFromHome} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/places/edit/${place._id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </Link>
                        <button
                          onClick={() => deletePlace(place._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {recentPlaces.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <Link to="/admin/places" className="text-primary-600 hover:text-primary-700 font-medium">
                View All Places →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
