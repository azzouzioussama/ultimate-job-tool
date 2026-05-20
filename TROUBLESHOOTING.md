# Troubleshooting Log & Bug Fixes

This document records every major technical problem encountered during the development of the Ultimate Job Tool, along with the exact solution implemented. This serves as a knowledge base for future maintenance.

## 1. The TeXLive PDF Compilation Failures

### Problem 1: `filename[]` Array Formatting
**Issue**: The TeXLive API returned errors because it didn't recognize the input file.
**Cause**: We were passing `filename[]=cv.tex`. The TeXLive CGI script is hardcoded to expect exactly `document.tex` as the primary filename to trigger the `pdflatex` engine correctly.
**Fix**: Changed the hidden form/FormData input to `filename[]=document.tex`.

### Problem 2: Missing Multipart Encoding
**Issue**: The initial form submission to `https://texlive.net/cgi-bin/latexcgi` was failing to upload the LaTeX content.
**Cause**: The `<form>` lacked the required encoding type for file/blob uploads.
**Fix**: Added `encType="multipart/form-data"` to the HTML form. (Later, when moving to `fetch()`, we used the `FormData` JS object, which handles this encoding automatically).

### Problem 3: Invalid LaTeX Syntax
**Issue**: The PDF failed to compile, throwing a LaTeX parsing error.
**Cause**: Our `SYNTHETIC_CV` contained Markdown-style bold text (e.g., `**Permis B**`). LaTeX uses `\textbf{}`.
**Fix**: Ran a regex/manual pass over the `SYNTHETIC_CV` variable to replace all Markdown syntax with valid LaTeX syntax (e.g., `\textbf{Permis B}`).

## 2. The PDF Inline Display Challenge

### Problem: CORS & `X-Frame-Options` Blocking
**Issue**: We wanted to show the generated PDF directly inside the app using an `<iframe>`. However, setting `src="https://texlive.net/..."` resulted in the browser blocking it due to Cross-Origin Resource Sharing (CORS) and `X-Frame-Options: DENY` headers.
**Attempted Fix 1**: Used a hidden `<form target="_blank">` to force the compilation result into a new tab. This worked but was a poor user experience.
**Final Fix (The "Blob + Proxy" Method)**:
1. Created a proxy in `vite.config.js` to route `/api/latex` to `texlive.net`. This bypassed the CORS block on the `fetch()` request.
2. We discovered TeXLive responds with a `301 Redirect` to `/latexcgi/document_XYZ.pdf`.
3. We added a second proxy rule for `/latexcgi` to handle the redirect.
4. Instead of opening the URL, we intercept the response as a Blob (`await response.blob()`).
5. We create a local URL via `URL.createObjectURL(blob)` and pass *that* to the iframe. Since the Blob is local to the browser, it entirely bypasses `X-Frame-Options`.

## 3. AI API Quota & Provider Issues

### Problem 1: Gemini "Model Not Found" / Deprecation
**Issue**: `handleRunAI` failed with the error `models/gemini-2.0-flash is not found for API version v1beta`.
**Cause**: The user's free-tier API key was trying to access models that Google deprecated or moved behind a paywall in 2026 (specifically 1.5-flash and 2.0-flash).
**Fix**: Updated the API call to use the currently supported free-tier model: `gemini-2.5-flash`.

### Problem 2: DeepSeek "Insufficient Balance"
**Issue**: DeepSeek integration returned a 400 error regarding account balance.
**Cause**: DeepSeek does not offer a perpetual free tier; the official API requires prepaid credits.
**Fix**: 
1. Added a UI note explicitly stating that the official DeepSeek API requires a paid balance.
2. Integrated **OpenRouter** as a 4th provider, which routes requests to `deepseek/deepseek-v4-flash:free` at no cost, solving the issue without requiring the user to pay.

### Problem 3: React State Stagnation Across Providers
**Issue**: Switching between AI providers (e.g., Gemini to DeepSeek) left the old API key in the input field or overwrote the new provider's key in local storage.
**Fix**: 
1. Separated localStorage keys: `api_key_gemini`, `api_key_openai`, etc.
2. Added a `useEffect` hook that listens to changes in `aiProvider` and hot-swaps the `apiKey` state variable to match the newly selected provider. Added a similar hook for `aiModel`.

