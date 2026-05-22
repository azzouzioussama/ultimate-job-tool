/**
 * ============================================================================
 * FILE: storageService.js
 * PURPOSE: Centralized helper for all localStorage read/write operations.
 * ============================================================================
 *
 * WHAT IS THIS?
 * Instead of scattering `localStorage.getItem('some_key')` calls all over
 * the codebase, we centralize them here. Every piece of data the app saves
 * to the browser's local storage goes through this file.
 *
 * WHY IS THIS USEFUL?
 * 1. If we ever want to swap localStorage for a real database (like
 *    IndexedDB/Dexie or Supabase), we only change THIS file.
 * 2. Typos in key names are caught in one place, not spread across 20 files.
 * 3. Junior developers can see at a glance what data the app persists.
 *
 * NOTE ON SECURITY:
 * API keys are stored in localStorage. Since this is a fully client-side
 * app with no server, this is acceptable — but users should be warned
 * not to share their screen while keys are visible.
 * TODO(security): Consider encrypting API keys in localStorage.
 */

// ─── Storage Key Constants ────────────────────────────────────────────────────
// Using constants prevents typos. If you need a new key, add it here.
const KEYS = {
  JOB_DESCRIPTION: 'job_description',
  CV_ORIGINAL: 'cv_original',
  CV_CONTENT_LEGACY: 'cv_content',    // Old key name, kept for migration
  CV_GENERATED: 'cv_generated',
  AI_RESPONSE: 'ai_response',
  AI_PROVIDER: 'ai_provider',
  AI_MODEL: 'ai_model',              // Generic key (deprecated but kept for compat)
  SCRAPER_TYPE: 'scraper_type',
  SCRAPFLY_KEY: 'scrapfly_key',
};

// ─── Generic Helpers ──────────────────────────────────────────────────────────

/**
 * Read a value from localStorage.
 * @param {string} key   - The storage key to read.
 * @param {string} fallback - Value to return if key doesn't exist (default: '').
 * @returns {string} The stored value, or the fallback.
 */
export function getItem(key, fallback = '') {
  return localStorage.getItem(key) ?? fallback;
}

/**
 * Write a value to localStorage.
 * @param {string} key   - The storage key to write.
 * @param {string} value - The value to store.
 */
export function setItem(key, value) {
  localStorage.setItem(key, value);
}

// ─── Job Description ──────────────────────────────────────────────────────────

export function getJobDescription() {
  return getItem(KEYS.JOB_DESCRIPTION);
}

export function saveJobDescription(text) {
  setItem(KEYS.JOB_DESCRIPTION, text);
}

// ─── CV Data ──────────────────────────────────────────────────────────────────

/**
 * Load the user's original CV from storage.
 * Falls back to the legacy 'cv_content' key for users who saved data
 * before the key was renamed.
 */
export function getCvOriginal() {
  return getItem(KEYS.CV_ORIGINAL) || getItem(KEYS.CV_CONTENT_LEGACY);
}

export function saveCvOriginal(latex) {
  setItem(KEYS.CV_ORIGINAL, latex);
}

export function getCvGenerated() {
  return getItem(KEYS.CV_GENERATED);
}

export function saveCvGenerated(latex) {
  setItem(KEYS.CV_GENERATED, latex);
}

// ─── AI Configuration ─────────────────────────────────────────────────────────

/**
 * Get the API key for a specific AI provider.
 * Each provider has its own storage slot (e.g., "api_key_gemini").
 * @param {string} provider - Provider key (e.g., "gemini", "openai").
 * @returns {string} The stored API key, or empty string.
 */
export function getApiKey(provider) {
  return getItem(`api_key_${provider}`);
}

/**
 * Save the API key for a specific AI provider.
 * @param {string} provider - Provider key.
 * @param {string} key      - The API key string.
 */
export function saveApiKey(provider, key) {
  setItem(`api_key_${provider}`, key);
}

export function getAiProvider() {
  return getItem(KEYS.AI_PROVIDER, 'gemini');
}

export function saveAiProvider(provider) {
  setItem(KEYS.AI_PROVIDER, provider);
}

/**
 * Get the selected model for a specific provider.
 * @param {string} provider - Provider key.
 * @returns {string|null} The model id, or null if never set.
 */
export function getAiModel(provider) {
  return localStorage.getItem(`ai_model_${provider}`);
}

/**
 * Save the selected model for a specific provider.
 * Also saves to the generic 'ai_model' key for backward compat.
 */
export function saveAiModel(provider, model) {
  setItem(`ai_model_${provider}`, model);
  setItem(KEYS.AI_MODEL, model);
}

// ─── AI Response ──────────────────────────────────────────────────────────────

export function getAiResponse() {
  return getItem(KEYS.AI_RESPONSE);
}

export function saveAiResponse(text) {
  setItem(KEYS.AI_RESPONSE, text);
}

// ─── Scraper ──────────────────────────────────────────────────────────────────

export function getScraperType() {
  return getItem(KEYS.SCRAPER_TYPE, 'jina');
}

export function saveScraperType(type) {
  setItem(KEYS.SCRAPER_TYPE, type);
}

export function getScrapflyKey() {
  return getItem(KEYS.SCRAPFLY_KEY);
}

export function saveScrapflyKey(key) {
  setItem(KEYS.SCRAPFLY_KEY, key);
}
