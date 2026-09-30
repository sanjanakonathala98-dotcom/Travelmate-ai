import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Setup Gemini AI Client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Endpoint: Test n8n Webhook
app.post('/api/test-webhook', async (req: Request, res: Response) => {
  const { webhookUrl, testPayload } = req.body;
  if (!webhookUrl || typeof webhookUrl !== 'string') {
    return res.status(400).json({ success: false, message: 'Webhook URL is required' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const sample = testPayload || {
      event: 'test_connection',
      name: 'Traveler',
      destination: 'Paris',
      timestamp: new Date().toISOString(),
    };

    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TravelMate-AI-Agent',
      },
      body: JSON.stringify(sample),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (webhookRes.ok) {
      let data = null;
      try {
        data = await webhookRes.json();
      } catch {
        data = await webhookRes.text();
      }
      return res.json({
        success: true,
        status: webhookRes.status,
        message: 'Successfully connected to n8n webhook!',
        response: data,
      });
    } else {
      return res.status(webhookRes.status).json({
        success: false,
        status: webhookRes.status,
        message: `Webhook returned status HTTP ${webhookRes.status} (${webhookRes.statusText})`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.name === 'AbortError' ? 'Webhook connection timed out (8s limit)' : (err.message || 'Failed to reach webhook'),
    });
  }
});

// 2. Endpoint: Generate AI Travel Plan (n8n Webhook -> Gemini AI -> Smart Engine)
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  const {
    name,
    destination,
    travelers,
    startDate,
    returnDate,
    budget,
    budgetAmount,
    budgetLevel,
    currency,
    transport,
    prebooking,
    n8nWebhookUrl,
  } = req.body;

  if (!destination) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  // Format n8n payload matching user prompt specification
  const n8nPayload = {
    name: name || 'Traveler',
    destination: destination,
    travelers: travelers || 1,
    travelDates: {
      startDate: startDate || new Date().toISOString().split('T')[0],
      returnDate: returnDate || '',
    },
    budget: {
      level: budgetLevel || 'moderate',
      amount: budgetAmount || 1500,
      currency: currency || '$',
      summary: budget || `${currency || '$'}${budgetAmount || 1500}`,
    },
    transportPreference: transport || 'flight',
    prebookingPreference: {
      willPrebook: prebooking?.willPrebook ?? true,
      categories: prebooking?.categories || ['Hotels', 'Activities'],
    },
    timestamp: new Date().toISOString(),
  };

  // Attempt 1: Call n8n Webhook if configured
  if (n8nWebhookUrl && typeof n8nWebhookUrl === 'string' && n8nWebhookUrl.startsWith('http')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TravelMate-AI-Agent',
        },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (n8nResponse.ok) {
        const n8nData = await n8nResponse.json();
        // If n8n returned structured data with hotels or places, return it!
        if (n8nData && (n8nData.hotels || n8nData.places || n8nData.tripPlan)) {
          const plan = n8nData.tripPlan || n8nData;
          return res.json({
            ...plan,
            source: 'n8n_agent',
            webhookDelivered: true,
          });
        }
      }
    } catch (n8nErr) {
      console.warn('n8n webhook call failed or timed out, continuing to Gemini/smart generator fallback:', n8nErr);
    }
  }

  // Attempt 2: Use Gemini API (gemini-3.8-flash)
  if (ai) {
    try {
      const systemInstruction = `You are TravelMate AI's master travel architect. You generate comprehensive, accurate, realistic travel recommendations for ANY destination in the world.
Always return strictly valid JSON matching this schema:
{
  "destination": string,
  "countryOrRegion": string,
  "tagline": string,
  "bestSeason": string,
  "currentWeather": string,
  "heroImage": string (a high quality unsplash photo URL of this destination),
  "hotels": [
    {
      "id": string,
      "name": string,
      "image": string (valid unsplash hotel/resort photo URL),
      "location": string,
      "pricePerNight": number,
      "rating": number (4.2 - 5.0),
      "ratingCount": number,
      "facilities": string[],
      "description": string,
      "tier": "budget" | "moderate" | "luxury",
      "roomType": string
    }
  ],
  "food": [
    {
      "id": string,
      "name": string,
      "image": string (valid unsplash food/restaurant photo URL),
      "location": string,
      "approxPrice": number,
      "cuisine": string,
      "description": string,
      "specialty": string
    }
  ],
  "places": [
    {
      "id": string,
      "name": string,
      "image": string (valid unsplash landmark photo URL),
      "location": string,
      "entryFee": string,
      "bestTime": string,
      "description": string,
      "thingsToDo": string[],
      "approxCost": string,
      "travelTips": string
    }
  ],
  "budgetBreakdown": {
    "transport": number,
    "hotel": number,
    "food": number,
    "activities": number,
    "localTravel": number,
    "totalEstimatedCost": number,
    "currency": string,
    "budgetFitStatus": "under_budget" | "on_budget" | "above_budget",
    "savingsAdvice": string
  },
  "itinerary": [
    {
      "day": number,
      "title": string,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "highlight": string
    }
  ],
  "travelTips": string[]
}`;

      const prompt = `Create a tailored travel plan for:
Traveler Name: ${name || 'Traveler'}
Destination: ${destination}
Number of Travelers: ${travelers || 1}
Dates: ${startDate || 'Upcoming'} to ${returnDate || 'Upcoming'}
Budget Level: ${budgetLevel || 'moderate'} (${currency || '$'}${budgetAmount || 1500} total)
Transport Mode: ${transport || 'flight'}
Pre-booking Preference: ${prebooking?.willPrebook ? 'Wants to pre-book: ' + (prebooking?.categories || []).join(', ') : 'Will book later'}

Provide at least 3 distinct hotels tailored to the budget, 3 authentic food/restaurant spots with specialties, 4 must-visit places with entry fees & tips, a realistic day-by-day itinerary (3 to 5 days), and detailed budget breakdown in currency ${currency || '$'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        return res.json({
          ...parsed,
          source: 'gemini_ai',
          n8nWebhookSent: !!n8nWebhookUrl,
        });
      }
    } catch (geminiErr) {
      console.warn('Gemini generation failed, falling back to smart destination engine:', geminiErr);
    }
  }

  // Attempt 3: Handled by client or fallback response
  return res.json({
    useFallback: true,
    message: 'Generated via Smart Travel Engine',
    n8nWebhookSent: !!n8nWebhookUrl,
  });
});

// 3. Endpoint: AI Travel Concierge Chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, tripContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const latestMessage = messages[messages.length - 1].content;

  if (ai) {
    try {
      const destination = tripContext?.destination || 'their destination';
      const travelers = tripContext?.travelers || 1;
      const budget = tripContext?.budget || 'flexible';
      const transport = tripContext?.transport || 'flight';
      const name = tripContext?.name || 'Traveler';

      const systemInstruction = `You are "TravelMate AI Concierge", a warm, world-wise, and ultra-knowledgeable personal travel companion.
The user is planning a trip to ${destination}.
Context details:
- Traveler: ${name}
- Number of travelers: ${travelers}
- Transport: ${transport}
- Budget: ${budget}
- Travel dates: ${tripContext?.startDate || 'Not set'} to ${tripContext?.returnDate || 'Not set'}

Your guidelines:
1. Provide actionable, concise, friendly answers with helpful emojis.
2. If asked about packing, give a tailored list based on the destination's climate and culture.
3. If asked about food, highlight specific authentic local dishes and neighborhoods.
4. If asked about budget, suggest realistic smart saving hacks without sacrificing the experience.
5. If asked about safety or local etiquette, give respectful cultural insider tips.
6. Keep answers structured with bullet points and bold highlights for effortless readability on mobile screens.`;

      // Construct conversation turns for Gemini
      const conversationHistory = messages.map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'TravelMate AI'}: ${m.content}`).join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${conversationHistory}\n\nUser: ${latestMessage}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I'm here to help you plan every detail of your journey! What else would you like to explore?";
      return res.json({ reply });
    } catch (err: any) {
      console.error('Chat error with Gemini:', err);
    }
  }

  // Fallback chatbot responses if offline
  const dest = tripContext?.destination || 'your destination';
  const queryLower = (latestMessage || '').toLowerCase();

  let fallbackReply = `Great question about traveling to ${dest}! `;
  if (queryLower.includes('pack') || queryLower.includes('clothes') || queryLower.includes('weather')) {
    fallbackReply += `Here are the top packing essentials for ${dest}:\n• Breathable, comfortable layers and walking shoes.\n• Universal power adapter and portable power bank.\n• Modest clothing option for visiting historical or religious sanctuaries.\n• Travel-sized sunscreen, insect repellent, and personal medications.`;
  } else if (queryLower.includes('food') || queryLower.includes('eat') || queryLower.includes('restaurant') || queryLower.includes('dish')) {
    fallbackReply += `When visiting ${dest}, definitely prioritize authentic local dining:\n• Seek out crowded family-run eateries and vibrant street food bazaars where turnover is high and food is freshest.\n• Try signature regional specialties and ask your hotel concierge for their personal favorite hidden gem.\n• Always check whether advance reservations are recommended for top dining spots!`;
  } else if (queryLower.includes('budget') || queryLower.includes('money') || queryLower.includes('cost') || queryLower.includes('save')) {
    fallbackReply += `Here are smart ways to optimize your budget in ${dest}:\n• Use local metro or transit passes instead of hailing individual cabs.\n• Combine a big sit-down lunch with lighter evening street food tastings.\n• Book main museum and landmark tickets online in advance to unlock combination ticket discounts.`;
  } else {
    fallbackReply += `I recommend prioritizing the top cultural landmarks in the morning to beat the crowds, enjoying a relaxing local meal in the afternoon, and catching sunset viewpoints along the waterfront or skyline lookouts. Would you like tips on hotels, transportation, or hidden attractions?`;
  }

  return res.json({ reply: fallbackReply });
});

// Setup Vite middleware in dev or static serving in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`TravelMate AI server running on port ${port}`);
});
