/**
 * ============================================================================
 * FILE: latexUtils.js
 * PURPOSE: Utility functions for processing LaTeX code from AI responses.
 * ============================================================================
 *
 * WHAT IS THIS?
 * When the AI generates a CV in LaTeX format, the response is usually
 * wrapped in conversational text ("Here's your updated CV: ...").
 * These utilities extract the pure LaTeX code from that response and
 * fix common AI mistakes.
 *
 * COMMON AI MISTAKES (HALLUCINATIONS):
 * 1. Unescaped '&' characters — LaTeX requires '\&' but AIs write '&'.
 * 2. Mismatched brackets — AIs sometimes write \textbf{text] instead of \textbf{text}.
 * 3. Markdown wrapping — AIs wrap LaTeX in ```latex ... ``` code blocks.
 *
 * See TROUBLESHOOTING.md → "AI Generates Invalid LaTeX" for full details.
 */

/**
 * Extract a complete LaTeX document from an AI response string.
 *
 * The AI's response typically looks like:
 *   "Here is your adapted CV:\n\n\\documentclass[...]{article}\n...\n\\end{document}\n\nI made the following changes..."
 *
 * This function uses a regex to find everything between \documentclass
 * and \end{document} (inclusive) and returns just that LaTeX code.
 *
 * @param {string} responseText - The full AI response text.
 * @returns {string|null} The extracted LaTeX code, or null if none found.
 */
export function extractLatexFromResponse(responseText) {
  // This regex matches from \documentclass to \end{document}
  // [\s\S]*? = any character (including newlines), non-greedy
  const match = responseText.match(/\\documentclass[\s\S]*?\\end\{document\}/);

  if (!match) {
    return null;
  }

  // Auto-fix the most common AI hallucination: unescaped ampersands
  return escapeAmpersands(match[0]);
}

/**
 * Escape unescaped '&' characters in LaTeX code.
 *
 * In LaTeX, a bare '&' is a column separator (used in tables).
 * In regular text, it must be written as '\&'.
 * AIs frequently forget to escape ampersands.
 *
 * The regex uses a "negative lookbehind" (?<!\\) to only match '&'
 * characters that are NOT already preceded by a backslash.
 *
 * Examples:
 *   "Support & Helpdesk"  → "Support \& Helpdesk"  (fixed)
 *   "Support \& Helpdesk" → "Support \& Helpdesk"  (already correct, untouched)
 *
 * @param {string} latex - LaTeX code that may contain unescaped ampersands.
 * @returns {string} LaTeX code with all ampersands properly escaped.
 */
export function escapeAmpersands(latex) {
  return latex.replace(/(?<!\\)&/g, '\\&');
}
