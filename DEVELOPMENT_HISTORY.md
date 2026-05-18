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
- **Source Selection**: The PDF Maker UI allows the user to choose whether they want to compile their "CV Original" or the newly adapted "CV Généré".

## 4. UI/UX Architecture

The app uses a modern, responsive layout divided into five main tabs:
1. **Prompts**: The central hub. Left column for selecting strategies, right column for editing and compiling.
2. **Assistant IA**: Displays the streaming/final response from the chosen LLM. Includes options to copy or regenerate.
3. **Offre**: A simple, large text area for pasting the target job description.
4. **Mon CV**: The LaTeX source editor.
5. **PDF Maker**: The interface for compiling the CV and viewing the generated PDF inline.

## 5. Development Timeline & Key Decisions

- **Initial Setup**: Ported Python CLI to React. Adopted Vite + Tailwind.
- **Privacy Pivot**: Replaced the user's real CV data with the `SYNTHETIC_CV` model.
- **PDF Iteration 1 (Form Submit)**: Attempted to compile PDFs using a hidden `<form target="_blank">`. This worked but forced users into a new tab, breaking immersion.
- **PDF Iteration 2 (Fetch + Proxy)**: Rewrote the PDF engine to use `fetch()`, implemented CORS proxies, and displayed the PDF via a Blob URL inside an iframe. Added a download button.
- **AI Iteration 1 (Gemini Only)**: Integrated Gemini 1.5 Flash.
- **AI Iteration 2 (Multi-Model)**: Addressed API quota issues by expanding provider support. Added DeepSeek.
- **AI Iteration 3 (OpenRouter & Updates)**: Added OpenRouter to provide guaranteed free tiers. Updated Gemini models to reflect the 2026 deprecation of 1.5/2.0 in favor of `gemini-2.5-flash`. Added OpenAI support.
- **State & UX Iteration 4**: Implemented full `localStorage` auto-saving for job descriptions, CVs, and AI chat history. Separated the CV architecture into "Original" and "Generated" to preserve user templates. Added an "Extraire CV" regex tool to seamlessly pull LaTeX code from conversational AI responses.

## 6. Known Constraints & Future Considerations
- **API Key Security**: Keys are stored in `localStorage`. Since this is a client-side only app, this is acceptable, but users must be warned not to share their screen while keys are visible.
- **TeXLive Reliability**: The app depends entirely on the uptime of `texlive.net`. If the service goes down, PDF compilation will fail.
- **Vercel Limits**: If deployed to Vercel, ensure the serverless function timeout is sufficient to handle the proxy request to TeXLive (which can take 2-5 seconds).

---
*Generated: May 2026*
