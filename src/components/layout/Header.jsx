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


import { Briefcase, KeyRound, Globe, User } from 'lucide-react';
import { UserButton } from '@clerk/react';
import { useTranslation } from 'react-i18next';
import AI_PROVIDERS from '../../constants/aiProviders';

const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Lazy component that only loads Clerk when available
function ClerkUserButton() {
  return (
    <div className="ml-1 flex items-center justify-center">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default function Header({
  aiProvider,
  aiModel,
  apiKey,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onOpenProfile
}) {
  const { t, i18n } = useTranslation();

  // Get the human-readable label for the current provider (e.g., "Gemini")
  const providerLabel = AI_PROVIDERS[aiProvider]?.label || aiProvider;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

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

        {/* Language Dropdown */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1.5 border border-slate-200">
          <Globe size={14} className="text-slate-500" />
          <select
            value={i18n.language || 'fr'}
            onChange={handleLanguageChange}
            className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>

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
            placeholder={t('header.apiKeyPlaceholder', { provider: providerLabel, defaultValue: `Clé ${providerLabel}...` })}
            className="bg-transparent border-none outline-none text-xs w-full sm:w-32 text-slate-700"
            value={apiKey}
            onChange={onApiKeyChange}
          />
        </div>

        {isClerkAvailable && <ClerkUserButton />}
        
        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="ml-1 p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center justify-center"
          title="Mon Profil"
        >
          <User size={20} />
        </button>
      </div>
    </div>
  );
}
