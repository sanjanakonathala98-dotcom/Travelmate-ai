export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export interface TripDetails {
  name: string;
  destination: string;
  travelers: number;
  startDate: string;
  returnDate: string;
  budgetLevel: BudgetLevel;
  budgetAmount: number;
  currency: string;
}

export type TransportType = 'flight' | 'train' | 'bus' | 'car' | 'ferry';

export interface TransportOption {
  id: TransportType;
  title: string;
  icon: string;
  estimatedTime: string;
  approxCostPerPerson: number;
  approxTotalCost: number;
  description: string;
  tag?: string;
  available: boolean;
}

export interface PrebookingPreferences {
  willPrebook: boolean;
  categories: ('Hotels' | 'Transport' | 'Activities' | 'Tours')[];
}

export interface HotelRecommendation {
  id: string;
  name: string;
  image: string;
  location: string;
  pricePerNight: number;
  rating: number;
  ratingCount: number;
  facilities: string[];
  description: string;
  tier: BudgetLevel;
  roomType: string;
}

export interface FoodRecommendation {
  id: string;
  name: string;
  image: string;
  location: string;
  approxPrice: number;
  cuisine: string;
  description: string;
  specialty: string;
}

export interface PlaceToVisit {
  id: string;
  name: string;
  image: string;
  location: string;
  entryFee: string;
  bestTime: string;
  description: string;
  thingsToDo: string[];
  approxCost: string;
  travelTips: string;
}

export interface BudgetBreakdown {
  transport: number;
  hotel: number;
  food: number;
  activities: number;
  localTravel: number;
  totalEstimatedCost: number;
  currency: string;
  budgetFitStatus: 'under_budget' | 'on_budget' | 'above_budget';
  savingsAdvice?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlight: string;
}

export interface TripPlan {
  destination: string;
  countryOrRegion: string;
  tagline: string;
  heroImage: string;
  bestSeason: string;
  currentWeather: string;
  hotels: HotelRecommendation[];
  food: FoodRecommendation[];
  places: PlaceToVisit[];
  budgetBreakdown: BudgetBreakdown;
  itinerary: ItineraryDay[];
  travelTips: string[];
  source: 'n8n_agent' | 'gemini_ai' | 'smart_engine';
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface N8nWebhookConfig {
  url: string;
  isActive: boolean;
  lastTestedStatus?: 'success' | 'failed' | 'idle';
  lastTestedMessage?: string;
}
