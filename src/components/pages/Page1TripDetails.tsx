import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, DollarSign, Sparkles, ArrowRight, Compass, Search } from 'lucide-react';
import { TripDetails, BudgetLevel } from '../../types';
import { POPULAR_DESTINATIONS } from '../../data/destinationsData';

interface Page1TripDetailsProps {
  details: TripDetails;
  onChangeDetails: (details: Partial<TripDetails>) => void;
  onNext: () => void;
}

export const Page1TripDetails: React.FC<Page1TripDetailsProps> = ({
  details,
  onChangeDetails,
  onNext,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.destination.trim()) {
      setError('Please enter a destination to start planning.');
      return;
    }
    setError(null);
    onNext();
  };

  const handleDestinationSelect = (destName: string) => {
    onChangeDetails({ destination: destName });
    setError(null);
  };

  // Adjust default budget amount when budgetLevel or currency changes
  const handleLevelChange = (level: BudgetLevel) => {
    const isINR = details.currency === '₹';
    let base = 1500;
    if (level === 'budget') base = isINR ? 25000 : 700;
    else if (level === 'moderate') base = isINR ? 65000 : 2200;
    else if (level === 'luxury') base = isINR ? 180000 : 5500;

    onChangeDetails({
      budgetLevel: level,
      budgetAmount: base * (details.travelers || 1),
    });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 1 • Trip Details 🌍
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Plan Your Perfect Trip{' '}
          <span className="inline-block hover:rotate-12 transition-transform cursor-default">
            ✈️
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Tell us where you want to go, and we'll create a personalized travel plan for you.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/90 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Name & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Johnson"
                value={details.name}
                onChange={(e) => onChangeDetails({ name: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>

            {/* Destination Search Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Destination (Any City, Country, or Island)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter ANY destination (e.g. Goa, Hyderabad, Paris, Tokyo...)"
                  value={details.destination}
                  onChange={(e) => {
                    onChangeDetails({ destination: e.target.value });
                    if (error) setError(null);
                  }}
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Destination Pill Suggestions */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Popular Inspiration (Click to auto-fill):
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((dest) => {
                const isSelected = details.destination.toLowerCase() === dest.name.toLowerCase();
                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => handleDestinationSelect(dest.name)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-amber-500/40'
                    }`}
                  >
                    <span>{dest.name}</span>
                    <span className="text-[10px] opacity-70">({dest.country})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Travelers, Start Date, Return Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Number of Travelers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Number of Travelers
              </label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={() => onChangeDetails({ travelers: Math.max(1, details.travelers - 1) })}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-base text-white">
                  {details.travelers} <span className="text-xs font-normal text-slate-400">{details.travelers === 1 ? 'Person' : 'People'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onChangeDetails({ travelers: Math.min(20, details.travelers + 1) })}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Travel Date / Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Travel Date / Start Date
              </label>
              <input
                type="date"
                required
                value={details.startDate}
                onChange={(e) => onChangeDetails({ startDate: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Return Date
              </label>
              <input
                type="date"
                required
                value={details.returnDate}
                onChange={(e) => onChangeDetails({ returnDate: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Budget Selector */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Estimated Travel Budget ({details.currency})
              </label>
              <span className="text-xs text-amber-400 font-semibold">
                Approx. {details.currency}{details.budgetAmount.toLocaleString()} Total
              </span>
            </div>

            {/* Budget Tier Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'budget' as BudgetLevel,
                  title: 'Budget-Friendly',
                  icon: '🎒',
                  subtitle: 'Hostels, cozy boutique stays & street food',
                },
                {
                  id: 'moderate' as BudgetLevel,
                  title: 'Comfort & Balanced',
                  icon: '🧳',
                  subtitle: '4-star hotels, guided tours & top dining',
                },
                {
                  id: 'luxury' as BudgetLevel,
                  title: 'Luxury & Premium',
                  icon: '💎',
                  subtitle: '5-star resorts, private transit & gourmet feasts',
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => handleLevelChange(tier.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    details.budgetLevel === tier.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{tier.icon}</div>
                  <div className="font-bold text-sm text-white">{tier.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{tier.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Custom Budget Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Flexible Amount Adjustment:</span>
                <span className="font-bold text-amber-300">{details.currency}{details.budgetAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={details.currency === '₹' ? 10000 : 300}
                max={details.currency === '₹' ? 500000 : 10000}
                step={details.currency === '₹' ? 5000 : 100}
                value={details.budgetAmount}
                onChange={(e) => onChangeDetails({ budgetAmount: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Action Button: Start Planning ✨ */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[280px] px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Start Planning ✨</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      {/* Feature Badges */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-2xl mb-1">🌍</div>
          <h4 className="text-xs font-bold text-slate-200">Global Destinations</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Works with any city, beach, or mountain town</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-2xl mb-1">🤖</div>
          <h4 className="text-xs font-bold text-slate-200">AI-Powered Planning</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Customized for your dates, budget & group size</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-2xl mb-1">⚡</div>
          <h4 className="text-xs font-bold text-slate-200">n8n Agent Integration</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time webhook connectivity & Gemini fallback</p>
        </div>
      </div>
    </div>
  );
};
