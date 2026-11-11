import React from 'react';
import { Destination } from '../types/travel';
import { MapPin, Star, Calendar, ArrowRight, Compass } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
  onShowOnMap: (dest: Destination) => void;
  isSelected?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onShowOnMap,
  isSelected
}) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isSelected
          ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-lg'
          : 'border-neutral-200/80 hover:border-neutral-300 hover:shadow-md'
      }`}
    >
      {/* Visual Asset Container with Fallback */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
        <img
          src={destination.image}
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Styled Fallback Container */}
        <div
          style={{ display: 'none' }}
          className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 items-center justify-center p-6 text-white text-center"
        >
          <Compass className="w-10 h-10 text-amber-400 mb-2 opacity-80" />
          <p className="font-semibold text-sm">{destination.name}</p>
        </div>

        {/* Rating & Season Scrim */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{destination.rating}</span>
          <span className="text-white/70 font-normal">({destination.reviewCount})</span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-neutral-800 text-xs font-medium rounded-lg">
          {destination.category}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
            <span>{destination.country}</span>
            <span aria-hidden="true">·</span>
            <span>{destination.region}</span>
            <span aria-hidden="true">·</span>
            <span>{destination.idealDays} Days Rec.</span>
          </div>

          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-600 transition-colors leading-snug mb-2">
            {destination.name}
          </h3>

          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
            {destination.summary}
          </p>

          {/* Highlights Preview */}
          <div className="space-y-1.5 mb-5 text-xs text-neutral-600">
            {destination.highlights.slice(0, 2).map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold leading-none mt-0.5">•</span>
                <span className="truncate">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer: Budget & Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-neutral-400">Est. Daily Budget</div>
            <div className="text-sm font-bold text-neutral-900 tabular-nums">
              ${destination.approxDailyBudget}{' '}
              <span className="text-xs font-normal text-neutral-500">/ traveler</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowOnMap(destination)}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Locate on Interactive Map"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(destination)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
