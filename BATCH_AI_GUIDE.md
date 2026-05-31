# Guide to Implementing Batch IA (Concurrency Limits) in Ultimate Job Tool V2

**ATTENTION AI AGENT:** 
Do **NOT** implement a generic `callAIBatch` function in `aiService.js`. The Ultimate Job Tool V2 already has a complex, multi-step batching pipeline implemented inside `src/components/tabs/BatchTab.jsx`. 

Your goal is to **add concurrency limits (rate limiting)** directly into `BatchTab.jsx` so that the app doesn't send 50 requests at the exact same time and crash the APIs (Error 429).

## Context of the Current Codebase ("What we have here")

1. **The Pipeline (`processItem`)**: Inside `BatchTab.jsx`, there is a function called `processItem(itemId, itemIndex)`. This function is responsible for the *entire* lifecycle of a single job offer:
   - Step 1: Scrape URL (`scrapeWithJina` / `scrapeWithScrapfly`)
   - Step 2: Extract jobTitle and companyName (`callAIProvider`)
   - Step 3: Create database entry (`createApplication`)
   - Step 4: Generate CV & Letters (`callAIProvider` in a loop over templates)
   - Step 5: Compile PDFs (`compilePdfFromLatex`)

2. **The Bug/Missing Feature**: Currently, the processing loop in `BatchTab.jsx` looks like this:
   ```javascript
   // CURRENT FLAWED IMPLEMENTATION:
   useEffect(() => {
     if (!isPlaying) return;
     items.forEach((item, index) => {
       if (item.status === 'pending') {
         processItem(item.id, index); // <--- Starts ALL pending items AT ONCE!
       }
     });
   }, [isPlaying, items.length]);
   ```
   This triggers all pending tasks concurrently. If the user adds 10 URLs, it hits the AI provider and the scraper 10 times simultaneously.

## Instructions for the Agent

To correctly implement Batch IA concurrency, you must modify `src/components/tabs/BatchTab.jsx` to respect a maximum number of concurrent running tasks.

### Step 1: Add a Concurrency Setting
At the top of `BatchTab.jsx`, add a state for concurrency limit:
```javascript
const [maxConcurrency, setMaxConcurrency] = useState(2); // Process 2 offers at a time
```
*(Optional: Add a small number input in the UI so the user can change `maxConcurrency` from 1 to 5).*

### Step 2: Rewrite the Queue Manager (`useEffect`)
Replace the flawed `useEffect` queue manager with one that checks `runningItemIdsRef.current.size`. Since `processItem` calls `setItems` (via `updateItemState`) when a task changes status (e.g. pending -> scraping -> completed), this `useEffect` will naturally re-run whenever a task finishes, allowing it to pick up the next one!

```javascript
// NEW IMPLEMENTATION IN BatchTab.jsx:
useEffect(() => {
  if (!isPlaying) return;

  // How many items are currently running?
  const currentRunningCount = runningItemIdsRef.current.size;
  
  // If we have reached the concurrency limit, do nothing and wait.
  if (currentRunningCount >= maxConcurrency) return;

  // Calculate how many new tasks we can start
  const availableSlots = maxConcurrency - currentRunningCount;

  // Find the next 'pending' items up to the available slots
  const pendingItems = items.filter(item => item.status === 'pending');
  const itemsToStart = pendingItems.slice(0, availableSlots);

  // Start them
  itemsToStart.forEach(item => {
    const originalIndex = items.findIndex(i => i.id === item.id);
    processItem(item.id, originalIndex);
  });

}, [isPlaying, items, maxConcurrency]); 
// Make sure 'items' is in the dependency array so it triggers when a task finishes and changes status!
```

### Step 3: Ensure Clean Cleanup in `processItem`
Make sure that inside `processItem(itemId, itemIndex)`, the `finally` block successfully removes the `itemId` from `runningItemIdsRef.current`. This is already implemented in the current code, but verify it looks like this:
```javascript
} finally {
  runningItemIdsRef.current.delete(itemId);
  // Important: We must trigger a state update here if the status didn't change
  // so the useEffect knows to check for the next item. But updateItemState
  // already updates the status to 'completed' or 'failed' right before this,
  // which will trigger the useEffect.
}
```

### Summary of Changes Expected from You (The Agent):
1. Only modify `src/components/tabs/BatchTab.jsx`.
2. Do **not** create a new batching function in `aiService.js`.
3. Fix the `useEffect` in `BatchTab.jsx` so it limits concurrent `processItem` executions to `maxConcurrency`.
4. (Optional but recommended) Add a UI element in the "Run Config Panel" to let the user select their desired concurrency level (1 to 5).