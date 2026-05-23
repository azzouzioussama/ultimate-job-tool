# Graph Report - ultimate-job-tool  (2026-05-24)

## Corpus Check
- 41 files · ~27,618 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 230 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5aa4a1c6`
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
7. `Graphify Knowledge Graph Guide` - 6 edges
8. `6. Job Posting Scraper (Jina AI & Scrapfly) Issues` - 6 edges
9. `Scraper Service` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (21 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (17): dependencies, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom, react-pdf (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (25): AI Service, useToast(), TabNavigation(), tabs, OpenRouter, PDF Service, Prompt Templates, callAIProvider() (+17 more)

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
Cohesion: 0.07
Nodes (26): 1. The TeXLive PDF Compilation Failures, 2. The PDF Inline Display Challenge, 3. AI API Quota & Provider Issues, 4. UI/UX Bugs, 5. AI Hallucination & Regex Challenges, 7. JSON Parsing from AI (ATS Tester), 8. Database (Dexie.js) & Architecture Refactoring, 9. Graphify Knowledge Graph Generation (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Evolution, 2. Technical Stack, 3. Core Features & Implementation Details, 4. UI/UX Architecture, 5. Development Timeline & Key Decisions, 6. Known Constraints & Future Considerations, A. The Dual CV System, B. Dynamic Prompt Engine (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.83
Nodes (4): ATS Service, buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis()

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (6): 6. Job Posting Scraper (Jina AI & Scrapfly) Issues, Problem 1: Scrapfly CORS / Direct Fetch Rejection, Problem 2: Scrapfly 422 Unprocessable Entity, Problem 3: Extracted Job Description Format, Problem 4: Jina AI Extractor Boilerplate Noise, Problem 5: Indeed/Cloudflare 403 Forbidden (Jina AI)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Answer, Q: How does the ATS scoring logic work?, Source Nodes

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Answer, Q: How the database work, Source Nodes

## Knowledge Gaps
- **85 isolated node(s):** `Answer`, `Source Nodes`, `Answer`, `Source Nodes`, `1. What is Graphify?` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Storage Service` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `Troubleshooting Log & Bug Fixes` connect `Community 7` to `Community 10`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Scraper Service` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Answer`, `Source Nodes`, `Answer` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06448202959830866 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._