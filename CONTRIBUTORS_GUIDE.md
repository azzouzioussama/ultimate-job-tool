# 🛠️ Contributors Guide — Ultimate Job Tool

Welcome! This guide is written for **everyone**, from complete beginners to experienced developers. It explains how the project is organized and how to add, remove, or update any feature.

---

## 📁 Project Structure (What Goes Where)

```
ultimate-job-tool/
│
├── src/                        ← All source code lives here
│   ├── main.jsx                ← Entry point. Mounts the App into the HTML page.
│   ├── App.jsx                 ← The "brain". Manages state, wires everything together.
│   ├── App.css                 ← Global custom CSS (scrollbar styles).
│   ├── index.css               ← Tailwind CSS directives.
│   │
│   ├── constants/              ← Static data (no logic, just values)
│   │   ├── syntheticCv.js      ← The fake/demo CV template (LaTeX).
│   │   ├── promptTemplates.js  ← The 10 prompt strategy templates.
│   │   └── aiProviders.js      ← AI provider configs (models, links, pricing).
│   │
│   ├── services/               ← Business logic (NO React, NO UI)
│   │   ├── aiService.js        ← Talks to AI APIs (Gemini, OpenAI, etc.)
│   │   ├── scraperService.js   ← Scrapes job postings (Jina AI, Scrapfly).
│   │   ├── pdfService.js       ← Compiles LaTeX → PDF via TeXLive.net.
│   │   ├── atsService.js       ← Runs ATS compatibility analysis.
│   │   ├── fileUploadService.js← Extracts text from PDF/Word files.
│   │   ├── latexUtils.js       ← Fixes AI-generated LaTeX (escaping, extraction).
│   │   └── storageService.js   ← All localStorage read/write operations.
│   │
│   ├── hooks/                  ← Reusable React hooks
│   │   ├── useLocalStorage.js  ← Auto-saves state to localStorage.
│   │   └── useToast.js         ← Shows temporary popup notifications.
│   │
│   └── components/             ← UI components (rendering only, NO logic)
│       ├── layout/
│       │   ├── Header.jsx      ← Top bar (logo, provider/model selectors, API key).
│       │   ├── TabNavigation.jsx← The tab buttons (Prompts, Assistant IA, etc.)
│       │   └── Toast.jsx       ← Popup notification message.
│       │
│       └── tabs/
│           ├── PromptsTab.jsx      ← Strategy selector + prompt editor.
│           ├── AiAssistantTab.jsx  ← AI response viewer.
│           ├── JobOfferTab.jsx     ← Job description input + scraper.
│           ├── MyCvTab.jsx         ← Dual CV editor (Original + Generated).
│           ├── PdfMakerTab.jsx     ← PDF compiler + viewer.
│           └── AtsTestTab.jsx      ← ATS score dashboard.
│
├── vite.config.js              ← Dev server config (CORS proxies).
├── vercel.json                 ← Production deployment config (rewrites).
├── package.json                ← Dependencies and scripts.
├── DEVELOPMENT_HISTORY.md      ← Full project history and architecture docs.
└── TROUBLESHOOTING.md          ← Every bug we've encountered and how we fixed it.
```

---

