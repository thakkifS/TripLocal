import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Trash2, Coffee, ArrowDown, Save, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const DayPlanner = () => {
  const [dayPlan, setDayPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const calculateTotals = useCallback((plan) => {
    if (!plan || !plan.places || plan.places.length === 0) {
      setTotalDistance(0);
      setTotalTime(0);
      return;
    }

    let distance = 0;
    let time = 0;

    plan.places.forEach((item, index) => {
      if (item.place) {
        distance += item.place.distanceFromHome || 0;
        time += item.place.estimatedVisitDuration || 60;
      }
    });

    // Add travel time between places (estimated 15 min per transition)
    if (plan.places.length > 1) {
      time += (plan.places.length - 1) * 15;
    }

    setTotalDistance(distance);
    setTotalTime(time);
  }, []);

  const fetchDayPlan = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dayplan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDayPlan(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching day plan:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateTotals]);

  useEffect(() => {
    fetchDayPlan();
  }, [fetchDayPlan]);

  const removeFromPlan = async (placeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/dayplan/remove/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchDayPlan();
    } catch (error) {
      console.error('Error removing from plan:', error);
      alert('Failed to remove place from plan');
    }
  };

  const clearPlan = async () => {
    if (!window.confirm('Are you sure you want to clear your entire day plan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/dayplan/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDayPlan(null);
      setTotalDistance(0);
      setTotalTime(0);
    } catch (error) {
      console.error('Error clearing plan:', error);
      alert('Failed to clear plan');
    }
  };

  const generateItinerary = () => {
    if (!dayPlan || !dayPlan.places || dayPlan.places.length === 0) {
      return null;
    }

    const itinerary = [];
    let currentTime = 8 * 60; // Start at 8:00 AM

    dayPlan.places.forEach((item, index) => {
      const place = item.place;
      const timeStr = formatTime(currentTime);
      
      itinerary.push({
        time: timeStr,
        place: place,
        isLunch: false
      });

      currentTime += place.estimatedVisitDuration || 60;

      // Add lunch break around 12:00 PM
      if (currentTime >= 12 * 60 && currentTime < 13 * 60 && index < dayPlan.places.length - 1) {
        itinerary.push({
          time: formatTime(currentTime),
          place: null,
          isLunch: true
        });
        currentTime += 60; // 1 hour lunch
      }

      // Add travel time between places
      if (index < dayPlan.places.length - 1) {
        currentTime += 15; // 15 min travel
      }
    });

    // Add end time
    itinerary.push({
      time: formatTime(currentTime),
      place: null,
      isEnd: true
    });

    return itinerary;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const itinerary = generateItinerary();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Day Trip</h1>
          <p className="text-gray-600">Plan your perfect one-day local adventure</p>
        </div>

        {!dayPlan || !dayPlan.places || dayPlan.places.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No places in your plan</h3>
            <p className="text-gray-500 mb-8">
              Start exploring and add places to create your day trip itinerary
            </p>
            <Link to="/places" className="btn-primary inline-block">
              Browse Places
            </Link>
          </div>
        ) : (
          <>
            {/* Itinerary */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
                <h2 className="text-2xl font-bold text-white">MY ONE-DAY PLAN</h2>
              </div>

              <div className="p-6">
                {itinerary.map((item, index) => (
                  <div key={index} className="relative">
                    {item.isEnd ? (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                          <span className="text-2xl">🎉</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">END OF TRIP</h3>
                        <p className="text-gray-600">{item.time}</p>
                      </div>
                    ) : item.isLunch ? (
                      <div className="flex items-center py-4">
                        <div className="w-24 text-right pr-4">
                          <span className="text-lg font-semibold text-gray-700">{item.time}</span>
                        </div>
                        <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center">
                          <Coffee className="w-8 h-8 text-yellow-600 mr-4" />
                          <div>
                            <h3 className="font-bold text-gray-900">Lunch Break</h3>
                            <p className="text-gray-600 text-sm">Take a break and enjoy a meal</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start py-4">
                        <div className="w-24 text-right pr-4 pt-2">
                          <span className="text-lg font-semibold text-gray-700">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200 rounded-xl p-4 relative">
                            <button
                              onClick={() => removeFromPlan(item.place._id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-start">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <MapPin className="w-6 h-6 text-primary-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{item.place.name}</h3>
                                <p className="text-primary-600 font-medium">{item.place.category}</p>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{item.place.estimatedVisitDuration} min visit</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {index < itinerary.length - 1 && !item.isEnd && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600">
                    {dayPlan.places.length}
                  </div>
                  <div className="text-gray-600 text-sm">Total Places</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl font-bold text-secondary-600">
                    {totalDistance.toFixed(1)} km
                  </div>
                  <div className="text-gray-600 text-sm">Est. Distance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">
                    {formatDuration(totalTime)}
                  </div>
                  <div className="text-gray-600 text-sm">Est. Time</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={clearPlan}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Clear Plan
              </button>
              <button disabled className="flex-1 btn-primary flex items-center justify-center disabled:opacity-80 disabled:cursor-default">
                <Save className="w-5 h-5 mr-2" />
                Plan Saved Automatically
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DayPlanner;
