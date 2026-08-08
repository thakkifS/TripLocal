import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, Filter } from 'lucide-react';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';

const Places = () => {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    distance: ''
  });

  const categories = ['All', 'Religious', 'Nature', 'Heritage', 'Cultural', 'Historical', 'Adventure'];
  const distanceRanges = ['0 - 5', '5 - 10', '10 - 15', '15 - 20', '20 - 25'];

  useEffect(() => {
    fetchPlaces();
  }, [filters]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.distance) params.distance = filters.distance;

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/places`, { params });
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleDistanceChange = (distance) => {
    setFilters({ ...filters, distance });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Places Near You</h1>
          <p className="text-gray-600">Discover amazing attractions within 25km</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search places..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.category === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Distance</h4>
            <div className="flex flex-wrap gap-2">
              {distanceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleDistanceChange(filters.distance === range ? '' : range)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.distance === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{places.length} places found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Places;
