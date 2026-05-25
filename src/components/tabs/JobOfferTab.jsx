/**
 * ============================================================================
 * FILE: JobOfferTab.jsx
 * PURPOSE: Text area for the job description + URL scraper controls.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This tab ("Offre") is where the user provides the target job description.
 * They can either:
 *   1. Paste the job text manually into the textarea, or
 *   2. Paste a URL and click "Extraire" to auto-scrape the job posting.
 *
 * The scraper bar supports two services:
 *   - Jina AI (free, but noisy — we clean the output)
 *   - Scrapfly (paid API key, but cleaner structured extraction)
 *
 * PROPS:
 *   - jobDescription:      Current job description text
 *   - onJobDescriptionChange: Function to update the text
 *   - jobUrl:              Current URL in the scraper input
 *   - onJobUrlChange:      Function to update the URL
 *   - scraperType:         'jina' or 'scrapfly'
 *   - onScraperTypeChange: Function to update scraper choice
 *   - onScrape:            Function to trigger scraping
 *   - isScraping:          Boolean, true while scraping is in progress
 *   - onClear:             Function to clear the job description
 */


import { FileText, Download, Trash, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function JobOfferTab({
  jobDescription,
  onJobDescriptionChange,
  jobUrl,
  onJobUrlChange,
  scraperType,
  onScraperTypeChange,
  onScrape,
  isScraping,
  onClear,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText size={20} className="text-slate-500" /> {t('job.title', "Description de l'Offre")}
        </h2>
        <button
          onClick={onClear}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 border border-slate-200 px-2 py-1 rounded-md bg-white"
        >
          <Trash size={14}/> {t('job.clear', 'Effacer')}
        </button>
      </div>

      {/* ── Scraper Bar ───────────────────────────────────────────────── */}
      <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 flex flex-col sm:flex-row gap-2 items-center">

        {/* Scraper type selector */}
        <select
          value={scraperType}
          onChange={(e) => onScraperTypeChange(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="jina">{t('job.jina', 'Jina AI (Gratuit)')}</option>
          <option value="scrapfly">{t('job.scrapfly', 'Scrapfly (Clé API)')}</option>
        </select>

        {/* URL input */}
        <input
          type="text"
          placeholder={t('job.urlPlaceholder', "Coller l'URL de l'offre pour l'extraire")}
          className="flex-grow w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={jobUrl}
          onChange={(e) => {
            const val = e.target.value;
            // Extract URL if the user pasted extra text (e.g. from mobile app share)
            const urlMatch = val.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
            if (urlMatch) {
              onJobUrlChange(urlMatch[0]);
            } else {
              onJobUrlChange(val);
            }
          }}
        />

        {/* Extract button */}
        <button
          onClick={onScrape}
          disabled={isScraping || !jobUrl}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isScraping ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {t('job.extract', 'Extraire')}
        </button>
      </div>

      {/* ── Job Description Textarea ──────────────────────────────────── */}
      <textarea
        className="flex-grow w-full resize-none p-6 text-sm outline-none custom-scrollbar"
        placeholder={t('job.placeholder', "Le texte de l'offre apparaîtra ici. Vous pouvez aussi le coller manuellement, ou coller directement l'URL de l'offre si vous utilisez une IA qui a accès à internet.")}
        value={jobDescription}
        onChange={(e) => onJobDescriptionChange(e.target.value)}
      />
    </div>
  );
}
