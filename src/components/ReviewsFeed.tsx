import React, { useState } from 'react';
import { Review } from '../types/travel';
import { Star, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';

interface ReviewsFeedProps {
  reviews: Review[];
  onHelpfulReview: (reviewId: string) => void;
  onSelectDestinationById: (destId: string) => void;
}

export const ReviewsFeed: React.FC<ReviewsFeedProps> = ({
  reviews,
  onHelpfulReview,
  onSelectDestinationById
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return Math.round(r.rating) === filterRating;
  });

  return (
    <section id="reviews-feed" className="py-16 border-t border-neutral-200 bg-neutral-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              <span>Authentic Community Voices</span>
              <span aria-hidden="true">·</span>
              <span>100% Verified Trips</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Latest Traveler Reviews & Experiences
            </h2>
          </div>

          {/* Filter by Star Rating */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-neutral-200 shadow-xs shrink-0">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterRating === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Ratings
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterRating === 5
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              5 ★ Only
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.slice(0, 6).map(review => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      <span>{review.authorName}</span>
                      {review.verifiedVisit && (
                        <span title="Verified Traveler" className="inline-flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                      <span>{review.authorLocation}</span>
                      <span aria-hidden="true">·</span>
                      <span>{review.tripType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Destination Reference Link */}
                <button
                  onClick={() => onSelectDestinationById(review.destinationId)}
                  className="text-left text-xs font-semibold text-amber-600 hover:underline cursor-pointer block"
                >
                  📍 {review.destinationName}
                </button>

                <h5 className="font-bold text-xs text-neutral-800 leading-snug">
                  "{review.title}"
                </h5>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">
                  {review.comment}
                </p>
              </div>

              {/* Bottom Helpful Strip */}
              <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>{review.date}</span>
                <button
                  onClick={() => onHelpfulReview(review.id)}
                  className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
