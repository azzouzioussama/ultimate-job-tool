/**
 * ============================================================================
 * FILE: Header.jsx
 * PURPOSE: The top navigation bar with app logo, AI provider/model selectors,
 *          and API key input.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This is the sticky header at the very top of the app. It contains:
 *   1. The app name/logo ("Ultimate Job Tool")
 *   2. A dropdown to select the AI provider (Gemini, OpenAI, etc.)
 *   3. A dropdown to select the specific AI model
 *   4. A password input for the API key
 *
 * PROPS (data passed in by the parent App.jsx):
 *   - aiProvider:        Currently selected provider key (e.g., 'gemini')
 *   - aiModel:           Currently selected model id
 *   - apiKey:            Current API key value
 *   - onProviderChange:  Function to call when user picks a new provider
 *   - onModelChange:     Function to call when user picks a new model
 *   - onApiKeyChange:    Function to call when user types in the key field
 */


import { Briefcase, KeyRound } from 'lucide-react';
import AI_PROVIDERS from '../../constants/aiProviders';

export default function Header({
  aiProvider,
  aiModel,
  apiKey,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
}) {
  // Get the human-readable label for the current provider (e.g., "Gemini")
  const providerLabel = AI_PROVIDERS[aiProvider]?.label || aiProvider;

  return (
    <div className="max-w-5xl mx-auto px-4 py-3 sm:h-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">

      {/* ── App Logo & Title ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-indigo-600 w-full sm:w-auto justify-between">
        <div className="flex items-center gap-2">
          <Briefcase size={28} />
          {/* Full title on desktop, short title on mobile */}
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Ultimate Job Tool</h1>
          <h1 className="text-xl font-bold tracking-tight sm:hidden">Job Tool</h1>
        </div>
      </div>

      {/* ── Provider + Model + API Key Selectors ────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">

        {/* Provider Dropdown */}
        <select
          value={aiProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer flex-1 sm:flex-none"
        >
          {Object.entries(AI_PROVIDERS).map(([key, p]) => (
            <option key={key} value={key}>{p.label}</option>
          ))}
        </select>

        {/* Model Dropdown */}
        <select
          value={aiModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer flex-1 sm:flex-none"
        >
          {AI_PROVIDERS[aiProvider]?.models.map(m => (
            <option key={m.id} value={m.id}>{m.label} ({m.note})</option>
          ))}
        </select>

        {/* API Key Input */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 w-full sm:w-auto">
          <KeyRound size={16} className="text-slate-400" />
          <input
            type="password"
            placeholder={`Clé ${providerLabel}...`}
            className="bg-transparent border-none outline-none text-xs w-full sm:w-32 text-slate-700"
            value={apiKey}
            onChange={onApiKeyChange}
          />
        </div>
      </div>
    </div>
  );
}
