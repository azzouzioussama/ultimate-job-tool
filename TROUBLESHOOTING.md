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
**Fix**: Enabled Anti Scraping Protection (ASP) in the Scrapfly fetch call (`asp: 'true'`) to guarantee that Scrapfly routes the Indeed request through residential proxies with headless browser fingerprinting to solve the Cloudflare CAPTCHA automatically.

### Problem 6: Mobile Copy-Paste URLs Contained Surrounding Text / Description
**Issue**: When copying a job posting link from a mobile app (like LinkedIn or Indeed), the clipboard content often includes descriptive text alongside the URL (e.g. *"Check out this job... https://www.linkedin.com/jobs/view/..."*). Pasting this into the URL scraper field or batch queue importer resulted in invalid URL format errors.
**Cause**: The input forms accepted the raw input directly without extracting and isolating the actual URL from the rest of the text.
**Fix**: Implemented an intelligent URL extractor and normalizer in the text inputs and batch queue handlers:
1. **Regex Extraction**: Runs a match for `/(https?:\/\/[^\s]+|www\.[^\s]+)/i` on the pasted input.
2. **Punctuation Trimming**: Strips out trailing punctuation (like `.`, `,`, `)`, `]`, `!`, `?`) that might be part of the surrounding message context but gets caught inside the matched URL block.
3. **Protocol Normalization**: Checks if the matched URL starts with `www.` and automatically prepends `https://` to prevent relative URL failures during network fetch calls.

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

## 11. Job Scraper Pagination Issues

### Problem 1: Frontend Pagination Yields Limited Links (LinkedIn)
**Issue**: Using `StealthyFetcher` or `Fetcher` on `https://www.linkedin.com/jobs/search/` only returned ~15-25 links total, regardless of how many results the search claimed to have.
**Cause**: LinkedIn's frontend relies on infinite scrolling. The initial HTML payload stops at 25 items. Playwright can scroll, but it's slow and prone to breaking on dynamic lazy-loading.
**Fix**: Completely bypassed the frontend UI by hooking into LinkedIn's hidden "Guest" API (`https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=...&start={offset}`). The Python backend loops this API dynamically, fetching up to 40 pages (1000 links) seamlessly and rapidly using raw HTTP requests.

### Problem 2: Cloudflare Anti-Bot Blocks Pagination (Indeed)
**Issue**: Fetching `&start=0` on Indeed worked perfectly, but attempting `&start=10` returned 0 links and redirected to a `secure.indeed.com/auth` Cloudflare checkpoint.
**Cause**: Indeed heavily monitors pagination. While the very first page is often allowed through, clicking "Next Page" programmatically triggers Cloudflare's invisible CAPTCHA challenge. 
**Fix**: The backend is configured to use fast `Fetcher` for `&start=0`, and gracefully fall back to headless Firefox (`StealthyFetcher`) if it encounters a block on subsequent pages. However, bypassing Cloudflare entirely for deep scraping on Indeed remains a known constraint without using commercial proxy solutions (like Scrapfly ASP).

### Problem 3: React SPA Job Links Missing (Welcome To The Jungle)
**Issue**: Scraping other job boards like Welcome To The Jungle returned 0 actual job links (e.g. `/fr/companies/.../jobs/...`), returning only generic SEO routing links (`/fr/pages/emploi-lyon`).
**Cause**: Modern job boards use Single Page Application frameworks and external search APIs (like Algolia) to load job cards *after* the initial page loads. The server-rendered HTML does not contain the job URLs.
**Fix**: The user is advised that generic extraction cannot parse undocumented dynamic JSON endpoints. For full support, these sites require custom API hooks similar to the LinkedIn implementation.

