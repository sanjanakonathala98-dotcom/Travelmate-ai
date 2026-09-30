import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Trash2, ChevronDown, Compass } from 'lucide-react';
import { TripDetails, ChatMessage, TripPlan } from '../types';

interface ChatbotWidgetProps {
  tripDetails: TripDetails;
  tripPlan: TripPlan | null;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ tripDetails, tripPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when opened
  useEffect(() => {
    if (messages.length === 0) {
      const destination = tripDetails.destination.trim() || 'your dream destination';
      const name = tripDetails.name.trim() || 'there';

      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Hi ${name}! 👋 I'm **TravelMate AI Concierge**.\n\nI'm ready to assist with your trip to **${destination}**! Ask me anything—from packing lists and secret scenic spots to vegetarian food or navigating airport transfers.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [tripDetails.destination, tripDetails.name]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const tripContext = {
        name: tripDetails.name,
        destination: tripDetails.destination,
        travelers: tripDetails.travelers,
        startDate: tripDetails.startDate,
        returnDate: tripDetails.returnDate,
        budget: `${tripDetails.currency}${tripDetails.budgetAmount} (${tripDetails.budgetLevel})`,
        hotel: tripPlan?.hotels?.[0]?.name,
        places: tripPlan?.places?.map(p => p.name).slice(0, 3).join(', '),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          tripContext,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "I'm ready to help with any travel tips, packing lists, or questions!";

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `I'm having a brief connection hitch, but here is a quick tip for ${tripDetails.destination || 'your destination'}: always check local transit options and keep cash/cards handy. How else can I help?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const dest = tripDetails.destination || 'your destination';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How else can I assist with your journey to **${dest}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    `🎒 What should I pack for ${tripDetails.destination || 'my trip'}?`,
    `🍜 Must-try street food & local delicacies?`,
    `💎 3 hidden gems tourists overlook?`,
    `🛡️ Safety & local transport tips?`,
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-bold rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all group select-none"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">AI Travel Concierge</span>
          <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 font-semibold">
            Ask AI
          </span>
        </button>
      )}

      {/* Slide-over Chat Box */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] glass-panel rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-100">TravelMate Concierge</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400" />
                  Destination: <span className="text-amber-300 font-semibold">{tripDetails.destination || 'Global'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.role === 'user' ? 'text-slate-800/80 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1 text-slate-400 font-medium">Concierge thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-slate-900/70 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/80 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about ${tripDetails.destination || 'your trip'}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
