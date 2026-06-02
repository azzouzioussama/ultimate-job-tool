// content_app.js - Content script that runs on the Ultimate Job Hunting Tool website.
// It listens for active application updates from the React app and relays them to the background page.

console.log("Ultimate Job Tool Companion: App listener active.");

// Listen for the custom event dispatched by App.jsx
window.addEventListener("UJT_ACTIVE_APP_CHANGED", (event) => {
  const appData = event.detail;
  
  chrome.runtime.sendMessage({
    action: "SET_ACTIVE_APPLICATION",
    data: appData
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("Ultimate Job Tool Companion: Connection to background script failed. Is the extension enabled?", chrome.runtime.lastError.message);
    } else {
      if (appData) {
        console.log(`Ultimate Job Tool Companion: Successfully synchronized application "${appData.jobTitle}" at "${appData.companyName}".`);
      } else {
        console.log("Ultimate Job Tool Companion: Cleared active application.");
      }
    }
  });
});
