import React, { useState } from 'react';
import { Destination, CustomItineraryPlan } from '../types/travel';
import { X, Sparkles, Calendar, Clock, DollarSign, Compass, Printer, Check } from 'lucide-react';

interface ItineraryPlannerModalProps {
  destinations: Destination[];
  initialDestination?: Destination;
  onClose: () => void;
}

export const ItineraryPlannerModal: React.FC<ItineraryPlannerModalProps> = ({
  destinations,
  initialDestination,
  onClose
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestination?.id || destinations[0]?.id || ''
  );
  const [days, setDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<'Budget' | 'Balanced' | 'Luxury'>('Balanced');
  const [pace, setPace] = useState<'Relaxed' | 'Moderate' | 'Fast-Paced'>('Moderate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<CustomItineraryPlan | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/itinerary/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: selectedDestId,
          days,
          travelStyle,
          pace
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPlan(data.data);
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Custom Travel Itinerary Planner</h3>
              <p className="text-xs text-neutral-500">
                Full-stack algorithmic route & budget generator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Controls Bar */}
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6 shrink-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Destination
              </label>
              <select
                value={selectedDestId}
                onChange={e => setSelectedDestId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration (Days) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Duration: <strong className="text-neutral-900">{days} Days</strong>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 7].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      days === d
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Budget Tier
              </label>
              <select
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Budget">Backpacker / Budget</option>
                <option value="Balanced">Balanced Comfort</option>
                <option value="Luxury">Private Luxury</option>
              </select>
            </div>

            {/* Pace */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Exploration Pace
              </label>
              <select
                value={pace}
                onChange={e => setPace(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Relaxed">Relaxed (Low Rush)</option>
                <option value="Moderate">Moderate (Standard)</option>
                <option value="Fast-Paced">Fast-Paced (See All)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? 'Computing Schedule...' : 'Generate Optimized Itinerary'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-6">
          {!generatedPlan ? (
            <div className="py-14 text-center border-2 border-dashed border-neutral-200 rounded-2xl p-6">
              <Compass className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="font-bold text-neutral-700 text-sm mb-1">
                Configure your trip parameters above
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Click “Generate Optimized Itinerary” to dynamically calculate morning, afternoon, and evening routes, cost breakdowns, and insider recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Plan Overview Banner */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300/60 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-1">
                    <span>{generatedPlan.destination.country}</span>
                    <span aria-hidden="true">·</span>
                    <span>{travelStyle} Tier</span>
                    <span aria-hidden="true">·</span>
                    <span>{pace} Pace</span>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">{generatedPlan.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1 max-w-xl">{generatedPlan.overview}</p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-neutral-500 uppercase font-semibold">
                    Total Estimated Budget
                  </div>
                  <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                    ${generatedPlan.estimatedTotalBudgetUSD}
                  </div>
                  <div className="text-[11px] text-neutral-400">All activities & dining included</div>
                </div>
              </div>

              {/* Day by Day Plan */}
              <div className="space-y-4">
                {generatedPlan.days.map(d => (
                  <div
                    key={d.dayNumber}
                    className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3.5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                          Day {d.dayNumber}
                        </span>
                        <h5 className="font-bold text-sm text-neutral-900">{d.theme}</h5>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {d.activities.map((act, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 mb-1">
                              <span>{act.time}</span>
                              <span className="text-amber-600 tabular-nums">{act.cost}</span>
                            </div>
                            <h6 className="font-semibold text-xs text-neutral-900 leading-snug mb-1">
                              {act.title}
                            </h6>
                            <p className="text-[11px] text-neutral-600 leading-relaxed mb-2">
                              {act.description}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-neutral-200/60 text-[10px] text-neutral-500 flex items-center justify-between">
                            <span>Duration: {act.duration}</span>
                            <span className="truncate max-w-[120px] italic">{act.tips}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Print / Save Trigger */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-500">
                  Ready to explore? Save or print this itinerary for your offline journey.
                </span>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Itinerary</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
