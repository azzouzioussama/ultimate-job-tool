/**
 * indeed.js
 * Adapter for indeed.com Easy Apply Modals
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'indeed',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("indeed.com") || window.location.hostname.includes("indeed.fr");
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Indeed Adapter] Autofilling...");
    let filledCount = 0;
    
    // Indeed uses a multi-step modal. It requires a MutationObserver or a generic scan.
    // We will just do a standard scan on the visible elements, 
    // the generic adapter logic actually works very well for Indeed's clean labels.
    
    // Using generic logic specifically for Indeed's current visible DOM
    const genericAdapter = window.UJTAutofillEngine.adapters.find(a => a.id === 'generic');
    if (genericAdapter) {
      filledCount += genericAdapter.fill(activeApp, personalProfile, utils);
    }
    
    return filledCount;
  }
});
