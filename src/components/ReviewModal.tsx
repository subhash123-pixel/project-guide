import React, { useState } from 'react';
import { Destination, Review } from '../types/travel';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  destination: Destination;
  onClose: () => void;
  onReviewSubmitted: (newReview: Review, updatedRating: number, totalReviews: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  destination,
  onClose,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [tripType, setTripType] = useState<'Solo' | 'Couples' | 'Family' | 'Friends'>('Solo');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !comment.trim()) {
      setErrorMsg('Please fill in your name, review headline, and feedback comment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/destinations/${destination.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          authorLocation: authorLocation.trim() || 'Verified Traveler',
          rating,
          tripType,
          title,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setSuccessMsg('Thank you! Your verified review has been posted successfully.');
      setTimeout(() => {
        onReviewSubmitted(data.data, data.updatedDestinationRating, data.totalReviews);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while posting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 p-6 sm:p-7 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Share Your Experience</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Reviewing <strong className="text-neutral-800">{destination.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Overall Traveler Rating
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = (hoverRating ?? rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-2xl transition-transform hover:scale-115 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          active ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-neutral-800 ml-2">
                {rating === 5
                  ? '5.0 - Exceptional'
                  : rating === 4
                  ? '4.0 - Very Good'
                  : rating === 3
                  ? '3.0 - Average'
                  : rating === 2
                  ? '2.0 - Poor'
                  : '1.0 - Terribly Disappointing'}
              </span>
            </div>
          </div>

          {/* Name & Origin City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g., Ananya Sharma"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Location
              </label>
              <input
                type="text"
                value={authorLocation}
                onChange={e => setAuthorLocation(e.target.value)}
                placeholder="e.g., Mumbai, India"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Trip Type Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Trip Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Solo', 'Couples', 'Family', 'Friends'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer text-center ${
                    tripType === type
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Review Headline */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Review Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Unforgettable morning hike and sacred temple vibes"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Your Review & Helpful Advice <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell fellow travelers about the scenic highlights, best photography angles, queue timings, or recommended local food..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
