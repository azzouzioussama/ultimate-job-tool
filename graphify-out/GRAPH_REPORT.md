# Graph Report - ultimate-job-tool  (2026-05-28)

## Corpus Check
- 55 files · ~40,311 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 734 nodes · 785 edges · 55 communities (41 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0b7aeea`
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

## God Nodes (most connected - your core abstractions)
1. `toast` - 29 edges
2. `toast` - 29 edges
3. `Storage Service` - 22 edges
4. `ai` - 16 edges
5. `ai` - 16 edges
6. `pdf` - 15 edges
7. `pdf` - 15 edges
8. `dashboard` - 14 edges
9. `dashboard` - 14 edges
10. `ats` - 13 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `getPromptTemplates()`  [EXTRACTED]
  src/App.jsx → src/constants/promptTemplates.js
- `App()` --calls--> `useDatabase()`  [EXTRACTED]
  src/App.jsx → src/hooks/useDatabase.js
- `DashboardTab()` --calls--> `useDatabase()`  [EXTRACTED]
  src/components/tabs/DashboardTab.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js
- `App()` --calls--> `useLocalStorage()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLocalStorage.js

## Communities (55 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): dependencies, @clerk/react, dexie, dexie-react-hooks, i18next, lucide-react, mammoth, react (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (3): callAIProvider(), buildLatexConversionPrompt(), extractTextFromFile()

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (47): cv, clear, generatedPlaceholder, generatedTitle, importBtn, importing, originalTitle, resetFake (+39 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, scripts, test (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): 1. What is Graphify?, 2. Basic Installation & Setup (One-Time), 3. How to Query the Graph (As a Developer), 4. How to Update the Graph, 5. 💡 PRO TIP: Changing the LLM Backend for Semantic Extraction, code:bash (pip install graphifyy), code:bash (graphify antigravity install), code:bash (graphify hook install) (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.80
Nodes (4): ATS Service, buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis()

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
Cohesion: 0.04
Nodes (43): ai, analyzing, clearAll, compileMultiple, compileMultipleTooltip, compileSelected, compileTooltip, copyAll (+35 more)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 22 - "Community 22"
Cohesion: 0.04
Nodes (47): apiError, error, errorTitle, app, ai, auth, error, prompt (+39 more)

### Community 23 - "Community 23"
Cohesion: 0.05
Nodes (41): content, desc, title, content, desc, title, content, desc (+33 more)

### Community 24 - "Community 24"
Cohesion: 0.46
Nodes (5): useCloudDatabase(), useDatabase(), useLocalDatabase(), createAuthenticatedSupabaseClient(), DashboardTab()

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
Cohesion: 0.06
Nodes (34): cv, docs, job, delete, modified, open, dashboard, badge (+26 more)

### Community 35 - "Community 35"
Cohesion: 0.06
Nodes (34): cv, docs, job, delete, modified, open, dashboard, badge (+26 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (13): ats, adviceTitle, analyzing, clickToRun, missingCv, missingGood, missingJob, missingTitle (+5 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (15): pdf, compile, compiling, download, emptyDesc, emptyTitle, error, loadingError (+7 more)

### Community 38 - "Community 38"
Cohesion: 0.15
Nodes (13): ats, adviceTitle, analyzing, clickToRun, missingCv, missingGood, missingJob, missingTitle (+5 more)

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (16): ai, analyzing, clearAll, compileMultiple, compileMultipleTooltip, compileSelected, compileTooltip, copyAll (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (18): apiError, error, errorTitle, app, ai, auth, error, prompt (+10 more)

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (15): pdf, compile, compiling, download, emptyDesc, emptyTitle, error, loadingError (+7 more)

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (11): prompts, copy, copyAll, download, editorTitle, empty, generate, requireLatex (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (4): getPromptTemplates(), useLocalStorage(), useToast(), App()

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (5): appStringsEn, appStringsFr, dashboardStringsEn, dashboardStringsFr, locales

### Community 47 - "Community 47"
Cohesion: 0.50
Nodes (4): PDF Service, compilePdfFromLatex(), downloadBlobAsPdf(), TeXLive.net API

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): locales, stringsEn, stringsFr

### Community 49 - "Community 49"
Cohesion: 0.83
Nodes (3): escapeAmpersands(), extractLatexFromResponse(), mergeLatexResponses()

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (3): locales, PROMPT_TEMPLATES, PROMPT_TEMPLATES_EN

### Community 51 - "Community 51"
Cohesion: 0.22
Nodes (9): tabs, aiAssistant, atsTest, dashboard, documents, jobOffer, myCv, pdfMaker (+1 more)

## Knowledge Gaps
- **504 isolated node(s):** `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System`, `B. Dynamic Prompt Engine`, `C. Multi-Provider AI Integration` (+499 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `app` connect `Community 40` to `Community 3`, `Community 30`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `app` connect `Community 22` to `Community 14`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `templates` connect `Community 23` to `Community 3`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System` to the rest of the system?**
  _504 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._