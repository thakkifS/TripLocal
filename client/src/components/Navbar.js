import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, UserRound, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = [['Home', '/'], ['Places', '/places'], ['Categories', '/categories'], ['About', '/about']];
  const navClass = ({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary-700' : 'text-[#456054] hover:text-primary-700'}`;
  const close = () => setOpen(false);
  const signOut = () => { logout(); close(); navigate('/'); };

  return <header className="sticky top-0 z-[1000] bg-[#fbfcf8]/95 backdrop-blur border-b border-primary-900/10">
    <div className="section-shell h-[76px] flex items-center justify-between">
      <Link to="/" onClick={close}><BrandMark /></Link>
      <nav className="hidden md:flex items-center gap-8">{links.map(([label, to]) => <NavLink key={to} end={to === '/'} to={to} className={navClass}>{label}</NavLink>)}</nav>
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated && <Link to="/day-planner" className="h-10 px-4 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm flex items-center gap-2"><CalendarDays size={17}/> My plan</Link>}
        {isAdmin && <Link to="/admin" aria-label="Admin dashboard" className="h-10 w-10 rounded-full border border-primary-900/10 flex items-center justify-center"><LayoutDashboard size={18}/></Link>}
        {isAuthenticated ? <button onClick={signOut} title={`Sign out ${user?.name || ''}`} className="h-10 w-10 rounded-full bg-primary-900 text-white flex items-center justify-center"><LogOut size={17}/></button> : <Link to="/login" aria-label="Login" className="h-10 w-10 rounded-full bg-primary-900 text-white flex items-center justify-center"><UserRound size={18}/></Link>}
      </div>
      <button className="md:hidden h-10 w-10 grid place-items-center" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="md:hidden border-t bg-white px-5 py-5 space-y-1">{links.map(([label, to]) => <NavLink onClick={close} key={to} to={to} className="block px-4 py-3 rounded-xl font-semibold hover:bg-primary-50">{label}</NavLink>)}{isAuthenticated && <Link onClick={close} to="/day-planner" className="block px-4 py-3 rounded-xl font-semibold">My day plan</Link>}{isAdmin && <Link onClick={close} to="/admin" className="block px-4 py-3 rounded-xl font-semibold">Admin dashboard</Link>}{isAuthenticated ? <button onClick={signOut} className="w-full text-left px-4 py-3 text-red-600 font-semibold">Sign out</button> : <Link onClick={close} to="/login" className="block mt-2 text-center btn-primary">Login</Link>}</div>}
  </header>;
};
export default Navbar;
