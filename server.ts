import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Destination, Review, TourBooking, CustomItineraryPlan } from './src/types/travel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database for FSD Examination Demo (Stateful CRUD operations)
let destinations: Destination[] = [
  {
    id: 'dest-1',
    name: 'Kyoto Cultural Heritage District',
    country: 'Japan',
    region: 'Kansai, East Asia',
    category: 'Heritage',
    summary: 'Ancient imperial capital home to over 2,000 preserved Buddhist temples, tranquil Zen rock gardens, and bamboo forests.',
    fullDescription: 'Kyoto was the imperial capital of Japan for over a millennium. Today it remains the cultural heartbeat of the nation, seamlessly balancing centuries-old tea traditions, meditative Zen gardens like Ryoan-ji, the thousand vermilion torii gates of Fushimi Inari, and traditional geisha districts in Gion.',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    image: '/src/assets/images/dest_kyoto_temple_1794369861699.jpg',
    gallery: [
      '/src/assets/images/dest_kyoto_temple_1794369861699.jpg',
      '/src/assets/images/hero_travel_guide_1794369861264.jpg'
    ],
    rating: 4.9,
    reviewCount: 38,
    entryFee: '$10 - $25 (Temple passes)',
    approxDailyBudget: 110,
    currency: 'JPY / USD',
    bestSeason: 'Spring (Cherry Blossoms) & Autumn (Foliage)',
    idealDays: 4,
    highlights: [
      'Fushimi Inari Taisha vermilion torii trail',
      'Arashiyama Bamboo Grove at sunrise',
      'Kinkaku-ji (The Golden Pavilion)',
      'Traditional Kaiseki & Matcha Tea Ceremony in Gion'
    ],
    localCuisine: [
      { name: 'Kyoto Kaiseki Ryori', description: 'Multi-course seasonal artistic dining reflecting Japanese culinary philosophy.' },
      { name: 'Matcha Parfait & Uji Green Tea', description: 'Stone-ground ceremonial green tea desserts made with heirloom Uji leaves.' },
      { name: 'Yudofu (Boiled Tofu)', description: 'Delicate silken tofu simmered in kombu broth served in Buddhist temple gardens.' }
    ],
    travelTips: [
      'Purchase an ICOCA transit IC card for seamless bus and subway hopping.',
      'Visit Arashiyama bamboo grove before 7:30 AM to experience the sacred whisper of the wind without crowds.',
      'Remove shoes respectfully at temple entrances and wear comfortable slip-on footwear.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Eastern Kyoto & Imperial Legacy',
        morning: 'Explore Kiyomizu-dera wooden temple veranda and Higashiyama historic stone alleys.',
        afternoon: 'Wander along the Philosophers Path and meditate at Ginkaku-ji Silver Pavilion.',
        evening: 'Twilight stroll through Gion preservation district, spotting geiko and maiko.',
        estimatedCost: '$65'
      },
      {
        day: 2,
        title: 'Sacred Nature & Shrines',
        morning: 'Early morning climb through the 10,000 torii gates of sacred Mount Inari.',
        afternoon: 'Train to Uji for traditional tea tasting and Byodoin Phoenix Hall.',
        evening: 'Dinner along the Kamogawa River with seasonal wooden dining platforms (Kawadoko).',
        estimatedCost: '$80'
      },
      {
        day: 3,
        title: 'Bamboo Groves & Zen Retreats',
        morning: 'Arashiyama Bamboo Grove and Tenryu-ji UNESCO landscape garden.',
        afternoon: 'Okochi Sanso villa panoramic view and Sagano romantic scenic train.',
        evening: 'Pontocho alley izakaya crawl sampling local craft sake and yakitori.',
        estimatedCost: '$75'
      }
    ],
    weather: {
      tempC: 19,
      condition: 'Pleasant & Crisp',
      humidity: 58,
      forecast: 'Clear skies, perfect for walking tours'
    },
    guideAvailable: true,
    guidesCount: 14,
    popularFor: ['Temples', 'Photography', 'Matcha Tea', 'Zen Gardens', 'History']
  },
  {
    id: 'dest-2',
    name: 'Amalfi Coast & Positano Cliffs',
    country: 'Italy',
    region: 'Campania, Southern Europe',
    category: 'Coastal',
    summary: 'UNESCO World Heritage coastline marked by pastel villages clinging to vertical limestone cliffs above turquoise Mediterranean waters.',
    fullDescription: 'The Costiera Amalfitana stretches along the southern edge of the Sorrentine Peninsula. Featuring sheer sea cliffs, lemon groves terraced into vertical rock faces, and iconic towns like Positano, Amalfi, and Ravello, this region is a legendary European travel masterpiece.',
    coordinates: { lat: 40.6340, lng: 14.6027 },
    image: '/src/assets/images/dest_amalfi_coast_1794369862828.jpg',
    gallery: [
      '/src/assets/images/dest_amalfi_coast_1794369862828.jpg',
      '/src/assets/images/hero_travel_guide_1794369861264.jpg'
    ],
    rating: 4.8,
    reviewCount: 42,
    entryFee: 'Free (Ferries $12 - $20)',
    approxDailyBudget: 190,
    currency: 'EUR / USD',
    bestSeason: 'May to October',
    idealDays: 3,
    highlights: [
      'Path of the Gods (Sentiero degli Dei) cliffside hike',
      'Private Gozzo boat cruise to emerald marine grottos',
      'Villa Cimbrone gardens & Terrace of Infinity in Ravello',
      'Sunset Aperitivo overlooking Positano beach pyramid'
    ],
    localCuisine: [
      { name: 'Scialatielli ai Frutti di Mare', description: 'Handmade thick ribbon pasta tossed with fresh clams, mussels, and calamari.' },
      { name: 'Limoncello di Sorrento', description: 'Sweet, fragrant liqueur crafted from IGP Amalfi Coast sfusato lemons.' },
      { name: 'Delizia al Limone', description: 'Dome-shaped sponge cake filled with delicate lemon cream.' }
    ],
    travelTips: [
      'Use high-speed ferries between Salerno, Amalfi, and Positano to bypass winding cliff roads.',
      'Pack sturdy footwear with grip for the hundreds of stone staircases throughout Positano.',
      'Book seaside dinner reservations at least 3 weeks ahead in peak summer months.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Positano Pastel Vistas',
        morning: 'Arrive via scenic coastal ferry; descend to Spiaggia Grande beach.',
        afternoon: 'Boutique shopping along Via dei Mulini for bespoke linen and handmade sandals.',
        evening: 'Sunset drinks at Franco’s Bar with panoramic views of the illuminated cliffs.',
        estimatedCost: '$130'
      },
      {
        day: 2,
        title: 'Path of the Gods & Historic Amalfi',
        morning: 'Hike Sentiero degli Dei from Bomerano down to Nocelle with 360-degree sea panoramas.',
        afternoon: 'Visit Amalfi Cathedral of St. Andrew and historical maritime paper mills.',
        evening: 'Seafood dinner on the dock in Atrani, Amalfi’s quiet neighboring village.',
        estimatedCost: '$95'
      },
      {
        day: 3,
        title: 'Ravello Heights & Romantic Gardens',
        morning: 'Ascend to hilltown Ravello and tour the cliffside gardens of Villa Rufolo.',
        afternoon: 'Classical music recital at the Oscar Niemeyer auditorium or infinity terrace.',
        evening: 'Wine tasting featuring local DOC Costa d’Amalfi wines at a cliff vineyard.',
        estimatedCost: '$110'
      }
    ],
    weather: {
      tempC: 24,
      condition: 'Sunny & Coastal Breeze',
      humidity: 50,
      forecast: 'Clear skies with calm seas'
    },
    guideAvailable: true,
    guidesCount: 9,
    popularFor: ['Coastal Views', 'Boat Tours', 'Hiking', 'Italian Cuisine', 'Luxury']
  },
  {
    id: 'dest-3',
    name: 'Lauterbrunnen & Jungfrau Alps',
    country: 'Switzerland',
    region: 'Bernese Oberland, Central Europe',
    category: 'Mountain',
    summary: 'The dramatic valley of 72 cascading waterfalls crowned by the Eiger, Mönch, and Jungfrau peaks in the Swiss Alps.',
    fullDescription: 'Nestled between colossal rock walls and mountain peaks, Lauterbrunnen is the legendary valley that inspired Tolkien’s Rivendell. From the roaring subterranean glacial waters of Trümmelbach Falls to the car-free mountain hamlets of Wengen and Mürren, this destination offers alpine adventure at its pinnacle.',
    coordinates: { lat: 46.5935, lng: 7.9090 },
    image: '/src/assets/images/dest_swiss_alps_1794369861933.jpg',
    gallery: [
      '/src/assets/images/dest_swiss_alps_1794369861933.jpg',
      '/src/assets/images/hero_travel_guide_1794369861264.jpg'
    ],
    rating: 4.95,
    reviewCount: 51,
    entryFee: '$14 (Trümmelbach Falls)',
    approxDailyBudget: 175,
    currency: 'CHF / USD',
    bestSeason: 'June to September (Hiking) or Dec to April (Skiing)',
    idealDays: 4,
    highlights: [
      'Staubbach Waterfall plunging 300 meters into the valley',
      'Jungfraujoch - Top of Europe railway at 3,454m altitude',
      'Cliff Walk bridge at Grindelwald First',
      'Panoramic cogwheel train to car-free Mürren and Schilthorn'
    ],
    localCuisine: [
      { name: 'Traditional Swiss Cheese Fondue', description: 'Melted Gruyère and Emmental with white wine and kirsch, served with crusty bread.' },
      { name: 'Rösti with Alpine Bratwurst', description: 'Crispy pan-fried shredded potato pancake topped with rich onion sauce.' },
      { name: 'Fresh Berner Alpkäse', description: 'Artisanal high-altitude summer cow cheese aged in mountain stone cellars.' }
    ],
    travelTips: [
      'Invest in the Swiss Travel Pass or Bernese Oberland Regional Pass to save up to 50% on mountain railways.',
      'Check live webcams at Jungfraujoch and Schilthorn before buying high-altitude train tickets.',
      'Layer clothing: valley temperatures may be 22°C while mountain summits remain near freezing.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Valley of the 72 Waterfalls',
        morning: 'Walk the flat valley floor to Staubbach Falls and Trümmelbach glacial cave falls.',
        afternoon: 'Cable car up to the cliffside village of Gimmelwald for panoramic valley photography.',
        evening: 'Cozy fireside dinner in Lauterbrunnen village tasting artisanal fondue.',
        estimatedCost: '$85'
      },
      {
        day: 2,
        title: 'Top of Europe Expedition',
        morning: 'Board the historic Jungfrau cogwheel train ascending through the Eiger north face.',
        afternoon: 'Walk inside the Aletsch Glacier Ice Palace and marvel at Europe’s largest glacier.',
        evening: 'Alpine sunset over Interlaken twin lakes Brienz and Thun.',
        estimatedCost: '$160'
      },
      {
        day: 3,
        title: 'Adventure in Grindelwald First',
        morning: 'Gondola to First; brave the First Cliff Walk metal walkway jutting over the abyss.',
        afternoon: 'Hike to the mirror-like waters of Lake Bachalpsee reflecting the Schreckhorn peak.',
        evening: 'Return to valley for Swiss chocolate tasting and local alpine beer.',
        estimatedCost: '$90'
      }
    ],
    weather: {
      tempC: 16,
      condition: 'Crisp Alpine Breeze',
      humidity: 45,
      forecast: 'Clear mountain visibility, ideal for cable cars'
    },
    guideAvailable: true,
    guidesCount: 11,
    popularFor: ['Waterfalls', 'Alpine Hiking', 'Scenic Trains', 'Photography', 'Adventure']
  },
  {
    id: 'dest-4',
    name: 'Banff National Park & Lake Louise',
    country: 'Canada',
    region: 'Alberta, Canadian Rockies',
    category: 'Nature',
    summary: 'Glacial wilderness featuring iridescent turquoise lakes, jagged Rocky Mountain peaks, and abundant wildlife.',
    fullDescription: 'Established in 1885 as Canada’s first national park, Banff encompasses 6,641 square kilometers of untamed Rocky Mountain beauty. Highlights include the vibrant turquoise waters of Lake Louise and Moraine Lake, the dramatic Icefields Parkway drive, and wild grizzly and elk habitats.',
    coordinates: { lat: 51.1784, lng: -115.5708 },
    image: '/src/assets/images/hero_travel_guide_1794369861264.jpg',
    gallery: [
      '/src/assets/images/hero_travel_guide_1794369861264.jpg',
      '/src/assets/images/dest_swiss_alps_1794369861933.jpg'
    ],
    rating: 4.92,
    reviewCount: 34,
    entryFee: '$10.50 CAD / day (Parks Canada)',
    approxDailyBudget: 140,
    currency: 'CAD / USD',
    bestSeason: 'June to September (Lakes) & Dec to March (Skiing)',
    idealDays: 3,
    highlights: [
      'Canoeing on the radiant waters of Moraine Lake and Lake Louise',
      'Hiking the Plain of Six Glaciers and visiting the historic Swiss Tea House',
      'Scenic wildlife spotting along the Bow Valley Parkway',
      'Soaking in the natural mineral waters of Banff Upper Hot Springs'
    ],
    localCuisine: [
      { name: 'Alberta Bison & Elk Steak', description: 'Locally raised, lean and tender game grilled with mountain juniper glaze.' },
      { name: 'Classic Canadian Poutine', description: 'Crisp hand-cut fries smothered in piping hot beef gravy and squeaky cheese curds.' },
      { name: 'Warm Maple Pecan Tart', description: 'Rich dark amber Canadian maple syrup baked in golden pastry with vanilla ice cream.' }
    ],
    travelTips: [
      'Parks Canada shuttles are required to reach Moraine Lake—book slots 48 hours in advance online.',
      'Carry bear spray on all backcountry trails and know how to use it safely.',
      'Wake up before 6:30 AM for the famous sunrise alpine glow on the Valley of the Ten Peaks.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Iconic Turquoise Lakes',
        morning: 'Sunrise shuttle to Moraine Lake; climb the Rockpile for the world-famous vista.',
        afternoon: 'Head to Lake Louise and hike up to the Lake Agnes Tea House for fresh scones.',
        evening: 'Relax in Banff town with craft beer from Banff Ave Brewing Co.',
        estimatedCost: '$70'
      },
      {
        day: 2,
        title: 'Glacial Vistas & Gondolas',
        morning: 'Banff Gondola ride to the summit of Sulphur Mountain for 360° mountain vistas.',
        afternoon: 'Walk the scenic boardwalk and spot big-horn sheep along the rim.',
        evening: 'Sunset soak at Banff Upper Hot Springs overlooking Mount Rundle.',
        estimatedCost: '$85'
      }
    ],
    weather: {
      tempC: 14,
      condition: 'Sunny with Mountain Clouds',
      humidity: 48,
      forecast: 'Cool mountain mornings warming by noon'
    },
    guideAvailable: true,
    guidesCount: 8,
    popularFor: ['Glacier Lakes', 'Wildlife', 'Canoeing', 'Hiking', 'National Parks']
  },
  {
    id: 'dest-5',
    name: 'Jaipur The Pink City',
    country: 'India',
    region: 'Rajasthan, South Asia',
    category: 'Heritage',
    summary: 'The regal capital of Rajasthan renowned for grand hilltop forts, terracotta-pink palace facades, and royal Mughal architecture.',
    fullDescription: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is a UNESCO World Heritage royal city. With its distinctive terracotta-pink stone buildings, honeycomb-screened Hawa Mahal, massive hilltop Amer Fort with elephant ramparts, and the royal observatories of Jantar Mantar, it is India’s cultural treasure.',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      '/src/assets/images/hero_travel_guide_1794369861264.jpg'
    ],
    rating: 4.88,
    reviewCount: 63,
    entryFee: '$7 - $15 (Composite monument pass)',
    approxDailyBudget: 55,
    currency: 'INR / USD',
    bestSeason: 'October to March (Pleasant winter months)',
    idealDays: 3,
    highlights: [
      'Amer Fort mirror palace (Sheesh Mahal) and Maota Lake reflection',
      'Hawa Mahal (Palace of Winds) 953 lattice windows',
      'Jantar Mantar UNESCO astronomical observatory',
      'Bazaar shopping for blue pottery, hand-block prints, and precious gems'
    ],
    localCuisine: [
      { name: 'Dal Baati Churma', description: 'Hard wheat rolls baked over charcoal, dipped in pure ghee, served with spicy lentil curry and sweet crushed wheat.' },
      { name: 'Laal Maas', description: 'Fiery royal mutton curry cooked with fiery Mathania red chilies and yogurt.' },
      { name: 'Ghevar', description: 'Disc-shaped honeycomb sweet soaked in saffron sugar syrup and topped with rabri and pistachios.' }
    ],
    travelTips: [
      'Hire a licensed government tour guide at Amer Fort to appreciate the intricate royal architectural acoustics.',
      'Visit Hawa Mahal early in the morning when the sun lights up the pink sandstone facade.',
      'Always negotiate politely at Johari and Bapu Bazaars for handicrafts and textiles.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Amer Royalty & Mirror Palaces',
        morning: 'Explore Amer Fort, the Jaigarh Fort cannon foundry, and Jal Mahal water palace.',
        afternoon: 'Stepwell photography at Panna Meena Ka Kund with geometric stair patterns.',
        evening: 'Traditional Rajasthani folk dance and dinner at Chokhi Dhani cultural village.',
        estimatedCost: '$35'
      },
      {
        day: 2,
        title: 'Heart of the Old Pink City',
        morning: 'Photograph Hawa Mahal and tour the City Palace royal residence & private museum.',
        afternoon: 'Marvel at the giant sundials at Jantar Mantar observatory.',
        evening: 'Sunset chai at Nahargarh Fort overlooking the entire illuminated pink city.',
        estimatedCost: '$30'
      }
    ],
    weather: {
      tempC: 28,
      condition: 'Warm & Sunny',
      humidity: 35,
      forecast: 'Dry and bright desert climate'
    },
    guideAvailable: true,
    guidesCount: 16,
    popularFor: ['Forts & Palaces', 'Culture', 'Handicrafts', 'Photography', 'Royal History']
  },
  {
    id: 'dest-6',
    name: 'Santorini Caldera & Oia',
    country: 'Greece',
    region: 'Cyclades, Aegean Sea',
    category: 'Coastal',
    summary: 'Iconic volcanic island known for whitewashed cave houses, blue-domed chapels, and world-famous Aegean sunsets.',
    fullDescription: 'Shaped by one of the largest volcanic eruptions in recorded history, Santorini rises abruptly from the deep blue Aegean Sea. The villages of Oia, Fira, and Imerovigli sit perched high upon the caldera rim, creating one of the most photographed seascapes in the world.',
    coordinates: { lat: 36.3932, lng: 25.4615 },
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      '/src/assets/images/dest_amalfi_coast_1794369862828.jpg'
    ],
    rating: 4.89,
    reviewCount: 47,
    entryFee: 'Free (Cable car $6)',
    approxDailyBudget: 160,
    currency: 'EUR / USD',
    bestSeason: 'Late April to October',
    idealDays: 3,
    highlights: [
      'Sunset watching from Byzantine Castle ruins in Oia',
      'Caldera rim walking trail from Fira to Oia (10km scenic hike)',
      'Sailing catamaran cruise to volcanic hot springs and Red Beach',
      'Tasting Assyrtiko mineral volcanic wine at Santo Wines'
    ],
    localCuisine: [
      { name: 'Santorini Fava Purée', description: 'Velvety yellow split pea purée drizzled with extra virgin Greek olive oil, capers, and red onion.' },
      { name: 'Tomatokeftedes (Tomato Fritters)', description: 'Crisp aromatic fritters made with sweet volcanic cherry tomatoes and fresh mint.' },
      { name: 'Grilled Fresh Octopus', description: 'Sun-dried octopus grilled over charcoal with lemon-oregano vinaigrette.' }
    ],
    travelTips: [
      'Head to Oia castle at least 90 minutes before sunset for prime viewing spots, or book a cliffside dinner table.',
      'Wear sunglasses with polarized lenses—the whitewashed Aegean walls reflect brilliant midday sunlight.',
      'Take the public KTEL bus network: clean, frequent, and much cheaper than island taxis.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Caldera Rim & Oia Marvels',
        morning: 'Arrive at Fira, explore narrow alleys, and view the iconic three blue domes of Firostefani.',
        afternoon: 'Wander through Oia marble pathways, visiting Atlantis Books cave library.',
        evening: 'Iconic sunset celebration followed by fresh grilled fish by Ammoudi Bay.',
        estimatedCost: '$120'
      },
      {
        day: 2,
        title: 'Volcano & Wine Heritage',
        morning: 'Catamaran boat tour to the active volcanic crater of Nea Kameni and sulfur hot springs.',
        afternoon: 'Swim in the volcanic red and black sand beaches at Perissa.',
        evening: 'Assyrtiko white wine flight paired with local Cycladic mezze.',
        estimatedCost: '$110'
      }
    ],
    weather: {
      tempC: 25,
      condition: 'Sunny Aegean Breeze',
      humidity: 52,
      forecast: 'Clear skies with signature Meltemi breeze'
    },
    guideAvailable: true,
    guidesCount: 7,
    popularFor: ['Sunsets', 'Architecture', 'Island Cruises', 'Volcanic Wine', 'Romance']
  }
];

