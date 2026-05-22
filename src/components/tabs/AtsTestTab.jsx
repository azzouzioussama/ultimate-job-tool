/**
 * ============================================================================
 * FILE: AtsTestTab.jsx
 * PURPOSE: ATS (Applicant Tracking System) compatibility score dashboard.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This tab ("Test ATS") lets the user evaluate how well their CV matches
 * a specific job offer. It sends both to the AI, which acts as a strict
 * ATS system and returns:
 *   - A compatibility score (0–100)
 *   - Missing keywords the CV should include
 *   - Actionable improvement advice
 *
 * PROPS:
 *   - atsResult:       Parsed result object { score, missingKeywords, advice } or null
 *   - isAtsLoading:    Boolean, true while analysis is running
 *   - onRunATS:        Function to trigger the ATS analysis
 *   - canRunATS:       Boolean, true if all prerequisites are met (CV + job offer)
 *   - jobDescription:  Current job description (used for empty state messaging)
 *   - cvGenerated:     Current generated CV (used for empty state messaging)
 *   - cvOriginal:      Current original CV (used for empty state messaging)
 */


import { Activity, Sparkles, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export default function AtsTestTab({
  atsResult,
  isAtsLoading,
  onRunATS,
  canRunATS,
  jobDescription,
  cvGenerated,
  cvOriginal,
}) {
  return (
    <div className="flex flex-col min-h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" /> Testeur ATS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Évaluez la compatibilité entre votre CV et l'offre d'emploi.
          </p>
        </div>
        <button
          onClick={onRunATS}
          disabled={isAtsLoading || !canRunATS}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAtsLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Lancer l'Analyse ATS
        </button>
      </div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className="flex-grow p-6 bg-slate-50">

        {/* Loading State */}
        {isAtsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-indigo-600 space-y-3">
            <Loader2 size={40} className="animate-spin" />
            <p className="text-sm font-medium animate-pulse">L'IA analyse les mots-clés...</p>
          </div>

        /* Results State */
        ) : atsResult ? (
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Score Card ──────────────────────────────────────── */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
              <div className={`text-6xl font-black ${
                atsResult.score >= 80 ? 'text-green-500' :
                atsResult.score >= 60 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {atsResult.score}%
              </div>
              <div className="text-center sm:text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-bold text-slate-800">Score de compatibilité</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Un score supérieur à 80% maximise vos chances de passer les filtres automatiques (ATS) des recruteurs.
                </p>
              </div>
            </div>

            {/* ── Keywords + Advice Grid ──────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Missing Keywords */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-red-500"/> Mots-clés manquants
                </h3>
                {atsResult.missingKeywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 font-medium">
                    Excellent ! Votre CV contient tous les mots-clés essentiels demandés dans l'offre.
                  </p>
                )}
              </div>

              {/* Improvement Advice */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-indigo-500"/> Conseils d'amélioration
                </h3>
                <ul className="space-y-3">
                  {atsResult.advice?.map((adv, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        /* Empty State */
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 max-w-sm">
              {!jobDescription
                ? "Il vous manque une offre d'emploi. Allez dans l'onglet 'Offre'."
                : (!cvGenerated && !cvOriginal)
                  ? "Il vous manque un CV. Allez dans l'onglet 'Mon CV'."
                  : "Cliquez sur 'Lancer l'Analyse ATS' pour évaluer votre CV par rapport à l'offre."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
