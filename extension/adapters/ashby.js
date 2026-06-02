/**
 * ashby.js
 * Adapter for jobs.ashbyhq.com
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'ashby',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("ashbyhq.com");
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Ashby Adapter] Autofilling...");
    let filledCount = 0;

    const fillField = (name, value) => {
      const el = document.querySelector(`input[name="${name}"]`);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    fillField('name', `${personalProfile.firstName} ${personalProfile.lastName}`.trim());
    fillField('email', personalProfile.email);
    fillField('phone', personalProfile.phone);
    fillField('linkedInUrl', personalProfile.linkedin);
    fillField('githubUrl', personalProfile.github);
    fillField('portfolioUrl', personalProfile.website);

    // Custom questions mapped dynamically
    const genericAdapter = window.UJTAutofillEngine.adapters.find(a => a.id === 'generic');
    if (genericAdapter) {
      // Don't count twice, just let it catch cover letters and custom questions
      genericAdapter.fill(activeApp, personalProfile, utils);
    }

    return filledCount;
  }
});
