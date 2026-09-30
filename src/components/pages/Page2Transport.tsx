import React from 'react';
import { Plane, Train, Bus, Car, Ship, Clock, DollarSign, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { TransportOption, TransportType } from '../../types';

interface Page2TransportProps {
  destination: string;
  selectedTransport: TransportType;
  transportOptions: TransportOption[];
  currency: string;
  travelers: number;
  onSelectTransport: (type: TransportType) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Page2Transport: React.FC<Page2TransportProps> = ({
  destination,
  selectedTransport,
  transportOptions,
  currency,
  travelers,
  onSelectTransport,
  onNext,
  onBack,
}) => {
  const getIcon = (id: TransportType) => {
    switch (id) {
      case 'flight':
        return <Plane className="w-6 h-6 text-amber-400" />;
      case 'train':
        return <Train className="w-6 h-6 text-blue-400" />;
      case 'car':
        return <Car className="w-6 h-6 text-emerald-400" />;
      case 'bus':
        return <Bus className="w-6 h-6 text-orange-400" />;
      case 'ferry':
        return <Ship className="w-6 h-6 text-cyan-400" />;
      default:
        return <Plane className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Page 2 • Mode of Transport 🚗✈️🚆
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          How Would You Like to Travel?
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Select your ideal mode of transportation to <span className="text-amber-400 font-bold">{destination}</span>. Pricing and duration adapt dynamically to your route and group of {travelers} traveler{travelers > 1 ? 's' : ''}.
        </p>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {transportOptions.map((opt) => {
          const isSelected = selectedTransport === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onSelectTransport(opt.id)}
              className={`relative rounded-3xl p-6 border cursor-pointer transition-all duration-300 glass-card-hover ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.02]'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Optional Tag (e.g. Recommended, Fastest) */}
              {opt.tag && (
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700">
                  {opt.tag}
                </span>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/50'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {getIcon(opt.id)}
                </div>

                <div className="flex-1 min-w-0 pr-16 sm:pr-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {opt.title}
                    </h3>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-amber-400 fill-amber-400/20 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {opt.description}
                  </p>

                  {/* Metadata Chips: Time and Cost */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{opt.estimatedTime}</span>
                    </div>

                    <div className="flex items-center gap-1 text-right">
                      <span className="text-slate-400">Total:</span>
                      <span className="font-extrabold text-sm text-amber-400">
                        {currency}{opt.approxTotalCost.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({currency}{opt.approxCostPerPerson.toLocaleString()}/person)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
