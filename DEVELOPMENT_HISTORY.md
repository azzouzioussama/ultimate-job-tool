# Ultimate Job Hunting Tool - Architecture & Development History

This document encapsulates the complete history, architecture, design decisions, and final feature set of the "Ultimate Job Tool" React application. It serves as the definitive reference for the project.

## 1. Project Overview & Evolution

The project began as a Python CLI tool (v1) and evolved into a web application (v2) with Firebase backend integration. The current version (v3) represents a shift towards a **local-first, privacy-focused, single-page React application**.

### Core Objectives of v3
- Consolidate all logic into a single React file (`src/App.jsx`) for simplicity and ease of deployment.
- Remove external backend dependencies (like Firebase) to ensure user data remains entirely local.
- Protect user privacy by generating a "Synthetic CV" that strips PII (Name, Contact, Employer names).
- Integrate advanced LLM providers to generate expert-level cover letters and job application materials.
- Provide a seamless LaTeX to PDF compilation experience directly within the browser.

## 2. Technical Stack

- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS (Utility-first styling, responsive design)
- **Icons**: Lucide React
- **Build Tool**: Vite (configured with proxy routes for CORS bypass)
- **Deployment**: Vercel
- **Data Persistence**: `localStorage` (for API keys, model preferences, CV content, job descriptions, and AI chat history)

## 3. Core Features & Implementation Details

### A. The Dual CV System
To protect the user's real identity, the app uses a `SYNTHETIC_CV` constant as a fallback. 
- **CV Original (Source de vérité)**: The user's base CV. This is what the AI uses as context to adapt the application.
- **CV Généré (Adapté)**: A separate workspace specifically for the AI's output, preventing the user's master CV from being overwritten.
- **Implementation**: Both CVs are auto-saved to `localStorage` on every keystroke. A "Rétablir CV Fake" button allows reverting the Original CV to the safe, anonymized `SYNTHETIC_CV` template.

### B. Dynamic Prompt Engine
The app ships with 10 pre-configured, expert-level prompt strategies (e.g., Cover Letter, Q&A Preparation, LinkedIn Outreach).
- **Variable Injection**: The prompt templates use placeholders `{cv_content}` and `{job_description}`. The app dynamically replaces these with the current state of the CV and the user-pasted job offer.
- **Live Preview & Export**: The "Éditeur de Prompt" shows the final compiled prompt in real-time. Users can download it as a `.txt` file, or copy the compiled version via a dedicated "Copier (Externe)" button to use with external AI tools.

### C. Multi-Provider AI Integration
The app acts as a client to multiple LLM APIs. This allows users to bring their own API keys and choose the best/cheapest models.
- **Supported Providers**:
  1. **OpenRouter**: Selected as the default for access to free models like `deepseek-v4-flash:free`.
  2. **Gemini**: Connects directly to Google's API using `gemini-2.5-flash`.
  3. **OpenAI**: Connects to the standard chat completions endpoint (supports `gpt-5.4-mini`, `o4-mini`, etc.).
  4. **DeepSeek**: Connects directly to DeepSeek's paid API.
- **Implementation Mechanism**:
  - The `handleRunAI` function branches based on the provider.
  - Gemini uses its specific `v1beta:generateContent` endpoint format.
  - OpenAI, DeepSeek, and OpenRouter all share the standard OpenAI-compatible `v1/chat/completions` format.
  - API keys and selected models are stored persistently in `localStorage` per provider.

### D. In-Browser PDF Compilation
One of the most complex features is compiling the user's LaTeX CV into a PDF without requiring a local LaTeX installation.
- **Backend Service**: Uses the public, official `texlive.net` CGI compilation service.
- **The CORS Challenge**: Direct `fetch` requests from localhost to `texlive.net` fail due to CORS restrictions.
- **The Proxy Solution**:
  - In development (`vite.config.js`), a proxy is set up to route `/api/latex` to `texlive.net`.
  - In production (`vercel.json`), serverless rewrites handle the same routing.
