/**
 * ============================================================================
 * FILE: aiProviders.js
 * PURPOSE: Configuration for all supported AI providers and their models.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This object defines every AI provider the app can talk to.
 * For each provider, it lists:
 *   - label:   The human-readable name shown in the UI dropdown.
 *   - models:  An array of available models, each with an id, label, and price note.
 *   - keyLink: A URL where the user can get an API key for this provider.
 *   - keyNote: A short note about pricing (e.g., "Gratuit" or "Payant").
 *
 * HOW TO ADD A NEW AI PROVIDER:
 * 1. Add a new key to the AI_PROVIDERS object below (e.g., "anthropic").
 * 2. Fill in the label, models array, keyLink, and keyNote.
 * 3. Go to `src/services/aiService.js` and add the API endpoint + request
 *    format for your new provider inside the `callAIProvider()` function.
 * 4. That's it — the UI dropdowns in the Header automatically pick up
 *    any new keys in this object.
 *
 * HOW TO REMOVE A PROVIDER:
 * Delete its key from this object and remove its endpoint from aiService.js.
 *
 * HOW TO ADD A NEW MODEL TO AN EXISTING PROVIDER:
 * Add a new object to that provider's `models` array with { id, label, note }.
 */

const AI_PROVIDERS = {
  // ─── OpenRouter ──────────────────────────────────────────────────────
  // OpenRouter is a proxy that routes requests to many different AI models.
  // It offers free tiers for several models, making it great for users
  // who don't want to pay for API access.
  openrouter: {
    label: 'OpenRouter',
    models: [
      { id: 'deepseek/deepseek-v4-flash:free', label: 'DeepSeek V4 Flash', note: 'Gratuit' },
      { id: 'openrouter/free', label: 'Auto (meilleur gratuit)', note: 'Gratuit' },
    ],
    keyLink: 'https://openrouter.ai/keys',
    keyNote: 'Gratuit',
  },

  // ─── Gemini (Google) ─────────────────────────────────────────────────
  // Google's AI models. The 2.5 Flash line is currently free-tier.
  // NOTE: Google deprecated 1.5-flash and 2.0-flash in 2026.
  gemini: {
    label: 'Gemini',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', note: 'Gratuit' },
      { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', note: 'Gratuit' },
    ],
    keyLink: 'https://aistudio.google.com/app/apikey',
    keyNote: 'Gratuit',
  },

  // ─── OpenAI ──────────────────────────────────────────────────────────
  // The classic ChatGPT provider. All models are paid.
  openai: {
    label: 'OpenAI',
    models: [
      { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano', note: '$0.20/M in' },
      { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', note: '$0.75/M in' },
      { id: 'gpt-5.4', label: 'GPT-5.4', note: '$2.50/M in' },
      { id: 'gpt-5.5', label: 'GPT-5.5 (Flagship)', note: '$5.00/M in' },
      { id: 'gpt-5.5-pro', label: 'GPT-5.5 Pro', note: '$30.00/M in' },
      { id: 'o4-mini', label: 'o4-mini (Reasoning)', note: '$0.55/M in' },
      { id: 'o3', label: 'o3 (Reasoning)', note: '$2.00/M in' },
      { id: 'o3-pro', label: 'o3-pro (High Reasoning)', note: '$20.00/M in' },
    ],
    keyLink: 'https://platform.openai.com/api-keys',
    keyNote: 'Payant',
  },

  // ─── DeepSeek ────────────────────────────────────────────────────────
  // DeepSeek's own paid API. For free DeepSeek access, use OpenRouter.
  deepseek: {
    label: 'DeepSeek',
    models: [
      { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', note: '$0.14/M in' },
      { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', note: '$1.74/M in' },
      { id: 'deepseek-chat', label: 'DeepSeek Chat (Legacy)', note: 'Déprécié' },
      { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (Legacy)', note: 'Déprécié' },
    ],
    keyLink: 'https://platform.deepseek.com/api_keys',
    keyNote: 'Payant',
  },
};

export default AI_PROVIDERS;