### Problem 4: Jina AI Fails on Cloudflare and Active-Consent SPAs
**Issue**: When using Jina AI Cloud as a fallback scraper for mobile devices, it successfully extracted links from standard sites (like Free-Work) but consistently returned 0 job links for Indeed and WelcomeToTheJungle.
**Cause**: Jina AI Reader is a stateless conversion engine. It gets instantly blocked by Cloudflare (Indeed). Furthermore, injecting headers like `x-wait-for-selector` or `x-remove-selector: #axeptio_overlay` failed on WTTJ because the React app refuses to trigger the Algolia search XHR requests until a user actively clicks the "Accept Cookies" button, which Jina cannot do.
**Fix**: Disabled Server-Sent Events (`text/event-stream`) in the fetch call to ensure the raw Markdown arrives intact for regex parsing, improving extraction on supported sites. Jina is maintained as a fallback for simple sites, but users are advised that highly protected enterprise sites mandate the local Python backend with TLS fingerprinting.

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

### Problem 4: Application Data Disappearing on Refresh (Supabase Schema Sync)
**Issue**: When generating an AI response (CV/cover letter) or extracting a new job offer, the data seemingly does not save. Upon refreshing the page, the job description and AI history revert to their previous states or disappear entirely.
**Cause**: Two overlapping issues:
1. The AI chat history (`aiResponses` state) was entirely ephemeral and missing from the `updateApplication` auto-save payload, meaning it never persisted across sessions.
2. The Supabase `applications` table schema in the cloud was missing several newly introduced columns (`trackingStatus`, `promptResponses`, `atsScoreBefore`, `atsScoreAfter`, `lastGeneratedDate`, `documents`, `atsResult`, `aiResponses`). Because PostgreSQL operates with strict schemas, `supabase-js` silently failed the entire `UPDATE` request when it encountered unrecognized fields in the JavaScript payload, preventing *any* field (even the `jobDescription`) from saving.
**Fix**:
1. Ran explicit `ALTER TABLE` commands in the Supabase SQL Editor to add the missing columns as `jsonb` or `text`/`integer` types.
2. Added `aiResponses` to the local state, auto-save payload, and Supabase schema, allowing the app to successfully reload and persist chat history tied to the specific `activeAppId`.

## 9. Localization & UI Workflows

### Problem 1: French Hardcoded Strings Leaking into English UI
**Issue**: Table headers ("STATUT", "ATS Avant"), specific buttons ("Sauvegarder Doc(s)"), and dropdown statuses ("Brouillon", "Candidature Envoyée") were appearing in French even when the app language was set to English.
**Cause**: The strings were either entirely hardcoded into the component (e.g., inside the `<select>` tag options in `DashboardTab.jsx`) or the required translation keys were missing from `en.json`, causing `react-i18next` to fall back to the provided default French string in the `t()` call.
**Fix**: Replaced all hardcoded text with `t()` calls and explicitly defined the missing nested JSON keys (like `dashboard.status.draft`, `dashboard.table.status`) in both `en.json` and `fr.json`.

### Problem 2: Missing Application Creation on Manual Paste
**Issue**: The "Auto-Create Application" logic only triggered automatically when successfully extracting text via the Scrapfly/Jina URL scraper. If a user manually copy-pasted a job description from an unsupported site, the AI title extraction pipeline could not be triggered.
**Cause**: The prompt injection and application saving logic (`createApplication()`) was tightly coupled inside the `handleScrape()` function in `App.jsx`.
**Fix**: Decoupled the logic into an independent `handleAutoCreateFromText(text)` function, passed it down to `JobOfferTab.jsx`, and added a new "Create Application" button that dynamically renders whenever `jobDescription.length > 50`.

