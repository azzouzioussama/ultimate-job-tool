# Ultimate Job Tool

**Ultimate Job Tool** is a comprehensive, local-first React web application designed to streamline the job application process. It helps you manage multiple versions of your resume, automatically extract job descriptions, use AI to generate tailored cover letters and interview prep materials, and compile LaTeX resumes directly in the browser—all while keeping your personal data completely private and local.

## 🚀 Features

- **Local-First & Privacy-Focused**: No external databases. Your job applications, AI chat history, API keys, and CVs are securely stored in your browser's `localStorage` and `IndexedDB`.
- **Dual CV System**: Safeguard your real identity using a "Synthetic CV" that strips Personally Identifiable Information (PII) before sending context to AI models.
- **AI-Powered Assistant**: Connect directly to your favorite LLM APIs (OpenRouter, Gemini, OpenAI, DeepSeek) using your own keys. Includes 10 pre-configured expert prompt strategies (Cover Letters, Interview Q&A, Networking outreach, etc.).
- **Smart Job Scraping & Auto-Creation**: Paste a URL and extract the job description via Jina AI or Scrapfly. Automatically extracts the job title and company name to instantly create a new tracking card. Supports manual pasting with a one-click auto-create button.
- **In-Browser LaTeX PDF Compilation**: Instantly preview and compile your LaTeX resume into a clean PDF using the `texlive.net` integration—without needing a local LaTeX installation.
- **ATS Parsing Test**: Automatically score your CV against a job description before and after AI optimization to maximize your interview chances.
- **Multi-Format Export**: Download generated documents in `.tex`, `.pdf`, or `.doc` format.
- **Bilingual Interface**: Seamlessly switch between English and French.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 & Vite
- **Styling**: Tailwind CSS, Lucide React icons
- **State & Data**: React Hooks, `dexie` (IndexedDB for structured storage)
- **Internationalization**: `react-i18next`
- **PDF Compilation**: `texlive.net` CGI wrapper via proxy

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ultimate-job-tool.git
   cd ultimate-job-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` (or the port specified by Vite) to use the app.

## 🐍 Scrapling Local Scraper Server Setup

To use the **Scrapling (Local)** scraper option in the app, you need to start the Python micro-server in the background:

1. **Install Python dependencies:**
   ```bash
   pip install --ignore-installed "scrapling[all]" fastapi uvicorn markdownify
   python3 -m patchright install
   ```

2. **Start the scraper server:**
   ```bash
   python3 scratch/scrapling_server.py
   ```
   The backend will run at `http://localhost:8000` and proxy scraping requests from `/api/scrapling` automatically.

## 📂 Project Structure

- `src/App.jsx`: Central hub managing global state, routing, and overarching logic.
- `src/components/tabs/`: Contains the modular UI views (Dashboard, Prompts, AI Assistant, Job Offer, My Resume, Documents, PDF Maker, ATS Test).
- `src/services/`: Abstracted business logic (e.g., `aiService.js`, `pdfService.js`, `scraperService.js`).
- `src/hooks/`: Custom React hooks, notably `useDatabase.js` for IndexedDB and `localStorage` abstraction.
- `src/locales/`: Translation dictionaries for English (`en.json`) and French (`fr.json`).

## ⚙️ Configuration

The app uses standard Vite configuration. If you need the PDF compilation proxy to work in production, ensure your deployment platform (like Vercel) routes `/latexcgi/` requests to `https://texlive.net/cgi-bin/latexcgi`.

## 📖 Documentation

For more in-depth information about the architecture and known issues, please refer to:
- `DEVELOPMENT_HISTORY.md`: Full log of architectural decisions, feature iterations, and app evolution.
- `TROUBLESHOOTING.md`: Common bugs encountered during development and their solutions.
- `CONTRIBUTORS_GUIDE.md`: Guidelines for adding new features or making structural changes.

---
*Built to make job hunting faster, smarter, and completely private.*
