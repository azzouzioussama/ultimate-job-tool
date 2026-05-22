/**
 * ============================================================================
 * FILE: AiAssistantTab.jsx
 * PURPOSE: Displays the AI's response and provides Extract/Copy/Clear actions.
 * ============================================================================
 *
 * WHAT IS THIS?
 * After the user sends a prompt to the AI (via the Prompts tab), the
 * response appears here. The user can:
 *   - Re-run the AI with the "Relancer" button
 *   - Extract the LaTeX code into the "CV Généré" workspace
 *   - Copy the full response to clipboard
 *   - Clear the response
 *
 * If no API key is configured, it shows a helpful guide with links
 * to get API keys from each provider.
 *
 * PROPS:
 *   - aiResponse:    The AI's text response (string)
 *   - isAiLoading:   Boolean, true while waiting for AI
 *   - apiKey:        Current API key (empty string = not configured)
 *   - providerLabel: Human-readable provider name (e.g., "Gemini")
 *   - onRunAI:       Function to trigger AI generation
 *   - onExtractLatex: Function to extract LaTeX from response
 *   - onCopy:        Function to copy text to clipboard
 *   - onClear:       Function to clear the AI response
 */


import { Bot, Sparkles, FileText, Copy, Trash, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import AI_PROVIDERS from '../../constants/aiProviders';

export default function AiAssistantTab({
  aiResponse,
  isAiLoading,
  apiKey,
  providerLabel,
  onRunAI,
  onExtractLatex,
  onCopy,
  onClear,
}) {
  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-900">
          <Bot size={20} className="text-indigo-600" />
          <span className="truncate">Réponse de l'IA ({providerLabel})</span>
        </h2>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Re-run button */}
          <button
            onClick={onRunAI}
            disabled={isAiLoading}
            className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Relancer
          </button>

          {/* Action buttons (only visible when there's a response) */}
          {aiResponse && (
            <>
              <button
                onClick={onExtractLatex}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-colors"
                title="Extraire le code LaTeX et le mettre dans le CV Généré"
              >
                <FileText size={14} /> <span className="hidden sm:inline">Extraire CV</span>
              </button>
              <button
                onClick={() => onCopy(aiResponse)}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <Copy size={14} /> <span className="hidden sm:inline">Copier</span>
              </button>
              <button
                onClick={onClear}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
              >
                <Trash size={14} /> <span className="hidden sm:inline">Effacer</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className="flex-grow p-6 overflow-y-auto bg-slate-50 custom-scrollbar">

        {/* State: No API key configured */}
        {!apiKey && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
            <KeyRound size={48} className="text-slate-300" />
            <div>
              <p className="font-semibold text-slate-700">Clé API Requise</p>
              <p className="text-sm max-w-sm mt-1">Choisissez un fournisseur dans la barre du haut, puis entrez votre clé API.</p>
              <div className="flex flex-col gap-2 mt-4">
                {Object.entries(AI_PROVIDERS).map(([key, p]) => (
                  <a key={key} href={p.keyLink} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center justify-center gap-1">
                    Clé {p.label} ({p.keyNote}) <ExternalLink size={12}/>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State: Loading */}
        {isAiLoading && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-3">
            <Loader2 size={40} className="animate-spin" />
            <p className="text-sm font-medium animate-pulse">L'IA analyse votre profil...</p>
          </div>
        )}

        {/* State: Response ready */}
        {aiResponse && !isAiLoading && (
          <pre className="text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-w-4xl mx-auto">
            {aiResponse}
          </pre>
        )}
      </div>
    </div>
  );
}