### Problem 3: Invisible/Transparent Buttons in the Batch UI & Low-Contrast Dashboard Actions
**Issue**: In the Batch tab, key control buttons (like "Ajouter", "Importer la liste", and "Démarrer la pile") were completely invisible (white-on-white text) by default, but suddenly appeared as colored buttons when hovered. In the Dashboard tab, row action buttons (Delete & Edit) were nearly invisible due to low contrast.
**Cause**:
1. **Batch UI**: The elements were styled with custom Tailwind color values ending in `50` (like `bg-indigo-650`, `text-slate-550`, `border-slate-350`, `border-slate-250`, etc.). Because these custom values are not extended in `tailwind.config.js` and do not exist in default Tailwind, the Tailwind compiler ignored them. Consequently, the default background color rendered as transparent, and the white text (`text-white`) became invisible against the white card backgrounds until hovered (since standard hover colors like `hover:bg-indigo-600` are valid Tailwind colors and were correctly generated).
2. **Dashboard UI**: The buttons used `text-slate-300` as a default text color, which lacks sufficient contrast against white table rows.
**Fix**:
1. **Batch UI**: Refactored `BatchTab.jsx` to replace all non-standard colors with standard Tailwind increments (e.g. `bg-indigo-600`, `hover:bg-indigo-700`, `text-slate-500`, `border-slate-300`, `border-slate-200`).
2. **Dashboard UI**: Changed the row action classes in `DashboardTab.jsx` from `text-slate-300` to `text-slate-400` to guarantee accessibility by default.

## 10. Concurrency and Rate Limiting in Batch Processing

### Problem 1: API Rate Limiting (Error 429) During Parallel Request Spikes
**Issue**: Attempting to scrape multiple URLs and run AI extraction simultaneously for multiple job offers in a single action led to immediate rate limits (`429 Too Many Requests`) from LLM APIs and target websites.
**Cause**: The initial batch execution processed all items concurrently by executing a `forEach` loop on all pending items simultaneously without any queue control, hitting API providers and scrapers at the exact same time.
**Fix**: Implemented a stateful queue manager using a React `useEffect` hook, a `maxConcurrency` limit configuration, and a `runningItemIdsRef` to strictly cap the number of active pipelines executing concurrently. Newly queued items only start when an active slot becomes available.

### Problem 2: Sequential Bottlenecks in Multi-Step Lifecycle Processing
**Issue**: Performing batch scraping followed by batch AI analysis forced the user to wait for *all* URLs to finish scraping before the first AI extraction could begin. If one scraper hung, it blocked the entire workflow.
**Cause**: The pipeline was batch-sequential (waiting for a global scraping pass to resolve before calling a global AI extraction pass), rather than item-sequential.
**Fix**: Refactored the architecture to process each job offer URL through its complete lifecycle (Scrape -> Extract Details -> Generate Materials -> Compile PDFs -> Save to DB) independently in a single item-level worker. If one worker fails or hangs, other slots continue executing. Added a user-adjustable delay setting and an AbortController cancellation system to stop the batch gracefully mid-run.

### Problem 3: Lack of Granular Control over Failed Batch Jobs
**Issue**: When the batch processing queue encountered errors (like rate limits or scraping failures), all failed jobs were bundled together. Clicking "Play" to resume the queue automatically reset and restarted *all* failed jobs simultaneously, which prevented the user from retrying a specific job or selecting only certain jobs to regenerate.
**Cause**: The `handleStartPause` logic aggressively mapped over the entire `items` array and reset every item with `status === 'failed'` back to `pending`. There was no UI mechanism to interact with individual items or select groups of items.
**Fix**: 
1. **Individual Control**: Disabled the automatic global reset of failed jobs in `handleStartPause`. Added an individual "Relancer" button for each item that resets its status to `pending` and immediately triggers the processing queue.
2. **Bulk Selection**: Added a `selectedItemIds` state array with checkbox inputs on every queue item. Implemented "Tout sélectionner" (Select All) logic in the list header alongside bulk action buttons for "Relancer la sélection" (Restart Selected) and "Supprimer la sélection" (Delete Selected), giving users full granular control over queue management.

### Problem 4: Queue Scrolling Fatigue on Bulk Addition
**Issue**: When pasting multiple new job URLs or importing text blocks into a large batch queue, the new items were appended to the very bottom of the list. The user had to constantly scroll down to verify that their jobs were added successfully.
**Cause**: The state updater used `setItems(prev => [...prev, newItem])`, which inherently pushes elements to the end of the React array.
**Fix**: Refactored both the single `handleAddItem` and the loop-based `handleBulkImport` to use `setItems(prev => [newItem, ...prev])` (or `[...newItems, ...prev]` for grouped bulk additions). This instantly prepends new jobs to the top of the UI list without altering the processing engine's logic.

