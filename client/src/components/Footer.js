import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import BrandMark from './BrandMark';

const Footer = () => (
  <footer className="bg-primary-900 text-white mt-auto">
    <div className="section-shell py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div><BrandMark inverse /><p className="mt-5 max-w-sm text-primary-100/70 leading-7">Thoughtful local adventures, close to home. Discover places, learn before you go, and shape a day worth remembering.</p></div>
      <div><h3 className="font-bold mb-4">Explore</h3><div className="space-y-3 text-primary-100/70"><Link className="block hover:text-secondary-300" to="/places">Places</Link><Link className="block hover:text-secondary-300" to="/categories">Categories</Link><Link className="block hover:text-secondary-300" to="/day-planner">Day planner</Link></div></div>
      <div><h3 className="font-bold mb-4">TripLocal</h3><p className="flex items-center gap-2 text-primary-100/70 mb-3"><MapPin size={17}/> Sri Lanka</p><p className="flex items-center gap-2 text-primary-100/70"><Mail size={17}/> hello@triplocal.lk</p></div>
    </div>
    <div className="border-t border-white/10"><div className="section-shell py-5 text-sm text-primary-100/60 flex flex-col sm:flex-row justify-between gap-2"><span>© {new Date().getFullYear()} TripLocal</span><span>Explore nearby. Travel meaningfully.</span></div></div>
  </footer>
);
export default Footer;
