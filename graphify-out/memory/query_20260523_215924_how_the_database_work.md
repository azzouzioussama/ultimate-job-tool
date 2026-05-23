---
type: "query"
date: "2026-05-23T21:59:24.316473+00:00"
question: "How the database work"
contributor: "graphify"
source_nodes: ["db.js", "App.jsx", "createApplication()", "getApplication()", "updateApplication()", "deleteApplication()", "getAllApplications()"]
---

# Q: How the database work

## Answer

Based on the knowledge graph, the database logic is encapsulated in src/services/db.js. This file exports the core 'db' instance and provides several CRUD operations to interact with it: createApplication() (src/services/db.js at loc=L28), getApplication() (src/services/db.js at loc=L37), updateApplication() (src/services/db.js at loc=L41), deleteApplication() (src/services/db.js at loc=L48), and getAllApplications() (src/services/db.js at loc=L52). These functions are imported and used by the main App.jsx and the DashboardTab.jsx to manage the data.

## Source Nodes

- db.js
- App.jsx
- createApplication()
- getApplication()
- updateApplication()
- deleteApplication()
- getAllApplications()