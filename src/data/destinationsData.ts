import { TripDetails, TransportOption, TripPlan, HotelRecommendation, FoodRecommendation, PlaceToVisit, ItineraryDay, BudgetBreakdown } from '../types';

export const POPULAR_DESTINATIONS = [
  { name: 'Goa', country: 'India', tag: 'Beaches & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80' },
  { name: 'Hyderabad', country: 'India', tag: 'Heritage & Biryani', image: 'https://images.unsplash.com/photo-1605335198031-bbecb5ec4434?w=800&auto=format&fit=crop&q=80' },
  { name: 'Paris', country: 'France', tag: 'Art, Romance & Cuisine', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80' },
  { name: 'Tokyo', country: 'Japan', tag: 'Futuristic & Ancient', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
  { name: 'Dubai', country: 'UAE', tag: 'Luxury & Desert Wonders', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80' },
  { name: 'Bali', country: 'Indonesia', tag: 'Tropical Serenity', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80' },
  { name: 'London', country: 'UK', tag: 'Royalty & Museums', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80' },
  { name: 'New York', country: 'USA', tag: 'The City That Never Sleeps', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80' },
  { name: 'Delhi', country: 'India', tag: 'Imperial History & Flavors', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Rome', country: 'Italy', tag: 'Ancient Wonders', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Swiss Alps', country: 'Switzerland', tag: 'Pristine Mountain Peaks', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80' },
];

export function getEstimatedTripDays(startStr?: string, returnStr?: string): number {
  if (!startStr || !returnStr) return 4;
  try {
    const start = new Date(startStr);
    const end = new Date(returnStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(diffDays, 14));
  } catch {
    return 4;
  }
}

// Generate transport options dynamically based on destination and budget
export function getTransportOptions(destination: string, travelers: number, currency: string, budgetLevel: string): TransportOption[] {
  const destLower = destination.toLowerCase();
  const multiplier = travelers || 1;
  const isINR = currency === '₹';
  const rate = isINR ? 85 : 1;

  // Is international or overseas island destination?
  const isIslandOrFar = ['paris', 'tokyo', 'japan', 'london', 'new york', 'bali', 'dubai', 'rome', 'swiss', 'iceland', 'hawaii', 'singapore', 'sydney'].some(k => destLower.includes(k));
  const isIndianMetro = ['hyderabad', 'goa', 'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'jaipur', 'kerala'].some(k => destLower.includes(k));

  const flightCostPerPerson = isINR ? (isIndianMetro ? 4500 : 38000) : (isIslandOrFar ? 650 : 220);
  const trainCostPerPerson = isINR ? (isIndianMetro ? 1400 : 8500) : (isIslandOrFar ? 90 : 65);
  const busCostPerPerson = isINR ? (isIndianMetro ? 950 : 3500) : (isIslandOrFar ? 45 : 35);
  const carCostPerPerson = isINR ? (isIndianMetro ? 2800 : 12000) : (isIslandOrFar ? 120 : 80);

  const budgetMultiplier = budgetLevel === 'luxury' ? 1.6 : budgetLevel === 'budget' ? 0.8 : 1.0;

  const flightCost = Math.round(flightCostPerPerson * budgetMultiplier);
  const trainCost = Math.round(trainCostPerPerson * budgetMultiplier);
  const busCost = Math.round(busCostPerPerson * budgetMultiplier);
  const carCost = Math.round(carCostPerPerson * budgetMultiplier);

  const options: TransportOption[] = [
    {
      id: 'flight',
      title: 'Commercial Flight ✈️',
      icon: 'Plane',
      estimatedTime: isIslandOrFar ? '7h - 14h' : '1h 30m - 2h 45m',
      approxCostPerPerson: flightCost,
      approxTotalCost: flightCost * multiplier,
      description: `Fastest and most comfortable connection to ${destination}. Includes standard baggage allowance and onboard comfort.`,
      tag: 'Fastest & Recommended',
      available: true,
    },
    {
      id: 'train',
      title: 'Express / High-Speed Train 🚆',
      icon: 'Train',
      estimatedTime: isIndianMetro ? '8h - 14h' : (destLower.includes('paris') || destLower.includes('london') || destLower.includes('tokyo') ? '2h 15m (Bullet/Eurostar)' : '6h - 10h'),
      approxCostPerPerson: trainCost,
      approxTotalCost: trainCost * multiplier,
      description: `Scenic views, spacious legroom, and city-center-to-city-center transit with minimal security queues.`,
      tag: 'Scenic & Eco-Friendly',
      available: !isIslandOrFar || destLower.includes('paris') || destLower.includes('london') || destLower.includes('tokyo') || destLower.includes('rome'),
    },
    {
      id: 'car',
      title: 'Private Chauffeur / Rental Car 🚗',
      icon: 'Car',
      estimatedTime: isIslandOrFar ? 'Flexible / Regional' : '5h - 9h Road Trip',
      approxCostPerPerson: carCost,
      approxTotalCost: carCost * multiplier,
      description: `Ultimate flexibility. Stop for roadside viewpoints, hidden cafes, and travel at your own curated pace.`,
      tag: 'Maximum Flexibility',
      available: true,
    },
    {
      id: 'bus',
      title: 'Premium AC Sleeper / Luxury Coach 🚌',
      icon: 'Bus',
      estimatedTime: '9h - 14h (Overnight)',
      approxCostPerPerson: busCost,
      approxTotalCost: busCost * multiplier,
      description: `Pocket-friendly intercity travel equipped with reclining seats, Wi-Fi, and convenient night routes.`,
      tag: 'Budget Favorite',
      available: !isIslandOrFar,
    },
  ];

  if (destLower.includes('goa') || destLower.includes('bali') || destLower.includes('greece') || destLower.includes('venice')) {
    const ferryCost = Math.round((isINR ? 1800 : 50) * budgetMultiplier);
    options.push({
      id: 'ferry',
      title: 'Coastal Cruise / Speed Ferry ⛴️',
      icon: 'Ship',
      estimatedTime: '1h 30m - 3h',
      approxCostPerPerson: ferryCost,
      approxTotalCost: ferryCost * multiplier,
      description: `Panoramic ocean ride across coastal waters, islands, and sparkling harbor bays.`,
      tag: 'Ocean Experience',
      available: true,
    });
  }

  return options;
}

// Built-in intelligent destination profiles
interface PresetDestination {
  tagline: string;
  countryOrRegion: string;
  heroImage: string;
  bestSeason: string;
  currentWeather: string;
  hotels: HotelRecommendation[];
  food: FoodRecommendation[];
  places: PlaceToVisit[];
  travelTips: string[];
}

const DESTINATION_PRESETS: Record<string, PresetDestination> = {
  goa: {
    tagline: 'Sun-drenched beaches, Portuguese heritage, and vibrant susegad vibes',
    countryOrRegion: 'Goa, India',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80',
    bestSeason: 'Mid-November to Mid-March (Pleasant sunny days, cool coastal breeze)',
    currentWeather: '29°C, Tropical Sunshine & Gentle Sea Breeze',
    hotels: [
      {
        id: 'goa-h1',
        name: 'Taj Exotica Resort & Spa Benaulim',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        location: 'South Goa, Benaulim Beach',
        pricePerNight: 280,
        rating: 4.9,
        ratingCount: 1420,
        facilities: ['Private Beach', 'Ayurvedic Spa', 'Infinity Pool', 'Golf Course', 'Free Breakfast'],
        description: 'Mediterranean-style beachfront luxury sanctuary set among 56 acres of lush gardens with pristine private beach access.',
        tier: 'luxury',
        roomType: 'Seaview Deluxe Villa with Private Balcony'
      },
      {
        id: 'goa-h2',
        name: 'The Heritage Village Resort & Spa',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        location: 'Arossim Beach, South Goa',
        pricePerNight: 120,
        rating: 4.7,
        ratingCount: 890,
        facilities: ['Outdoor Pool', 'Spa & Wellness', 'Live Music', 'Kids Play Zone', 'Restaurant'],
        description: 'Colonial Indo-Portuguese architecture with tropical courtyards, authentic Goan hospitality, and calm white sands.',
        tier: 'moderate',
        roomType: 'Colonial Grand Room'
      },
      {
        id: 'goa-h3',
        name: 'Santana Beach Resort Candolim',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
        location: 'Candolim, North Goa',
        pricePerNight: 55,
        rating: 4.5,
        ratingCount: 640,
        facilities: ['2 Swimming Pools', 'Beach Shacks nearby', 'Free Wi-Fi', 'Tropical Garden'],
        description: 'Vibrant boutique resort tucked in coconut palms just 2 minutes walk from Candolim sand and beach nightlife.',
        tier: 'budget',
        roomType: 'Cozy Poolside Studio'
      }
    ],
    food: [
      {
        id: 'goa-f1',
        name: 'Fisherman’s Wharf',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        location: 'Mobor Beach, Cavelossim',
        approxPrice: 28,
        cuisine: 'Authentic Goan & Seafood',
        description: 'Riverside dining overlooking trawlers with fresh kingfish recheado, prawn balchão, and chilled feni cocktails.',
        specialty: 'Goan Prawn Curry with Poi & Crab Xec Xec'
      },
      {
        id: 'goa-f2',
        name: 'Gunpowder Kitchen & Bar',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        location: 'Assagao, North Goa',
        approxPrice: 22,
        cuisine: 'Peninsular South Indian & Coastal',
        description: 'Charming heritage villa garden dining celebrated for slow-cooked Syrian beef fry, Malabar parottas, and craft cocktails.',
        specialty: 'Kozhi Roast & Fluffy Appams'
      },
      {
        id: 'goa-f3',
        name: 'Thalassa Greek Taverna',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        location: 'Siolim Waterfront',
        approxPrice: 35,
        cuisine: 'Greek Mediterranean & Sunset Cocktails',
        description: 'Iconic open-air cliffside sanctuary offering sunset fire shows, fresh souvlaki, and breezy waterfront music.',
        specialty: 'Spanakopita & Flame-grilled Calamari'
      }
    ],
    places: [
      {
        id: 'goa-p1',
        name: 'Aguada Fort & Portuguese Lighthouse',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        location: 'Sinquerim, Candolim',
        entryFee: '₹50 (~$1) for domestic, ₹300 foreign',
        bestTime: 'Early morning 8:30 AM or Sunset 5:00 PM',
        description: 'Well-preserved 17th-century Portuguese fortress standing proudly against the Mandovi River meeting the Arabian Sea.',
        thingsToDo: ['Climb the historic 4-storey lighthouse', 'Explore the massive water cistern', 'Capture panoramic ocean photography'],
        approxCost: '$2 - $5',
        travelTips: 'Wear comfortable walking shoes and carry sunscreen; the sea breeze is strongest on the upper ramparts.'
      },
      {
        id: 'goa-p2',
        name: 'Dudhsagar Waterfalls & Jungle Jeep Safari',
        image: 'https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?w=800&auto=format&fit=crop&q=80',
        location: 'Bhagwan Mahaveer Sanctuary, Mollem',
        entryFee: '₹500 - ₹800 per person (includes Jeep permit & lifejacket)',
        bestTime: 'October to February for clear cascade views',
        description: 'A spectacular 4-tiered "Sea of Milk" waterfall plummeting 310 meters through dense Western Ghats rainforest.',
        thingsToDo: ['Off-road 4x4 jungle river crossings', 'Swim in the natural mountain plunge pool', 'Feed friendly sanctuary macaques'],
        approxCost: '$15 - $25 per person',
        travelTips: 'Pre-book your official forest jeep early in the morning to beat the rush.'
      },
      {
        id: 'goa-p3',
        name: 'Fontainhas Latin Quarter',
        image: 'https://images.unsplash.com/photo-1605335198031-bbecb5ec4434?w=800&auto=format&fit=crop&q=80',
        location: 'Panjim, Central Goa',
        entryFee: 'Free (Public Heritage Quarter)',
        bestTime: 'Morning 9:00 AM - 11:30 AM or 4:00 PM',
        description: 'UNESCO Heritage zone showcasing cobblestone lanes, pastel-yellow villas, tiled balconies, and nostalgic Portuguese bakeries.',
        thingsToDo: ['Photograph vibrant terracotta-tiled streets', 'Sip espresso at heritage bakeries', 'Browse local handmade azulejos tiles'],
        approxCost: 'Free ($5 for bakery treats)',
        travelTips: 'Respect local residents when taking photos; look out for old street name plaques painted on ceramic tiles.'
      },
      {
        id: 'goa-p4',
        name: 'Palolem Beach & Butterfly Island',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        location: 'Canacona, South Goa',
        entryFee: 'Free',
        bestTime: 'Morning sunrise or gentle sunset',
        description: 'Crescent-shaped serene beach framed by coconut groves, gentle swimming waters, and colorful wooden beach huts.',
        thingsToDo: ['Kayaking to secluded Butterfly Island', 'Dolphin spotting boat rides', 'Relax in beachfront hammocks'],
        approxCost: '$8 - $15 for kayak/boat',
        travelTips: 'The water here is significantly calmer than North Goa, making it great for beginner kayakers and swimming.'
      }
    ],
    travelTips: [
      'Renting an automatic scooter or self-drive Thar is the most fun and economical way to explore hidden bays.',
      'South Goa is perfect for quiet, scenic retreats; North Goa is the hotspot for beach clubs and night markets.',
      'Always carry cash or UPI for beach shacks where mobile card terminals occasionally lose network.'
    ]
  },

  hyderabad: {
    tagline: 'The City of Pearls, Nizami palaces, cutting-edge tech, and legendary dum biryani',
    countryOrRegion: 'Telangana, India',
    heroImage: 'https://images.unsplash.com/photo-1605335198031-bbecb5ec4434?w=1600&auto=format&fit=crop&q=80',
    bestSeason: 'October to March (Warm sunny days and crisp, cool evenings)',
    currentWeather: '26°C, Pleasant and Clear Skies',
    hotels: [
      {
        id: 'hyd-h1',
        name: 'Taj Falaknuma Palace',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        location: 'Engine Bowli, Falaknuma',
        pricePerNight: 420,
        rating: 4.95,
        ratingCount: 1680,
        facilities: ['Horse Carriage Arrival', 'Nizami Butler Service', 'Italian Marble Pool', 'Heritage Palace Tour'],
        description: 'Perched 2,000 feet above Hyderabad, this 1893 royal residence was once home to the Nizam, featuring Belgian chandeliers and Venetian mosaics.',
        tier: 'luxury',
        roomType: 'Royal Palace Suite with Panoramic City Views'
      },
      {
        id: 'hyd-h2',
        name: 'ITC Kohenur, A Luxury Collection Hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        location: 'HITEC City & Durgam Cheruvu',
        pricePerNight: 160,
        rating: 4.8,
        ratingCount: 1100,
        facilities: ['Lakeview Rooftop Pool', 'Kaya Kalp Spa', 'Fine-dining Restaurants', 'Fitness Studio'],
        description: 'Modern architectural marvel inspired by the Kohinoor diamond, overlooking the Durgam Cheruvu freshwater lake.',
        tier: 'moderate',
        roomType: 'Executive Lakeview King Room'
      },
      {
        id: 'hyd-h3',
        name: 'Mercure Hyderabad KCP',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        location: 'Banjara Hills',
        pricePerNight: 65,
        rating: 4.5,
        ratingCount: 780,
        facilities: ['City View Lounge', 'Gym', 'Free High-speed Wi-Fi', 'Complimentary Breakfast'],
        description: 'Centrally located boutique hotel in upscale Banjara Hills, convenient for both historic sights and tech corridors.',
        tier: 'budget',
        roomType: 'Deluxe City View Room'
      }
    ],
    food: [
      {
        id: 'hyd-f1',
        name: 'Paradise / Shadab Historic Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        location: 'Near High Court & Charminar',
        approxPrice: 16,
        cuisine: 'Nizami Hyderabadi Dum Cooking',
        description: 'Legendary clay-pot sealed basmati rice slow-cooked with tender marinated mutton, saffron, and aromatic spices.',
        specialty: 'Hyderabadi Mutton Dum Biryani & Mirchi ka Salan'
      },
      {
        id: 'hyd-f2',
        name: 'Nimrah Cafe & Bakery',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        location: 'Right beside Charminar gates',
        approxPrice: 4,
        cuisine: 'Irani Cafe & Artisanal Bakery',
        description: 'Bustling tea house serving rich creamy Irani chai paired with crumbly buttery Osmania biscuits directly overlooking the monument.',
        specialty: 'Irani Chai with Osmania Biscuits & Chand Biscuits'
      },
      {
        id: 'hyd-f3',
        name: 'Chutneys',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        location: 'Banjara Hills',
        approxPrice: 12,
        cuisine: 'South Indian Breakfast & Tiffins',
        description: 'Famous for serving dosas and steaming idlis alongside 6 signature handcrafted chutneys, including ginger and mango.',
        specialty: 'Guntur Babai Idli & Steaming Ghee Karam Dosa'
      }
    ],
    places: [
      {
        id: 'hyd-p1',
        name: 'Charminar & Laad Bazaar Pearl Market',
        image: 'https://images.unsplash.com/photo-1605335198031-bbecb5ec4434?w=800&auto=format&fit=crop&q=80',
        location: 'Old City, Hyderabad',
        entryFee: '₹25 (~$0.30) Indian, ₹300 (~$3.60) Foreigners',
        bestTime: 'Morning 9:30 AM or Lit up after 6:30 PM',
        description: 'Built in 1591 by Sultan Muhammad Quli Qutb Shah, this iconic global symbol features four grand arches and 56-meter minarets.',
        thingsToDo: ['Climb the spiral stone steps for Old City views', 'Shop for lacquer bangles and pearls in Laad Bazaar', 'Sample hot street snacks'],
        approxCost: '$2 - $10',
        travelTips: 'Visit in the early evening to see the monument bathed in golden illumination against the bustling twilight market.'
      },
      {
        id: 'hyd-p2',
        name: 'Golconda Fort & Sound-Light Spectacular',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&auto=format&fit=crop&q=80',
        location: 'Ibrahim Bagh, Western Hyderabad',
        entryFee: '₹25 Fort Entry, ₹140 Sound & Light Show',
        bestTime: 'Late afternoon 3:30 PM - 7:00 PM',
        description: 'Medieval citadel renowned for acoustic engineering—a single handclap at the Fateh Darwaza can be heard 1 km away at the summit.',
        thingsToDo: ['Test the whispering acoustic gates', 'Climb to the Bala Hissar royal pavilions', 'Watch the twilight sound-and-light show'],
        approxCost: '$3 - $6',
        travelTips: 'Wear sturdy sports shoes with good grip; the stone inclines to the top pavilion require a moderate 30-minute hike.'
      },
      {
        id: 'hyd-p3',
        name: 'Chowmahalla Palace & Vintage Nizam Car Collection',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        location: 'Khilwat, Near Charminar',
        entryFee: '₹100 Indian, ₹400 Foreigners',
        bestTime: '10:00 AM - 1:00 PM (Closed Fridays)',
        description: 'Opulent palace of the Asaf Jahi dynasty modeled after the Shah of Iran’s palace in Tehran, featuring 19 crystal chandeliers.',
        thingsToDo: ['Marvel at the Grand Khilwat Durbar Hall', 'View the 1912 yellow Rolls-Royce Silver Ghost', 'Stroll pristine royal gardens'],
        approxCost: '$2 - $5',
        travelTips: 'Photography tickets are extra ($1); well worth it for the breathtaking symmetry of the throne room.'
      },
      {
        id: 'hyd-p4',
        name: 'Ramoji Film City',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        location: 'Hayathnagar, Outer Ring Road',
        entryFee: '₹1,350 (~$16) General Day Tour',
        bestTime: 'Full Day (9:00 AM - 5:30 PM)',
        description: 'Guinness World Record holder for the largest film studio complex in the world spanning over 2,000 acres.',
        thingsToDo: ['Explore live film sets and London streets', 'Experience stunt shows and action effects', 'Visit the wings bird park'],
        approxCost: '$16 - $30',
        travelTips: 'Book standard transportation or the AC coach shuttle package from central city pickup points.'
      }
    ],
    travelTips: [
      'Take the modern Hyderabad Metro to easily dodge peak hour traffic between Secunderabad, Ameerpet, and HITEC City.',
      'Purchase pearls only from certified government-recognized jewelers around Charminar or Begumpet.',
      'Save space for dessert: double ka meetha and qubani ka meetha with clotted cream are must-tries!'
    ]
  },

  paris: {
    tagline: 'The City of Light, timeless haute couture, architectural majesty, and world-class culinary art',
    countryOrRegion: 'Île-de-France, France',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=80',
    bestSeason: 'April to October (Pleasant blooms, sidewalk café culture, warm evenings)',
    currentWeather: '18°C, Gentle Breeze & Golden Sunlight',
    hotels: [
      {
        id: 'paris-h1',
        name: 'Hôtel Plaza Athénée',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
        location: 'Avenue Montaigne, 8th Arrondissement',
        pricePerNight: 850,
        rating: 4.9,
        ratingCount: 1200,
        facilities: ['Direct Eiffel Tower Views', 'Dior Spa', 'Michelin-starred Dining', 'Courtyard Garden'],
        description: 'Iconic Parisian haute couture hotel famous for its red geraniums, romantic Eiffel balconies, and regal suites.',
        tier: 'luxury',
        roomType: 'Eiffel Tower View Prestige Suite'
      },
      {
        id: 'paris-h2',
        name: 'Hôtel Le Marais Opéra',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        location: 'Le Marais, 4th Arrondissement',
        pricePerNight: 240,
        rating: 4.7,
        ratingCount: 890,
        facilities: ['Boutique Parisian Lounge', 'Complimentary Breakfast Croissants', 'High-Speed Wi-Fi', 'Air Conditioning'],
        description: 'Chic 18th-century boutique building nestled in the heart of trendy art galleries, vintage boutiques, and cafes.',
        tier: 'moderate',
        roomType: 'Classic Parisian Balcony Room'
      },
      {
        id: 'paris-h3',
        name: 'CitizenM Paris Gare de Lyon',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        location: '12th Arrondissement',
        pricePerNight: 125,
        rating: 4.6,
        ratingCount: 1450,
        facilities: ['Rooftop Cloud Bar', 'XL King Beds', 'Rain Showers', '24/7 Smart Food Bar'],
        description: 'Affordable modern luxury featuring tech-enabled rooms and a designer panoramic sky lounge overlooking the Seine.',
        tier: 'budget',
        roomType: 'Standard King Room with City View'
      }
    ],
    food: [
      {
        id: 'paris-f1',
        name: 'Le Comptoir du Relais',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
        location: 'Saint-Germain-des-Prés, 6th Arrondissement',
        approxPrice: 55,
        cuisine: 'Classic French Bistronomy',
        description: 'Chef Yves Camdeborde’s intimate French bistro dishing out velvety duck confit, escargots, and regional wines.',
        specialty: 'Duck Confit with Truffled Potato Puree & Tarte Tatin'
      },
      {
        id: 'paris-f2',
        name: 'L’As du Fallafel',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        location: 'Rue des Rosiers, Le Marais',
        approxPrice: 14,
        cuisine: 'Middle Eastern & Falafel',
        description: 'Consistently rated the best street food in Paris; crispy herbaceous falafel balls with roasted eggplant and spicy harissa.',
        specialty: 'Special Falafel Pita with Grilled Eggplant & Tahini'
      },
      {
        id: 'paris-f3',
        name: 'Café de Flore',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        location: 'Boulevard Saint-Germain',
        approxPrice: 22,
        cuisine: 'Historic Parisian Café',
        description: 'Sit in the outdoor wicker chairs once favored by Jean-Paul Sartre and Hemingway for creamy thick hot chocolate and croissants.',
        specialty: 'Chocolat Chaud Spécial Flore & Toasted Croque Monsieur'
      }
    ],
    places: [
      {
        id: 'paris-p1',
        name: 'Eiffel Tower & Champ de Mars',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80',
        location: 'Champ de Mars, 7th Arrondissement',
        entryFee: '€18 - €29 (~$20 - $32) for Summit Lift',
        bestTime: 'Sunset into twilight (sparkles every hour on the hour)',
        description: 'Gustave Eiffel’s 330-meter iron masterpiece offering panoramic 360-degree vistas over all Paris arrondissements.',
        thingsToDo: ['Elevator ride to the top summit', 'Picnic on Champ de Mars lawns with cheese and baguette', 'Watch 20,000 twinkling golden lamps'],
        approxCost: '$20 - $35',
        travelTips: 'Book summit elevator tickets online 60 days in advance to skip 2-hour ticket booth lines.'
      },
      {
        id: 'paris-p2',
        name: 'The Louvre Museum & Glass Pyramid',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
        location: 'Rue de Rivoli, 1st Arrondissement',
        entryFee: '€22 (~$24)',
        bestTime: 'Wednesday or Friday evening (fewer crowds)',
        description: 'World’s most visited art museum housing 35,000 treasures including the Mona Lisa, Venus de Milo, and Winged Victory.',
        thingsToDo: ['Pose by I.M. Pei’s Glass Pyramid', 'Explore Renaissance Masterpieces', 'Stroll through the adjoining Tuileries Gardens'],
        approxCost: '$25',
        travelTips: 'Use the underground Carrousel du Louvre entrance rather than the main pyramid line for faster security check.'
      },
      {
        id: 'paris-p3',
        name: 'Montmartre & Sacré-Cœur Basilica',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
        location: '18th Arrondissement',
        entryFee: 'Basilica Free; Dome climb €7',
        bestTime: 'Late afternoon 4:00 PM - 7:30 PM',
        description: 'Bohemian hilltop village where Monet, Picasso, and Van Gogh once painted, crowned by the radiant white dome.',
        thingsToDo: ['Climb the stone dome for sweeping city views', 'Watch street portrait artists at Place du Tertre', 'Discover hidden windmills and vineyards'],
        approxCost: '$8',
        travelTips: 'Take the Montmartre Funicular with a standard metro ticket if you want to skip the 222 stone stairs.'
      },
      {
        id: 'paris-p4',
        name: 'Seine River Sunset Cruise',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
        location: 'Pont Neuf / Pont de l’Alma',
        entryFee: '€16 - €25 (~$18 - $28)',
        bestTime: '7:30 PM departure for golden hour and night lights',
        description: 'Gliding along the UNESCO-listed riverbanks under 37 bridges past Notre-Dame, Musée d’Orsay, and the glowing Eiffel Tower.',
        thingsToDo: ['Capture unobstructed monument photos', 'Audio-guided historic bridge storytelling', 'Sip champagne on the upper open deck'],
        approxCost: '$18 - $30',
        travelTips: 'Sit on the upper open deck right side (starboard) for premier angles of the illuminated Eiffel Tower on return.'
      }
    ],
    travelTips: [
      'Buy a "Navigo Easy" pass or carnet of digital Metro tickets on your phone for quick subway connections.',
      'Always greet shopkeepers and waiters with a polite "Bonjour Madame/Monsieur" before asking questions in English.',
      'Tap water ("une carafe d’eau") and bread in French restaurants are always complimentary by law.'
    ]
  },

  tokyo: {
    tagline: 'Hyper-futuristic neon metropolises seamlessly woven with serene Shinto shrines and culinary perfection',
    countryOrRegion: 'Kanto, Japan',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80',
    bestSeason: 'March to May (Cherry Blossoms) or October to November (Vibrant Autumn Foliage)',
    currentWeather: '19°C, Crisp Autumn Breeze & Clear Skies',
    hotels: [
      {
        id: 'tokyo-h1',
        name: 'Aman Tokyo',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        location: 'Otemachi, Chiyoda',
        pricePerNight: 950,
        rating: 4.95,
        ratingCount: 980,
        facilities: ['Mount Fuji Views', 'Traditional Onsen Bath', 'Zen Garden Lobby', '30m Sky Pool'],
        description: 'Urban sanctuary occupying the top six floors of Otemachi Tower, crafted with camphor wood, washi paper, and granite.',
        tier: 'luxury',
        roomType: 'Deluxe Palace Suite with Furo Soaking Tub'
      },
      {
        id: 'tokyo-h2',
        name: 'Shibuya Stream Excel Hotel Tokyu',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        location: 'Shibuya Station',
        pricePerNight: 210,
        rating: 4.7,
        ratingCount: 1300,
        facilities: ['Direct Station Link', 'Modern Stream Design', 'Free Pocket Wi-Fi Rental', 'Trendy Bar'],
        description: 'Directly connected to Shibuya Station with ultra-modern design, minutes from the world-famous scramble crossing.',
        tier: 'moderate',
        roomType: 'Superior King Shibuya View Room'
      },
      {
        id: 'tokyo-h3',
        name: 'Richmond Hotel Premier Asakusa',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        location: 'Asakusa, Taito',
        pricePerNight: 110,
        rating: 4.6,
        ratingCount: 1650,
        facilities: ['Temple Views', 'Coin Laundry', 'Japanese Breakfast Buffet', 'High Speed Wi-Fi'],
        description: 'Exceptional value overlooking Senso-ji temple and Tokyo Skytree, surrounded by historic artisan alleys and food stalls.',
        tier: 'budget',
        roomType: 'Comfort Double Room with Temple View'
      }
    ],
    food: [
      {
        id: 'tokyo-f1',
        name: 'Ichiran Shibuya Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
        location: 'Shibuya, Tokyo',
        approxPrice: 12,
        cuisine: 'Tonkotsu Ramen',
        description: 'Individual solo dining flavor-concentration booths serving customized rich pork broth ramen with handmade springy noodles.',
        specialty: 'Natural Tonkotsu Ramen with Secret Spicy Red Sauce'
      },
      {
        id: 'tokyo-f2',
        name: 'Tsukiji Outer Market Fresh Sushi & Wagyu',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
        location: 'Tsukiji, Chuo Ward',
        approxPrice: 28,
        cuisine: 'Edomae Sushi & Street Delicacies',
        description: 'Historic vibrant alleyways packed with master sushi chefs slicing morning bluefin tuna, uni bowls, and flame-torched wagyu skewers.',
        specialty: 'Otoro (Fatty Tuna) Nigiri & Tamagoyaki Sweet Omelet'
      },
      {
        id: 'tokyo-f3',
        name: 'Gonpachi Nishi-Azabu ("Kill Bill Restaurant")',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        location: 'Roppongi / Nishi-Azabu',
        approxPrice: 45,
        cuisine: 'Izakaya & Charcoal Yakitori',
        description: 'Atmospheric multi-tiered wooden tavern that inspired Quentin Tarantino’s famous movie set, with hand-pounded soba and skewers.',
        specialty: 'Charcoal-grilled Kurobuta Pork & Hand-ground Soba'
      }
    ],
    places: [
      {
        id: 'tokyo-p1',
        name: 'Shibuya Scramble & Shibuya Sky Deck',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
        location: 'Shibuya',
        entryFee: 'Crossing Free; Shibuya Sky Deck ¥2,200 (~$15)',
        bestTime: 'Sunset around 5:30 PM when neon lights ignite',
        description: 'World’s busiest pedestrian crossing with up to 3,000 people crossing simultaneously, backed by giant neon video screens.',
        thingsToDo: ['Walk the scramble crosswalk', 'Visit the Hachiko faithful dog statue', 'Soar 229m on the Shibuya Sky open-air glass rooftop'],
        approxCost: '$15 for Sky Deck',
        travelTips: 'Pre-book the 4:40 PM Shibuya Sky sunset slot 4 weeks in advance for breathtaking views of Mount Fuji on clear days.'
      },
      {
        id: 'tokyo-p2',
        name: 'Senso-ji Temple & Nakamise-dori',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
        location: 'Asakusa',
        entryFee: 'Free (Omikuji fortune slip ¥100)',
        bestTime: 'Early morning 8:00 AM before tour crowds',
        description: 'Tokyo’s oldest Buddhist temple founded in 628 AD, approached through the iconic giant red Kaminarimon (Thunder Gate) lantern.',
        thingsToDo: ['Draw an Omikuji fortune paper', 'Purify with sacred incense smoke in the cauldron', 'Sample warm melonpan and matcha ice cream'],
        approxCost: 'Free ($5 for street snacks)',
        travelTips: 'Walk Nakamise shopping street for traditional folding fans, chopsticks, and freshly baked ningyo-yaki bean cakes.'
      },
      {
        id: 'tokyo-p3',
        name: 'teamLab Borderless / Planets Digital Art',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        location: 'Azabudai Hills / Toyosu',
        entryFee: '¥3,800 (~$25)',
        bestTime: 'Morning or late afternoon slots',
        description: 'Mesmerizing immersive museum where artwork moves out of rooms, communicates with other works, and transforms around human movement.',
        thingsToDo: ['Wade through digital water koi ponds', 'Walk through the infinite crystal mirror universe', 'Touch responsive flower cascades'],
        approxCost: '$25 - $30',
        travelTips: 'Wear pants or shorts that can easily be rolled above knees (at Planets you walk barefoot through shallow water).'
      },
      {
        id: 'tokyo-p4',
        name: 'Meiji Jingu Shrine & Harajuku Takeshita Street',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
        location: 'Shibuya / Harajuku',
        entryFee: 'Shrine Free; Inner Garden ¥500',
        bestTime: 'Morning 9:00 AM - 12:00 PM',
        description: 'Tranquil 170-acre evergreen forest sanctuary honoring Emperor Meiji, right next to the vibrant youth fashion center of Harajuku.',
        thingsToDo: ['Write a wish on an Ema wooden prayer tablet', 'Walk under massive 12-meter cypress Torii gates', 'Try whimsical Harajuku crepes'],
        approxCost: 'Free ($4 for crepes)',
        travelTips: 'Early Sunday mornings often feature traditional Japanese Shinto wedding processions in ceremonial kimonos.'
      }
    ],
    travelTips: [
      'Add a digital Suica or Pasmo IC card to your Apple/Google Wallet for seamless taps on all trains, buses, and 7-Eleven vending machines.',
      'Tipping is NOT customary in Japan and can cause confusion; polite service is proudly included in all prices.',
      'Convenience stores (7-Eleven, Lawson, FamilyMart) offer Michelin-worthy onigiri, egg salad sandwiches, and fresh fried chicken at low prices.'
    ]
  }
};

// Generic dynamic generator for ANY city worldwide
export function generateDynamicTravelPlan(details: TripDetails): TripPlan {
  const destClean = details.destination.trim();
  const destKey = destClean.toLowerCase();

  // If we have an exact or partial preset match
  const matchedKey = Object.keys(DESTINATION_PRESETS).find(k => destKey.includes(k) || k.includes(destKey));
  const preset = matchedKey ? DESTINATION_PRESETS[matchedKey] : null;

  const days = getEstimatedTripDays(details.startDate, details.returnDate);
  const travelers = details.travelers || 1;
  const isINR = details.currency === '₹';
  const rate = isINR ? 85 : 1;

  const budgetMultiplier = details.budgetLevel === 'luxury' ? 2.5 : details.budgetLevel === 'budget' ? 0.6 : 1.2;

  // Build Hotels
  let hotels: HotelRecommendation[] = [];
  if (preset) {
    hotels = preset.hotels.map(h => ({
      ...h,
      pricePerNight: Math.round(h.pricePerNight * (isINR ? 80 : 1) * (details.budgetLevel === 'luxury' ? 1.4 : details.budgetLevel === 'budget' ? 0.7 : 1))
    }));
  } else {
    // Dynamically fabricate 3 high-quality real-sounding hotels for ANY destination!
    hotels = [
      {
        id: `dyn-h1-${destClean}`,
        name: `The Grand Palace & Spa ${destClean}`,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        location: `Central ${destClean} Historic District`,
        pricePerNight: Math.round((isINR ? 18500 : 260) * budgetMultiplier),
        rating: 4.9,
        ratingCount: 840,
        facilities: ['Infinity Pool', 'Luxury Spa', 'Michelin Culinary Suite', '24/7 Concierge', 'Complimentary Breakfast'],
        description: `Premier 5-star haven situated in prime ${destClean}, showcasing panoramic views, signature spa treatments, and bespoke concierge service.`,
        tier: 'luxury',
        roomType: 'Panoramic Luxury Executive Suite'
      },
      {
        id: `dyn-h2-${destClean}`,
        name: `${destClean} Boutique Heritage Hotel`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        location: `Old Town Waterfront, ${destClean}`,
        pricePerNight: Math.round((isINR ? 8500 : 120) * budgetMultiplier * 0.7),
        rating: 4.7,
        ratingCount: 620,
        facilities: ['Rooftop Lounge', 'Free Breakfast Buffet', 'High-Speed Wi-Fi', 'Airport Shuttle'],
        description: `Chic, character-rich boutique residence blending local artisanal design with modern comfort and walking distance to landmarks.`,
        tier: 'moderate',
        roomType: 'Deluxe City View Room'
      },
      {
        id: `dyn-h3-${destClean}`,
        name: `${destClean} Traveler Inn & Lofts`,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        location: `Downtown Transit Hub, ${destClean}`,
        pricePerNight: Math.round((isINR ? 3800 : 55) * budgetMultiplier * 0.4),
        rating: 4.5,
        ratingCount: 940,
        facilities: ['Free High-Speed Wi-Fi', 'Smart TV', 'Self-Check-in', 'Co-working Cafe'],
        description: `Clean, modern, and highly rated value accommodation providing effortless transit connections and cozy bedding.`,
        tier: 'budget',
        roomType: 'Standard Queen Traveler Room'
      }
    ];
  }

  // Filter or prioritize based on user's selected budgetLevel
  hotels.sort((a, b) => {
    if (a.tier === details.budgetLevel) return -1;
    if (b.tier === details.budgetLevel) return 1;
    return 0;
  });

  // Food recommendations
  let food: FoodRecommendation[] = [];
  if (preset) {
    food = preset.food.map(f => ({
      ...f,
      approxPrice: Math.round(f.approxPrice * (isINR ? 80 : 1))
    }));
  } else {
    food = [
      {
        id: `dyn-f1-${destClean}`,
        name: `${destClean} Heritage Kitchen & Grill`,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        location: `Old Town Center, ${destClean}`,
        approxPrice: Math.round((isINR ? 1800 : 25) * budgetMultiplier),
        cuisine: `Authentic Regional & Gourmet Flavors`,
        description: `Celebrated establishment famous for traditional clay-oven and slow-braised local delicacies using farm-to-table produce.`,
        specialty: `Chef’s Signature ${destClean} Platter & House Artisanal Dessert`
      },
      {
        id: `dyn-f2-${destClean}`,
        name: `Street Food Bazaar & Night Market`,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        location: `Central Promenade, ${destClean}`,
        approxPrice: Math.round((isINR ? 650 : 9) * budgetMultiplier),
        cuisine: `Fresh Street Eats & Finger Food`,
        description: `Vibrant pedestrian food alley packed with sizzle, fresh skewer grills, warm pastries, and craft beverages.`,
        specialty: `Crispy Regional Fritters & Spiced Herbal Tea`
      },
      {
        id: `dyn-f3-${destClean}`,
        name: `The Panorama Sky Bistro`,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        location: `Observatory Tower, ${destClean}`,
        approxPrice: Math.round((isINR ? 3200 : 45) * budgetMultiplier),
        cuisine: `Contemporary Fusion & Cocktails`,
        description: `Elevated sunset dining offering panoramic skyline vistas, live acoustic lounge tunes, and innovative mixology.`,
        specialty: `Wood-fired Entrees & Smoked Sunset Mocktail`
      }
    ];
  }

  // Places to visit
  let places: PlaceToVisit[] = [];
  if (preset) {
    places = preset.places;
  } else {
    places = [
      {
        id: `dyn-p1-${destClean}`,
        name: `${destClean} Historic Citadel & Grand Plaza`,
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
        location: `Center of ${destClean}`,
        entryFee: isINR ? '₹150 - ₹500' : '$5 - $15',
        bestTime: 'Morning 9:00 AM or Golden Sunset',
        description: `The monumental heartbeat of ${destClean}, preserving centuries of architecture, majestic colonnades, and public squares.`,
        thingsToDo: ['Photograph the monumental central gate', 'Explore the historic galleries', 'Relax at the open-air fountain cafe'],
        approxCost: isINR ? '₹300 per person' : '$8 per person',
        travelTips: 'Arrive 15 minutes before opening to enjoy the plaza unobstructed by daytime walking tours.'
      },
      {
        id: `dyn-p2-${destClean}`,
        name: `${destClean} National Heritage Museum & Royal Gardens`,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        location: `Cultural Corridor, ${destClean}`,
        entryFee: isINR ? '₹100 - ₹350' : '$8 - $18',
        bestTime: 'Afternoon 1:30 PM - 4:00 PM',
        description: `Showcases ancient archaeological treasures, royal tapestries, and manicured botanical courtyards.`,
        thingsToDo: ['Guided audio tour through ancient wings', 'Stroll through the medicinal rose gardens', 'Browse the artisanal craft gift store'],
        approxCost: isINR ? '₹250' : '$10',
        travelTips: 'Photography is allowed without flash; lockers are available at the main foyer for large backpacks.'
      },
      {
        id: `dyn-p3-${destClean}`,
        name: `${destClean} Sunset Promenade & Waterfront Walk`,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        location: `River/Harbor Esplanade, ${destClean}`,
        entryFee: 'Free (Public Esplanade)',
        bestTime: '5:30 PM - 8:00 PM Twilight',
        description: `Paved scenic boardwalk filled with ocean breeze, buskers, illuminated bridges, and cozy waterfront bistros.`,
        thingsToDo: ['Take a 45-minute riverboat or cruise loop', 'Sample freshly roasted street snacks', 'Watch evening fountain light displays'],
        approxCost: isINR ? 'Free (Optional ₹500 boat ride)' : 'Free (Optional $12 cruise)',
        travelTips: 'The waterfront gets lively in the evening with street musicians; grab an outdoor bench near the center pier.'
      },
      {
        id: `dyn-p4-${destClean}`,
        name: `${destClean} Panoramic Mountain & Skyline Lookout`,
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80',
        location: `Summit Road, ${destClean}`,
        entryFee: 'Free / Cable Car Ticket',
        bestTime: 'Clear morning or sparkling night lights',
        description: `Highest panoramic elevation overlooking the entirety of ${destClean} and the surrounding natural landscapes.`,
        thingsToDo: ['Ride the observation gondola/cable car', 'Spot major landmarks using summit telescopes', 'Capture breathtaking wide-angle photos'],
        approxCost: isINR ? '₹400 for cable car' : '$12 for cable car',
        travelTips: 'Bring a light jacket as temperatures are noticeably cooler and breezier at the summit.'
      }
    ];
  }

  // Calculate Budget Breakdown
  const selectedHotel = hotels[0];
  const hotelTotal = (selectedHotel.pricePerNight * days);
  const transportPerPerson = isINR ? (details.budgetLevel === 'luxury' ? 8500 : 3500) : (details.budgetLevel === 'luxury' ? 350 : 120);
  const transportTotal = transportPerPerson * travelers;
  const foodTotal = Math.round((food[0].approxPrice * 2.2 * days * travelers));
  const activitiesTotal = Math.round((isINR ? 1800 : 35) * days * travelers * (details.budgetLevel === 'luxury' ? 1.8 : 0.8));
  const localTravelTotal = Math.round((isINR ? 800 : 18) * days * travelers);
  const totalCost = transportTotal + hotelTotal + foodTotal + activitiesTotal + localTravelTotal;

  const userBudget = details.budgetAmount || (isINR ? 45000 : 1500);
  let budgetFitStatus: 'under_budget' | 'on_budget' | 'above_budget' = 'on_budget';
  if (totalCost < userBudget * 0.85) {
    budgetFitStatus = 'under_budget';
  } else if (totalCost > userBudget * 1.15) {
    budgetFitStatus = 'above_budget';
  }

  const budgetBreakdown: BudgetBreakdown = {
    transport: transportTotal,
    hotel: hotelTotal,
    food: foodTotal,
    activities: activitiesTotal,
    localTravel: localTravelTotal,
    totalEstimatedCost: totalCost,
    currency: details.currency || '$',
    budgetFitStatus,
    savingsAdvice: budgetFitStatus === 'above_budget'
      ? `To optimize for your target budget of ${details.currency}${userBudget.toLocaleString()}, consider booking mid-range hotels or taking express public trains.`
      : `Your estimated expenditure fits comfortably within your ${details.currency}${userBudget.toLocaleString()} budget with extra margin for shopping and spontaneous adventures!`
  };

  // Day-by-Day Itinerary generator
  const itinerary: ItineraryDay[] = [
    {
      day: 1,
      title: `Arrival & Getting Settled in ${destClean}`,
      morning: `Arrive at ${destClean}, transfer comfortably to your hotel, unpack and unwind with a refreshing welcome beverage.`,
      afternoon: `Stroll through the vibrant neighborhood near ${hotels[0]?.name || 'your hotel'}, soak in the lively local atmosphere, and grab a light lunch.`,
      evening: `Dine at ${food[0]?.name || 'a recommended local restaurant'} and enjoy a relaxed evening walk along the illuminated streets.`,
      highlight: `First sunset views and authentic introductory local dinner.`
    },
    {
      day: 2,
      title: `Iconic Landmarks & Cultural Wonders`,
      morning: `Early visit to ${places[0]?.name || 'the historic city center'} to capture stunning photos with minimal crowds.`,
      afternoon: `Explore ${places[1]?.name || 'the heritage museum'}, discovering the rich history, artwork, and architecture of ${destClean}.`,
      evening: `Experience the evening atmosphere at ${food[1]?.name || 'the bustling local food market'}, tasting signature street delicacies.`,
      highlight: `Unlocking the iconic architecture and cultural heritage.`
    },
    {
      day: 3,
      title: `Scenic Splendor & Leisure Exploration`,
      morning: `Scenic excursion to ${places[2]?.name || 'the waterfront promenade or nature viewpoints'}, breathing in the scenic breeze.`,
      afternoon: `Visit ${places[3]?.name || 'the panoramic lookout point'}, shop for authentic souvenirs, handicrafts, and local snacks.`,
      evening: `Celebrate the journey with dinner at ${food[2]?.name || 'the rooftop panoramic bistro'} overlooking sparkling night lights.`,
      highlight: `Panoramic vista photography and unforgettable farewell feast.`
    }
  ];

  if (days >= 4) {
    itinerary.push({
      day: 4,
      title: `Hidden Gems & Memorable Departure`,
      morning: `Indulge in a leisurely breakfast, visit a hidden local cafe or quiet botanical park for peaceful reflection.`,
      afternoon: `Last-minute souvenir shopping for local treats and artisanal keepsakes for friends and family.`,
      evening: `Check out from hotel and smooth transit to airport or station for your comfortable journey home.`,
      highlight: `Packing cherished memories and handcrafted mementos.`
    });
  }

  const travelTips = preset?.travelTips || [
    `Download an offline Google Map of ${destClean} and a local transit app before departure.`,
    `Keep small change in the local currency handy for local transport, street markets, and tips.`,
    `Comfortable walking shoes and a portable power bank will keep you energized throughout the day!`
  ];

  return {
    destination: destClean,
    countryOrRegion: preset?.countryOrRegion || `${destClean} Region`,
    tagline: preset?.tagline || `Discover the captivating wonders, vibrant cuisine, and timeless beauty of ${destClean}`,
    heroImage: preset?.heroImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop&q=80',
    bestSeason: preset?.bestSeason || 'Spring through Autumn (Mild temperatures and pleasant skies)',
    currentWeather: preset?.currentWeather || '24°C, Pleasant and Clear',
    hotels,
    food,
    places,
    budgetBreakdown,
    itinerary,
    travelTips,
    source: 'smart_engine',
    generatedAt: new Date().toISOString()
  };
}