let reviews: Review[] = [
  {
    id: 'rev-1',
    destinationId: 'dest-1',
    destinationName: 'Kyoto Cultural Heritage District',
    authorName: 'Elena Rostova',
    authorLocation: 'Zurich, Switzerland',
    rating: 5,
    date: '2026-10-14',
    tripType: 'Solo',
    title: 'Transformative cultural journey at dawn',
    comment: 'Getting to Fushimi Inari at 6:00 AM before the tour buses arrived was the single best decision of my travel life. The morning mist through the vermilion torii gates combined with the scent of cypress trees is unforgettable. Make sure to try the matcha soft serve near Gion!',
    helpfulCount: 29,
    verifiedVisit: true,
    travelMonth: 'October 2026'
  },
  {
    id: 'rev-2',
    destinationId: 'dest-1',
    destinationName: 'Kyoto Cultural Heritage District',
    authorName: 'Marcus Chen',
    authorLocation: 'Vancouver, Canada',
    rating: 5,
    date: '2026-09-28',
    tripType: 'Couples',
    title: 'The Zen gardens exceeded all expectations',
    comment: 'Ryoan-ji rock garden gave us a profound sense of calm. Our local guide Kenji booked us into an authentic tea house where we learned the philosophy behind every hand movement. Highly recommend spending at least 4 full days.',
    helpfulCount: 18,
    verifiedVisit: true,
    travelMonth: 'September 2026'
  },
  {
    id: 'rev-3',
    destinationId: 'dest-2',
    destinationName: 'Amalfi Coast & Positano Cliffs',
    authorName: 'Sophia Miller',
    authorLocation: 'London, UK',
    rating: 5,
    date: '2026-08-19',
    tripType: 'Friends',
    title: 'Breathtaking Path of the Gods hike!',
    comment: 'We did the Sentiero degli Dei hike early morning starting from Bomerano. The sheer vertical drop to the blue sea with wildflowers blooming along the path made our jaws drop. Finish with fresh handmade lemon granita in Positano.',
    helpfulCount: 34,
    verifiedVisit: true,
    travelMonth: 'August 2026'
  },
  {
    id: 'rev-4',
    destinationId: 'dest-3',
    destinationName: 'Lauterbrunnen & Jungfrau Alps',
    authorName: 'David K.',
    authorLocation: 'Melbourne, Australia',
    rating: 5,
    date: '2026-07-22',
    tripType: 'Family',
    title: 'Pure fairytale landscape',
    comment: 'Our kids were mesmerized by Staubbach Falls roaring right behind the wooden chalets. The Swiss train system is like clockwork. Riding the cogwheel railway inside the mountain up to Jungfraujoch is a once-in-a-lifetime engineering marvel.',
    helpfulCount: 41,
    verifiedVisit: true,
    travelMonth: 'July 2026'
  },
  {
    id: 'rev-5',
    destinationId: 'dest-4',
    destinationName: 'Banff National Park & Lake Louise',
    authorName: 'Aria Patel',
    authorLocation: 'San Francisco, USA',
    rating: 5,
    date: '2026-06-30',
    tripType: 'Friends',
    title: 'The water color looks painted!',
    comment: 'Moraine Lake at sunrise took our breath away. Glacial rock flour really gives it an electric turquoise glow that photos cannot fully capture. Rent a canoe on the lake—it is worth every penny.',
    helpfulCount: 22,
    verifiedVisit: true,
    travelMonth: 'June 2026'
  },
  {
    id: 'rev-6',
    destinationId: 'dest-5',
    destinationName: 'Jaipur The Pink City',
    authorName: 'Arjun Mehta',
    authorLocation: 'New Delhi, India',
    rating: 5,
    date: '2026-10-02',
    tripType: 'Family',
    title: 'Grand heritage and rich Rajasthani hospitality',
    comment: 'Amer Fort is majestic. The Sheesh Mahal (Mirror Palace) where a single candle illuminates the entire ceiling will leave you spellbound. The Dal Baati Churma at LMB was authentic and delicious.',
    helpfulCount: 19,
    verifiedVisit: true,
    travelMonth: 'October 2026'
  }
];

