import React from 'react';
import { MapPin, Users, Calendar, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TripLocal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing places within 25km of your location and plan perfect one-day trips
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            TripLocal is designed to help tourists discover local attractions, plan their visits efficiently,
            and make the most of their one-day trips. We believe that every destination has hidden gems waiting
            to be explored, and our platform makes it easy to find and visit them.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Discover Places</h3>
            <p className="text-gray-600 text-sm">Find attractions within 25km of your location</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Plan Trips</h3>
            <p className="text-gray-600 text-sm">Create efficient one-day visit itineraries</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 text-sm">Share experiences and travel tips</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600 text-sm">Your data is protected with modern security</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Browse Places</h3>
              <p className="text-white/90 text-sm">Search and filter attractions by category, distance, or name</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">View Details</h3>
              <p className="text-white/90 text-sm">Check opening hours, travel tips, and location on the map</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Plan Your Day</h3>
              <p className="text-white/90 text-sm">Add places to your day plan and create your itinerary</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <a href="mailto:support@triplocal.com" className="btn-primary inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
