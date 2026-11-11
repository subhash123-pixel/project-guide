import React, { useState } from 'react';
import { Destination, Review } from '../types/travel';
import {
  X,
  Star,
  MapPin,
  Calendar,
  CloudSun,
  Utensils,
  Lightbulb,
  Compass,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination;
  reviews: Review[];
  onClose: () => void;
  onOpenReviewModal: (dest: Destination) => void;
  onBookGuide: (dest: Destination) => void;
  onPlanCustomItinerary: (dest: Destination) => void;
  onHelpfulReview: (reviewId: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  reviews,
  onClose,
  onOpenReviewModal,
  onBookGuide,
  onPlanCustomItinerary,
  onHelpfulReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'cuisine' | 'reviews'>('overview');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(destination.image);

  // Filter reviews for this destination
  const destReviews = reviews.filter(r => r.destinationId === destination.id);

  // Calculate star ratings breakdown
  const starCounts = [5, 4, 3, 2, 1].map(stars => {
    const count = destReviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = destReviews.length > 0 ? (count / destReviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 my-8 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={selectedGalleryImg}
            alt={destination.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white rounded-full transition-colors cursor-pointer z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Gallery Thumbnails */}
          {destination.gallery.length > 1 && (
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {destination.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedGalleryImg(img)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-transform cursor-pointer ${
                    selectedGalleryImg === img ? 'border-amber-400 scale-105' : 'border-white/50 opacity-80'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Hero Caption */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
              <span>{destination.country}</span>
              <span aria-hidden="true">·</span>
              <span>{destination.region}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{destination.category}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {destination.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <strong className="text-white">{destination.rating}</strong> ({destination.reviewCount} reviews)
              </span>
              <span aria-hidden="true">·</span>
              <span>Daily Budget: ~${destination.approxDailyBudget}</span>
              <span aria-hidden="true">·</span>
              <span>Best Season: {destination.bestSeason}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 px-6 border-b border-neutral-200 bg-neutral-50 shrink-0 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Highlights' },
            { id: 'itinerary', label: 'Suggested Itinerary' },
            { id: 'cuisine', label: 'Local Food & Tips' },
            { id: 'reviews', label: `Reviews (${destReviews.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  About This Destination
                </h4>
                <p className="text-neutral-700 leading-relaxed text-sm">
                  {destination.fullDescription}
                </p>
              </div>

              {/* Weather Widget Strip */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">
                      Current Climate: {destination.weather.tempC}°C · {destination.weather.condition}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {destination.weather.forecast} (Humidity: {destination.weather.humidity}%)
                    </div>
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  Ideal Duration: <strong className="text-neutral-900">{destination.idealDays} Days</strong>
                </div>
              </div>

              {/* Marquee Highlights */}
              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Top Experiences & Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-neutral-800 leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 text-center">
                  <div className="text-[11px] text-neutral-500">Monuments Entry</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1">{destination.entryFee}</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 text-center">
                  <div className="text-[11px] text-neutral-500">Local Currency</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1">{destination.currency}</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 text-center">
                  <div className="text-[11px] text-neutral-500">Available Guides</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1">{destination.guidesCount} Certified</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 text-center">
                  <div className="text-[11px] text-neutral-500">Coordinates</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 tabular-nums">
                    {destination.coordinates.lat.toFixed(2)}°, {destination.coordinates.lng.toFixed(2)}°
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Recommended {destination.idealDays}-Day Itinerary
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Curated by local guides for the best walking routes and cultural pacing.
                  </p>
                </div>
                <button
                  onClick={() => onPlanCustomItinerary(destination)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize Schedule</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {destination.itinerary.map(day => (
                  <div
                    key={day.day}
                    className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                          {day.day}
                        </span>
                        <h5 className="font-bold text-sm text-neutral-900">{day.title}</h5>
                      </div>
                      <span className="text-xs font-medium text-neutral-500">Est: {day.estimatedCost}</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-neutral-700">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-neutral-400 w-16 shrink-0">Morning:</span>
                        <span>{day.morning}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-neutral-400 w-16 shrink-0">Afternoon:</span>
                        <span>{day.afternoon}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-neutral-400 w-16 shrink-0">Evening:</span>
                        <span>{day.evening}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cuisine' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Must-Try Local Culinary Delicacies</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.localCuisine.map((dish, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col justify-between"
                    >
                      <h5 className="font-bold text-sm text-neutral-900 mb-1">{dish.name}</h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">{dish.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Insider Travel Tips & Etiquette</span>
                </h4>
                <div className="space-y-2.5">
                  {destination.travelTips.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 text-xs text-neutral-700 leading-relaxed flex items-start gap-2"
                    >
                      <span className="font-bold text-amber-700 shrink-0">0{i + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary Card */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="text-center sm:border-r sm:border-neutral-200 sm:pr-4">
                  <div className="text-4xl font-extrabold text-neutral-900 tabular-nums">
                    {destination.rating}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500">Based on {destReviews.length} traveler reviews</div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="col-span-2 space-y-1.5">
                  {starCounts.map(item => (
                    <div key={item.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-7 text-neutral-600 font-medium">{item.stars} ★</span>
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-neutral-400 tabular-nums">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Write Review */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-900">Traveler Feedback</h4>
                <button
                  onClick={() => onOpenReviewModal(destination)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3.5">
                {destReviews.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    No reviews yet. Be the first adventurer to share your experience!
                  </div>
                ) : (
                  destReviews.map(r => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900">{r.authorName}</span>
                            {r.verifiedVisit && (
                              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified Trip</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                            <span>{r.authorLocation}</span>
                            <span aria-hidden="true">·</span>
                            <span>{r.tripType} Traveler</span>
                            <span aria-hidden="true">·</span>
                            <span>{r.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="font-semibold text-xs text-neutral-900 pt-1">{r.title}</h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">{r.comment}</p>

                      <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100">
                        <span>Visited in {r.travelMonth || 'Summer'}</span>
                        <button
                          onClick={() => onHelpfulReview(r.id)}
                          className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({r.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-[11px] text-neutral-400">Total Estimated Package</div>
            <div className="text-base font-bold text-neutral-900 tabular-nums">
              ${destination.approxDailyBudget * destination.idealDays}{' '}
              <span className="text-xs font-normal text-neutral-500">
                ({destination.idealDays} Days / Traveler)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onPlanCustomItinerary(destination)}
              className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Generate Itinerary
            </button>
            <button
              onClick={() => onBookGuide(destination)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Book Local Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
