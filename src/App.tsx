import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebhookModal } from './components/WebhookModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { HotelDetailModal } from './components/HotelDetailModal';
import { Footer } from './components/Footer';

// Pages 1 to 7
import { Page1TripDetails } from './components/pages/Page1TripDetails';
import { Page2Transport } from './components/pages/Page2Transport';
import { Page3Prebooking } from './components/pages/Page3Prebooking';
import { Page4Recommendations } from './components/pages/Page4Recommendations';
import { Page5DestinationDetails } from './components/pages/Page5DestinationDetails';
import { Page6MyTripPlan } from './components/pages/Page6MyTripPlan';
import { Page7ThankYou } from './components/pages/Page7ThankYou';

import {
  TripDetails,
  TransportType,
  PrebookingPreferences,
  TripPlan,
  HotelRecommendation,
  N8nWebhookConfig,
} from './types';
import { getTransportOptions, generateDynamicTravelPlan } from './data/destinationsData';

export default function App() {
  // Step state (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);

  // Trip Configuration state
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    name: 'Alex Johnson',
    destination: 'Goa',
    travelers: 2,
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    budgetLevel: 'moderate',
    budgetAmount: 2200,
    currency: '$',
  });

  const [selectedTransport, setSelectedTransport] = useState<TransportType>('flight');
  const [prebooking, setPrebooking] = useState<PrebookingPreferences>({
    willPrebook: true,
    categories: ['Hotels', 'Activities'],
  });

  // Generated Plan & Selected Hotel
  const [tripPlan, setTripPlan] = useState<TripPlan>(() => generateDynamicTravelPlan(tripDetails));
  const [activeHotelModal, setActiveHotelModal] = useState<HotelRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // n8n Webhook configuration
  const [webhookModalOpen, setWebhookModalOpen] = useState<boolean>(false);
  const [webhookConfig, setWebhookConfig] = useState<N8nWebhookConfig>({
    url: '',
    isActive: true,
    lastTestedStatus: 'idle',
  });

  // Keep transport options in sync with destination, travelers, and currency
  const transportOptions = getTransportOptions(
    tripDetails.destination,
    tripDetails.travelers,
    tripDetails.currency,
    tripDetails.budgetLevel
  );

  // Update trip plan dynamically whenever trip details change
  useEffect(() => {
    if (currentStep <= 3) {
      const generated = generateDynamicTravelPlan(tripDetails);
      setTripPlan(generated);
    }
  }, [tripDetails.destination, tripDetails.budgetLevel, tripDetails.budgetAmount, tripDetails.currency, tripDetails.travelers]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const advanceToStep = (nextStep: number) => {
    setMaxStepReached(prev => Math.max(prev, nextStep));
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when moving from Page 3 to Page 4: Dispatches to n8n Webhook / Gemini AI
  const handleGenerateAndGoToRecommendations = async () => {
    setIsGenerating(true);

    try {
      const payload = {
        name: tripDetails.name,
        destination: tripDetails.destination,
        travelers: tripDetails.travelers,
        startDate: tripDetails.startDate,
        returnDate: tripDetails.returnDate,
        budget: `${tripDetails.currency}${tripDetails.budgetAmount} (${tripDetails.budgetLevel})`,
        budgetAmount: tripDetails.budgetAmount,
        budgetLevel: tripDetails.budgetLevel,
        currency: tripDetails.currency,
        transport: selectedTransport,
        prebooking: prebooking,
        n8nWebhookUrl: webhookConfig.isActive ? webhookConfig.url : undefined,
      };

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.hotels && data.places && !data.useFallback) {
          setTripPlan(data);
        } else {
          // Dynamic generator fallback
          const localPlan = generateDynamicTravelPlan(tripDetails);
          setTripPlan(localPlan);
        }
      } else {
        const localPlan = generateDynamicTravelPlan(tripDetails);
        setTripPlan(localPlan);
      }
    } catch (err) {
      console.warn('API call encountered error, falling back to local travel engine:', err);
      const localPlan = generateDynamicTravelPlan(tripDetails);
      setTripPlan(localPlan);
    } finally {
      setIsGenerating(false);
      advanceToStep(4);
    }
  };

  const handlePlanAgain = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToHome = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Top Header with Brand & 7-step Progress Bar */}
      <Header
        currentStep={currentStep}
        totalSteps={7}
        onStepClick={handleStepChange}
        maxStepReached={maxStepReached}
        onOpenWebhookModal={() => setWebhookModalOpen(true)}
        webhookConfig={webhookConfig}
        currency={tripDetails.currency}
        onCurrencyChange={(curr) => setTripDetails(prev => ({ ...prev, currency: curr }))}
      />

      {/* Main Content Area based on currentStep */}
      <main className="flex-1 w-full">
        {currentStep === 1 && (
          <Page1TripDetails
            details={tripDetails}
            onChangeDetails={(updated) => setTripDetails(prev => ({ ...prev, ...updated }))}
            onNext={() => advanceToStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Page2Transport
            destination={tripDetails.destination}
            selectedTransport={selectedTransport}
            transportOptions={transportOptions}
            currency={tripDetails.currency}
            travelers={tripDetails.travelers}
            onSelectTransport={setSelectedTransport}
            onNext={() => advanceToStep(3)}
            onBack={() => handleStepChange(1)}
          />
        )}

        {currentStep === 3 && (
          <Page3Prebooking
            destination={tripDetails.destination}
            preferences={prebooking}
            onChangePreferences={setPrebooking}
            onNext={handleGenerateAndGoToRecommendations}
            onBack={() => handleStepChange(2)}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 4 && (
          <Page4Recommendations
            plan={tripPlan}
            details={tripDetails}
            onOpenHotelModal={(hotel) => setActiveHotelModal(hotel)}
            onNext={() => advanceToStep(5)}
            onBack={() => handleStepChange(3)}
            onJumpToTripPlan={() => advanceToStep(6)}
          />
        )}

        {currentStep === 5 && (
          <Page5DestinationDetails
            plan={tripPlan}
            details={tripDetails}
            onNext={() => advanceToStep(6)}
            onBack={() => handleStepChange(4)}
          />
        )}

        {currentStep === 6 && (
          <Page6MyTripPlan
            plan={tripPlan}
            details={tripDetails}
            selectedTransport={selectedTransport}
            prebooking={prebooking}
            selectedHotel={activeHotelModal}
            onFinishAndThankYou={() => advanceToStep(7)}
            onPlanAgain={handlePlanAgain}
            onReturnToHome={handleReturnToHome}
          />
        )}

        {currentStep === 7 && (
          <Page7ThankYou
            details={tripDetails}
            plan={tripPlan}
            onPlanAnotherTrip={handlePlanAgain}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onGoToStep={handleStepChange}
        onOpenWebhookModal={() => setWebhookModalOpen(true)}
      />

      {/* Floating AI Travel Concierge Chatbot Widget */}
      <ChatbotWidget
        tripDetails={tripDetails}
        tripPlan={tripPlan}
      />

      {/* Hotel Detail View Modal */}
      <HotelDetailModal
        hotel={activeHotelModal}
        currency={tripDetails.currency}
        onClose={() => setActiveHotelModal(null)}
        onSelectHotel={(hotel) => setActiveHotelModal(hotel)}
        isSelected={activeHotelModal?.id === tripPlan.hotels[0]?.id}
      />

      {/* n8n Webhook Configuration Modal */}
      <WebhookModal
        isOpen={webhookModalOpen}
        onClose={() => setWebhookModalOpen(false)}
        config={webhookConfig}
        onSaveConfig={setWebhookConfig}
      />
    </div>
  );
}
