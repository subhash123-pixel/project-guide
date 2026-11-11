import React from 'react';
import { Compass, Server } from 'lucide-react';

interface NavbarProps {
  onOpenExamDocs: () => void;
  onOpenItineraryPlanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExamDocs, onOpenItineraryPlanner }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#"
          className="flex items-center gap-2 text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-amber-500 transition-colors">
            <Compass className="w-5 h-5 text-amber-400 group-hover:text-neutral-950 transition-colors" />
          </div>
          <span>WanderGuide</span>
        </a>

        {/* Zone 2: 4 Concise Single-Line Text Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600">
          <a
            href="#destinations"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Destinations
          </a>
          <a
            href="#interactive-map"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Interactive Map
          </a>
          <button
            onClick={onOpenItineraryPlanner}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer"
          >
            Itinerary Planner
          </button>
          <a
            href="#reviews-feed"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Traveler Reviews
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExamDocs}
            className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 border border-neutral-800"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>FSD Exam Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
