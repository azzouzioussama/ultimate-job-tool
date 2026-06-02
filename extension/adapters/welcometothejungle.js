/**
 * welcometothejungle.js
 * Adapter for welcometothejungle.com (French market)
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'welcometothejungle',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("welcometothejungle.com") ||
           document.querySelector('[data-testid="job-application-form"]') !== null;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[WTTJ Adapter] Autofilling...");
    let filledCount = 0;

    // WTTJ uses data-testid attributes for forms a lot
    const fillField = (testId, value) => {
      const el = document.querySelector(`input[data-testid="${testId}"]`) || 
                 document.querySelector(`input[name="${testId}"]`);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    fillField('first_name', personalProfile.firstName);
    fillField('last_name', personalProfile.lastName);
    fillField('email', personalProfile.email);
    fillField('phone', personalProfile.phone);

    // Cover letter in WTTJ
    const coverLetterText = utils.getCoverLetterText(activeApp);
    const clTextarea = document.querySelector('textarea[data-testid="cover_letter"]') || 
                       document.querySelector('textarea[name="cover_letter"]');
    if (clTextarea && !clTextarea.value && coverLetterText) {
      if (utils.setValueAndDispatch(clTextarea, coverLetterText)) filledCount++;
    }

    // Custom links
    const linksMap = {
      "linkedin": personalProfile.linkedin,
      "github": personalProfile.github,
      "portfolio": personalProfile.website
    };

    const inputs = document.querySelectorAll('input[type="url"], input[type="text"]');
    inputs.forEach(input => {
      const label = utils.getLabelForInput(input).toLowerCase();
      const placeholder = (input.placeholder || "").toLowerCase();
      
      for (const [key, val] of Object.entries(linksMap)) {
        if (val && (label.includes(key) || placeholder.includes(key)) && !input.value) {
          if (utils.setValueAndDispatch(input, val)) filledCount++;
        }
      }
    });

    return filledCount;
  }
});
