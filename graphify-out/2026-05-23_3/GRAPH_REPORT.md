# Graph Report - ultimate-job-tool  (2026-05-23)

## Corpus Check
- 38 files · ~26,881 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 175 nodes · 207 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70471c7b`
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `Storage Service` - 23 edges
2. `Troubleshooting Log & Bug Fixes` - 10 edges
3. `getItem()` - 10 edges
4. `setItem()` - 10 edges
5. `Ultimate Job Hunting Tool - Architecture & Development History` - 7 edges
6. `3. Core Features & Implementation Details` - 7 edges
7. `6. Job Posting Scraper (Jina AI & Scrapfly) Issues` - 6 edges
8. `Scraper Service` - 6 edges
9. `scripts` - 5 edges
10. `DashboardTab()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (17 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (17): dependencies, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom, react-pdf (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (22): AI Service, ATS Service, useToast(), TabNavigation(), tabs, OpenRouter, PDF Service, Prompt Templates (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), rewrites

### Community 5 - "Community 5"
Cohesion: 0.36
Nodes (7): createApplication(), db, deleteApplication(), getAllApplications(), getApplication(), updateApplication(), DashboardTab()

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (32): 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, 7. JSON Parsing from AI (ATS Tester), 8. Database (Dexie.js) & Architecture Refactoring (+24 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

## Knowledge Gaps
- **70 isolated node(s):** `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System`, `B. Dynamic Prompt Engine`, `C. Multi-Provider AI Integration` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Storage Service` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `Scraper Service` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `Core Objectives of v3`, `2. Technical Stack`, `A. The Dual CV System` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._