# Graph Report - ultimate-job-tool  (2026-05-25)

## Corpus Check
- 45 files · ~29,589 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 271 nodes · 322 edges · 31 communities (21 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `52e88375`
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
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `Storage Service` - 22 edges
2. `getItem()` - 11 edges
3. `setItem()` - 11 edges
4. `Troubleshooting Log & Bug Fixes` - 11 edges
5. `useDatabase()` - 7 edges
6. `Ultimate Job Hunting Tool - Architecture & Development History` - 7 edges
7. `3. Core Features & Implementation Details` - 7 edges
8. `🛠️ Contributors Guide — Ultimate Job Tool` - 7 edges
9. `Graphify Knowledge Graph Guide` - 6 edges
10. `6. Job Posting Scraper (Jina AI & Scrapfly) Issues` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useDatabase()`  [EXTRACTED]
  src/App.jsx → src/hooks/useDatabase.js
- `DashboardTab()` --calls--> `useDatabase()`  [EXTRACTED]
  src/components/tabs/DashboardTab.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js
- `App()` --calls--> `useLocalStorage()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLocalStorage.js
- `useCloudDatabase()` --calls--> `createAuthenticatedSupabaseClient()`  [EXTRACTED]
  src/hooks/useDatabase.js → src/services/supabaseClient.js

## Communities (31 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): dependencies, @clerk/react, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (16): ATS Service, CV_TEMPLATES, PROMPT_TEMPLATES, useLocalStorage(), useToast(), TabNavigation(), tabs, callAIProvider() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (13): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, scripts, test (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): 1. What is Graphify?, 2. Basic Installation & Setup (One-Time), 3. How to Query the Graph (As a Developer), 4. How to Update the Graph, 5. 💡 PRO TIP: Changing the LLM Backend for Semantic Extraction, code:bash (pip install graphifyy), code:bash (graphify antigravity install), code:bash (graphify hook install) (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (38): 10. Clerk + Supabase Integration Issues, 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, 7. JSON Parsing from AI (ATS Tester) (+30 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (14): ✅ Add a New AI Provider, ✅ Add a New Prompt Template, ✅ Add a New Scraper, ✅ Add a New Tab (New Feature), code:jsx (<option value="myservice">My Service (Custom)</option>), code:javascript (anthropic: {), code:javascript (anthropic: 'https://api.anthropic.com/v1/messages',), code:javascript ({) (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Answer, Q: How does the ATS scoring logic work?, Source Nodes

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Answer, Q: How the database work, Source Nodes

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (12): 🏗️ Architecture Diagram, code:block1 (ultimate-job-tool/), code:bash (# Install dependencies (first time only)), code:block2 (┌───────────────────────────────────────────────────────────), 📝 Coding Conventions, Comments, Component Design, 🛠️ Contributors Guide — Ultimate Job Tool (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (5): PDF Service, compilePdfFromLatex(), downloadBlobAsPdf(), TeXLive.net API, Vite Configuration

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 24 - "Community 24"
Cohesion: 0.46
Nodes (5): useCloudDatabase(), useDatabase(), useLocalDatabase(), createAuthenticatedSupabaseClient(), DashboardTab()

### Community 32 - "Community 32"
Cohesion: 0.31
Nodes (7): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), rewrites

## Knowledge Gaps
- **122 isolated node(s):** `rewrites`, `firebaseConfig`, `App`, `name`, `private` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `rewrites`, `firebaseConfig`, `App` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06852497096399536 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._