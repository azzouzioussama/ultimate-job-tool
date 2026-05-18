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

---
*Generated: May 2026*
