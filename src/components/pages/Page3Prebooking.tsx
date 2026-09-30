import React from 'react';
import { Building2, Car, Compass, MapPin, Check, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Clock, Zap } from 'lucide-react';
import { PrebookingPreferences } from '../../types';

interface Page3PrebookingProps {
  destination: string;
  preferences: PrebookingPreferences;
  onChangePreferences: (prefs: PrebookingPreferences) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

const CATEGORIES = [
  {
    id: 'Hotels' as const,
    title: 'Hotels & Resorts',
    icon: Building2,
    badge: 'Free Cancellation Options',
    desc: 'Reserve verified accommodations with early-bird discounts and complimentary breakfast perks.',
  },
  {
    id: 'Transport' as const,
    title: 'Transport & Transfers',
    icon: Car,
    badge: 'Guaranteed Seats',
    desc: 'Pre-arrange airport pickups, express train passes, and scenic self-drive rentals with zero wait times.',
  },
  {
    id: 'Activities' as const,
    title: 'Activities & Experiences',
    icon: Zap,
    badge: 'Skip-the-Line',
    desc: 'Bypass tourist ticket queues at premier landmarks, museums, and viewpoint observation decks.',
  },
  {
    id: 'Tours' as const,
    title: 'Guided Tours & Excursions',
    icon: Compass,
    badge: 'Local Certified Guides',
    desc: 'Immersive storytelling, heritage walks, culinary tasting excursions, and nature trails.',
  },
];

export const Page3Prebooking: React.FC<Page3PrebookingProps> = ({
  destination,
  preferences,
  onChangePreferences,
  onNext,
  onBack,
  isGenerating = false,
}) => {
  const toggleCategory = (cat: 'Hotels' | 'Transport' | 'Activities' | 'Tours') => {
    const exists = preferences.categories.includes(cat);
    const updated = exists
      ? preferences.categories.filter((c) => c !== cat)
      : [...preferences.categories, cat];

    onChangePreferences({
      ...preferences,
      categories: updated,
    });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 3 • Pre-Booking 🏨
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Would You Like to Pre-Book?
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Lock in guaranteed availability, skip crowded ticket counters, and secure seasonal discounts in{' '}
          <span className="text-amber-400 font-bold">{destination}</span>.
        </p>
      </div>

      {/* Option Selectors: Yes Pre-Book vs. No I'll Book Later */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
        {/* Yes, Pre-Book */}
        <div
          onClick={() => onChangePreferences({ ...preferences, willPrebook: true })}
          className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative text-left ${
            preferences.willPrebook
              ? 'bg-amber-500/15 border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.02]'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🏨✨</span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                preferences.willPrebook
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              {preferences.willPrebook && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">Yes, Pre-Book</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Reserve key accommodations, tickets, and transfers in advance for complete peace of mind.
          </p>
        </div>

        {/* No, I'll Book Later */}
        <div
          onClick={() => onChangePreferences({ ...preferences, willPrebook: false })}
          className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative text-left ${
            !preferences.willPrebook
              ? 'bg-amber-500/15 border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.02]'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🎒🗺️</span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                !preferences.willPrebook
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              {!preferences.willPrebook && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">No, I'll Book Later</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Keep full flexibility to book on-the-go once you arrive at your destination.
          </p>
        </div>
      </div>

      {/* Pre-Booking Categories Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              Select Booking Categories
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the travel essentials you wish to reserve or prioritize in recommendations.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-semibold self-start sm:self-auto">
            {preferences.categories.length} of 4 selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isChecked = preferences.categories.includes(cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                  isChecked
                    ? 'bg-slate-800/90 border-amber-500/60 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isChecked
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {cat.title}
                    </h4>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {cat.badge}
                  </span>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Destination Availability Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-300">Destination Availability Guarantee: </span>
            Available booking options and seasonal rates depend specifically on{' '}
            <strong className="text-amber-300">{destination}</strong>. Our AI Travel Agent checks current availability and local customs to tailor real recommendations.
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transport</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isGenerating}
          className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Generating Recommendations...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
