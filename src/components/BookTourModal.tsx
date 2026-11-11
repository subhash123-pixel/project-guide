import React, { useState } from 'react';
import { Destination, TourBooking } from '../types/travel';
import { X, Calendar, User, Mail, Phone, Users, CheckCircle, ShieldCheck } from 'lucide-react';

interface BookTourModalProps {
  destination: Destination;
  onClose: () => void;
  onBookingSuccess: (booking: TourBooking) => void;
}

export const BookTourModal: React.FC<BookTourModalProps> = ({
  destination,
  onClose,
  onBookingSuccess
}) => {
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [travelStyle, setTravelStyle] = useState<'Standard' | 'Private Luxury' | 'Adventure Trek' | 'Cultural Deep-Dive'>('Cultural Deep-Dive');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TourBooking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Cost Calculation
  const styleMultiplier = travelStyle === 'Private Luxury' ? 1.8 : travelStyle === 'Adventure Trek' ? 1.3 : 1.0;
  const estimatedCost = Math.round(destination.approxDailyBudget * groupSize * styleMultiplier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName.trim() || !travelerEmail.trim() || !tourDate) {
      setErrorMsg('Please provide your name, valid email address, and desired tour date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: destination.id,
          travelerName,
          travelerEmail,
          travelerPhone,
          tourDate,
          groupSize,
          preferredLanguage,
          travelStyle,
          specialRequests
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete booking');
      }

      setConfirmedBooking(data.data);
      onBookingSuccess(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {confirmedBooking ? 'Reservation Confirmed' : 'Book a Certified Tour Guide'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Destination: <strong className="text-neutral-800">{destination.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="space-y-5 animate-fade-in text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-neutral-900">Your Tour Is Confirmed!</h4>
              <p className="text-xs text-neutral-600 mt-1">
                A confirmation voucher and guide meeting point have been sent to{' '}
                <strong className="text-neutral-900">{confirmedBooking.travelerEmail}</strong>.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-medium">Booking Reference</span>
                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {confirmedBooking.bookingRef}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Destination</span>
                <span className="font-semibold text-neutral-900">{confirmedBooking.destinationName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Tour Date</span>
                <span className="font-semibold text-neutral-900">{confirmedBooking.tourDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Party Size</span>
                <span className="font-semibold text-neutral-900">{confirmedBooking.groupSize} Travelers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Tour Experience</span>
                <span className="font-semibold text-neutral-900">{confirmedBooking.travelStyle}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-sm">
                <span className="font-bold text-neutral-900">Total Price</span>
                <span className="font-extrabold text-neutral-900 tabular-nums">${confirmedBooking.totalCost}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close & Return to Guide
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Guide Info Banner */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Licensed English / Multilingual Guides ({destination.guidesCount} active)</span>
              </div>
              <span className="text-xs font-bold text-neutral-900 tabular-nums">
                ~${destination.approxDailyBudget}/day base
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Traveler Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={e => setTravelerName(e.target.value)}
                  placeholder="e.g. Subhash V."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={travelerEmail}
                  onChange={e => setTravelerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tour Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={tourDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setTourDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Party Size (Travelers)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={groupSize}
                  onChange={e => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preferred Tour Style
                </label>
                <select
                  value={travelStyle}
                  onChange={e => setTravelStyle(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Cultural Deep-Dive">Cultural Deep-Dive</option>
                  <option value="Standard">Standard City Walking</option>
                  <option value="Private Luxury">Private VIP Luxury</option>
                  <option value="Adventure Trek">Adventure Trek & Scenic Hike</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Guide Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Special Inquiries or Dietary Preferences
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian lunch, wheelchair access, photography focus..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>

            {/* Total Price Bar */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500">Estimated Total Quote</span>
                <div className="text-base font-extrabold text-neutral-900 tabular-nums">
                  ${estimatedCost}{' '}
                  <span className="text-xs font-normal text-neutral-500">
                    ({groupSize} {groupSize === 1 ? 'person' : 'people'})
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">Free 24hr cancellation</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
