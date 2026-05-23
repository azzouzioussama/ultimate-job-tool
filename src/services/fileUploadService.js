/**
 * ============================================================================
 * FILE: fileUploadService.js
 * PURPOSE: Extracts raw text from PDF and Word (.docx) files in the browser.
 * ============================================================================
 *
 * WHAT IS THIS?
 * When a user uploads their existing CV (as a PDF or Word document), we need
 * to extract the raw text content so we can later convert it to LaTeX via AI.
 *
 * This is done 100% in the browser — NO data is sent to any server.
 * This is critical for user privacy.
 *
 * LIBRARIES USED:
 *   - pdf.js (via 'pdfjs-dist')  → Reads PDF files page by page
 *   - mammoth (via 'mammoth')    → Reads Word (.docx) files
 *
 * HOW TO ADD SUPPORT FOR A NEW FILE FORMAT:
 * 1. Install a library that can parse the format (e.g., xlsx for Excel).
 * 2. Add a new `else if` branch in `extractTextFromFile()`.
 * 3. Return the extracted text as a plain string.
 */

import * as mammoth from 'mammoth';
import { pdfjs } from 'react-pdf';

/**
 * Extract raw text from a PDF or Word document.
 *
 * @param {File} file - A File object from an <input type="file"> element.
 * @returns {Promise<string>} The extracted plain text.
 * @throws {Error} If the file format is unsupported or contains no text.
 */
export async function extractTextFromFile(file) {
  let extractedText;

  if (file.type === 'application/pdf') {
    // ── PDF Extraction ───────────────────────────────────────────────
    // pdf.js reads the PDF page by page and extracts text content items.
    // Each "item" is a text run (a word or phrase) on the page.
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Join all text items on the page with spaces
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\\n\\n';
    }
    extractedText = fullText;

  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    // ── Word (.docx) Extraction ──────────────────────────────────────
    // mammoth reads .docx files and extracts raw text (no formatting).
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    extractedText = result.value;

  } else {
    throw new Error('Format non supporté. Veuillez utiliser un PDF ou un DOCX.');
  }

  // Make sure we actually got some text
  if (!extractedText || !extractedText.trim()) {
    throw new Error('Aucun texte trouvé dans le fichier.');
  }

  return extractedText;
}

/**
 * Build the AI prompt that converts raw extracted text into LaTeX.
 *
 * @param {string} rawText - Plain text extracted from the user's document.
 * @param {string} templateLatex - The base LaTeX template code to use.
 * @returns {string} A prompt instructing the AI to format it as LaTeX using the template.
 */
export function buildLatexConversionPrompt(rawText, templateLatex) {
  return `Voici le texte brut extrait de mon CV non-formaté. 
Je souhaite que tu convertisses ce texte en code LaTeX. 

IMPORTANT : Tu DOIS utiliser la structure, le préambule et la mise en page EXACTE du modèle LaTeX fourni ci-dessous. 
Ne modifie pas les packages, les marges, ou les commandes de sectionnement du modèle. 
Contente-toi de remplacer les données factices du modèle par les informations extraites de mon texte brut.
Échappe correctement les caractères spéciaux LaTeX comme le & en l'écrivant \\& et le % en \\%.
Ne réponds QUE par le code LaTeX complet (commençant par \\documentclass et finissant par \\end{document}). Ne dis absolument rien d'autre.

--- MODÈLE LATEX À UTILISER COMME BASE ---
${templateLatex}

--- TEXTE DU CV À INTÉGRER ---
${rawText}`;
}
