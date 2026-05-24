# Graph Report - ultimate-job-tool  (2026-05-24)

## Corpus Check
- 43 files · ~28,985 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 222 nodes · 227 edges · 32 communities (22 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4bda96ee`
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]

## God Nodes (most connected - your core abstractions)
1. `Storage Service` - 22 edges
2. `Troubleshooting Log & Bug Fixes` - 10 edges
3. `getItem()` - 10 edges
4. `setItem()` - 10 edges
5. `Ultimate Job Hunting Tool - Architecture & Development History` - 7 edges
6. `3. Core Features & Implementation Details` - 7 edges
7. `useDatabase()` - 6 edges
8. `Graphify Knowledge Graph Guide` - 6 edges
9. `6. Job Posting Scraper (Jina AI & Scrapfly) Issues` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useDatabase()`  [EXTRACTED]
  src/App.jsx → src/hooks/useDatabase.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (32 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): dependencies, @clerk/react, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (17): ATS Service, CV_TEMPLATES, useToast(), PDF Service, callAIProvider(), buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis() (+9 more)

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
Cohesion: 0.06
Nodes (32): 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, 7. JSON Parsing from AI (ATS Tester), 8. Database (Dexie.js) & Architecture Refactoring (+24 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Answer, Q: How does the ATS scoring logic work?, Source Nodes

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Answer, Q: How the database work, Source Nodes

### Community 24 - "Community 24"
Cohesion: 0.31
Nodes (5): useCloudDatabase(), useDatabase(), useLocalDatabase(), createAuthenticatedSupabaseClient(), supabase

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (7): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), rewrites

## Knowledge Gaps
- **100 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08866995073891626 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._