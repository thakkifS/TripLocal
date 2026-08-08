import React from 'react';
import { MapPin } from 'lucide-react';

const BrandMark = ({ compact = false, inverse = false }) => (
  <div className="flex items-center gap-2.5">
    <div className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} relative rounded-full bg-primary-600 text-white flex items-center justify-center shadow-sm`}>
      <MapPin className={compact ? 'h-5 w-5' : 'h-6 w-6'} strokeWidth={2.3} />
      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-secondary-300 border-2 border-white" />
    </div>
    <div className="leading-none">
      <span className={`${compact ? 'text-xl' : 'text-2xl'} font-extrabold ${inverse ? 'text-white' : 'text-primary-900'}`}>Trip</span>
      <span className={`${compact ? 'text-xl' : 'text-2xl'} font-extrabold text-secondary-500`}>Local</span>
    </div>
  </div>
);

export default BrandMark;
