/**
 * ============================================================================
 * FILE: PromptsTab.jsx
 * PURPOSE: The main prompt strategy selector and editor view.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This is the first tab ("Prompts") — the central hub of the app.
 * Left column: A scrollable list of 10 prompt strategies to choose from.
 * Right column: An editor where the user can customize the prompt template,
 *               plus buttons to copy, download, or send it to the AI.
 *
 * PROPS:
 *   - templates:          Array of prompt template objects from promptTemplates.js
 *   - selectedTemplateIds: Array of currently selected template ids
 *   - onSelectTemplate:   Function to toggle a strategy selection
 *   - customPrompts:      Object mapping templateId to its current editable text
 *   - onCustomPromptChange: Function to update the editable prompt for a template
 *   - getCompiledPrompt:  Function to compile a prompt with current CV and job text
 *   - onCopy:             Function to copy text to clipboard
 *   - onDownload:         Function to download prompt as .txt
 *   - onRunAI:            Function to send the compiled prompts to the AI
 *   - onReset:            Function to reset everything to defaults
 */


import { Settings, Copy, Download, Sparkles, RotateCcw } from 'lucide-react';

export default function PromptsTab({
  templates,
  selectedTemplateIds = [],
  onSelectTemplate,
  customPrompts = {},
  onCustomPromptChange,
  getCompiledPrompt,
  onCopy,
  onDownload,
  onRunAI,
  onReset,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Left Column: Strategy Selector ────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[70vh]">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Settings size={20} className="text-indigo-600" /> Choisir une stratégie
        </h2>
        <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {templates.map(t => {
            const isSelected = selectedTemplateIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onSelectTemplate(t.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="mt-1">
                  <input type="checkbox" checked={isSelected} readOnly className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800">{t.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{t.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Column: Prompt Editor ───────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[70vh]">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="font-semibold text-sm">Éditeur de Prompt</span>
          <div className="flex items-center gap-2">
            <button onClick={onReset} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600" title="Réinitialiser tout">
              <RotateCcw size={14}/> Reset
            </button>
          </div>
        </div>

        {/* Editor + Action Buttons */}
        <div className="p-4 flex-grow flex flex-col gap-4 overflow-hidden">
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {selectedTemplateIds.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Veuillez sélectionner au moins une stratégie.
              </div>
            ) : (
              selectedTemplateIds.map(id => {
                const template = templates.find(t => t.id === id);
                if (!template) return null;
                const promptText = customPrompts[id] || template.content;
                const compiled = getCompiledPrompt(promptText);

                return (
                  <div key={id} className="flex flex-col gap-2 border border-slate-100 rounded-xl p-3 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-600">{template.title}</span>
                      <div className="flex gap-2">
                        <button onClick={() => onDownload(compiled, id)} className="text-slate-400 hover:text-indigo-600" title="Télécharger">
                          <Download size={14} />
                        </button>
                        <button onClick={() => onCopy(compiled)} className="text-slate-400 hover:text-indigo-600" title="Copier">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      className="w-full resize-none rounded-lg border border-slate-200 p-2 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                      value={promptText}
                      onChange={(e) => onCustomPromptChange(id, e.target.value)}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom action buttons */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                const compiledAll = selectedTemplateIds.map(id => getCompiledPrompt(customPrompts[id] || templates.find(t => t.id === id)?.content)).join('\n\n---\n\n');
                onCopy(compiledAll);
              }}
              disabled={selectedTemplateIds.length === 0}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] border border-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy size={18} /> Copier Tout (Externe)
            </button>
            <button
              onClick={onRunAI}
              disabled={selectedTemplateIds.length === 0}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={18} /> Générer ({selectedTemplateIds.length}) avec l'IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
