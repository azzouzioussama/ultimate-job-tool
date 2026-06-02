// background.js - Service Worker for Ultimate Job Tool Companion

console.log("Ultimate Job Tool Companion Service Worker loaded.");

// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["activeApp"], (result) => {
    if (!result.activeApp) {
      chrome.storage.local.set({ activeApp: null });
      console.log("Initialized activeApp storage to null.");
    } else {
      console.log("Existing activeApp found:", result.activeApp?.companyName, "-", result.activeApp?.jobTitle);
    }
  });
});

// Message listener to coordinate between the React web app, job boards, and the popup.
// IMPORTANT: Every branch must call sendResponse() to prevent "message channel closed" errors.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SET_ACTIVE_APPLICATION") {
    // Save application data received from content_app.js
    chrome.storage.local.set({ activeApp: message.data }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save active app:", chrome.runtime.lastError.message);
        sendResponse({ status: "error", error: chrome.runtime.lastError.message });
      } else {
        console.log("Updated active application state:", message.data?.companyName, "-", message.data?.jobTitle);
        sendResponse({ status: "success" });
      }
    });
    return true; // Keep message channel open for async response
  } 
  
  else if (message.action === "GET_ACTIVE_APPLICATION") {
    // Return saved active application data to content_filler.js or popup.js
    chrome.storage.local.get(["activeApp"], (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ data: null, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ data: result.activeApp || null });
      }
    });
    return true;
  }
  
  else if (message.action === "DOWNLOAD_FILE") {
    // Automate downloading files (like the customized CV PDF)
    const { url, filename } = message;
    if (!url) {
      sendResponse({ status: "error", error: "Missing download URL" });
      return false;
    }
    
    chrome.downloads.download({
      url: url,
      filename: filename || "CV_Tailored.pdf",
      conflictAction: "uniquify",
      saveAs: false // Download silently without prompt
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
        sendResponse({ status: "error", error: chrome.runtime.lastError.message });
      } else {
        console.log("Triggered download ID:", downloadId);
        sendResponse({ status: "success", downloadId });
      }
    });
    return true;
  }
  
  else if (message.action === "DOWNLOAD_TEXT") {
    // Create a data URL from text (e.g. cover letter or LaTeX) and download it
    const { text, filename } = message;
    if (!text) {
      sendResponse({ status: "error", error: "Missing text content" });
      return false;
    }
    
    const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
    chrome.downloads.download({
      url: dataUrl,
      filename: filename || "letter.txt",
      conflictAction: "uniquify",
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ status: "error", error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ status: "success", downloadId });
      }
    });
    return true;
  }
  
  // Default: unknown action — respond immediately to prevent channel leak
  else {
    console.log("Unknown message action:", message.action);
    sendResponse({ status: "ignored", error: "Unknown action" });
    return false;
  }
});
