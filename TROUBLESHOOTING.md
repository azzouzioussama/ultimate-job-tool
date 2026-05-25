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

### Problem 2: Mobile Browsers Blocking Inline PDF `Blob:` URLs
**Issue**: While the `Blob` + `iframe` method works perfectly on desktop, mobile browsers (iOS Safari, Chrome Android) natively refuse to render PDF blobs inside `<iframe>` elements due to security/plugin policies, showing a blank screen instead.
**Attempted Fix**: Added a download-only fallback button for mobile users, but this degraded the user experience.
**Final Fix (Canvas Rendering)**: 
1. Installed `react-pdf` (Mozilla's `pdf.js` wrapper).
2. On mobile devices, we bypass the `iframe` entirely and use `react-pdf` to render each page of the PDF onto an HTML `<canvas>` element. This works universally across all mobile browsers.
3. Desktop continues to use the fast native `iframe` method.

### Problem 3: Mobile PDF Viewer Scrolling & Text Selection Bugs
**Issue**: The `react-pdf` canvas viewer on mobile trapped the user on the first page (no scrolling) and prevented copying text.
**Cause**:
1. **Scrolling**: CSS Flexbox rules (`flex-grow` inside a fixed `80vh` container) caused nested scrollbars to fail on mobile.
2. **Copying**: The `react-pdf` component disabled its invisible HTML text overlay layer by default for performance.
**Fix**: 
1. Changed the mobile container layout from a fixed height to `h-auto`. This allows the PDF container to grow naturally, meaning the user can scroll through the pages using the native browser window scroll instead of a rigid inner scrollbox.
2. Re-enabled `renderTextLayer={true}` on the `Page` component to overlay selectable text on top of the rendered canvas.

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

### Problem 5: Indeed/Cloudflare 403 Forbidden (Jina AI)
**Issue**: When scraping Indeed URLs using Jina AI, the result was a Markdown file containing `Warning: Target URL returned error 403: Forbidden` and `# Just a moment... Additional Verification Required`.
**Cause**: Indeed uses Cloudflare's aggressive anti-bot protection. Simple HTTP scrapers like Jina AI are instantly detected and served a CAPTCHA challenge instead of the job page.
**Fix**: 
2. Enabled Anti Scraping Protection (ASP) in the Scrapfly fetch call (`asp: 'true'`) to guarantee that Scrapfly routes the Indeed request through residential proxies with headless browser fingerprinting to solve the Cloudflare CAPTCHA automatically.

## 7. JSON Parsing from AI (ATS Tester)

### Problem: AI Hallucinating Markdown in JSON Responses
**Issue**: When the ATS Tester requested a strict JSON output from the AI, the JSON parser sometimes threw a `SyntaxError: Unexpected token` crashing the ATS feature.
**Cause**: LLMs (like Gemini or OpenAI) often wrap JSON outputs in Markdown code blocks, even when strictly instructed not to. They return:
\`\`\`json
{
  "score": 85
}
\`\`\`
JavaScript's native `JSON.parse()` fails when encountering the backticks.
**Fix**: Added a cleanup regex pass before parsing the AI response to strip out Markdown: `reply = reply.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/g, '').trim();`

## 8. Database (Dexie.js) & Architecture Refactoring

### Problem 1: Cascading Renders warning with `useEffect`
**Issue**: ESLint flagged `Calling setState synchronously within an effect can trigger cascading renders` when loading the active application from Dexie into the `App.jsx` React state.
**Cause**: The application uses a local `activeAppId` state which triggers a `useEffect` that calls `getApplication(id)` to load data into the local `jobDescription`, `cvOriginal`, and `cvGenerated` states.
**Fix**: While technically causing an extra render cycle, this pattern is required to synchronize asynchronous IndexedDB data with fast synchronous UI state for text areas. The warning is safely ignored, though future optimizations could involve `useLiveQuery` at the component level to skip manual `setState` syncing.

### Problem 2: Data Loss Risk during `localStorage` to IndexedDB Migration
**Issue**: Migrating the app from `localStorage` to `dexie.js` threatened to delete the user's active, unsaved CV draft if they refreshed the page.
**Cause**: The new database schema required an explicit `createApplication()` call, whereas the old system just read naked strings from `localStorage`.
**Fix**: Implemented a one-time migration hook in the initial `App.jsx` load sequence. It checks if the `applications` table is completely empty. If it is, it searches `localStorage` for the old `cv_original` and `job_description` keys. If found, it automatically creates a new row titled `"Ancienne Candidature - Importée"` and selects it, ensuring zero data loss during the seamless transition.

## 9. Graphify Knowledge Graph Generation

### Problem 1: `openai` package missing during extraction
**Issue**: Running `graphify .` with the Gemini backend crashed with: `Gemini/Kimi/Ollama/OpenAI-compatible extraction requires the openai package. Run: pip install openai`.
**Cause**: The Graphify pip installation handles core dependencies (like `tree-sitter`), but leaves LLM provider SDKs (like `openai`) as optional dependencies depending on which API key the user provides.
**Fix**: Ran `pip install openai`.

### Problem 2: Corrupted Python Environment (Pydantic `version_short` ImportError)
**Issue**: After installing the `openai` package, Graphify (and Python itself when attempting to `import openai`) crashed with: `ImportError: cannot import name 'version_short' from 'pydantic.version'`.
**Cause**: A conflict in the local Anaconda environment where older `pydantic v1` shared object (`.so`) files were clashing with `pydantic v2` requirements expected by the newly installed `openai` SDK, corrupting the module namespace.
**Fix**: Purged both versions completely and reinstalled them cleanly:
```bash
pip uninstall -y pydantic pydantic-core
rm -rf ~/anaconda3/lib/python3.11/site-packages/pydantic*
pip install pydantic pydantic-core openai
```

## 10. Clerk + Supabase Integration Issues

### Problem 1: Vite Crash with `require()`
**Issue**: Using dynamic `require('@clerk/react')` to optionally load Clerk crashed the entire Vite build in production (white screen) and threw `ReferenceError: require is not defined`.
**Cause**: Vite is an ES Module bundler and does not support Node.js `require()` for importing modules in the browser out of the box.
**Fix**: Removed all `require()` calls and switched back to standard top-level `import`. We discovered that statically importing Clerk components does not crash the app even if the API keys are missing; it only crashes if you try to *render* them or *call their hooks* without a `<ClerkProvider>`. So we conditionally render a custom `<AuthGate>` component instead.

### Problem 2: Supabase Client Instantiation Crash
**Issue**: The Vercel production server showed a white screen because the Supabase client threw `Error: supabaseUrl is required`.
**Cause**: When deploying without environment variables (to test the fallback local mode), `import.meta.env.VITE_SUPABASE_URL` was `undefined`. The official `@supabase/supabase-js` `createClient` throws a fatal synchronous error if the URL is an empty string during module evaluation.
**Fix**: Wrapped the client initialization in a condition: `export const supabase = (supabaseUrl && supabaseKey) ? createClient(...) : null;`. The `useDatabase` hook already gracefully falls back to localStorage if the client is `null`.

### Problem 3: Dashboard Stuck on "Chargement..."
**Issue**: When successfully logged in via Clerk, the dashboard completely froze on "Chargement..." and no applications loaded.
**Cause**: The user logged in, but their brand new Supabase project didn't have the `applications` table created yet. When the client requested the table, Supabase threw an error. The `getAllApplications` function in `useDatabase.js` had no `try/catch` block, causing an unhandled promise rejection that stopped the React state from updating.
**Fix**: 
1. Added robust `try/catch` blocks and null-checks to all database hooks in `useDatabase.js` so they safely return `[]` or `null` instead of crashing the UI.
2. Executed the `CREATE TABLE` and RLS policy SQL script in the user's Supabase dashboard.

### Problem 4: Missing Clerk JWT Template & Invalid JWT Secret
**Issue**: Even after creating the table, the database rejected all INSERTS silently.
**Cause**: Supabase uses Row Level Security (RLS) to verify identity. If Supabase doesn't know the Clerk JWT secret, or if Clerk isn't configured to generate a "supabase" template token, Supabase rejects the requests as Unauthorized.
**Fix**:
1. In Clerk Dashboard: Created a new JWT Template named `supabase`.
2. In Supabase Dashboard: Navigated to `Authentication -> Providers -> Custom JWT`, enabled it, and pasted the Clerk JWKS Public Key.

### Problem 5: RLS Type Mismatch (`uuid = text`)
**Issue**: The SQL query to create the RLS policies threw `ERROR: 42883: operator does not exist: uuid = text`.
**Cause**: The initial SQL used `USING (auth.uid() = user_id)`. `auth.uid()` expects a standard UUID format, but Clerk user IDs are strings (e.g., `user_2Nne...`), which were stored in a `text` column.
**Fix**: Modified the RLS policies to extract the user ID directly from the Clerk JWT payload as text using `(auth.jwt() ->> 'sub') = user_id`.

## 11. WSL2 Development Server Blank Page

### Problem 1: Vite 8 `allowedHosts` Syntax Change
**Issue**: When accessing the Vite dev server through a Cloudflare tunnel or any non-localhost hostname, the browser displayed: `Blocked request. This host ("...trycloudflare.com") is not allowed.`
**Cause**: The `vite.config.js` used `allowedHosts: 'all'`, which was valid syntax in **Vite 5/6** but silently ignored in **Vite 8**. Vite 8 changed the API to accept a boolean `true` instead of the string `'all'`. With the old syntax, Vite fell back to its default behavior of only allowing `localhost` as a valid host header.
**Fix**: Changed `allowedHosts: 'all'` to `allowedHosts: true` in `vite.config.js`.

### Problem 2: WSL2 Port 5173 Forwarding Broken
**Issue**: The app showed a completely blank page when accessed via `localhost:5173` from a Windows browser, even though `curl http://localhost:5173` from inside WSL returned the correct HTML. The Chrome console displayed: `Unsafe attempt to load URL http://172.21.151.162:5173/ from frame with URL chrome-error://chromewebdata/`.
**Cause**: WSL2 runs inside a Hyper-V virtual machine with its own network stack. Windows automatically forwards some ports from `localhost` to the WSL2 VM, but **port 5173 was stuck/broken** in that forwarding layer. This is a known WSL2 bug where certain ports get "claimed" by Windows services (like Hyper-V Reserved Ports) or get stuck in a stale forwarding state. Other ports (e.g., 42917, 3001) forwarded correctly.
**Fix**: Changed the Vite dev server port from the default `5173` to `3000` in `vite.config.js` (`server.port: 3000`). Vite auto-increments to the next available port if the configured one is occupied (e.g., 3001 if 3000 is in use).
**Diagnostic tools used**:
1. `curl -s http://localhost:5173` — confirmed Vite was serving correctly from inside WSL.
2. `npx serve dist` — confirmed a static server on a random port (42917) was reachable from Windows, proving the issue was port-specific.
3. `cloudflared tunnel --url http://localhost:5173` — confirmed Vite served correctly through a Cloudflare tunnel, proving the app code was not the issue.
4. Error overlay injection in `index.html` — added `window.onerror` and `unhandledrejection` handlers to catch and display any silent JS crashes.

### Problem 3: ClerkProvider Missing `publishableKey` Prop
**Issue**: Potential white screen when Clerk fails to initialize.
**Cause**: After refactoring `main.jsx` to conditionally load Clerk, the `<ClerkProvider>` was rendered without its required `publishableKey` prop. While Clerk v6 can auto-detect the key from environment variables, explicit passing is more reliable and prevents edge-case initialization failures.
**Fix**: Added `publishableKey={PUBLISHABLE_KEY}` to the `<ClerkProvider>` component in `main.jsx`.

---
*Generated: May 2026*
