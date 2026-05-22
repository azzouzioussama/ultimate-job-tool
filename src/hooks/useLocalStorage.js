/**
 * ============================================================================
 * FILE: useLocalStorage.js
 * PURPOSE: A reusable React hook that auto-saves state to localStorage.
 * ============================================================================
 *
 * WHAT IS THIS?
 * Instead of writing this pattern over and over:
 *
 *   const [value, setValue] = useState(localStorage.getItem('key') || '');
 *   useEffect(() => { localStorage.setItem('key', value); }, [value]);
 *
 * ...you can write:
 *
 *   const [value, setValue] = useLocalStorage('key', '');
 *
 * It works exactly like useState, but automatically reads the initial
 * value from localStorage and saves every change back to localStorage.
 *
 * HOW TO USE:
 *   import { useLocalStorage } from '../hooks/useLocalStorage';
 *   const [name, setName] = useLocalStorage('user_name', 'Default Name');
 *
 * WHY IS THIS BETTER?
 * - Eliminates duplicate useEffect blocks for auto-saving.
 * - If we ever switch from localStorage to IndexedDB, we only change
 *   this hook — every component using it automatically benefits.
 */

import { useState, useEffect } from 'react';

/**
 * A React hook that syncs state with localStorage.
 *
 * @param {string} key          - The localStorage key to read from and write to.
 * @param {string} defaultValue - The default value to use if the key doesn't exist.
 * @returns {[string, Function]} A tuple of [currentValue, setterFunction],
 *                                just like React's useState.
 */
export function useLocalStorage(key, defaultValue = '') {
  // Initialize state from localStorage (or use the default)
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : defaultValue;
  });

  // Every time the value changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
