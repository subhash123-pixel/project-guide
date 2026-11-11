export type DestinationCategory = 'Heritage' | 'Nature' | 'Coastal' | 'Mountain' | 'Urban' | 'Culinary';

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  category: DestinationCategory;
  summary: string;
  fullDescription: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  entryFee: string;
  approxDailyBudget: number; // in USD
  currency: string;
  bestSeason: string;
  idealDays: number;
  highlights: string[];
  localCuisine: {
    name: string;
    description: string;
  }[];
  travelTips: string[];
  itinerary: {
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    estimatedCost: string;
  }[];
  weather: {
    tempC: number;
    condition: string;
    humidity: number;
    forecast: string;
  };
  guideAvailable: boolean;
  guidesCount: number;
  popularFor: string[];
}

export interface Review {
  id: string;
  destinationId: string;
  destinationName: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  rating: number; // 1 - 5
  date: string;
  tripType: 'Solo' | 'Couples' | 'Family' | 'Friends' | 'Business';
  title: string;
  comment: string;
  helpfulCount: number;
  verifiedVisit: boolean;
  travelMonth?: string;
}

export interface TourBooking {
  id: string;
  destinationId: string;
  destinationName: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  tourDate: string;
  groupSize: number;
  preferredLanguage: string;
  travelStyle: 'Standard' | 'Private Luxury' | 'Adventure Trek' | 'Cultural Deep-Dive';
  specialRequests?: string;
  totalCost: number;
  status: 'Confirmed' | 'Pending';
  bookingRef: string;
  createdAt: string;
}

export interface CustomItineraryRequest {
  destinationId: string;
  days: number;
  travelStyle: 'Budget' | 'Balanced' | 'Luxury';
  interests: string[];
  pace: 'Relaxed' | 'Moderate' | 'Fast-Paced';
}

export interface CustomItineraryPlan {
  id: string;
  destination: Destination;
  title: string;
  overview: string;
  estimatedTotalBudgetUSD: number;
  days: {
    dayNumber: number;
    theme: string;
    activities: {
      time: 'Morning' | 'Afternoon' | 'Evening';
      title: string;
      description: string;
      cost: string;
      duration: string;
      tips: string;
    }[];
  }[];
}
