import React from 'react';
import { Search, MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';
import { DestinationCategory } from '../types/travel';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  maxBudget: number;
  onBudgetChange: (budget: number) => void;
  onOpenItineraryPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxBudget,
  onBudgetChange,
  onOpenItineraryPlanner
}) => {
  const categories: ('All' | DestinationCategory)[] = [
    'All',
    'Heritage',
    'Coastal',
    'Mountain',
    'Nature'
  ];

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white py-16 sm:py-24">
      {/* Background Hero Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_travel_guide_1794369861264.jpg"
          alt="Breathtaking alpine travel exploration"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl space-y-4">
          {/* Unboxed Header Editorial Metadata */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <span>Full-Stack Development Project</span>
            <span aria-hidden="true">·</span>
            <span>Geospatial Travel Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Discover the World’s Most Wonder-Filled Destinations
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
            Explore ancient temple alleys, turquoise coastal cliffs, and alpine summits. Backed by verified traveler reviews, live map navigation, and custom day-by-day itineraries.
          </p>
        </div>

        {/* Search & Filter Command Bar */}
        <div className="mt-8 max-w-4xl p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 text-neutral-900">
          <div className="flex flex-col md:flex-row md:items-center gap-2.5">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-neutral-50 rounded-xl sm:rounded-2xl border border-neutral-200">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search by city, country, temple, mountain, or highlight..."
                className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-neutral-900 placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Budget Range Filter */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-neutral-50 rounded-xl sm:rounded-2xl border border-neutral-200 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-600">
                Max Daily Budget: <strong className="text-neutral-900 tabular-nums">${maxBudget}</strong>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="25"
                value={maxBudget}
                onChange={e => onBudgetChange(Number(e.target.value))}
                className="w-20 accent-neutral-900 cursor-pointer"
              />
            </div>

            {/* Custom Schedule Generator CTA */}
            <button
              onClick={onOpenItineraryPlanner}
              className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Itinerary</span>
            </button>
          </div>

          {/* Interactive Category Filter Tabs (Functional Button Controls) */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">
              Categories:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
