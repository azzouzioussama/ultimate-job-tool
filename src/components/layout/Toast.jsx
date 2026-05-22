/**
 * ============================================================================
 * FILE: Toast.jsx
 * PURPOSE: A small popup notification that appears briefly and auto-hides.
 * ============================================================================
 *
 * WHAT IS THIS?
 * A "toast" is a temporary message that slides in from the top, shows
 * a success/info message (e.g., "Copié !"), and disappears after 3 seconds.
 *
 * This component only handles RENDERING the toast. The auto-hide logic
 * is handled by the useToast hook.
 *
 * PROPS:
 *   - message: The text to display. If empty/null, the toast is hidden.
 */


import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  // Don't render anything if there's no message
  if (!message) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
      <CheckCircle2 size={18} className="text-green-400" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