## 11. Scrapling Scraper & Python Backend Integration

### Problem 1: Frontend Cannot Call Python Code Directly (CORS & Sandboxing)
**Issue**: Scrapling is a Python library, but the frontend is a client-side only React app.
**Fix**: Built a local FastAPI Python micro-server (`scratch/scrapling_server.py`) that runs on `http://localhost:8000`. Configured a proxy rule in Vite (`/api/scrapling` -> `http://localhost:8000/scrape`) to bridge the communication and bypass browser CORS limits.

### Problem 2: FastAPI Startup Failure (`TypeError: Router.__init__() got an unexpected keyword argument 'on_startup'`)
**Issue**: Running the Python FastAPI server crashed immediately on startup.
**Cause**: When installing the `scrapling[all]` dependencies via pip, pip upgraded `starlette` to version `1.2.1` but kept the pre-existing `fastapi==0.105.0` in Anaconda, causing a library constructor signature mismatch.
**Fix**: Upgraded the FastAPI library to the latest version (`0.136.3`) by running `pip install --ignore-installed fastapi` to successfully bypass Anaconda's metadata lock.

### Problem 3: Playwright/Patchright Missing Browser Executables or Sudo Password Requirement
**Issue**: Running Scrapling's `StealthyFetcher` failed with a missing browser binary error (e.g., `Executable doesn't exist at ~/.cache/ms-playwright/...`). However, running the recommended `scrapling install` command failed because it tried to install system dependencies requiring a `sudo` password.
**Fix**: Executed `python3 -m patchright install` directly, which successfully downloads the required browser binaries (including chromium v1217) locally into the user's home folder without needing root/sudo permissions. Added a fallback mechanism inside the Python backend to use standard HTTP `Fetcher` (impersonated curl) first, which bypasses LinkedIn bot checks instantly (~2s) and only invokes browser-based `StealthyFetcher` as a fallback.

### Problem 4: Scrapling Integration on Production Server (Vercel Host + Local Python Helper)
**Issue**: When deploying the frontend to Vercel (hosted over HTTPS), users wondered if the Scrapling (Local) option would fail due to mixed content restrictions or if the FastAPI server itself should be deployed as a Vercel serverless function.
**Cause**:
1. **Mixed Content Rules**: Browsers block fetching unencrypted HTTP resources from an HTTPS page.
2. **Serverless Limitations**: Running Scrapling (and its Playwright/Patchright browser dependencies) directly inside a Vercel Serverless Function is impossible because Vercel has a 50MB deployment size limit (browser binaries are several hundred MBs), lacks system-level browser library configurations, and has execution timeout limits (10–15s).
**Fix**:
1. **Loopback Exemption**: Configured the frontend to make requests directly to `http://localhost:8000/scrape`. Modern browsers explicitly exempt loopback/local addresses (`localhost` and `127.0.0.1`) from mixed content blocking, treating them as "potentially trustworthy origins".
2. **CORS Activation**: Added full CORS middleware allowing all origins (`allow_origins=["*"]`) in the local FastAPI backend to enable smooth communication.
3. **Local Architecture Design**: The Scrapling scraper remains a local helper service that the user runs on their computer (`python3 scratch/scrapling_server.py`) while browsing the app.

### Problem 5: Scrapling Server 500 Error (Strict 200 HTTP Check on LinkedIn)
**Issue**: Extracting LinkedIn job links via the Python server returned a `500 Internal Server Error`.
**Cause**: The server was programmed to raise a fatal exception if `page.status != 200`. However, LinkedIn heavily utilizes anti-bot measures and routinely returns a `999` status code for automated requests, even though it still delivers the complete HTML page with all job links!
**Fix**: Removed the strict HTTP status code check in `scrapling_server.py`. The scraper now proceeds to extract `<a>` tags regardless of the HTTP status, successfully harvesting links even on `999` responses.