- **The Redirect Challenge**: TeXLive responds with a `301 Moved Permanently` to a temporary PDF URL (e.g., `/latexcgi/document_XYZ.pdf`). The proxy config handles this by also forwarding `/latexcgi/*` paths.
- **Inline Display**: Instead of forcing a new tab, the `fetch` request retrieves the PDF as a Blob. A local Object URL (`blob:http://...`) is generated and passed to an `<iframe>`, allowing seamless inline preview within the app.
- **Mobile Canvas Rendering**: Mobile browsers natively block `blob:` URLs in `<iframe>` tags. To solve this, the app detects mobile devices and dynamically swaps the `iframe` for `react-pdf` (a React wrapper for Mozilla's `pdf.js`). This renders the PDF directly onto HTML `<canvas>` elements, fully bypassing mobile restrictions.
- **Source Selection**: The PDF Maker UI allows the user to choose whether they want to compile their "CV Original" or the newly adapted "CV Généré".

### E. Job Posting Scraping & Auto-Extraction
To simplify adding job descriptions without copying and pasting manually, the app integrates job board scrapers.
- **Services**: Supports Jina AI (free, text-based markdown reader) and Scrapfly (API-key based web scraping with JS rendering and AI-powered extraction).
- **Scrapfly AI Model**: Uses Scrapfly's pre-trained `job_posting` model to parse messy web content into structured JSON data.
- **The CORS & Proxy Solution**: To call the Scrapfly API directly without exposing keys or facing browser CORS blocks, the `/api/scrapfly` endpoint acts as a proxy:
  - Vite server routes `/api/scrapfly` to `api.scrapfly.io` rewriting to the `/scrape` path in development.
  - Vercel serverless rewrites handle it in production.
- **Refined Data Extraction**: Rather than dumping raw structured JSON metadata (e.g. company, salary, quality indicators), the parser specifically extracts the target `jobDescription` string for use in the dynamic prompts, falling back to full JSON only when the field is absent.

### F. CV Converter & ATS Testing
To assist non-technical users, the app provides tools to import existing documents and test their performance:
- **Client-Side Document Parsing**: Uses `pdf.js` for PDF files and `mammoth` for Word (`.docx`) files to extract raw text completely locally in the browser, preserving user privacy.
- **AI LaTeX Conversion**: The extracted raw text is sent to the user's configured LLM with a strict prompt to format the unstructured text into a clean LaTeX document.
- **ATS Compatibility Tool**: A dedicated tab that cross-references the current Job Description with the CV (Original or Generated). The AI acts as a strict Applicant Tracking System, returning a parsed JSON response containing a compatibility score out of 100, a list of missing keywords, and actionable advice.

## 4. UI/UX Architecture

The app uses a modern, responsive layout divided into five main tabs:
1. **Prompts**: The central hub. Left column for selecting strategies, right column for editing and compiling.
2. **Assistant IA**: Displays the streaming/final response from the chosen LLM. Includes options to copy or regenerate.
3. **Offre**: A simple, large text area for pasting the target job description. Supports scrapers (Jina AI & Scrapfly) via URL input.
4. **Mon CV**: The LaTeX source editor, including the PDF/Word CV import tool.
5. **PDF Maker**: The interface for compiling the CV and viewing the generated PDF inline.
6. **Test ATS**: A dashboard displaying the AI-generated compatibility score, missing keywords, and advice.

## 5. Development Timeline & Key Decisions

- **Initial Setup**: Ported Python CLI to React. Adopted Vite + Tailwind.
- **Privacy Pivot**: Replaced the user's real CV data with the `SYNTHETIC_CV` model.
- **PDF Iteration 1 (Form Submit)**: Attempted to compile PDFs using a hidden `<form target="_blank">`. This worked but forced users into a new tab, breaking immersion.
- **PDF Iteration 2 (Fetch + Proxy)**: Rewrote the PDF engine to use `fetch()`, implemented CORS proxies, and displayed the PDF via a Blob URL inside an iframe. Added a download button.
- **AI Iteration 1 (Gemini Only)**: Integrated Gemini 1.5 Flash.
- **AI Iteration 2 (Multi-Model)**: Addressed API quota issues by expanding provider support. Added DeepSeek.
- **AI Iteration 3 (OpenRouter & Updates)**: Added OpenRouter to provide guaranteed free tiers. Updated Gemini models to reflect the 2026 deprecation of 1.5/2.0 in favor of `gemini-2.5-flash`. Added OpenAI support.
- **State & UX Iteration 4**: Implemented full `localStorage` auto-saving for job descriptions, CVs, and AI chat history. Separated the CV architecture into "Original" and "Generated" to preserve user templates. Added an "Extraire CV" regex tool to seamlessly pull LaTeX code from conversational AI responses.
- **Mobile PDF & Responsive UI Iteration 5**: Fixed mobile layout squishing by refactoring flex containers to wrap properly. Resolved mobile `iframe` PDF blocking by integrating `react-pdf` (`pdf.js`) for canvas-based rendering specifically on mobile devices. Fixed mobile scroll trapping by unbounding the container height (`h-auto`) to utilize native window scrolling, and re-enabled `renderTextLayer` to allow text selection on the mobile canvas.
- **Job Scraping Integration (May 2026)**: Integrated Jina AI and Scrapfly. Handled Scrapfly CORS rejections using proxy configurations (`/api/scrapfly`), fixed 422 API errors by using the correct `job_posting` model parameter, and targeted the parser specifically to the `jobDescription` JSON response field. Added a stateful Markdown cleanup heuristic (`cleanJinaMarkdown`) for Jina AI Reader to strip out website navigation menus, cookie consent popups, signup forms, social media widgets, and related jobs recommendations. Added an explicit block to prevent Jina AI from being used on Indeed due to 403 Cloudflare restrictions, and enabled Anti Scraping Protection (`asp: 'true'`) for Scrapfly to ensure reliable scraping of bot-protected sites.
- **CV Import & ATS Iteration 6**: Added local file parsing (`pdfjs-dist` and `mammoth`) to extract text from PDFs and Word documents without backend processing, converting them to LaTeX via AI. Added a new ATS testing interface that evaluates the CV against the job description, strictly parsing JSON from the AI to display compatibility scores and missing keywords.
- **Architecture Decoupling Iteration 7**: Refactored the monolithic 1,400+ line `App.jsx` by extracting business logic into `services/` (AI, Scraper, Storage, PDF, ATS, Upload), UI into modular `components/tabs/`, and static data into `constants/`. This significantly improved maintainability and allowed for easier feature expansion.
- **Local-First Database Iteration 8**: Migrated from a single-slot `localStorage` architecture to a robust IndexedDB implementation using `dexie.js`. This enabled multi-tenant job tracking, allowing users to save, switch between, and manage multiple job applications from a new central "Dashboard" tab while preserving absolute privacy (no cloud backend).
- **Graphify AI Knowledge Graph Integration (Iteration 9)**: Implemented `graphifyy` to transform the codebase into a queryable semantic knowledge graph (`graph.json`). Installed the Antigravity skill (`graphify antigravity install`) and automated graph rebuilding via Git hooks (`graphify hook install`). This allows AI coding assistants to conduct precise impact analyses and map architectural call flows instantly, significantly reducing LLM token context bloat.
- **Cloud Database & Authentication (Iteration 10)**: Transitioned the app to a true dual-mode architecture. Integrated Clerk for seamless authentication and Supabase for cloud database storage, enabling cross-device synchronization for user applications. Re-engineered `useDatabase.js` to intelligently fall back to local `localStorage` if environment variables (Vercel) or Clerk configuration are missing, preventing application crashes and preserving the local-first philosophy when cloud features are unavailable. Resolved deep integration issues with RLS policies, Vite ESM module conflicts, and JWT template configurations.
- **Multi-Prompt System & WSL2 Dev Fixes (Iteration 11)**: Overhauled the prompt system to support **multi-prompt selection and parallel AI execution** — users can now select multiple prompt templates (e.g., Cover Letter + Q&A Prep) and generate all responses simultaneously with N assistants. AI responses are displayed as individually selectable cards with checkboxes, allowing users to merge any combination into a single LaTeX document for PDF compilation. Added LaTeX output constraints to all prompt templates. Fixed critical WSL2 development server issues: migrated `allowedHosts` from Vite 5/6 string syntax (`'all'`) to Vite 8 boolean syntax (`true`), changed the default dev server port from 5173 to 3000 to work around broken WSL2 port forwarding, and added the explicit `publishableKey` prop to `ClerkProvider` in `main.jsx`. Used Cloudflare Tunnel (`cloudflared`) as a diagnostic/access tool to confirm the app code was healthy while isolating the WSL2 networking issue.
- **Dashboard Tracking & Auto-Create (Iteration 12)**: Upgraded the Dashboard to track the full lifecycle of an application, introducing `trackingStatus`, before/after ATS scores (`atsScoreBefore`, `atsScoreAfter`), and direct JSON persistence of generated LaTeX responses (`promptResponses`) accessible via an accordion UI for quick downloading. Implemented an **Auto-Create Workflow** in the Scraper Tab that automatically queries the active AI to extract the Company Name and Job Title from raw scraped markdown, instantly instantiating a new database application and switching context to it. Resolved a critical data-loss issue by persisting the previously ephemeral AI chat history (`aiResponses`) directly into the database per application, ensuring generated CVs and cover letters are never lost on page refresh. Fixed cascading Supabase save failures by synchronizing the local state models with the PostgreSQL schema.

## 6. Known Constraints & Future Considerations
- **API Key Security**: Keys are stored in `localStorage`. Since this is a client-side only app, this is acceptable, but users must be warned not to share their screen while keys are visible.
- **TeXLive Reliability**: The app depends entirely on the uptime of `texlive.net`. If the service goes down, PDF compilation will fail.
- **Vercel Limits**: If deployed to Vercel, ensure the serverless function timeout is sufficient to handle the proxy request to TeXLive (which can take 2-5 seconds).

---
*Generated: May 2026*
