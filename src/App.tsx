import React, { useEffect, useState } from 'react';
import { Destination, Review, TourBooking } from './types/travel';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { BookTourModal } from './components/BookTourModal';
import { ItineraryPlannerModal } from './components/ItineraryPlannerModal';
import { FsdExamDocsModal } from './components/FsdExamDocsModal';
import { ReviewsFeed } from './components/ReviewsFeed';
import { Footer } from './components/Footer';
import {
  MapPin,
  Sparkles,
  SlidersHorizontal,
  Compass,
  ArrowUpDown,
  CheckCircle,
  Server,
  Layers
} from 'lucide-react';

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(250);
  const [sortBy, setSortBy] = useState<'rating' | 'budget-low' | 'budget-high' | 'reviews'>('rating');

  // Interactive Map Focus
  const [selectedMapDest, setSelectedMapDest] = useState<Destination | null>(null);

  // Modals
  const [modalDest, setModalDest] = useState<Destination | null>(null);
  const [reviewModalDest, setReviewModalDest] = useState<Destination | null>(null);
  const [bookTourDest, setBookTourDest] = useState<Destination | null>(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [itineraryInitialDest, setItineraryInitialDest] = useState<Destination | undefined>(undefined);
  const [showExamDocs, setShowExamDocs] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial data from Express backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, revRes] = await Promise.all([
        fetch('/api/destinations'),
        fetch('/api/reviews/recent')
      ]);

      const destData = await destRes.json();
      const revData = await revRes.json();

      if (destData.success && destData.data) {
        setDestinations(destData.data);
        if (destData.data.length > 0) {
          setSelectedMapDest(destData.data[0]);
        }
      }

      if (revData.success && revData.data) {
        setReviews(revData.data);
      }
    } catch (err) {
      console.error('Failed to load full stack data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered & Sorted Destinations
  const filteredDestinations = destinations
    .filter(dest => {
      // Category Filter
      if (selectedCategory !== 'All' && dest.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Budget Filter
      if (dest.approxDailyBudget > maxBudget) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesCountry = dest.country.toLowerCase().includes(q);
        const matchesRegion = dest.region.toLowerCase().includes(q);
        const matchesSummary = dest.summary.toLowerCase().includes(q);
        const matchesHighlight = dest.highlights.some(h => h.toLowerCase().includes(q));
        if (!matchesName && !matchesCountry && !matchesRegion && !matchesSummary && !matchesHighlight) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'budget-low') return a.approxDailyBudget - b.approxDailyBudget;
      if (sortBy === 'budget-high') return b.approxDailyBudget - a.approxDailyBudget;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });

  // Handle Review Submitted
  const handleReviewSubmitted = (
    newReview: Review,
    updatedRating: number,
    totalReviews: number
  ) => {
    // Prepend to reviews state
    setReviews(prev => [newReview, ...prev]);

    // Update destination rating in state
    setDestinations(prev =>
      prev.map(d =>
        d.id === newReview.destinationId
          ? { ...d, rating: updatedRating, reviewCount: totalReviews }
          : d
      )
    );

    // If modal is open for this destination, update it
    if (modalDest?.id === newReview.destinationId) {
      setModalDest(prev =>
        prev ? { ...prev, rating: updatedRating, reviewCount: totalReviews } : null
      );
    }

    showToast(`Your review for "${newReview.destinationName}" has been successfully posted!`);
  };

  // Handle Helpful Upvote
  const handleHelpfulReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReviews(prev =>
          prev.map(r => (r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r))
        );
      }
    } catch (err) {
      console.error('Failed to upvote review:', err);
    }
  };

  // Handle Booking Success
  const handleBookingSuccess = (booking: TourBooking) => {
    showToast(`Reservation confirmed! Booking Reference: ${booking.bookingRef}`);
  };

  const handleOpenItinerary = (dest?: Destination) => {
    setItineraryInitialDest(dest);
    setShowItineraryModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-80 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        onOpenExamDocs={() => setShowExamDocs(true)}
        onOpenItineraryPlanner={() => handleOpenItinerary()}
      />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        maxBudget={maxBudget}
        onBudgetChange={setMaxBudget}
        onOpenItineraryPlanner={() => handleOpenItinerary()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full space-y-16">
        {/* Interactive Map Section */}
        <section id="interactive-map" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                <span>Geospatial Exploration</span>
                <span aria-hidden="true">·</span>
                <span>OpenStreetMap & Leaflet Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Interactive World Tourist Map
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-md">
              Click pins to inspect destination summaries, switch between Satellite/Topo layers, or enable route connection path.
            </p>
          </div>

          <InteractiveMap
            destinations={destinations}
            selectedDestination={selectedMapDest}
            onSelectDestination={dest => setSelectedMapDest(dest)}
            onOpenDetails={dest => setModalDest(dest)}
          />
        </section>

        {/* Curated Destinations Section */}
        <section id="destinations" className="space-y-6">
          {/* Section Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Curated Travel Guides
              </h2>
              <div className="text-xs text-neutral-500 mt-1">
                Showing <strong className="text-neutral-900">{filteredDestinations.length}</strong> of{' '}
                {destinations.length} destinations
                {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-600">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="budget-low">Daily Budget: Low to High</option>
                <option value="budget-high">Daily Budget: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="py-20 text-center text-sm text-neutral-500">
              Loading destinations from Express REST backend...
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-3xl p-8 space-y-3">
              <Compass className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">No destinations match your criteria</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try widening your search terms or increasing the maximum daily budget slider.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setMaxBudget(300);
                }}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map(dest => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  isSelected={selectedMapDest?.id === dest.id}
                  onSelect={d => setModalDest(d)}
                  onShowOnMap={d => {
                    setSelectedMapDest(d);
                    const mapEl = document.getElementById('interactive-map');
                    if (mapEl) {
                      mapEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Community Reviews Feed */}
        <ReviewsFeed
          reviews={reviews}
          onHelpfulReview={handleHelpfulReview}
          onSelectDestinationById={id => {
            const dest = destinations.find(d => d.id === id);
            if (dest) setModalDest(dest);
          }}
        />

        {/* FSD Examination Inspection Banner */}
        <section className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
              <Server className="w-4 h-4" />
              <span>Full Stack Development (FSD) University Project</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready for External Examiner Evaluation & Viva-Voce
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Explore the complete client-server architectural specification, database models, live REST API tester console, and oral exam answer guide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowExamDocs(true)}
              className="px-5 py-3 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Server className="w-4 h-4 text-amber-600" />
              <span>Open Examination Deck</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenExamDocs={() => setShowExamDocs(true)} />

      {/* Modals */}
      {modalDest && (
        <DestinationDetailModal
          destination={modalDest}
          reviews={reviews}
          onClose={() => setModalDest(null)}
          onOpenReviewModal={dest => {
            setModalDest(null);
            setReviewModalDest(dest);
          }}
          onBookGuide={dest => {
            setModalDest(null);
            setBookTourDest(dest);
          }}
          onPlanCustomItinerary={dest => {
            setModalDest(null);
            handleOpenItinerary(dest);
          }}
          onHelpfulReview={handleHelpfulReview}
        />
      )}

      {reviewModalDest && (
        <ReviewModal
          destination={reviewModalDest}
          onClose={() => setReviewModalDest(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {bookTourDest && (
        <BookTourModal
          destination={bookTourDest}
          onClose={() => setBookTourDest(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {showItineraryModal && (
        <ItineraryPlannerModal
          destinations={destinations}
          initialDestination={itineraryInitialDest}
          onClose={() => setShowItineraryModal(false)}
        />
      )}

      {showExamDocs && (
        <FsdExamDocsModal onClose={() => setShowExamDocs(false)} />
      )}
    </div>
  );
}
