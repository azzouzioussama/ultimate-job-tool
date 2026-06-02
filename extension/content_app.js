// content_app.js - Content script that runs on the Ultimate Job Hunting Tool website.
// It listens for active application updates from the React app and relays them to the background page.
//
// Content scripts run in an "isolated world" — they share the DOM with the page
// but have their own JavaScript context. Communication with the page uses postMessage.

console.log("[UJT Extension] ✅ content_app.js injected and running on:", window.location.href);

// Function to send data to background service worker
function syncToBackground(appData) {
  if (!chrome.runtime?.id) {
    console.warn("[UJT Extension] ⚠️ Extension context invalidated, cannot sync.");
    return;
  }
  
  console.log("[UJT Extension] 📤 Sending data to background:", 
    appData ? `"${appData.jobTitle}" at "${appData.companyName}"` : "null (clearing)");
  
  try {
    chrome.runtime.sendMessage({
      action: "SET_ACTIVE_APPLICATION",
      data: appData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("[UJT Extension] ⚠️ Sync failed:", chrome.runtime.lastError.message);
      } else {
        console.log("[UJT Extension] ✅ Sync successful:", response);
      }
    });
  } catch (e) {
    console.warn("[UJT Extension] ⚠️ Failed to send message:", e.message);
  }
}

// 1. Listen for real-time postMessage events from the React app.
// This is the PRIMARY communication channel. The React useEffect dispatches:
//   window.postMessage({ type: 'UJT_ACTIVE_APP_CHANGED', detail: ... })
// which crosses the isolated world boundary reliably.
window.addEventListener("message", (event) => {
  // Only accept messages from the current window context
  if (event.source !== window) return;
  
  if (event.data && event.data.type === "UJT_ACTIVE_APP_CHANGED") {
    console.log("[UJT Extension] 📩 Received postMessage UJT_ACTIVE_APP_CHANGED");
    syncToBackground(event.data.detail);
  }
});

// 2. Listen for the custom DOM Event (Fallback — also crosses the isolated world)
window.addEventListener("UJT_ACTIVE_APP_CHANGED", (event) => {
  console.log("[UJT Extension] 📩 Received CustomEvent UJT_ACTIVE_APP_CHANGED");
  syncToBackground(event.detail);
});

// 3. Send a ping to the page to request the latest data.
// The React app listens for UJT_EXTENSION_PING and responds with the current state.
console.log("[UJT Extension] 🏓 Sending UJT_EXTENSION_PING to request current app data");
window.postMessage({ type: "UJT_EXTENSION_PING" }, "*");

// 4. Diagnostic: Log current extension storage state
if (chrome.runtime?.id) {
  chrome.storage.local.get(["activeApp"], (result) => {
    if (chrome.runtime.lastError) return;
    console.log("[UJT Extension] 📊 Current extension storage activeApp:", 
      result.activeApp ? `"${result.activeApp.jobTitle}" at "${result.activeApp.companyName}"` : "null (empty)");
  });
}

// 5. Respond to diagnostic pings from the test page
window.addEventListener("message", (event) => {
  if (event.source === window && event.data && event.data.type === "UJT_DIAGNOSTIC_PING") {
    console.log("[UJT Extension] 🏓 Received diagnostic ping, sending pong");
    window.postMessage({ type: "UJT_EXTENSION_PONG" }, "*");
  }
});
