import React from 'react';
import { Building2, Utensils, MapPin, DollarSign, Star, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Clock, PieChart, ShieldCheck } from 'lucide-react';
import { TripPlan, TripDetails, HotelRecommendation } from '../../types';

interface Page4RecommendationsProps {
  plan: TripPlan;
  details: TripDetails;
  onOpenHotelModal: (hotel: HotelRecommendation) => void;
  onNext: () => void;
  onBack: () => void;
  onJumpToTripPlan: () => void;
}

export const Page4Recommendations: React.FC<Page4RecommendationsProps> = ({
  plan,
  details,
  onOpenHotelModal,
  onNext,
  onBack,
  onJumpToTripPlan,
}) => {
  const { hotels, food, places, budgetBreakdown } = plan;
  const currency = details.currency || '$';

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300 space-y-12">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Heading & Meta Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 4 • Personalized Recommendations 🌟
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Your Personalized Recommendations
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Customized for <span className="text-amber-400 font-bold">{details.name || 'Traveler'}</span>'s trip to{' '}
          <span className="text-amber-400 font-bold">{plan.destination}</span> • {details.travelers} Traveler(s) • Target Budget: {currency}{details.budgetAmount.toLocaleString()}
        </p>

        {/* Source Badge */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {plan.source === 'n8n_agent'
              ? 'Dispatched & Tailored via n8n AI Agent Webhook'
              : plan.source === 'gemini_ai'
              ? 'Generated via Server Gemini AI'
              : 'Tailored by Smart Global Travel Engine'}
          </span>
        </div>
      </div>

      {/* SECTION 1: 🏨 BEST HOTELS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                🏨 Best Hotels & Stays
              </h2>
              <p className="text-xs text-slate-400">
                Top rated stays matched to your {details.budgetLevel} budget tier
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800/90 flex flex-col glass-card-hover group"
            >
              {/* Image & Price Tag */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {hotel.tier}
                </span>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md text-right border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Per night</span>
                  <span className="text-sm font-black text-amber-400">
                    {currency}{hotel.pricePerNight.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-white tracking-tight line-clamp-1">
                      {hotel.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{hotel.rating}</span>
                    <span className="text-slate-500 font-normal">({hotel.ratingCount} reviews)</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>

                  {/* Facilities Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.facilities.slice(0, 3).map((f, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => onOpenHotelModal(hotel)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-500/50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: 🍽️ FOOD & RESTAURANTS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🍽️ Food & Restaurants
            </h2>
            <p className="text-xs text-slate-400">
              Authentic regional delicacies and celebrated culinary hotspots
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {food.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800/90 flex flex-col glass-card-hover group"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-orange-300 border border-orange-500/30">
                  {item.cuisine}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/90 backdrop-blur-md text-amber-300 border border-slate-800">
                  ~{currency}{item.approxPrice.toLocaleString()} / meal
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item.location}</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                    Must-Try Specialty:
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {item.specialty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: 📍 PLACES TO VISIT */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              📍 Places to Visit
            </h2>
            <p className="text-xs text-slate-400">
              Must-see historic landmarks, scenic lookouts, and cultural treasures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800/90 flex flex-col sm:flex-row glass-card-hover group"
            >
              <div className="relative h-48 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-slate-900">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{place.location}</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{place.bestTime}</span>
                  </div>
                  <span className="font-bold text-amber-400">
                    {place.entryFee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: 💰 BUDGET BREAKDOWN */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                💰 Estimated Budget Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Itemized cost estimation prioritized to match your target budget
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Estimated Cost</span>
            <span className="text-2xl font-black text-amber-400">
              {currency}{budgetBreakdown.totalEstimatedCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Breakdown Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Transport', amount: budgetBreakdown.transport, icon: '✈️' },
            { label: 'Hotel & Stay', amount: budgetBreakdown.hotel, icon: '🏨' },
            { label: 'Food & Dining', amount: budgetBreakdown.food, icon: '🍽️' },
            { label: 'Activities & Tours', amount: budgetBreakdown.activities, icon: '🎟️' },
            { label: 'Local Travel', amount: budgetBreakdown.localTravel, icon: '🚕' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{item.icon} {item.label}</span>
              </div>
              <div className="font-extrabold text-sm text-slate-100">
                {currency}{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Savings Advice & Budget Fit Note */}
        {budgetBreakdown.savingsAdvice && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-emerald-300">Budget Advice: </strong>
              {budgetBreakdown.savingsAdvice}
            </p>
          </div>
        )}
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pre-Booking</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onJumpToTripPlan}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer"
          >
            Skip to Trip Plan 🗺️
          </button>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Destination Details 📸</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
