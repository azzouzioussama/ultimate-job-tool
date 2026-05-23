---
type: "query"
date: "2026-05-23T20:27:27.953162+00:00"
question: "How does the ATS scoring logic work?"
contributor: "graphify"
source_nodes: ["ATS Service", "AtsTestTab()", "buildAtsPrompt()", "runAtsAnalysis()", "cleanJsonResponse()"]
---

# Q: How does the ATS scoring logic work?

## Answer

Based on the knowledge graph, the ATS scoring logic is handled by the ATS Service (src/services/atsService.js). The AtsTestTab component (src/components/tabs/AtsTestTab.jsx loc=L28) orchestrates this by utilizing the service which is composed of three main functions: buildAtsPrompt() (src/services/atsService.js loc=L30), runAtsAnalysis() (src/services/atsService.js loc=L82), and cleanJsonResponse() (src/services/atsService.js loc=L62). The graph lacks enough detailed information to describe the exact data flow.

## Source Nodes

- ATS Service
- AtsTestTab()
- buildAtsPrompt()
- runAtsAnalysis()
- cleanJsonResponse()