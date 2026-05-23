/**
 * ============================================================================
 * FILE: MyCvTab.jsx
 * PURPOSE: Dual CV editor (Original + Generated) with file upload support.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This tab ("Mon CV") shows two side-by-side LaTeX editors:
 *   1. "CV Original (Source)" — The user's base/master CV.
 *   2. "CV Généré (Adapté)" — The AI-adapted version for a specific job.
 *
 * The user can:
 *   - Type LaTeX directly in either editor
 *   - Import a PDF or Word (.docx) file to auto-extract and convert to LaTeX
 *   - Reset the original CV to the safe synthetic/fake template
 *   - Clear the generated CV
 *
 * PROPS:
 *   - cvOriginal:       The original CV LaTeX text
 *   - onCvOriginalChange: Function to update original CV
 *   - cvGenerated:      The generated CV LaTeX text
 *   - onCvGeneratedChange: Function to update generated CV
 *   - onResetToSynthetic: Function to reset original CV to synthetic template
 *   - onFileUpload:     Function to handle PDF/DOCX file upload
 *   - isUploadingCv:    Boolean, true while upload+conversion is in progress
 */


import { User, Sparkles, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import CV_TEMPLATES from '../../constants/cvTemplates';

export default function MyCvTab({
  cvOriginal,
  onCvOriginalChange,
  cvGenerated,
  onCvGeneratedChange,
  onResetToSynthetic,
  onFileUpload,
  isUploadingCv,
  selectedCvTemplateId,
  onSelectedCvTemplateIdChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Top: Template Selector ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Choisissez votre modèle de base</h2>
          <p className="text-sm text-slate-500">
            Ce modèle sera utilisé pour structurer votre CV lors de l'importation de votre fichier PDF/Word.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CV_TEMPLATES.map((template) => {
            const isSelected = selectedCvTemplateId === template.id;
            return (
              <div
                key={template.id}
                onClick={() => onSelectedCvTemplateIdChange(template.id)}
                className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-indigo-600">
                    <CheckCircle2 size={20} className="fill-indigo-100" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${template.previewColor}`}>
                  <User size={20} className={template.iconColor} />
                </div>
                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {template.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {template.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom: Dual Editors ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Original CV ─────────────────────────────────────────── */}
        <div className="flex flex-col h-[50vh] lg:h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <User size={16} className="text-slate-500" /> CV Original (Source)
              </h2>
              {/* File upload button */}
              <label className="cursor-pointer text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                {isUploadingCv ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {isUploadingCv ? 'Import...' : 'Importer (PDF/Word)'}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onFileUpload}
                  disabled={isUploadingCv}
                />
              </label>
            </div>
            <button
              onClick={onResetToSynthetic}
              className="text-xs text-slate-500 hover:text-red-600 underline"
            >
              Rétablir CV Fake
            </button>
          </div>
          {/* Dark-themed LaTeX editor */}
          <textarea
            className="flex-grow w-full resize-none p-4 text-xs font-mono outline-none custom-scrollbar bg-slate-900 text-slate-100 rounded-b-2xl"
            value={cvOriginal}
            onChange={(e) => onCvOriginalChange(e.target.value)}
          />
        </div>

        {/* ── Right: Generated CV ───────────────────────────────────────── */}
        <div className="flex flex-col h-[50vh] lg:h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-indigo-900">
              <Sparkles size={16} className="text-indigo-600" /> CV Généré (Adapté)
            </h2>
            <button
              onClick={() => onCvGeneratedChange('')}
              className="text-xs text-slate-500 hover:text-red-600 underline"
            >
              Vider
            </button>
          </div>
          {/* Indigo-themed LaTeX editor */}
          <textarea
            className="flex-grow w-full resize-none p-4 text-xs font-mono outline-none custom-scrollbar bg-indigo-950 text-indigo-100 rounded-b-2xl"
            placeholder="Le code LaTeX généré par l'IA sera affiché ici. Utilisez le bouton 'Extraire CV' dans l'onglet Assistant IA."
            value={cvGenerated}
            onChange={(e) => onCvGeneratedChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
