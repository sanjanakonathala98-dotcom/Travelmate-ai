import React from 'react';
import { Plane, Heart, Shield, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  onGoToStep: (step: number) => void;
  onOpenWebhookModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToStep, onOpenWebhookModal }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 px-4 sm:px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 text-center">
        {/* Brand & Main Tagline */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <span className="font-extrabold text-base text-slate-100 tracking-tight">
              TravelMate AI
            </span>
          </div>

          <p className="text-sm font-semibold text-amber-300/90 tracking-wide">
            TravelMate AI — Your Smart Travel Companion 🌍✈️
          </p>
        </div>

        {/* Quick Links & Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <button
            onClick={() => onGoToStep(1)}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Start Planning
          </button>
          <button
            onClick={onOpenWebhookModal}
            className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            n8n Webhook Integration
          </button>
          <span className="text-slate-600">•</span>
          <span>Instant Global Recommendations</span>
          <span className="text-slate-600">•</span>
          <span>Dynamic Real-Time Budgeting</span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for curious global travelers worldwide.</span>
        </div>
      </div>
    </footer>
  );
};
