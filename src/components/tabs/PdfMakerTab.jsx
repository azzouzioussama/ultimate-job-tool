/**
 * ============================================================================
 * FILE: PdfMakerTab.jsx
 * PURPOSE: LaTeX-to-PDF compiler with inline viewer (desktop + mobile).
 * ============================================================================
 *
 * WHAT IS THIS?
 * This tab ("PDF Maker") compiles the user's LaTeX CV into a PDF and
 * displays it inline. The user can:
 *   - Choose which CV to compile (Original or Generated)
 *   - Compile the PDF via the TeXLive.net service
 *   - View the result inline (iframe on desktop, react-pdf canvas on mobile)
 *   - Download the PDF
 *
 * MOBILE VS DESKTOP RENDERING:
 * Mobile browsers block PDF blob URLs inside <iframe> tags.
 * To work around this, we detect mobile devices and use react-pdf
 * (Mozilla's pdf.js) to render each page onto HTML <canvas> elements.
 * See TROUBLESHOOTING.md for the full history.
 *
 * PROPS:
 *   - pdfSource:       'generated' or 'original'
 *   - onPdfSourceChange: Function to update source selection
 *   - pdfBlobUrl:      URL.createObjectURL result (or null)
 *   - isPdfLoading:    Boolean, true while compiling
 *   - pdfError:        Error message string (or '')
 *   - onCompile:       Function to trigger PDF compilation
 *   - onDownload:      Function to trigger PDF download
 *   - isMobile:        Boolean, true on mobile devices
 *   - numPages:        Number of pages in the PDF (for react-pdf)
 *   - onDocumentLoadSuccess: Callback when react-pdf loads
 *   - pdfContainerRef: React ref for measuring container width
 *   - pdfContainerWidth: Current container width (for responsive pages)
 */


import { FileOutput, Download, Loader2 } from 'lucide-react';
import { Document, Page } from 'react-pdf';

export default function PdfMakerTab({
  pdfSource,
  onPdfSourceChange,
  pdfBlobUrl,
  isPdfLoading,
  pdfError,
  onCompile,
  onDownload,
  isMobile,
  numPages,
  onDocumentLoadSuccess,
  pdfContainerRef,
  pdfContainerWidth,
}) {
  return (
    <div className="flex flex-col h-auto sm:h-[80vh] min-h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileOutput size={20} className="text-slate-500" /> Générateur PDF
          </h2>
          <p className="text-xs text-slate-500 mt-1">Via les serveurs officiels TeXLive.net</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Source selector: compile Original or Generated CV */}
          <select
            value={pdfSource}
            onChange={(e) => onPdfSourceChange(e.target.value)}
            className="flex-1 sm:flex-none bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="generated">CV Généré</option>
            <option value="original">CV Original</option>
          </select>

          {/* Download button (only visible after compilation) */}
          {pdfBlobUrl && (
            <button onClick={onDownload} className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download size={14} /> <span className="hidden sm:inline">Télécharger PDF</span>
            </button>
          )}

          {/* Compile/Recompile button */}
          <button
            onClick={onCompile}
            disabled={isPdfLoading}
            className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isPdfLoading ? <Loader2 size={14} className="animate-spin" /> : <FileOutput size={14} />}
            {pdfBlobUrl ? 'Recompiler' : 'Compiler le PDF'}
          </button>
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className="flex-grow bg-slate-50 flex flex-col">

        {/* Loading State */}
        {isPdfLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-red-600 space-y-3">
            <Loader2 size={40} className="animate-spin" />
            <p className="text-sm font-medium animate-pulse">Compilation en cours...</p>
            <p className="text-xs text-slate-500">Cela peut prendre quelques secondes</p>
          </div>
        )}

        {/* Error State */}
        {pdfError && !isPdfLoading && (
          <div className="flex-grow flex items-center justify-center p-6">
            <div className="max-w-lg bg-red-50 text-red-800 p-5 rounded-xl border border-red-200 text-sm">
              <strong className="block mb-2 font-bold">❌ Erreur de compilation</strong>
              <pre className="text-xs whitespace-pre-wrap font-mono mt-2 max-h-48 overflow-y-auto">{pdfError}</pre>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {pdfBlobUrl && !isPdfLoading && (
          isMobile ? (
            /* ── Mobile: Canvas-based rendering (react-pdf / pdf.js) ──── */
            /* Mobile browsers block blob: URLs in iframes, so we render
               each page onto a <canvas> element instead. */
            <div ref={pdfContainerRef} className="flex-grow bg-slate-100 p-2">
              <Document
                file={pdfBlobUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="flex items-center justify-center p-8"><Loader2 size={30} className="animate-spin text-red-500" /></div>}
                error={<div className="text-red-600 text-sm p-4">Erreur lors du chargement du PDF.</div>}
              >
                {numPages && Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={pdfContainerWidth ? pdfContainerWidth - 16 : undefined}
                    className="mb-3 shadow-md bg-white"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ))}
              </Document>
            </div>
          ) : (
            /* ── Desktop: Native iframe rendering ─────────────────────── */
            /* Desktop browsers can render blob: URLs in iframes natively,
               which is faster than canvas rendering. */
            <iframe
              src={pdfBlobUrl}
              className="flex-grow w-full border-none"
              title="PDF Preview"
            />
          )
        )}

        {/* Empty State (no PDF yet) */}
        {!pdfBlobUrl && !isPdfLoading && !pdfError && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
              <FileOutput size={48} className="text-slate-300 mx-auto" />
              <div>
                <p className="font-semibold text-slate-700">Compilez votre CV LaTeX en PDF</p>
                <p className="text-sm text-slate-500 mt-2">
                  Votre code LaTeX de l'onglet "Mon CV" sera envoyé au compilateur TeXLive. Le PDF s'affichera ici directement.
                </p>
              </div>
              <button
                onClick={onCompile}
                className="w-full py-4 text-base font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
              >
                <FileOutput size={24} /> Compiler le PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
