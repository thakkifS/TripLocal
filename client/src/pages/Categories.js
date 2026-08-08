import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Landmark, Drama, Mountain, Church, Compass, ArrowUpRight } from 'lucide-react';

const items = [
  ['Nature', TreePine, 'Forests, lagoons, beaches and wildlife'],
  ['Religious', Church, 'Sacred spaces and peaceful retreats'],
  ['Heritage', Landmark, 'Architecture and stories from the past'],
  ['Cultural', Drama, 'Living traditions, arts and communities'],
  ['Historical', Mountain, 'Landmarks that shaped the region'],
  ['Adventure', Compass, 'Active escapes and outdoor experiences'],
];

const Categories = () => <main className="flex-1">
  <section className="bg-primary-900 text-white py-20"><div className="section-shell"><p className="eyebrow !text-secondary-300">Browse your way</p><h1 className="text-4xl md:text-6xl font-extrabold mt-4">What are you in the mood for?</h1><p className="text-primary-100/70 text-lg mt-5 max-w-2xl">Choose a category and find nearby experiences that fit your perfect day out.</p></div></section>
  <section className="section-shell py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{items.map(([name, Icon, copy]) => <Link key={name} to={`/places?category=${name}`} className="group relative rounded-3xl p-7 min-h-56 border border-primary-900/10 bg-white hover:bg-primary-600 focus-visible:bg-primary-600 hover:text-white focus-visible:text-white hover:border-primary-600 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-900/10 focus-visible:-translate-y-2 focus-visible:ring-4 focus-visible:ring-primary-500/20 outline-none"><div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary-50 text-primary-700 group-hover:bg-white/15 group-hover:text-white group-focus-visible:bg-white/15 group-focus-visible:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"><Icon /></div><div><h2 className="text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1">{name}</h2><p className="mt-2 text-gray-500 group-hover:text-white/75 group-focus-visible:text-white/75 transition-colors">{copy}</p></div><ArrowUpRight className="absolute right-7 top-7 text-primary-500 group-hover:text-white group-focus-visible:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" /></Link>)}</section>
</main>;
export default Categories;
