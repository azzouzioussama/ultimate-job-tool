/**
 * ============================================================================
 * FILE: aiService.js
 * PURPOSE: Handles all communication with AI providers (Gemini, OpenAI, etc.)
 * ============================================================================
 *
 * WHAT IS THIS?
 * This service sends the user's compiled prompt to whichever AI provider
 * they've selected and returns the AI's text response.
 *
 * It supports 4 providers:
 *   1. Gemini (Google)  — uses a unique request/response format
 *   2. OpenAI           — uses the standard chat completions format
 *   3. DeepSeek         — also uses the OpenAI-compatible format
 *   4. OpenRouter       — also uses the OpenAI-compatible format
 *
 * WHY IS THIS A SEPARATE FILE?
 * By isolating the AI API logic here, the rest of the app doesn't need to
 * know anything about HTTP requests, API formats, or error handling.
 * If the scraper breaks, the AI still works. If the AI breaks, the PDF
 * compiler still works.
 *
 * HOW TO ADD A NEW AI PROVIDER:
 * 1. Add the provider config to `src/constants/aiProviders.js`.
 * 2. In the `callAIProvider` function below:
 *    a. If it uses the OpenAI-compatible format, just add its endpoint URL
 *       to the `endpoints` object.
 *    b. If it uses a unique format (like Gemini), add a new `if` branch.
 */

/**
 * Send a prompt to the specified AI provider and get the response.
 *
 * @param {Object} options
 * @param {string} options.provider   - Provider key: 'gemini', 'openai', 'deepseek', or 'openrouter'.
 * @param {string} options.model      - Model id (e.g., 'gemini-2.5-flash', 'gpt-5.4-mini').
 * @param {string} options.apiKey     - The user's API key for the chosen provider.
 * @param {string} options.promptText - The full compiled prompt to send.
 * @param {AbortSignal} [options.signal] - Optional AbortSignal for cancellation/timeout.
 *
 * @returns {Promise<string>} The AI's text response.
 * @throws {Error} If the API returns an error or the request fails.
 */
export async function callAIProvider({ provider, model, apiKey, promptText, signal }) {

  // ── Gemini uses its own unique API format ───────────────────────────
  // Google's Generative Language API expects a different request body
  // structure than the OpenAI standard.
  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    const data = await response.json();

    // Gemini puts errors in data.error instead of using HTTP status codes
    if (data.error) {
      throw new Error(data.error.message || 'Erreur API Gemini');
    }

    // Gemini wraps the response in: candidates[0].content.parts[0].text
    return data.candidates[0].content.parts[0].text;
  }

  // ── All other providers use the OpenAI-compatible format ────────────
  // OpenAI, DeepSeek, and OpenRouter all accept the same request body:
  //   { model: "...", messages: [{ role: "user", content: "..." }] }
  // The only difference is the endpoint URL.

  const endpoints = {
    openai: 'https://api.openai.com/v1/chat/completions',
    deepseek: 'https://api.deepseek.com/chat/completions',
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  };

  const endpoint = endpoints[provider];
  if (!endpoint) {
    throw new Error(`Fournisseur IA inconnu: "${provider}". Vérifiez aiProviders.js.`);
  }

  // Build the request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  // OpenRouter requires extra headers to identify the calling app
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Ultimate Job Tool';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || `Erreur API ${provider}`);
  }

  // OpenAI-format puts the response in: choices[0].message.content
  return data.choices[0].message.content;
}
