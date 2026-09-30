import React from 'react';
import { X, Star, MapPin, CheckCircle, Wifi, Coffee, Sparkles, ShieldCheck } from 'lucide-react';
import { HotelRecommendation } from '../types';

interface HotelDetailModalProps {
  hotel: HotelRecommendation | null;
  currency: string;
  onClose: () => void;
  onSelectHotel?: (hotel: HotelRecommendation) => void;
  isSelected?: boolean;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  currency,
  onClose,
  onSelectHotel,
  isSelected,
}) => {
  if (!hotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500 text-slate-950 inline-block mb-1.5 shadow-md">
                {hotel.tier.toUpperCase()} TIER
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {hotel.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {hotel.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">From</span>
              <div className="text-2xl font-extrabold text-amber-400">
                {currency}{hotel.pricePerNight.toLocaleString()}
                <span className="text-xs font-normal text-slate-300"> / night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Rating bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold text-slate-100">{hotel.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({hotel.ratingCount} verified guest reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Stay</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              About This Property
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {hotel.description}
            </p>
          </div>

          {/* Room Configuration */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Recommended Room Type
            </span>
            <p className="text-sm font-semibold text-slate-200">
              {hotel.roomType}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Includes complimentary high-speed Wi-Fi, air conditioning, daily housekeeping, and flexible check-in.
            </p>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Featured Amenities & Facilities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {hotel.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 font-medium"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{fac}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close Details
          </button>
          {onSelectHotel && (
            <button
              onClick={() => {
                onSelectHotel(hotel);
                onClose();
              }}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isSelected ? '✓ Selected as Preferred Hotel' : 'Select This Hotel for My Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
