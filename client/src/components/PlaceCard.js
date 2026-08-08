import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock3, ArrowUpRight, Plus, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const PlaceCard = ({ place, showAdd = true }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const add = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setAdding(true);
    try { await axios.post(`${API_URL}/dayplan/add`, { placeId: place._id }, { headers: { Authorization: `Bearer ${token}` } }); }
    catch (error) { if (error.response?.status !== 400) console.error(error); }
    finally { setAdding(false); }
  };
  return <article className="card group flex flex-col h-full">
    <Link to={`/places/${place._id}`} className="relative h-56 overflow-hidden block">
      {place.images?.[0] ? <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> : <div className="image-placeholder w-full h-full flex flex-col items-center justify-center text-primary-700/45"><ImageIcon size={38}/><span className="text-xs font-bold uppercase tracking-widest mt-3">Image coming soon</span></div>}
      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-primary-800">{place.category}</span>
      <span className="absolute top-4 right-4 bg-primary-900/80 text-white backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold">{place.distanceFromHome} km</span>
    </Link>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-xl font-bold text-primary-900 line-clamp-1 min-h-7">{place.name}</h3>
      <p className="flex items-start gap-2 text-sm text-gray-500 mt-2 min-h-10"><MapPin size={15} className="text-primary-600 shrink-0 mt-0.5"/><span className="line-clamp-2">{place.address || 'Local attraction'}</span></p>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-5 pt-4 border-t border-primary-900/10"><span className="flex items-center gap-1.5"><Clock3 size={16}/>{place.estimatedVisitDuration || 60} min</span><span className="text-primary-700 font-semibold">Within 25 km</span></div>
      <div className="flex items-center gap-2 mt-auto pt-5"><Link to={`/places/${place._id}`} className="flex-1 min-w-0 h-10 rounded-full bg-primary-900 text-white px-4 text-sm font-semibold inline-flex justify-center items-center gap-2 whitespace-nowrap">View details <ArrowUpRight size={16} className="shrink-0"/></Link>{showAdd && <button onClick={add} disabled={adding} aria-label="Add to plan" className="h-10 w-10 shrink-0 rounded-full border border-primary-700 text-primary-700 flex items-center justify-center hover:bg-primary-50 disabled:opacity-50"><Plus size={18}/></button>}</div>
    </div>
  </article>;
};
export default PlaceCard;