let bookings: TourBooking[] = [
  {
    id: 'book-101',
    destinationId: 'dest-1',
    destinationName: 'Kyoto Cultural Heritage District',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@example.com',
    travelerPhone: '+1-555-019-2834',
    tourDate: '2026-12-05',
    groupSize: 2,
    preferredLanguage: 'English',
    travelStyle: 'Cultural Deep-Dive',
    specialRequests: 'Interested in vegetarian Zen temple lunch and private tea master introduction.',
    totalCost: 220,
    status: 'Confirmed',
    bookingRef: 'WG-KYO-8821',
    createdAt: '2026-11-01T08:30:00Z'
  }
];

// --- REST API ENDPOINTS ---

// 1. Get all destinations with query filters
app.get('/api/destinations', (req: Request, res: Response) => {
  const { category, search, maxBudget, sort } = req.query;
  let results = [...destinations];

  if (category && category !== 'All') {
    results = results.filter(d => d.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.highlights.some(h => h.toLowerCase().includes(q))
    );
  }

  if (maxBudget) {
    const max = Number(maxBudget);
    if (!isNaN(max) && max > 0) {
      results = results.filter(d => d.approxDailyBudget <= max);
    }
  }

  if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'budget-low') {
    results.sort((a, b) => a.approxDailyBudget - b.approxDailyBudget);
  } else if (sort === 'budget-high') {
    results.sort((a, b) => b.approxDailyBudget - a.approxDailyBudget);
  } else if (sort === 'reviews') {
    results.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 2. Get single destination by ID
app.get('/api/destinations/:id', (req: Request, res: Response) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }

  // Calculate live average rating from reviews
  const destReviews = reviews.filter(r => r.destinationId === dest.id);
  let liveRating = dest.rating;
  if (destReviews.length > 0) {
    const sum = destReviews.reduce((acc, curr) => acc + curr.rating, 0);
    liveRating = Number((sum / destReviews.length).toFixed(2));
  }

  res.json({
    success: true,
    data: {
      ...dest,
      rating: liveRating,
      reviewCount: destReviews.length
    }
  });
});

