import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) navigate(result.user?.role === 'admin' ? '/admin' : '/');
    else setError(result.error);
    setLoading(false);
  };

  return <AuthLayout eyebrow="Welcome back" title="Sign in to TripLocal" description="Continue planning your nearby adventures. Tourists and administrators can sign in here.">
    {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={18}/><span>{error}</span></div>}
    <form onSubmit={handleSubmit} className="space-y-5">
      <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold text-primary-900">Email address</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19}/><input id="login-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required className="input-field !pl-12" placeholder="you@example.com"/></div></div>
      <div><label htmlFor="login-password" className="mb-2 block text-sm font-bold text-primary-900">Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19}/><input id="login-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange} required className="input-field !px-12" placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div></div>
      <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 !py-3.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in...' : <>Sign in <ArrowRight size={18}/></>}</button>
    </form>
    <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-primary-900/10"/><span className="text-xs font-bold uppercase tracking-widest text-gray-400">New here?</span><span className="h-px flex-1 bg-primary-900/10"/></div>
    <p className="text-center text-gray-500">Create an account to save your day plan. <Link to="/register" className="font-bold text-primary-700 hover:text-primary-900">Sign up</Link></p>
  </AuthLayout>;
};
export default Login;
