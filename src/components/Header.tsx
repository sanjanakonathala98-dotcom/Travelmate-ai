import React from 'react';
import { Plane, Compass, Sparkles, SlidersHorizontal, CheckCircle2, ChevronRight } from 'lucide-react';
import { N8nWebhookConfig } from '../types';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  maxStepReached: number;
  onOpenWebhookModal: () => void;
  webhookConfig: N8nWebhookConfig;
  currency: string;
  onCurrencyChange: (c: string) => void;
}

const STEP_LABELS = [
  { step: 1, name: 'Trip Details', icon: '🌍' },
  { step: 2, name: 'Transport', icon: '🚗' },
  { step: 3, name: 'Pre-Booking', icon: '🏨' },
  { step: 4, name: 'Recommendations', icon: '🌟' },
  { step: 5, name: 'Places', icon: '📸' },
  { step: 6, name: 'Trip Plan', icon: '🗺️' },
  { step: 7, name: 'Thank You', icon: '❤️' },
];

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  maxStepReached,
  onOpenWebhookModal,
  webhookConfig,
  currency,
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-xl shadow-black/20">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => onStepClick(1)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  TravelMate AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Smart
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Your Smart Travel Companion
              </p>
            </div>
          </div>

          {/* Right Controls: Currency + n8n Webhook button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency selector */}
            <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 text-xs">
              {(['$', '₹', '€', '£'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    currency === curr
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Change currency to ${curr}`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* n8n Webhook configuration button */}
            <button
              onClick={onOpenWebhookModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                webhookConfig.isActive && webhookConfig.url
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
              }`}
              title="Configure n8n AI Agent Webhook"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">n8n Agent</span>
              <span className={`w-2 h-2 rounded-full ${webhookConfig.isActive && webhookConfig.url ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Step Progress Bar */}
      <div className="w-full bg-slate-900/60 border-t border-slate-800/60 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[620px] gap-2">
          {STEP_LABELS.map((item, idx) => {
            const isCurrent = currentStep === item.step;
            const isCompleted = item.step < currentStep || item.step <= maxStepReached;
            const isAccessible = item.step <= maxStepReached;

            return (
              <React.Fragment key={item.step}>
                <button
                  onClick={() => isAccessible && onStepClick(item.step)}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold select-none group ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                      : isCompleted
                      ? 'bg-slate-800/90 text-amber-300/90 hover:bg-slate-800 cursor-pointer border border-amber-500/20'
                      : 'text-slate-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="whitespace-nowrap">
                    {item.step}. {item.name}
                  </span>
                  {isCompleted && !isCurrent && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
                  )}
                </button>

                {idx < STEP_LABELS.length - 1 && (
                  <div className="flex-1 max-w-[28px] h-0.5 bg-slate-800 hidden md:block">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.step < currentStep ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
