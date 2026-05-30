# Graph Report - ultimate-job-tool  (2026-05-30)

## Corpus Check
- 55 files · ~41,227 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 791 nodes · 844 edges · 63 communities (50 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `122885db`
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

## God Nodes (most connected - your core abstractions)
1. `toast` - 29 edges
2. `toast` - 29 edges
3. `dashboard` - 25 edges
4. `dashboard` - 25 edges
5. `Storage Service` - 22 edges
6. `ai` - 18 edges
7. `ai` - 18 edges
8. `pdf` - 15 edges
9. `pdf` - 15 edges
10. `ats` - 13 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `getPromptTemplates()`  [EXTRACTED]
  src/App.jsx → src/constants/promptTemplates.js
- `DashboardTab()` --calls--> `useDatabase()`  [EXTRACTED]
  src/components/tabs/DashboardTab.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useDatabase()`  [EXTRACTED]
  src/App.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js
- `App()` --calls--> `useLocalStorage()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLocalStorage.js

## Communities (63 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): dependencies, @clerk/react, dexie, dexie-react-hooks, i18next, lucide-react, mammoth, react (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (27): ATS Service, AI_PROVIDERS, CV_TEMPLATES, getPromptTemplates(), useCloudDatabase(), useDatabase(), useLocalDatabase(), useLocalStorage() (+19 more)

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
Cohesion: 0.05
Nodes (43): 10. Clerk + Supabase Integration Issues, 11. WSL2 Development Server Blank Page, 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 6. Job Posting Scraper (Jina AI & Scrapfly) Issues (+35 more)

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
Nodes (13): ats, adviceTitle, analyzing, clickToRun, missingCv, missingGood, missingJob, missingTitle (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (12): table, actions, ats, atsAfter, atsBefore, company, cv, date (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (29): toast, apiKeyRequired, apiRequiredFirst, atsError, atsMissingData, atsSuccess, compileMultipleError, compilingMultipleDone (+21 more)

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
Cohesion: 0.07
Nodes (29): toast, apiKeyRequired, apiRequiredFirst, atsError, atsMissingData, atsSuccess, compileMultipleError, compilingMultipleDone (+21 more)

### Community 32 - "Community 32"
Cohesion: 0.31
Nodes (7): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), rewrites

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (20): dashboard, compileError, compiling, confirmDelete, confirmDeletePrompt, continueEditing, deleteDoc, downloadLatex (+12 more)

### Community 35 - "Community 35"
Cohesion: 0.05
Nodes (41): cv, docs, job, delete, modified, open, dashboard, badge (+33 more)

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
Cohesion: 0.11
Nodes (18): apiError, error, errorTitle, app, ai, auth, error, prompt (+10 more)

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (15): pdf, compile, compiling, download, emptyDesc, emptyTitle, error, loadingError (+7 more)

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (11): prompts, copy, copyAll, download, editorTitle, empty, generate, requireLatex (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (10): cv, clear, generatedPlaceholder, generatedTitle, importBtn, importing, originalTitle, resetFake (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.20
Nodes (10): cv, clear, generatedPlaceholder, generatedTitle, importBtn, importing, originalTitle, resetFake (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (5): appStringsEn, appStringsFr, dashboardStringsEn, dashboardStringsFr, locales

### Community 46 - "Community 46"
Cohesion: 0.22
Nodes (9): tabs, aiAssistant, atsTest, dashboard, documents, jobOffer, myCv, pdfMaker (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (8): job, clear, extract, jina, placeholder, scrapfly, title, urlPlaceholder

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

### Community 58 - "Community 58"
Cohesion: 0.11
Nodes (18): apiError, error, errorTitle, app, ai, auth, error, prompt (+10 more)

### Community 59 - "Community 59"
Cohesion: 0.15
Nodes (13): documents, compileError, compiling, confirmDelete, delete, downloadLatex, downloadPdf, downloadWord (+5 more)

### Community 60 - "Community 60"
Cohesion: 0.18
Nodes (11): job, autoCreateBtn, autoCreateBtnTooltip, autoCreateToggle, clear, extract, jina, placeholder (+3 more)

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (9): tabs, aiAssistant, atsTest, dashboard, documents, jobOffer, myCv, pdfMaker (+1 more)

## Knowledge Gaps
- **559 isolated node(s):** `apiKeyPlaceholder`, `dashboard`, `prompts`, `aiAssistant`, `jobOffer` (+554 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dashboard` connect `Community 34` to `Community 15`, `Community 49`, `Community 51`, `Community 55`, `Community 56`, `Community 57`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `dashboard` connect `Community 35` to `Community 38`, `Community 62`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `app` connect `Community 40` to `Community 57`, `Community 30`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `apiKeyPlaceholder`, `dashboard`, `prompts` to the rest of the system?**
  _559 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.051715309779825906 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._