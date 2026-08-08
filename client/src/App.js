import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import DayPlanner from './pages/DayPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePlaces from './pages/admin/ManagePlaces';
import AddPlace from './pages/admin/AddPlace';
import EditPlace from './pages/admin/EditPlace';
import About from './pages/About';
import Categories from './pages/Categories';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/day-planner" element={<ProtectedRoute><DayPlanner /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/places" element={<AdminRoute><ManagePlaces /></AdminRoute>} />
            <Route path="/admin/places/add" element={<AdminRoute><AddPlace /></AdminRoute>} />
            <Route path="/admin/places/edit/:id" element={<AdminRoute><EditPlace /></AdminRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
