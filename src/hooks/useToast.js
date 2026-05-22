/**
 * ============================================================================
 * FILE: useToast.js
 * PURPOSE: A reusable React hook for showing temporary notification messages.
 * ============================================================================
 *
 * WHAT IS THIS?
 * A "toast" is a small popup message that appears briefly (e.g., "Copied!")
 * and then disappears automatically after a few seconds.
 *
 * This hook manages the toast state so any component in the app can
 * trigger a notification by calling showToast('Your message here').
 *
 * HOW TO USE:
 *   import { useToast } from '../hooks/useToast';
 *   const { toastMessage, showToast } = useToast();
 *
 *   // Show a message (auto-hides after 3 seconds):
 *   showToast('Copié dans le presse-papiers !');
 *
 *   // Render it in your JSX:
 *   {toastMessage && <Toast message={toastMessage} />}
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing toast notification state.
 *
 * @param {number} duration - How long the toast stays visible (in milliseconds).
 *                            Default: 3000ms (3 seconds).
 * @returns {{ toastMessage: string, showToast: Function }}
 */
export function useToast(duration = 3000) {
  const [toastMessage, setToastMessage] = useState('');

  /**
   * Display a toast message. It will automatically disappear
   * after the configured duration.
   *
   * @param {string} message - The text to display in the toast.
   */
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  }, [duration]);

  return { toastMessage, showToast };
}