### Problem 6: Playwright Sync API inside Asyncio Loop Crash
**Issue**: Fetching URLs with Scrapling's `StealthyFetcher` threw `StealthyFetcher failed: It looks like you are using Playwright Sync API inside the asyncio loop. Please use the Async API instead.`
**Cause**: The `/scrape-search` FastAPI route was defined with `async def`. FastAPI executes asynchronous routes directly on its main event loop. However, `StealthyFetcher` uses the synchronous Playwright API under the hood, which is forbidden from running inside an active asyncio loop.
**Fix**: Changed the route definition to a standard synchronous function (`def scrape_search_url()`). FastAPI automatically detects synchronous routes and executes them inside an external threadpool, completely bypassing the asyncio event loop restriction and allowing the synchronous Playwright code to run flawlessly.

## 12. General CV Storage & Batch AI LaTeX CV Generation

### Problem 1: General/Default CV Missing or Reverting to Synthetic CV
**Issue**: Users had to paste their CV LaTeX text repeatedly when creating new applications manually or via batch scraping, or the CV reverted to empty/the synthetic template.
**Fix**: Added dedicated "Définir comme CV Général" (Save) and "Charger CV Général" (Load) buttons to [MyCvTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/MyCvTab.jsx) to persist the master LaTeX CV in `localStorage` under `ujt_general_cv`. When creating a new application in [DashboardTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/DashboardTab.jsx) or running a batch scraping job in [BatchTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/BatchTab.jsx), the app automatically loads this saved general CV by default.

### Problem 2: Batch-Generated LaTeX CV Not Appearing in Documents or Dashboard tabs
**Issue**: After running batch AI scraping, the generated adapted CV could not be found anywhere in the Documents tab or Dashboard tab (it could only be downloaded during the batch run if the download checkbox was checked).
**Cause**: The batch runner was saving the adapted CV content into the database's `cvGenerated` field, but only elements in the `documents` array and the `promptResponses` dictionary were being listed in the Documents and Dashboard tabs.
**Fix**: Updated the batch worker in [BatchTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/BatchTab.jsx) to also push the generated CV text to the application's local `documents` list and `promptResponses` object under its template title. This instantly exposes it in both tabs for previewing, copying, or downloading.

### Problem 3: Motivation Letters and Other Documents Generating as Plain Text and Failing PDF Compilation
**Issue**: In batch runs, motivation letters and other prompt documents were generated as raw, plain-text markdown, which caused the PDF compiler (TeXLive) to throw formatting errors or fail completely.
**Fix**: Integrated a "Générer en LaTeX (Recommandé)" configuration toggle in [BatchTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/BatchTab.jsx). When checked (default), the runner appends strict instruction modifiers to all non-CV prompts, forcing the AI to output documents wrapped inside a valid compilable LaTeX document structure (`\documentclass{article}`, `\begin{document}`, etc.), which compiles seamlessly to PDF.

## 13. Cloud Mode Strict Schema Constraints on Application Creation