## 🏗️ Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         App.jsx                               │
│              (State Management + Wiring)                      │
│                                                               │
│   Reads:          Calls:            Renders:                  │
│   constants/      services/         components/               │
│                                                               │
│   syntheticCv     aiService    ──→  Header                    │
│   promptTemplates scraperService──→ TabNavigation             │
│   aiProviders     pdfService   ──→  Toast                    │
│                   atsService   ──→  PromptsTab               │
│                   fileUpload   ──→  AiAssistantTab           │
│                   latexUtils   ──→  JobOfferTab              │
│                   storage      ──→  MyCvTab                  │
│                                ──→  PdfMakerTab              │
│                                ──→  AtsTestTab               │
└──────────────────────────────────────────────────────────────┘
```

**Key Rule**: Components never call services directly. They call callback functions (props) that App.jsx provides. This way, if you remove a service, only App.jsx needs to change — the components are unaffected.

---

## 🔧 How To: Common Tasks

### ✅ Add a New AI Provider

**Example**: You want to add "Anthropic (Claude)" as a 5th AI provider.

**Step 1**: Open `src/constants/aiProviders.js` and add:
```javascript
anthropic: {
  label: 'Anthropic',
  models: [
    { id: 'claude-4-haiku', label: 'Claude 4 Haiku', note: '$0.25/M in' },
  ],
  keyLink: 'https://console.anthropic.com/',
  keyNote: 'Payant',
},
```

**Step 2**: Open `src/services/aiService.js`. In the `endpoints` object, add:
```javascript
anthropic: 'https://api.anthropic.com/v1/messages',
```
If Anthropic uses a different request format than OpenAI, add an `if (provider === 'anthropic')` branch.

**Step 3**: Done! The dropdowns in the Header automatically pick up new providers.

---

### ✅ Add a New Prompt Template

**Step 1**: Open `src/constants/promptTemplates.js`.

**Step 2**: Add a new object at the end of the array:
```javascript
{
  id: 11,
  title: "11. Mon Nouveau Prompt",
  description: "Description courte ici.",
  content: `Tes instructions ici.
  
--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
}
```

**Step 3**: Done! The new prompt appears in the Prompts tab automatically.

---

### ✅ Add a New Tab (New Feature)

**Step 1**: Create the component file: `src/components/tabs/MyNewTab.jsx`
```jsx
import React from 'react';

export default function MyNewTab({ someProp }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2>My New Feature</h2>
      {/* Your UI here */}
    </div>
  );
}
```

**Step 2**: Register the tab in `src/components/layout/TabNavigation.jsx`:
```javascript
// Add to the tabs array:
{ id: 'mynew', icon: Star, label: 'New Feature' },
```

**Step 3**: Wire it in `src/App.jsx`:
```jsx
import MyNewTab from './components/tabs/MyNewTab';

// In the render section:
<div className={activeTab === 'mynew' ? 'block' : 'hidden'}>
  <MyNewTab someProp={someValue} />
</div>
```

---

### ✅ Add a New Scraper

**Step 1**: Open `src/services/scraperService.js` and add a new function:
```javascript
export async function scrapeWithMyService(url, apiKey) {
  const response = await fetch(`https://myapi.com/scrape?url=${url}&key=${apiKey}`);
  const data = await response.json();
  return data.text; // Return the extracted job description as a string
}
```

**Step 2**: Open `src/App.jsx` and add an `else if` branch in `handleScrape()`.

**Step 3**: Open `src/components/tabs/JobOfferTab.jsx` and add an `<option>` to the scraper dropdown:
```jsx
<option value="myservice">My Service (Custom)</option>
```

---

### ❌ Remove a Feature (e.g., the ATS Tester)

1. Delete `src/components/tabs/AtsTestTab.jsx`.
2. Delete `src/services/atsService.js`.
3. In `src/App.jsx`: Remove the AtsTestTab import, the `atsResult`/`isAtsLoading` state, the `handleRunATS` function, and the AtsTestTab render block.
4. In `src/components/layout/TabNavigation.jsx`: Remove the `{ id: 'ats', ... }` entry from the tabs array.
5. Build (`npm run build`) to verify no broken imports.

---

## 📝 Coding Conventions

### Comments
- Every file starts with a **docblock** explaining what it does.
- Every exported function has a **JSDoc comment** with `@param` and `@returns`.
- Tricky lines (regex, workarounds) have **inline comments** explaining why.

### File Naming
- **Constants**: `camelCase.js` (e.g., `syntheticCv.js`)
- **Services**: `camelCaseService.js` (e.g., `aiService.js`)
- **Hooks**: `useCamelCase.js` (e.g., `useLocalStorage.js`)
- **Components**: `PascalCase.jsx` (e.g., `Header.jsx`)

### Component Design
- Components receive data and callbacks via **props**.
- Components do NOT call services directly.
- Components do NOT import other components' files (no cross-dependencies).

---

## 🚀 Running the Project

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📖 More Documentation

- **DEVELOPMENT_HISTORY.md** — Complete project history, architecture, and feature descriptions.
- **TROUBLESHOOTING.md** — Every bug we've hit and how we fixed it.

---

*Last updated: May 2026*
