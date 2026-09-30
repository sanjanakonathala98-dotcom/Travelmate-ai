import React, { useState } from 'react';
import { Calendar, Users, DollarSign, MapPin, Building2, Utensils, Plane, ShieldCheck, Printer, Share2, Sparkles, Check, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { TripPlan, TripDetails, TransportType, PrebookingPreferences, HotelRecommendation } from '../../types';

interface Page6MyTripPlanProps {
  plan: TripPlan;
  details: TripDetails;
  selectedTransport: TransportType;
  prebooking: PrebookingPreferences;
  selectedHotel: HotelRecommendation | null;
  onFinishAndThankYou: () => void;
  onPlanAgain: () => void;
  onReturnToHome: () => void;
}

export const Page6MyTripPlan: React.FC<Page6MyTripPlanProps> = ({
  plan,
  details,
  selectedTransport,
  prebooking,
  selectedHotel,
  onFinishAndThankYou,
  onPlanAgain,
  onReturnToHome,
}) => {
  const [copied, setCopied] = useState(false);
  const currency = details.currency || '$';
  const effectiveHotel = selectedHotel || plan.hotels[0];

  const handleShare = () => {
    const text = `✈️ My Trip Plan to ${plan.destination} with TravelMate AI!\nTraveler: ${details.name}\nDates: ${details.startDate} to ${details.returnDate}\nTravelers: ${details.travelers}\nEstimated Cost: ${currency}${plan.budgetBreakdown.totalEstimatedCost.toLocaleString()}\nHotel: ${effectiveHotel.name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300 space-y-10">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 6 • Trip Summary 🗺️
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Your Trip Plan Is Ready! ✨
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          All your personalized travel choices, bookings, and day-by-day itinerary curated in one master overview.
        </p>
      </div>

      {/* Primary Trip Overview Card (Print-friendly) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8 bg-slate-900/90">
        {/* Destination & Traveler Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Curated Travel Plan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {details.name}'s Adventure to {plan.destination}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generated via TravelMate AI • {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* 6-Grid Core Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Traveler</span>
            <span className="font-bold text-sm text-white truncate block">{details.name || 'Traveler'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Destination</span>
            <span className="font-bold text-sm text-amber-400 truncate block">{plan.destination}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Travelers</span>
            <span className="font-bold text-sm text-white">{details.travelers} Person{details.travelers > 1 ? 's' : ''}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Dates</span>
            <span className="font-bold text-xs text-white block truncate">{details.startDate || 'Upcoming'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Transport</span>
            <span className="font-bold text-sm text-white capitalize">{selectedTransport}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Pre-Booking</span>
            <span className="font-bold text-xs text-emerald-400">
              {prebooking.willPrebook ? 'Yes, Confirmed' : 'Book on arrival'}
            </span>
          </div>
        </div>

        {/* Highlighted Choices Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Hotel Summary */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Recommended Hotel
            </div>
            <img
              src={effectiveHotel.image}
              alt={effectiveHotel.name}
              className="w-full h-32 object-cover rounded-xl"
            />
            <div>
              <h4 className="font-bold text-sm text-white">{effectiveHotel.name}</h4>
              <p className="text-xs text-slate-400">{effectiveHotel.location}</p>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {currency}{effectiveHotel.pricePerNight.toLocaleString()} / night • {effectiveHotel.roomType}
              </p>
            </div>
          </div>

          {/* Food Summary */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              Top Food & Dining
            </div>
            <img
              src={plan.food[0]?.image}
              alt={plan.food[0]?.name}
              className="w-full h-32 object-cover rounded-xl"
            />
            <div>
              <h4 className="font-bold text-sm text-white">{plan.food[0]?.name}</h4>
              <p className="text-xs text-slate-400">{plan.food[0]?.cuisine}</p>
              <p className="text-xs text-orange-300 font-semibold mt-1">
                Specialty: {plan.food[0]?.specialty}
              </p>
            </div>
          </div>

          {/* Attraction Summary */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              Premier Attraction
            </div>
            <img
              src={plan.places[0]?.image}
              alt={plan.places[0]?.name}
              className="w-full h-32 object-cover rounded-xl"
            />
            <div>
              <h4 className="font-bold text-sm text-white">{plan.places[0]?.name}</h4>
              <p className="text-xs text-slate-400">{plan.places[0]?.location}</p>
              <p className="text-xs text-rose-300 font-semibold mt-1">
                Entry: {plan.places[0]?.entryFee}
              </p>
            </div>
          </div>
        </div>

        {/* Day-by-Day Suggested Itinerary */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🗺️ Suggested Day-by-Day Itinerary</span>
          </h3>

          <div className="space-y-3">
            {plan.itinerary.map((day) => (
              <div
                key={day.day}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Day {day.day}
                  </span>
                  <span className="font-bold text-sm text-white">{day.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="font-bold text-amber-400 block mb-0.5">🌅 Morning</span>
                    <p className="text-slate-300 leading-relaxed">{day.morning}</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="font-bold text-orange-400 block mb-0.5">☀️ Afternoon</span>
                    <p className="text-slate-300 leading-relaxed">{day.afternoon}</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="font-bold text-rose-400 block mb-0.5">🌙 Evening</span>
                    <p className="text-slate-300 leading-relaxed">{day.evening}</p>
                  </div>
                </div>

                {day.highlight && (
                  <p className="text-[11px] text-amber-300/90 font-medium pt-1">
                    ✨ Daily Highlight: {day.highlight}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Total Journey Cost
            </span>
            <div className="text-3xl font-black text-amber-400 mt-0.5">
              {currency}{plan.budgetBreakdown.totalEstimatedCost.toLocaleString()}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Fits within target budget of {currency}{details.budgetAmount.toLocaleString()} ({details.budgetLevel} tier)
            </p>
          </div>

          <button
            onClick={onFinishAndThankYou}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Complete & Confirm Trip ❤️</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Prompt Required Buttons: “Return to Home” & “Plan Again” */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={onReturnToHome}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>Return to Home</span>
        </button>

        <button
          type="button"
          onClick={onPlanAgain}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Plan Again</span>
        </button>
      </div>
    </div>
  );
};
