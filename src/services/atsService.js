/**
 * ============================================================================
 * FILE: atsService.js
 * PURPOSE: Runs an ATS (Applicant Tracking System) compatibility analysis.
 * ============================================================================
 *
 * WHAT IS THIS?
 * An ATS is software used by recruiters to automatically filter CVs based
 * on keyword matching. This service asks the AI to act as a strict ATS
 * and return a compatibility score, missing keywords, and improvement advice.
 *
 * HOW DOES IT WORK?
 * 1. We build a special prompt that asks the AI to compare the CV against
 *    the job description.
 * 2. We instruct the AI to respond with ONLY a JSON object (no markdown).
 * 3. We parse the JSON response and return a structured result.
 *
 * KNOWN ISSUE: LLMs often wrap JSON in markdown code blocks (```json ... ```)
 * even when told not to. We strip those before parsing.
 * See TROUBLESHOOTING.md → "AI Hallucinating Markdown in JSON Responses".
 */

/**
 * Build the ATS analysis prompt.
 *
 * @param {string} jobDescription - The job offer text.
 * @param {string} cvContent      - The CV content (LaTeX or plain text).
 * @returns {string} The full prompt to send to the AI.
 */
function buildAtsPrompt(jobDescription, cvContent) {
  return `Agis comme un système ATS strict (Applicant Tracking System).
Compare le CV suivant avec l'offre d'emploi suivante.
Donne un score global sur 100 de compatibilité.
Identifie les mots-clés importants de l'offre qui MANQUENT dans le CV.
Donne 3 conseils brefs pour améliorer le CV.

Tu DOIS répondre UNIQUEMENT avec un objet JSON valide, sans markdown (pas de backticks), sans commentaires.
Format strict attendu:
{
  "score": 85,
  "missingKeywords": ["Mot clé 1", "Mot clé 2"],
  "advice": ["Conseil 1", "Conseil 2", "Conseil 3"]
}

--- OFFRE D'EMPLOI ---
${jobDescription}

--- CV ---
${cvContent}`;
}

/**
 * Clean markdown artifacts from AI's JSON response.
 *
 * LLMs frequently wrap their JSON output in ```json ... ``` code blocks
 * even when explicitly told not to. This function strips those wrappers
 * so JSON.parse() can work.
 *
 * @param {string} text - Raw AI response text.
 * @returns {string} Cleaned text ready for JSON.parse().
 */
function cleanJsonResponse(text) {
  return text
    .replace(/^```json/i, '')   // Remove opening ```json
    .replace(/^```/, '')         // Remove opening ``` (without language tag)
    .replace(/```$/g, '')        // Remove closing ```
    .trim();
}

/**
 * Run a full ATS compatibility analysis.
 *
 * @param {Function} callAI        - A function that sends a prompt to the AI and returns the response.
 *                                   Signature: (promptText, signal) => Promise<string>
 * @param {string} jobDescription  - The job offer text.
 * @param {string} cvContent       - The CV to evaluate (LaTeX or plain text).
 * @param {AbortSignal} [signal]   - Optional AbortSignal for cancellation.
 *
 * @returns {Promise<{score: number, missingKeywords: string[], advice: string[]}>}
 * @throws {Error} If the AI response can't be parsed as valid JSON.
 */
export async function runAtsAnalysis(callAI, jobDescription, cvContent, signal) {
  const prompt = buildAtsPrompt(jobDescription, cvContent);

  // Get the raw AI response
  let reply = await callAI(prompt, signal);

  // Clean up markdown code fences that the AI may have added
  reply = cleanJsonResponse(reply);

  // Parse the JSON — this will throw a SyntaxError if the format is wrong
  const parsed = JSON.parse(reply);

  return parsed;
}
