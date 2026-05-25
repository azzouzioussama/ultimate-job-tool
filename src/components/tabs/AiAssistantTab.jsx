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
 *   - aiResponses:   Array of AI responses (objects with id, title, content, isSelectedForPdf)
 *   - setAiResponses: Function to update the responses array (for toggling selection)
 *   - isAiLoading:   Boolean, true while waiting for AI
 *   - apiKey:        Current API key (empty string = not configured)
 *   - providerLabel: Human-readable provider name (e.g., "Gemini")
 *   - onRunAI:       Function to trigger AI generation
 *   - onExtractLatex: Function to extract LaTeX from selected responses
 *   - onCopy:        Function to copy all text to clipboard
 *   - onClear:       Function to clear the AI responses
 */


import { Bot, Sparkles, FileText, Copy, Trash, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AI_PROVIDERS from '../../constants/aiProviders';

export default function AiAssistantTab({
  aiResponses = [],
  setAiResponses,
  isAiLoading,
  apiKey,
  providerLabel,
  onRunAI,
  onExtractLatex,
  onSaveToDocuments,
  onCopy,
  onClear,
}) {
  const { t } = useTranslation();
  const toggleSelection = (id) => {
    setAiResponses(prev => prev.map(r => r.id === id ? { ...r, isSelectedForPdf: !r.isSelectedForPdf } : r));
  };

  const hasResponses = aiResponses.length > 0;
  const selectedCount = aiResponses.filter(r => r.isSelectedForPdf).length;
  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-900">
          <Bot size={20} className="text-indigo-600" />
          <span className="truncate">{t('ai.title', { provider: providerLabel, defaultValue: `Réponse de l'IA (${providerLabel})` })}</span>
        </h2>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Re-run button */}
          <button
            onClick={onRunAI}
            disabled={isAiLoading}
            className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {t('ai.rerun', 'Relancer')}
          </button>

          {/* Action buttons (only visible when there are responses) */}
          {hasResponses && (
            <>
              <button
                onClick={onExtractLatex}
                disabled={selectedCount === 0}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('ai.compileTooltip', 'Compiler la sélection en PDF et le mettre dans le CV Généré')}
              >
                <FileText size={14} /> <span className="hidden sm:inline">{t('ai.compileSelected', { count: selectedCount, defaultValue: `Extraire CV (${selectedCount})` })}</span>
              </button>
              <button
                onClick={onSaveToDocuments}
                disabled={selectedCount === 0}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('ai.saveDocsTooltip', 'Sauvegarder les réponses sélectionnées dans l\'onglet Documents')}
              >
                <FileText size={14} /> <span className="hidden sm:inline">{t('ai.saveDocs', { count: selectedCount, defaultValue: `Sauvegarder Doc(s) (${selectedCount})` })}</span>
              </button>
              <button
                onClick={() => onCopy(aiResponses.map(r => r.content).join('\n\n---\n\n'))}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <Copy size={14} /> <span className="hidden sm:inline">{t('ai.copyAll', 'Tout Copier')}</span>
              </button>
              <button
                onClick={onClear}
                className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
              >
                <Trash size={14} /> <span className="hidden sm:inline">{t('ai.clearAll', 'Tout Effacer')}</span>
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
              <p className="font-semibold text-slate-700">{t('ai.keyRequired', 'Clé API Requise')}</p>
              <p className="text-sm max-w-sm mt-1">{t('ai.keyDesc', 'Choisissez un fournisseur dans la barre du haut, puis entrez votre clé API.')}</p>
              <div className="flex flex-col gap-2 mt-4">
                {Object.entries(AI_PROVIDERS).map(([key, p]) => (
                  <a key={key} href={p.keyLink} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center justify-center gap-1">
                    {t('ai.keyLink', { provider: p.label, note: p.keyNote, defaultValue: `Clé ${p.label} (${p.keyNote})` })} <ExternalLink size={12}/>
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
            <p className="text-sm font-medium animate-pulse">{t('ai.analyzing', "L'IA analyse votre profil...")}</p>
          </div>
        )}

        {/* State: Response ready */}
        {hasResponses && !isAiLoading && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {aiResponses.map(resp => (
              <div key={resp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={resp.isSelectedForPdf}
                      onChange={() => toggleSelection(resp.id)}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      title={t('ai.includeInPdf', 'Inclure dans la compilation PDF')}
                    />
                    <span className="font-semibold text-sm text-slate-700">{resp.title}</span>
                  </div>
                  <button onClick={() => onCopy(resp.content)} className="text-slate-400 hover:text-indigo-600">
                    <Copy size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <pre className="text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {resp.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
