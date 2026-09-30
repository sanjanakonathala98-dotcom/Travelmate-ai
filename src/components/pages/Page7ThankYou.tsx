import React, { useState } from 'react';
import { Plane, Heart, Sparkles, CheckCircle2, RotateCcw, Share2, Compass, MapPin } from 'lucide-react';
import { TripDetails, TripPlan } from '../../types';

interface Page7ThankYouProps {
  details: TripDetails;
  plan: TripPlan | null;
  onPlanAnotherTrip: () => void;
}

export const Page7ThankYou: React.FC<Page7ThankYouProps> = ({
  details,
  plan,
  onPlanAnotherTrip,
}) => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm passport validity (minimum 6 months recommended)', checked: true },
    { id: 2, text: 'Save digital e-tickets and offline boarding passes', checked: true },
    { id: 3, text: 'Notify credit card / international payment banks', checked: false },
    { id: 4, text: 'Download offline Google Maps of destination', checked: true },
    { id: 5, text: 'Pack travel adapter, emergency power bank & meds', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 animate-in fade-in duration-500 overflow-hidden">
      {/* Scenic Sunset Airplane Backdrop Image */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&auto=format&fit=crop&q=80"
          alt="Sunset airplane flight"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105"
        />
        {/* Warm Sunset & Sapphire Radial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-transparent to-rose-950/40" />
      </div>

      <div className="relative max-w-3xl w-full mx-auto text-center space-y-8">
        {/* Airplane & Heart Glow Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-bounce [animation-duration:3s]">
            <Plane className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950 transform -rotate-45" />
          </div>
          <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-500 border-2 border-slate-950 flex items-center justify-center text-white text-xs shadow-lg">
            ❤️
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
            Thank You for Using TravelMate AI! 🌍
          </h1>

          <p className="text-base sm:text-xl text-amber-200/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            “Your journey begins with a plan. Have a safe trip and create unforgettable memories!”
          </p>
        </div>

        {/* Personalized Trip Farewell Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-left space-y-5 bg-slate-950/70 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Destination Countdown
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {details.destination} Adventure
              </h3>
            </div>
            <div className="text-xs text-slate-300">
              Traveler: <strong className="text-white">{details.name || 'Traveler'}</strong> • {details.travelers} Traveler(s)
            </div>
          </div>

          {/* Interactive Pre-Departure Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pre-Departure Readiness Checklist
            </h4>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 text-xs ${
                    item.checked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      item.checked ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'
                    }`}
                  />
                  <span className={item.checked ? 'line-through opacity-80' : ''}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Required Button: “Plan Another Trip” */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onPlanAnotherTrip}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
            <span>Plan Another Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
