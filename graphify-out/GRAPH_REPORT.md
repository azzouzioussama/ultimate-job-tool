# Graph Report - ultimate-job-tool  (2026-05-24)

## Corpus Check
- 40 files · ~28,146 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 203 nodes · 209 edges · 31 communities (22 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46533d04`
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
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `Storage Service` - 22 edges
2. `Troubleshooting Log & Bug Fixes` - 10 edges
3. `getItem()` - 10 edges
4. `setItem()` - 10 edges
5. `Ultimate Job Hunting Tool - Architecture & Development History` - 7 edges
6. `3. Core Features & Implementation Details` - 7 edges
7. `Graphify Knowledge Graph Guide` - 6 edges
8. `6. Job Posting Scraper (Jina AI & Scrapfly) Issues` - 6 edges
9. `scripts` - 5 edges
10. `Scraper Service` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (31 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (17): dependencies, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom, react-pdf (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (20): CV_TEMPLATES, useToast(), PDF Service, callAIProvider(), createApplication(), db, deleteApplication(), getAllApplications() (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), rewrites

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): 1. What is Graphify?, 2. Basic Installation & Setup (One-Time), 3. How to Query the Graph (As a Developer), 4. How to Update the Graph, 5. 💡 PRO TIP: Changing the LLM Backend for Semantic Extraction, code:bash (pip install graphifyy), code:bash (graphify antigravity install), code:bash (graphify hook install) (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (32): 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, 7. JSON Parsing from AI (ATS Tester), 8. Database (Dexie.js) & Architecture Refactoring (+24 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.83
Nodes (4): ATS Service, buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis()

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Answer, Q: How does the ATS scoring logic work?, Source Nodes

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Answer, Q: How the database work, Source Nodes

## Knowledge Gaps
- **87 isolated node(s):** `CV_TEMPLATES`, `Answer`, `Source Nodes`, `Answer`, `Source Nodes` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `CV_TEMPLATES`, `Answer`, `Source Nodes` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09425287356321839 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._