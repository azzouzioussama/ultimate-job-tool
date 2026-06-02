# Graph Report - ultimate-job-tool  (2026-06-02)

## Corpus Check
- 83 files · ~107,828 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1161 nodes · 1209 edges · 113 communities (91 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4bfd287`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]

## God Nodes (most connected - your core abstractions)
1. `batch` - 30 edges
2. `batch` - 30 edges
3. `toast` - 29 edges
4. `dashboard` - 29 edges
5. `toast` - 29 edges
6. `dashboard` - 29 edges
7. `Similar jobs` - 28 edges
8. `Similar jobs` - 28 edges
9. `Storage Service` - 22 edges
10. `Troubleshooting Log & Bug Fixes` - 18 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `getPromptTemplates()`  [EXTRACTED]
  src/App.jsx → src/constants/promptTemplates.js
- `App()` --calls--> `useDatabase()`  [EXTRACTED]
  src/App.jsx → src/hooks/useDatabase.js
- `DashboardTab()` --calls--> `useDatabase()`  [EXTRACTED]
  src/components/tabs/DashboardTab.jsx → src/hooks/useDatabase.js
- `BatchTab()` --calls--> `useDatabase()`  [EXTRACTED]
  src/components/tabs/BatchTab.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (113 total, 22 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): dependencies, @clerk/react, dexie, dexie-react-hooks, i18next, lucide-react, mammoth, @phosphor-icons/react (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (6): useLocalStorage(), useToast(), callAIProvider(), buildLatexConversionPrompt(), extractTextFromFile(), App()

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (11): prompts, copy, copyAll, download, editorTitle, empty, generate, requireLatex (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, scripts, test (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): 1. What is Graphify?, 2. Basic Installation & Setup (One-Time), 3. How to Query the Graph (As a Developer), 4. How to Update the Graph, 5. 💡 PRO TIP: Changing the LLM Backend for Semantic Extraction, code:bash (pip install graphifyy), code:bash (graphify antigravity install), code:bash (graphify hook install) (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): ai, analyzing, clearAll, compileMultiple, compileMultipleTooltip, compileSelected, compileTooltip, copyAll (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (12): 10. Concurrency and Rate Limiting in Batch Processing, 13. Cloud Mode Strict Schema Constraints on Application Creation, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 7. JSON Parsing from AI (ATS Tester), Problem 1: API Rate Limiting (Error 429) During Parallel Request Spikes, Problem 1: Batch Queue & Manual Create failing in Clerk + Supabase Cloud Mode, Problem 2: Sequential Bottlenecks in Multi-Step Lifecycle Processing (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (26): ✅ Add a New AI Provider, ✅ Add a New Prompt Template, ✅ Add a New Scraper, ✅ Add a New Tab (New Feature), 🏗️ Architecture Diagram, code:block1 (ultimate-job-tool/), code:jsx (<option value="myservice">My Service (Custom)</option>), code:bash (# Install dependencies (first time only)) (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Answer, Q: How does the ATS scoring logic work?, Source Nodes

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Answer, Q: How the database work, Source Nodes

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (13): documents, compileError, compiling, confirmDelete, delete, downloadLatex, downloadPdf, downloadWord (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (12): table, actions, ats, atsAfter, atsBefore, company, cv, date (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (13): code:bash (git clone https://github.com/your-username/ultimate-job-tool), code:bash (npm install), code:bash (npm run dev), code:bash (pip install --ignore-installed "scrapling[all]" fastapi uvic), code:bash (python3 scratch/scrapling_server.py), ⚙️ Configuration, 📖 Documentation, 🚀 Features (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.04
Nodes (47): apiError, error, errorTitle, app, ai, auth, error, prompt (+39 more)

### Community 23 - "Community 23"
Cohesion: 0.05
Nodes (41): content, desc, title, content, desc, title, content, desc (+33 more)

### Community 24 - "Community 24"
Cohesion: 0.15
Nodes (13): documents, compileError, compiling, confirmDelete, delete, downloadLatex, downloadPdf, downloadWord (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.05
Nodes (41): content, desc, title, content, desc, title, content, desc (+33 more)

### Community 30 - "Community 30"
Cohesion: 0.04
Nodes (47): apiError, error, errorTitle, app, ai, auth, error, prompt (+39 more)

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (6): 10. Clerk + Supabase Integration Issues, Problem 1: Vite Crash with `require()`, Problem 2: Supabase Client Instantiation Crash, Problem 3: Dashboard Stuck on "Chargement...", Problem 4: Missing Clerk JWT Template & Invalid JWT Secret, Problem 5: RLS Type Mismatch (`uuid = text`)

### Community 34 - "Community 34"
Cohesion: 0.08
Nodes (24): dashboard, bulkDeleteSuccess, compileError, compiling, confirmBulkDelete, confirmDelete, confirmDeletePrompt, continueEditing (+16 more)

### Community 35 - "Community 35"
Cohesion: 0.08
Nodes (24): dashboard, bulkDeleteSuccess, compileError, compiling, confirmBulkDelete, confirmDelete, confirmDeletePrompt, continueEditing (+16 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (13): ats, adviceTitle, analyzing, clickToRun, missingCv, missingGood, missingJob, missingTitle (+5 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (15): pdf, compile, compiling, download, emptyDesc, emptyTitle, error, loadingError (+7 more)

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (12): table, actions, ats, atsAfter, atsBefore, company, cv, date (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.11
Nodes (18): ai, analyzing, clearAll, compileMultiple, compileMultipleTooltip, compileSelected, compileTooltip, copyAll (+10 more)

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (7): 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, Problem 1: Scrapfly CORS / Direct Fetch Rejection, Problem 2: Scrapfly 422 Unprocessable Entity, Problem 3: Extracted Job Description Format, Problem 4: Jina AI Extractor Boilerplate Noise, Problem 5: Indeed/Cloudflare 403 Forbidden (Jina AI), Problem 6: Mobile Copy-Paste URLs Contained Surrounding Text / Description

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (15): pdf, compile, compiling, download, emptyDesc, emptyTitle, error, loadingError (+7 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (12): job, autoCreateBtn, autoCreateBtnTooltip, autoCreateToggle, clear, extract, jina, placeholder (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.05
Nodes (42): [Astek](https://fr.linkedin.com/company/astek?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [Belmet](https://fr.linkedin.com/company/belmet?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [Belmet](https://fr.linkedin.com/company/belmet?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), Brest en vue hiring Technicien Support Informatique F/H in Brest, Brittany, France | LinkedIn, [Brest en vue](https://fr.linkedin.com/company/brestenvue?trk=public_jobs_topcard-org-name) Brest, Brittany, France, [Brest Métropole](https://fr.linkedin.com/company/brestmetropole?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [Brest Métropole](https://fr.linkedin.com/company/brestmetropole?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [CEVA SANTE ANIMALE](https://fr.linkedin.com/company/ceva-sante-animale?trk=public_jobs_similar-jobs_main-jobs-card-subtitle) (+34 more)

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (5): 11. WSL2 Development Server Blank Page, Problem 1: Vite 8 `allowedHosts` Syntax Change, Problem 2: WSL2 Port 5173 Forwarding Broken, Problem 3: ClerkProvider Missing `publishableKey` Prop, Problem 4: Application Data Disappearing on Refresh (Supabase Schema Sync)

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (5): appStringsEn, appStringsFr, dashboardStringsEn, dashboardStringsFr, locales

### Community 46 - "Community 46"
Cohesion: 0.05
Nodes (38): [Accor](https://fr.linkedin.com/company/accor?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [CENTURION SEARCH | Cabinet de recrutement](https://fr.linkedin.com/company/centurion-search?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [CNAM](https://fr.linkedin.com/company/cnam-caisse-nationale-assurance-maladie?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [ELSAN](https://fr.linkedin.com/company/elsan?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), Explore top content on LinkedIn, [FAYAT Group](https://fr.linkedin.com/company/fayat?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [France Travail](https://fr.linkedin.com/company/francetravail?trk=public_jobs_similar-jobs_main-jobs-card-subtitle), [France Travail](https://fr.linkedin.com/company/francetravail?trk=public_jobs_similar-jobs_main-jobs-card-subtitle) (+30 more)

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (11): prompts, copy, copyAll, download, editorTitle, empty, generate, requireLatex (+3 more)

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): locales, stringsEn, stringsFr

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (7): form, cancel, company, companyPlaceholder, create, jobTitle, jobTitlePlaceholder

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (3): locales, PROMPT_TEMPLATES, PROMPT_TEMPLATES_EN

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (6): status, applied, draft, interview, pdfGenerated, rejected

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (4): cv, docs, job, badge

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (4): delete, modified, open, card

### Community 57 - "Community 57"
Cohesion: 0.50
Nodes (4): 1. The TeXLive PDF Compilation Failures, Problem 1: `filename[]` Array Formatting, Problem 2: Missing Multipart Encoding, Problem 3: Invalid LaTeX Syntax

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (4): 2. The PDF Inline Display Challenge, Problem 2: Mobile Browsers Blocking Inline PDF `Blob:` URLs, Problem 3: Mobile PDF Viewer Scrolling & Text Selection Bugs, Problem: CORS & `X-Frame-Options` Blocking

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (7): form, cancel, company, companyPlaceholder, create, jobTitle, jobTitlePlaceholder

### Community 60 - "Community 60"
Cohesion: 0.11
Nodes (18): cv, clear, generatedPlaceholder, generatedTitle, importBtn, importing, loadGeneral, loadGeneralTooltip (+10 more)

### Community 61 - "Community 61"
Cohesion: 0.50
Nodes (4): 3. AI API Quota & Provider Issues, Problem 1: Gemini "Model Not Found" / Deprecation, Problem 2: DeepSeek "Insufficient Balance", Problem 3: React State Stagnation Across Providers

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (6): status, applied, draft, interview, pdfGenerated, rejected

### Community 63 - "Community 63"
Cohesion: 0.80
Nodes (4): ATS Service, buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis()

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (4): 9. Graphify Knowledge Graph Generation, code:bash (pip uninstall -y pydantic pydantic-core), Problem 1: `openai` package missing during extraction, Problem 2: Corrupted Python Environment (Pydantic `version_short` ImportError)

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (4): cv, docs, job, badge

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (4): delete, modified, open, card

### Community 67 - "Community 67"
Cohesion: 0.15
Nodes (13): ats, adviceTitle, analyzing, clickToRun, missingCv, missingGood, missingJob, missingTitle (+5 more)

### Community 68 - "Community 68"
Cohesion: 0.04
Nodes (48): compiling, completed, extracting, failed, generating, pending, saving, scraping (+40 more)

### Community 69 - "Community 69"
Cohesion: 0.04
Nodes (48): compiling, completed, extracting, failed, generating, pending, saving, scraping (+40 more)

### Community 70 - "Community 70"
Cohesion: 0.20
Nodes (10): tabs, aiAssistant, atsTest, batch, dashboard, documents, jobOffer, myCv (+2 more)

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (4): 9. Localization & UI Workflows, Problem 1: French Hardcoded Strings Leaking into English UI, Problem 2: Missing Application Creation on Manual Paste, Problem 3: Invisible/Transparent Buttons in the Batch UI & Low-Contrast Dashboard Actions

### Community 72 - "Community 72"
Cohesion: 0.17
Nodes (11): code:javascript (// CURRENT FLAWED IMPLEMENTATION:), code:javascript (const [maxConcurrency, setMaxConcurrency] = useState(2); // ), code:javascript (// NEW IMPLEMENTATION IN BatchTab.jsx:), code:javascript (} finally {), Context of the Current Codebase ("What we have here"), Guide to Implementing Batch IA (Concurrency Limits) in Ultimate Job Tool V2, Instructions for the Agent, Step 1: Add a Concurrency Setting (+3 more)

### Community 73 - "Community 73"
Cohesion: 0.83
Nodes (3): escapeAmpersands(), extractLatexFromResponse(), mergeLatexResponses()

### Community 74 - "Community 74"
Cohesion: 0.22
Nodes (10): getPromptTemplates(), Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), scrapeWithScrapling() (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.43
Nodes (4): PDF Service, compilePdfFromLatex(), downloadBlobAsPdf(), TeXLive.net API

### Community 78 - "Community 78"
Cohesion: 0.48
Nodes (5): useCloudDatabase(), useDatabase(), useLocalDatabase(), createAuthenticatedSupabaseClient(), DashboardTab()

### Community 81 - "Community 81"
Cohesion: 0.18
Nodes (10): coverLetterKeywords, coverLetterText, fieldMapping, inputId, inputName, inputPlaceholder, inputs, isMatch (+2 more)

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): 11. Scrapling Scraper & Python Backend Integration, Problem 1: Frontend Cannot Call Python Code Directly (CORS & Sandboxing), Problem 2: FastAPI Startup Failure (`TypeError: Router.__init__() got an unexpected keyword argument 'on_startup'`), Problem 3: Playwright/Patchright Missing Browser Executables or Sudo Password Requirement, Problem 4: Scrapling Integration on Production Server (Vercel Host + Local Python Helper)

### Community 83 - "Community 83"
Cohesion: 0.20
Nodes (10): tabs, aiAssistant, atsTest, batch, dashboard, documents, jobOffer, myCv (+2 more)

### Community 84 - "Community 84"
Cohesion: 0.50
Nodes (4): 12. General CV Storage & Batch AI LaTeX CV Generation, Problem 1: General/Default CV Missing or Reverting to Synthetic CV, Problem 2: Batch-Generated LaTeX CV Not Appearing in Documents or Dashboard tabs, Problem 3: Motivation Letters and Other Documents Generating as Plain Text and Failing PDF Compilation

### Community 91 - "Community 91"
Cohesion: 0.11
Nodes (18): cv, clear, generatedPlaceholder, generatedTitle, importBtn, importing, loadGeneral, loadGeneralTooltip (+10 more)

### Community 92 - "Community 92"
Cohesion: 0.22
Nodes (9): job, clear, extract, jina, placeholder, scrapfly, scrapling, title (+1 more)

### Community 94 - "Community 94"
Cohesion: 0.33
Nodes (5): envContent, inserted, supabaseKey, supabaseUrl, validPayload

### Community 95 - "Community 95"
Cohesion: 0.29
Nodes (5): clTextarea, coverLetterText, customFields, labels, labelText

### Community 96 - "Community 96"
Cohesion: 0.20
Nodes (4): createSidebar(), personalProfile, style, updateSidebarUI()

### Community 97 - "Community 97"
Cohesion: 0.13
Nodes (14): action, default_icon, default_popup, background, service_worker, content_scripts, description, host_permissions (+6 more)

### Community 98 - "Community 98"
Cohesion: 0.20
Nodes (9): 1. Synchronisation (Local et Vercel), 2. Configuration du Profil Autofill, 3. Remplissage des Formulaires de Candidature, Guide d'Installation de l'Extension Ultimate Job Tool Companion, 🔒 Limite de sécurité du navigateur et Contournement (Drag & Drop), Pour Google Chrome, Brave, Microsoft Edge ou Opera :, 🛠️ Étape 1 : Charger l'extension dans votre navigateur, 📂 Étape 2 : Icône de l'extension (+1 more)

### Community 99 - "Community 99"
Cohesion: 0.17
Nodes (11): appCard, btnAutofillNow, btnOpenApp, companyEl, docRow, existingTab, statusBadge, statusRow (+3 more)

### Community 102 - "Community 102"
Cohesion: 0.29
Nodes (5): coverLetterText, inputs, label, linksMap, placeholder

### Community 103 - "Community 103"
Cohesion: 0.33
Nodes (4): clText, customFields, labels, labelText

### Community 104 - "Community 104"
Cohesion: 0.50
Nodes (3): genericAdapter, keys, label

### Community 110 - "Community 110"
Cohesion: 0.67
Nodes (3): 14. Chrome Extension Companion Integration, Problem 1: Content Security Policy (CSP) Blocking Inline Scripts, Problem 2: Active Application Data Always Null on Initial Load

### Community 111 - "Community 111"
Cohesion: 0.67
Nodes (3): 8. Database (Dexie.js) & Architecture Refactoring, Problem 1: Cascading Renders warning with `useEffect`, Problem 2: Data Loss Risk during `localStorage` to IndexedDB Migration

## Knowledge Gaps
- **841 isolated node(s):** `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System`, `B. Dynamic Prompt Engine`, `C. Multi-Provider AI Integration` (+836 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `app` connect `Community 22` to `Community 109`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `batch` connect `Community 69` to `Community 109`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `batch` connect `Community 68` to `Community 93`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System` to the rest of the system?**
  _841 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._