### Problem 1: Batch Queue & Manual Create failing in Clerk + Supabase Cloud Mode
**Issue**: When using Clerk + Supabase cloud mode, starting a batch run or manually pasting a job description failed to save the application to the database, resulting in an empty dashboard, no document output, and an invisible "Ouvrir" button in the batch panel.
**Cause**: The JavaScript payload contains `jobUrl` as a property. However, Supabase's cloud PostgreSQL schema does not have a `jobUrl` column. Because PostgreSQL operates under strict schema validation, PostgREST returned a fatal 400 error (`PGRST204: Could not find the 'jobUrl' column`), aborting the insert/update transaction and returning `null` for the application ID.
**Fix**: Modified the cloud database client wrappers in [useDatabase.js](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/hooks/useDatabase.js) to:
1. Intercept the `jobUrl` parameter on application creation/update.
2. Store it inside the existing `promptResponses` JSONB column as a serialized key `__job_url__`.
3. Read the serialized key on fetch and restore it as `app.jobUrl` on the returned objects.
4. Filter out any keys starting with double underscores (`__`) from rendering in [DashboardTab.jsx](file:///home/koukou/HELPDESK/Job_prompt_generator/ultimate-job-tool/src/components/tabs/DashboardTab.jsx)'s file viewer.

## 14. Chrome Extension Companion Integration

### Problem 1: Content Security Policy (CSP) Blocking Inline Scripts
**Issue**: The extension's `content_app.js` was blocked from injecting inline scripts into the React app's context to bridge `localStorage` with a CSP violation error (`script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules'`).
**Cause**: Manifest V3 enforces strict CSP policies that prohibit executing inline JavaScript strings injected via DOM manipulation (e.g., `script.textContent = "..."`) from content scripts.
**Fix**: Removed the inline script injection approach entirely. Switched to relying purely on DOM events (`window.dispatchEvent(new CustomEvent(...))`) and `window.postMessage()` for robust communication across the isolated world boundary between the React application and the extension's content script.

### Problem 3: Active Application Data Always Null or Forcibly Resetting to First Item
**Issue**: The extension successfully connected and received messages, but the synced application data payload was consistently `null`, or the dashboard kept forcibly selecting the very first application in the list, completely overriding the user's manual clicks.
**Cause**: Two overlapping issues:
1. **Race Condition**: The `initDB()` effect in `App.jsx` ran on mount with an empty dependency array `[]`. At this exact moment, Clerk authentication had not yet resolved, meaning `user` was `null`, and `getAllApplications()` returned `[]`. Because the dependency array was empty, `initDB()` never re-ran after Clerk auth completed, leaving the `activeAppId` permanently `null`.
2. **Missing useCallback (Stale Closures & Infinite Render)**: The database methods (`getAllApplications`, `createApplication`, etc.) inside `useDatabase.js` were standard functions, meaning their references changed on every single render. This caused `App.jsx`'s `useEffect` (which depended on `getAllApplications`) to constantly re-fire in an infinite loop, constantly triggering the fallback code that resets `activeAppId` to the first application.
**Fix**: 
1. Updated the `initDB()` `useEffect` dependency to include `[getAllApplications]`.
2. Wrapped all exported database methods inside `useDatabase.js` with `useCallback` to guarantee stable references, breaking the infinite render loop and allowing manual selections to persist.

## 15. Dashboard UI & List Stability

### Problem 1: Application List Jumping Chaotically on Status Change
**Issue**: When a user modified an application's tracking status (e.g. from "Draft" to "Applied"), the application row instantly disappeared from its current position and jumped to the very top or bottom of the list, forcing the user to lose their scroll position.
**Cause**: The dashboard list was sorted chronologically. However, the Supabase schema lacked a true `created_at` column, causing the app to rely on `lastUpdated`. Every time `updateApplication()` was called to change a status, it aggressively overwrote `lastUpdated: new Date().toISOString()`. The React state updated, the list re-sorted, and the recently modified application was pushed out of order.
**Fix**: Refactored the `updateApplication()` logic in `useDatabase.js` to intelligently analyze the payload. If the *only* field being updated is `trackingStatus`, it skips the `lastUpdated` timestamp override. This allows the application to retain its original chronological position while displaying the new status label.

### Problem 2: Download Workflow Disconnected from Submission
**Issue**: Users downloaded their CVs from the dashboard to apply on external job boards, but then had to manually change the dashboard status to "Applied" and manually search for the job URL again to actually submit it.
**Fix**: Intertwined the workflows:
1. When downloading a document (PDF, LaTeX, or Word) from the dashboard, the app now automatically triggers an `updateApplication` call to mark the status as "Applied" (`Postulée`) in the background.
2. The download handler checks for `app.jobUrl` and executes `window.open(app.jobUrl, '_blank')`, instantly opening the target job posting in an adjacent tab so the user can immediately submit the newly downloaded document.

---
*Generated: June 2026*