// 3. Get reviews for a destination
app.get('/api/destinations/:id/reviews', (req: Request, res: Response) => {
  const destReviews = reviews.filter(r => r.destinationId === req.params.id);
  res.json({
    success: true,
    count: destReviews.length,
    data: destReviews
  });
});

// 4. Create a new user review
app.post('/api/destinations/:id/reviews', (req: Request, res: Response) => {
  const { authorName, authorLocation, rating, tripType, title, comment } = req.body;
  const dest = destinations.find(d => d.id === req.params.id);

  if (!dest) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }

  if (!authorName || !rating || !title || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: authorName, rating (1-5), title, and comment are required.'
    });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be a valid number between 1 and 5'
    });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    destinationId: dest.id,
    destinationName: dest.name,
    authorName: String(authorName).trim(),
    authorLocation: authorLocation ? String(authorLocation).trim() : 'Verified Traveler',
    rating: numRating,
    date: new Date().toISOString().split('T')[0],
    tripType: tripType || 'Solo',
    title: String(title).trim(),
    comment: String(comment).trim(),
    helpfulCount: 0,
    verifiedVisit: true,
    travelMonth: 'Recent Visit'
  };

  reviews.unshift(newReview);

  // Recalculate destination overall rating
  const destReviews = reviews.filter(r => r.destinationId === dest.id);
  const avg = destReviews.reduce((sum, r) => sum + r.rating, 0) / destReviews.length;
  dest.rating = Number(avg.toFixed(2));
  dest.reviewCount = destReviews.length;

  res.status(201).json({
    success: true,
    message: 'Review successfully recorded and destination rating updated.',
    data: newReview,
    updatedDestinationRating: dest.rating,
    totalReviews: dest.reviewCount
  });
});

