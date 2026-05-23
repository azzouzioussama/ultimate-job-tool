# Graph Report - ultimate-job-tool  (2026-05-23)

## Corpus Check
- 38 files · ~26,664 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 132 nodes · 163 edges · 28 communities (16 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59374021`
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `Storage Service` - 23 edges
2. `getItem()` - 10 edges
3. `setItem()` - 10 edges
4. `Scraper Service` - 7 edges
5. `scripts` - 5 edges
6. `DashboardTab()` - 5 edges
7. `PDF Service` - 5 edges
8. `runAtsAnalysis()` - 4 edges
9. `ATS Service` - 4 edges
10. `App()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `TeXLive PDF Compilation Failures` --conceptually_related_to--> `PDF Service`  [INFERRED]
  TROUBLESHOOTING.md → src/services/pdfService.js
- `Job Posting Scraper Issues` --conceptually_related_to--> `Scraper Service`  [INFERRED]
  TROUBLESHOOTING.md → src/services/scraperService.js
- `App()` --calls--> `useToast()`  [EXTRACTED]
  src/App.jsx → src/hooks/useToast.js

## Communities (28 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (23): Dexie.js (IndexedDB), getAiModel(), getAiProvider(), getAiResponse(), getApiKey(), getCvGenerated(), getCvOriginal(), getItem() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (17): dependencies, dexie, dexie-react-hooks, lucide-react, mammoth, react, react-dom, react-pdf (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.21
Nodes (5): Prompt Templates, callAIProvider(), buildLatexConversionPrompt(), extractTextFromFile(), Synthetic CV Template

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (8): Jina AI Reader, Scraper Service, Scrapfly API, cleanJinaMarkdown(), scrapeWithJina(), scrapeWithScrapfly(), Job Posting Scraper Issues, rewrites

### Community 5 - "Community 5"
Cohesion: 0.36
Nodes (7): createApplication(), db, deleteApplication(), getAllApplications(), getApplication(), updateApplication(), DashboardTab()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (6): PDF Service, compilePdfFromLatex(), downloadBlobAsPdf(), TeXLive.net API, TeXLive PDF Compilation Failures, Vite Configuration

### Community 8 - "Community 8"
Cohesion: 0.83
Nodes (4): ATS Service, buildAtsPrompt(), cleanJsonResponse(), runAtsAnalysis()

## Knowledge Gaps
- **43 isolated node(s):** `graphify`, `Workflow: graphify`, `rewrites`, `firebaseConfig`, `app` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Storage Service` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Why does `Scraper Service` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `graphify`, `Workflow: graphify`, `rewrites` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._