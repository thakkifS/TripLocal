import React from 'react';
import { Compass, MapPin, CalendarCheck } from 'lucide-react';
import BrandMark from './BrandMark';
import travelSign from '../images/image5.jpeg';

const AuthLayout = ({ eyebrow, title, description, children }) => (
  <main className="flex-1 bg-[#edf2e9] px-4 py-10 sm:px-6 lg:py-16">
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-primary-900/10 bg-white shadow-2xl shadow-primary-900/10 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden min-h-[700px] overflow-hidden bg-primary-900 p-8 text-white lg:flex lg:flex-col xl:p-10">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10"><BrandMark inverse /><p className="mt-8 max-w-sm text-3xl font-extrabold leading-tight xl:text-4xl">Your perfect local day starts here.</p><p className="mt-3 max-w-sm leading-7 text-primary-100/70">Save nearby places, build a simple itinerary and discover more of the region around you.</p></div>

        <div className="relative z-10 my-7 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[#011b0e] shadow-xl">
          <img src={travelSign} alt="Illustrated local travel direction signs" className="h-full w-full object-contain" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/15 via-transparent to-white/5" />
        </div>

        <div className="relative z-10 grid gap-3 text-sm">
          <span className="flex w-full items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur"><MapPin size={16} className="shrink-0 text-secondary-300" /> Places within 25 km</span>
          <span className="flex w-full items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur"><CalendarCheck size={16} className="shrink-0 text-secondary-300" /> Personal day planning</span>
        </div>
      </aside>

      <section className="flex items-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden"><BrandMark /></div>
          <p className="eyebrow flex items-center gap-2"><Compass size={15} /> {eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold text-primary-900 sm:text-5xl">{title}</h1>
          <p className="mt-3 leading-7 text-gray-500">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  </main>
);

export default AuthLayout;