// 5. Upvote a review helpfulness
app.post('/api/reviews/:id/helpful', (req: Request, res: Response) => {
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  review.helpfulCount += 1;
  res.json({ success: true, helpfulCount: review.helpfulCount });
});

// 6. Get all recent reviews across all destinations
app.get('/api/reviews/recent', (_req: Request, res: Response) => {
  const recent = [...reviews].slice(0, 10);
  res.json({ success: true, count: recent.length, data: recent });
});

// 7. Create a tour guide booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    destinationId,
    travelerName,
    travelerEmail,
    travelerPhone,
    tourDate,
    groupSize,
    preferredLanguage,
    travelStyle,
    specialRequests
  } = req.body;

  if (!destinationId || !travelerName || !travelerEmail || !tourDate) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: destinationId, travelerName, travelerEmail, and tourDate are mandatory.'
    });
  }

  const dest = destinations.find(d => d.id === destinationId);
  if (!dest) {
    return res.status(404).json({ success: false, message: 'Invalid destination selected' });
  }

  const travelers = Math.max(1, Number(groupSize) || 1);
  const baseRatePerDay = dest.approxDailyBudget;
  const styleMultiplier = travelStyle === 'Private Luxury' ? 1.8 : travelStyle === 'Adventure Trek' ? 1.3 : 1.0;
  const totalCost = Math.round(baseRatePerDay * travelers * styleMultiplier);

  const newBooking: TourBooking = {
    id: `book-${Date.now()}`,
    destinationId: dest.id,
    destinationName: dest.name,
    travelerName: String(travelerName).trim(),
    travelerEmail: String(travelerEmail).trim(),
    travelerPhone: travelerPhone ? String(travelerPhone).trim() : 'Not provided',
    tourDate: String(tourDate),
    groupSize: travelers,
    preferredLanguage: preferredLanguage || 'English',
    travelStyle: travelStyle || 'Standard',
    specialRequests: specialRequests ? String(specialRequests).trim() : undefined,
    totalCost,
    status: 'Confirmed',
    bookingRef: `WG-${dest.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Tour guide reservation confirmed successfully!',
    data: newBooking
  });
});

// 8. Get all bookings
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ success: true, count: bookings.length, data: bookings });
});

// 9. Generate dynamic custom multi-day itinerary
app.post('/api/itinerary/plan', (req: Request, res: Response) => {
  const { destinationId, days, travelStyle, pace } = req.body;
  const dest = destinations.find(d => d.id === destinationId) || destinations[0];
  const totalDays = Math.min(7, Math.max(1, Number(days) || 3));

  const budgetMultiplier = travelStyle === 'Luxury' ? 2.2 : travelStyle === 'Budget' ? 0.6 : 1.0;
  const totalBudget = Math.round(dest.approxDailyBudget * totalDays * budgetMultiplier);

  const daysPlan = [];
  const themes = [
    'Arrival, Landmark Highlights & Old Town Orientation',
    'Cultural Immersion, Sacred Architecture & Local Bazaars',
    'Nature Exploration, Scenic Viewpoints & Coastal/Mountain Vistas',
    'Hidden Gems, Artisanal Workshops & Culinary Discoveries',
    'Off-the-beaten-path Villages & Panoramic Sunset Trail',
    'Adventure Excursion & Outdoor Recreation',
    'Souvenir Hunting, Leisurely Cafes & Farewell Dinner'
  ];

  for (let i = 0; i < totalDays; i++) {
    const existingDay = dest.itinerary[i % dest.itinerary.length];
    daysPlan.push({
      dayNumber: i + 1,
      theme: themes[i] || `Exploration Day ${i + 1}`,
      activities: [
        {
          time: 'Morning' as const,
          title: existingDay ? existingDay.morning : `Morning visit to ${dest.highlights[i % dest.highlights.length]}`,
          description: `Enjoy scenic morning light with fewer crowds. Ideal for photography and walking tours.`,
          cost: `$${Math.round(20 * budgetMultiplier)}`,
          duration: pace === 'Fast-Paced' ? '2.5 hrs' : '3.5 hrs',
          tips: `Carry hydration and check opening hours.`
        },
        {
          time: 'Afternoon' as const,
          title: existingDay ? existingDay.afternoon : `Afternoon tasting of ${dest.localCuisine[0]?.name || 'local specialties'}`,
          description: `Savor authentic regional flavors and browse local craft stalls.`,
          cost: `$${Math.round(35 * budgetMultiplier)}`,
          duration: '3 hrs',
          tips: `Reservations recommended for peak lunch slots.`
        },
        {
          time: 'Evening' as const,
          title: existingDay ? existingDay.evening : `Sunset panoramic walk and twilight dining`,
          description: `Witness spectacular twilight vistas and unwind at an acclaimed local restaurant.`,
          cost: `$${Math.round(45 * budgetMultiplier)}`,
          duration: '3 hrs',
          tips: `Best sunset angles usually face west towards the horizon.`
        }
      ]
    });
  }

  const plan: CustomItineraryPlan = {
    id: `plan-${Date.now()}`,
    destination: dest,
    title: `${totalDays}-Day ${travelStyle || 'Balanced'} Guide to ${dest.name}`,
    overview: `A personalized travel schedule tuned for a ${pace || 'Moderate'} pace across ${dest.country}. Includes optimized routes, authentic cultural hotspots, and budgeted meals.`,
    estimatedTotalBudgetUSD: totalBudget,
    days: daysPlan
  };

  res.json({ success: true, data: plan });
});

// 10. Destination Weather API
app.get('/api/weather/:id', (req: Request, res: Response) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({
    success: true,
    data: {
      destination: dest.name,
      country: dest.country,
      coordinates: dest.coordinates,
      ...dest.weather
    }
  });
});

// 11. Special Examination Endpoint: FSD Architecture & VIVA Documentation
app.get('/api/fsd-architecture', (_req: Request, res: Response) => {
  res.json({
    projectTitle: 'WanderGuide - Full-Stack Tourist Exploration & Travel Platform',
    fsdSubject: 'Full Stack Development (CS / IT External Practical Examination)',
    architecture: 'Client-Server RESTful Architecture with Stateful In-Memory Store & Interactive Leaflet Geospatial UI',
    stack: {
      frontend: 'React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Leaflet / OpenStreetMap Geo Engine, Motion animations',
      backend: 'Node.js, Express.js REST API with modular route handlers and data validation',
      runtime: 'Vite 8 development middleware + tsx TypeScript executor',
      databaseModel: 'Normalized relational in-memory schema (Destinations, Reviews, Bookings, Itineraries)'
    },
    keyFeaturesImplemented: [
      'Interactive Geospatial Map with customizable pin clustering, category filters, and interactive popups',
      'Dual-Directional User Review Engine with live rating recalculation and helpfulness upvoting',
      'Dynamic Multi-Day Itinerary Generator with budgeting and travel pace configuration',
      'Tour Guide Booking & Inquiry System with instant price estimation and reservation reference generation',
      'Real-time search, multi-criteria filtering (category, budget, rating), and sorting algorithms',
      'Fully responsive UI adhering to WCAG accessibility, 60-30-10 color theory, and zero-pill discipline'
    ],
    restEndpoints: [
      { method: 'GET', endpoint: '/api/destinations', purpose: 'Fetch all destinations with query filters (category, search, budget, sort)' },
      { method: 'GET', endpoint: '/api/destinations/:id', purpose: 'Retrieve single destination details and live recalculation' },
      { method: 'GET', endpoint: '/api/destinations/:id/reviews', purpose: 'Retrieve all reviews specific to a destination' },
      { method: 'POST', endpoint: '/api/destinations/:id/reviews', purpose: 'Submit user review with rating, recalculates aggregate stats' },
      { method: 'POST', endpoint: '/api/reviews/:id/helpful', purpose: 'Increment helpful counter for a community review' },
      { method: 'GET', endpoint: '/api/reviews/recent', purpose: 'Retrieve global feed of most recent tourist reviews' },
      { method: 'POST', endpoint: '/api/bookings', purpose: 'Create a tour guide booking with pricing calculation and reference code' },
      { method: 'GET', endpoint: '/api/bookings', purpose: 'List all active reservations' },
      { method: 'POST', endpoint: '/api/itinerary/plan', purpose: 'Algorithmic multi-day custom schedule builder' },
      { method: 'GET', endpoint: '/api/weather/:id', purpose: 'Retrieve destination climate and microclimate forecast' },
      { method: 'GET', endpoint: '/api/fsd-architecture', purpose: 'System documentation endpoint for FSD examiner evaluation' }
    ]
  });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[WanderGuide FSD Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
