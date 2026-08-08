import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, 'tourist');
    if (result.success) navigate('/'); else setError(result.error);
    setLoading(false);
  };
  const FieldIcon = ({ children }) => <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{children}</span>;

  return <AuthLayout eyebrow="Join the journey" title="Create your account" description="Save favourite places and turn them into a perfectly paced one-day itinerary.">
    {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={18}/><span>{error}</span></div>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label htmlFor="register-name" className="mb-2 block text-sm font-bold text-primary-900">Full name</label><div className="relative"><FieldIcon><User size={19}/></FieldIcon><input id="register-name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required className="input-field !pl-12" placeholder="Your full name"/></div></div>
      <div><label htmlFor="register-email" className="mb-2 block text-sm font-bold text-primary-900">Email address</label><div className="relative"><FieldIcon><Mail size={19}/></FieldIcon><input id="register-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required className="input-field !pl-12" placeholder="you@example.com"/></div></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="register-password" className="mb-2 block text-sm font-bold text-primary-900">Password</label><div className="relative"><FieldIcon><Lock size={19}/></FieldIcon><input id="register-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required className="input-field !pl-12 !pr-10" placeholder="6+ characters"/></div></div>
        <div><label htmlFor="register-confirm" className="mb-2 block text-sm font-bold text-primary-900">Confirm</label><div className="relative"><FieldIcon><Lock size={19}/></FieldIcon><input id="register-confirm" type={showPassword ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required className="input-field !pl-12 !pr-10" placeholder="Repeat password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-700" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
      </div>
      <p className="flex items-center gap-2 text-xs text-gray-500"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary-50 text-primary-700"><Check size={13}/></span> Tourist accounts can create and save day plans.</p>
      <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 !py-3.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Creating account...' : <>Create account <ArrowRight size={18}/></>}</button>
    </form>
    <p className="mt-7 text-center text-gray-500">Already have an account? <Link to="/login" className="font-bold text-primary-700 hover:text-primary-900">Sign in</Link></p>
  </AuthLayout>;
};
export default Register;
