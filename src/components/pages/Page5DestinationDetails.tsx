import React from 'react';
import { MapPin, Clock, DollarSign, Lightbulb, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Sun, Thermometer, Camera } from 'lucide-react';
import { TripPlan, TripDetails } from '../../types';

interface Page5DestinationDetailsProps {
  plan: TripPlan;
  details: TripDetails;
  onNext: () => void;
  onBack: () => void;
}

export const Page5DestinationDetails: React.FC<Page5DestinationDetailsProps> = ({
  plan,
  details,
  onNext,
  onBack,
}) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300 space-y-12">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 5 • Destination Details 📸
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Explore {plan.destination}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {plan.tagline}
        </p>
      </div>

      {/* Destination Hero Card */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl h-80 sm:h-96">
        <img
          src={plan.heroImage}
          alt={plan.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider inline-block mb-2 shadow-md">
              {plan.countryOrRegion}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
              {plan.destination}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Best Season: {plan.bestSeason}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Weather: {plan.currentWeather}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Places to Visit Showcase */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              📸 Iconic Sights & Experiences in {plan.destination}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated attractions, things to do, and pro traveler tips
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {plan.places.map((place, index) => (
            <div
              key={place.id || index}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800/90 shadow-xl flex flex-col lg:flex-row glass-card-hover group"
            >
              {/* Large High-Quality Image */}
              <div className="relative lg:w-2/5 h-64 lg:h-auto min-h-[280px] overflow-hidden bg-slate-900">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-extrabold text-sm flex items-center justify-center border border-amber-500/30">
                  {index + 1}
                </span>
              </div>

              {/* Details & Metadata */}
              <div className="p-6 sm:p-8 lg:w-3/5 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{place.location}</span>
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Things To Do */}
                  {place.thingsToDo && place.thingsToDo.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        Things to Do:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {place.thingsToDo.map((todo, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-xl border border-slate-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{todo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Metrics: Best Time, Approx Cost & Pro Tips */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Time</span>
                        <span className="font-semibold text-slate-200">{place.bestTime}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Entry Fee / Cost</span>
                        <span className="font-semibold text-amber-400">{place.entryFee || place.approxCost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Travel Tips Box */}
                  {place.travelTips && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="text-amber-300">Traveler Tip: </strong>
                        {place.travelTips}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Insider Tips & Advice */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          General Insider Tips for {plan.destination}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          {plan.travelTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View My Trip Plan 🗺️</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
