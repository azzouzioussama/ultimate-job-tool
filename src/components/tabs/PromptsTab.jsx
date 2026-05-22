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
 *   - selectedTemplateId: The id of the currently selected template
 *   - onSelectTemplate:   Function to call when user clicks a strategy
 *   - customPrompt:       The editable prompt text
 *   - onCustomPromptChange: Function to update the editable prompt
 *   - compiledPrompt:     The prompt with {cv_content} and {job_description} replaced
 *   - onCopy:             Function to copy text to clipboard
 *   - onDownload:         Function to download compiled prompt as .txt
 *   - onRunAI:            Function to send the compiled prompt to the AI
 *   - onReset:            Function to reset everything to defaults
 */


import { Settings, Copy, Download, Sparkles, RotateCcw } from 'lucide-react';

export default function PromptsTab({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  customPrompt,
  onCustomPromptChange,
  compiledPrompt,
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
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedTemplateId === t.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-sm text-slate-800">{t.title}</div>
              <div className="text-xs text-slate-500 mt-1">{t.description}</div>
            </button>
          ))}
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
            <button onClick={onDownload} className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600">
              <Download size={14}/> .txt
            </button>
            <button onClick={() => onCopy(compiledPrompt)} className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600">
              <Copy size={14}/> Copier
            </button>
          </div>
        </div>

        {/* Editor + Action Buttons */}
        <div className="p-4 flex-grow flex flex-col gap-4">
          {/* Editable prompt textarea */}
          <textarea
            className="w-full flex-1 resize-none rounded-xl border border-slate-200 p-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
          />

          {/* Bottom action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onCopy(compiledPrompt)}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] border border-slate-200 shadow-sm"
            >
              <Copy size={18} /> Copier (Externe)
            </button>
            <button
              onClick={onRunAI}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md"
            >
              <Sparkles size={18} /> Générer avec l'IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
