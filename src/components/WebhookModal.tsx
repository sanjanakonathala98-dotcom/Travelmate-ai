import React, { useState } from 'react';
import { X, Check, Globe, RefreshCw, AlertCircle, Sparkles, Terminal, Copy } from 'lucide-react';
import { N8nWebhookConfig } from '../types';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: N8nWebhookConfig;
  onSaveConfig: (newConfig: N8nWebhookConfig) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [isActive, setIsActive] = useState(config.isActive ?? true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    data?: any;
  }>({
    status: config.lastTestedStatus || 'idle',
    message: config.lastTestedMessage || '',
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim()) {
      setTestResult({
        status: 'failed',
        message: 'Please provide a valid n8n Webhook URL.',
      });
      return;
    }

    setTesting(true);
    setTestResult({ status: 'idle', message: 'Pinging n8n webhook...' });

    try {
      const res = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: url.trim(),
          testPayload: {
            event: 'travel_agent_ping',
            name: 'Traveler',
            destination: 'Paris',
            travelers: 2,
            travelDates: { startDate: '2026-10-01', returnDate: '2026-10-06' },
            budget: { level: 'moderate', amount: 2500, currency: '$' },
            transportPreference: 'flight',
            prebookingPreference: { willPrebook: true, categories: ['Hotels', 'Activities'] },
            source: 'TravelMate-AI-Test',
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          status: 'success',
          message: 'Webhook ping successful! n8n responded with HTTP 200 OK.',
          data: data.response,
        });
      } else {
        setTestResult({
          status: 'failed',
          message: data.message || `Webhook returned error (Status: ${res.status})`,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'failed',
        message: err.message || 'Network request failed while contacting webhook.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      url: url.trim(),
      isActive,
      lastTestedStatus: testResult.status,
      lastTestedMessage: testResult.message,
    });
    onClose();
  };

  const samplePayloadString = JSON.stringify(
    {
      name: 'Alex Johnson',
      destination: 'Tokyo',
      travelers: 2,
      travelDates: {
        startDate: '2026-10-15',
        returnDate: '2026-10-21',
      },
      budget: {
        level: 'moderate',
        amount: 3200,
        currency: '$',
      },
      transportPreference: 'flight',
      prebookingPreference: {
        willPrebook: true,
        categories: ['Hotels', 'Tours'],
      },
    },
    null,
    2
  );

  const handleCopySchema = () => {
    navigator.clipboard.writeText(samplePayloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                n8n AI Agent Webhook Integration
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Live Dispatch
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connect your custom n8n travel agent workflow to receive full trip payloads.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Switch & URL input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">
                n8n Webhook Production / Test URL
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span>Enable Webhook Dispatch</span>
              </label>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://your-n8n-instance.com/webhook/travel-agent"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !url}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Test Ping</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              💡 Tip: In n8n, create a <strong>Webhook node</strong> listening to <code className="text-amber-300">POST</code> requests.
            </p>
          </div>

          {/* Test Status Banner */}
          {testResult.message && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${
                testResult.status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : testResult.status === 'failed'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              {testResult.status === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : testResult.status === 'failed' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Terminal className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testResult.message}</p>
                {testResult.data && (
                  <pre className="mt-1 p-2 bg-slate-950/80 rounded-lg text-[11px] overflow-x-auto text-slate-300">
                    {typeof testResult.data === 'string'
                      ? testResult.data
                      : JSON.stringify(testResult.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Fallback Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-1">
                Automatic Dual Fallback Engine
              </p>
              <p className="leading-relaxed text-slate-300">
                Don’t have an n8n webhook handy? No worries! TravelMate AI automatically runs through <strong>Server Gemini AI</strong> and our built-in <strong>Global Smart Travel Engine</strong>. You get rich, personalized recommendations for any destination right away.
              </p>
            </div>
          </div>

          {/* JSON Payload Schema Spec */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Payload Dispatched to n8n Webhook
              </span>
              <button
                type="button"
                onClick={handleCopySchema}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 rounded-2xl text-[11px] text-slate-300 font-mono border border-slate-800 overflow-x-auto leading-relaxed">
              {samplePayloadString}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
