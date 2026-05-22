/**
 * ============================================================================
 * FILE: pdfService.js
 * PURPOSE: Compiles LaTeX code into a PDF using the TeXLive.net service.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This service takes a string of LaTeX code and sends it to the public
 * TeXLive.net compilation server. It returns the compiled PDF as a Blob
 * (a binary file object in the browser).
 *
 * HOW DOES THE CORS PROXY WORK?
 * Browsers block direct requests from localhost to texlive.net (CORS).
 * So we use a proxy:
 *   - In development: vite.config.js routes "/api/latex" → texlive.net
 *   - In production:  vercel.json routes "/api/latex" → texlive.net
 *
 * TeXLive also does a 301 redirect to "/latexcgi/document_XYZ.pdf",
 * which is why there's a second proxy rule for "/latexcgi/*".
 *
 * See TROUBLESHOOTING.md for the full history of PDF-related bugs.
 */

/**
 * Compile a LaTeX string into a PDF blob.
 *
 * @param {string} latexContent - The full LaTeX document (from \documentclass to \end{document}).
 * @returns {Promise<Blob>} The compiled PDF as a binary Blob.
 * @throws {Error} If compilation fails (invalid LaTeX, server error, etc.)
 */
export async function compilePdfFromLatex(latexContent) {
  // Build a FormData object (multipart/form-data) as required by the TeXLive CGI
  const formData = new FormData();

  // IMPORTANT: The filename MUST be "document.tex" — TeXLive's CGI is
  // hardcoded to look for this exact name to trigger pdflatex.
  // See TROUBLESHOOTING.md → "filename[] Array Formatting".
  formData.append('filecontents[]', latexContent);
  formData.append('filename[]', 'document.tex');
  formData.append('engine', 'pdflatex');
  formData.append('return', 'pdf');

  // Send to our proxy endpoint (NOT directly to texlive.net)
  const response = await fetch('/api/latex', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur (${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  const blob = await response.blob();

  // If the server returned HTML/text instead of a PDF, that means
  // the LaTeX code had compilation errors. We extract the error text.
  if (!contentType.includes('pdf')) {
    const errorText = await blob.text();
    throw new Error(
      'La compilation a échoué. Vérifiez votre code LaTeX.\n\n' +
      errorText.slice(0, 500)
    );
  }

  return blob;
}

/**
 * Trigger a file download for a PDF blob.
 *
 * Creates a temporary <a> element, clicks it, then removes it.
 * This is the standard browser trick for programmatic downloads.
 *
 * @param {string} blobUrl  - A URL created via URL.createObjectURL(blob).
 * @param {string} filename - The filename to suggest for the download.
 */
export function downloadBlobAsPdf(blobUrl, filename = 'cv_compiled.pdf') {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  a.click();
}