## 4. UI/UX Bugs

### Problem: Stale JSX Tags
**Issue**: The Vite build crashed with `Unexpected token. Did you mean {'}'} or &rbrace;?`.
**Cause**: When refactoring the "Clé API Requise" warning box to support multiple provider links, an old `</a>` tag was accidentally left dangling outside the new `<div>` structure.
**Fix**: Manually reviewed the DOM tree in `App.jsx` and removed the orphan closing tag.

## 5. AI Hallucination & Regex Challenges

### Problem: AI Generates Invalid LaTeX (Mismatched Brackets & Unescaped Ampersands)
**Issue**: The AI response contains valid-looking LaTeX, but it fails to compile with errors like `Missing $ inserted` or `File ended while scanning use of \textbf`.
**Cause**: LLMs frequently hallucinate brackets (e.g., `\textbf{Text]`) and forget to escape special LaTeX characters (e.g., generating `&` instead of `\&` or `%` instead of `\%`).
**Fix**: 
1. **Prompt Hardening**: Added a strict, all-caps warning to the system prompt explicitly instructing the model to escape `&` and to not confuse `{` with `[`.
2. **Regex Auto-Correction**: Added a post-processing step in the `extractLatexAndSave` function. It uses a negative lookbehind regex `/(?<!\\)&/g` to automatically escape any `&` that isn't already escaped with a backslash before saving the code to the state.

## 6. Job Posting Scraper (Jina AI & Scrapfly) Issues

### Problem 1: Scrapfly CORS / Direct Fetch Rejection
**Issue**: Fetching `https://api.scrapfly.io/scrape` from the browser console failed with a `TypeError: Failed to fetch` or CORS origin error.
**Cause**: The browser enforces Same-Origin Policy (CORS). Scrapfly's API does not support direct browser-to-server requests without CORS approval, and calling it directly exposes private API keys to front-end traffic.
**Fix**: Routed Scrapfly API requests through backend proxies:
1. In development, configured `vite.config.js` to proxy `/api/scrapfly` requests to `https://api.scrapfly.io`.
2. In production, added a rewrite rule in `vercel.json` mapping `/api/scrapfly` to `https://api.scrapfly.io/scrape`.
3. Updated the frontend to fetch `/api/scrapfly` instead of the direct URL.

### Problem 2: Scrapfly 422 Unprocessable Entity
**Issue**: Scrapfly API returned an HTTP 422 error when scraping.
**Cause**: The parameter `extraction_model` was incorrectly set to `'job'` instead of the official value `'job_posting'`.
**Fix**: Changed the parameter to `extraction_model: 'job_posting'`. Also, upgraded the frontend fetch error handling to extract and display the exact rejection message returned in Scrapfly's response body for clearer troubleshooting.

### Problem 3: Extracted Job Description Format
**Issue**: The scraper returned a large, structured JSON object with metadata (companyName, location, data quality metrics) instead of just the plain job description text.
**Cause**: The Scrapfly `job_posting` model parses the entire HTML into structured fields under `result.extracted_data.data`.
**Fix**: Refined the response parser in `App.jsx` to check for `data.result.extracted_data.data.jobDescription` and set the state directly to that field, falling back to full JSON stringification only if the field is missing.

### Problem 4: Jina AI Extractor Boilerplate Noise
**Issue**: Using the free Jina AI reader scraper returned the entire page's converted Markdown (sometimes over 500 lines), containing website navigation links, login popups, recommended jobs lists, cookie forms, and footer links.
**Cause**: Jina AI Reader converts the entire DOM into Markdown without using an AI-guided selector model, so it includes all page headers and footers.
**Fix**: Implemented a stateful cleaner function `cleanJinaMarkdown` in `App.jsx`:
1. **Cut-off logic**: Loops through lines and automatically stops parsing the remaining document if it encounters any bottom-of-page heading matching keywords (e.g. `ces offres`, `recherches similaires`, `créez votre compte`, `similar jobs`).
2. **Pure link stripping**: Strips out lines that consist of nothing but markdown links (e.g. top/side navigation menus).
3. **Keyword-based stripping**: Filters out lines containing RGPD cookies, dashboard links, social links, app store buttons, and UI feedback text (like `- [x]` checkboxes or `Lien copié`).

---
*Generated: May 2026*
