/**
 * lever.js
 * Adapter for jobs.lever.co
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'lever',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("lever.co") ||
           document.querySelector('form#application-form') !== null ||
           document.querySelector('.application-form') !== null;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Lever Adapter] Autofilling...");
    let filledCount = 0;

    const fillFieldByName = (name, value) => {
      const el = document.querySelector(`input[name="${name}"]`);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    // Lever uses a single "name" field for full name
    fillFieldByName("name", `${personalProfile.firstName} ${personalProfile.lastName}`.trim());
    fillFieldByName("email", personalProfile.email);
    fillFieldByName("phone", personalProfile.phone);
    fillFieldByName("org", personalProfile.company); // if we had current company

    // URLs in Lever are often specific name attributes
    fillFieldByName("urls[LinkedIn]", personalProfile.linkedin);
    fillFieldByName("urls[GitHub]", personalProfile.github);
    fillFieldByName("urls[Portfolio]", personalProfile.website);
    fillFieldByName("urls[Twitter]", "");

    // Generic fallback for custom questions if they don't match the standard URL format
    const customFields = [
      { keys: ["linkedin"], value: personalProfile.linkedin },
      { keys: ["github"], value: personalProfile.github },
      { keys: ["website", "portfolio"], value: personalProfile.website }
    ];

    const labels = document.querySelectorAll('.application-question, label');
    labels.forEach(label => {
      const labelText = label.textContent.toLowerCase();
      
      customFields.forEach(field => {
        if (field.keys.some(k => labelText.includes(k))) {
          const input = label.querySelector('input') || (label.parentElement && label.parentElement.querySelector('input'));
          if (input && !input.value && field.value) {
            if (utils.setValueAndDispatch(input, field.value)) filledCount++;
          }
        }
      });
    });

    // Cover Letter (Lever usually uses a textarea with name="comments")
    const coverLetterText = utils.getCoverLetterText(activeApp);
    const clTextarea = document.querySelector('textarea[name="comments"]');
    if (clTextarea && !clTextarea.value && coverLetterText) {
      if (utils.setValueAndDispatch(clTextarea, coverLetterText)) filledCount++;
    }

    return filledCount;
  }
});
