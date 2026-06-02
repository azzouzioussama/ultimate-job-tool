/**
 * greenhouse.js
 * Adapter for boards.greenhouse.io
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'greenhouse',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("greenhouse.io") || 
           document.querySelector('div#app_body') !== null ||
           document.querySelector('form#application_form') !== null;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Greenhouse Adapter] Autofilling...");
    let filledCount = 0;

    const fillField = (selector, value) => {
      const el = document.querySelector(selector);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    fillField('input#first_name', personalProfile.firstName);
    fillField('input#last_name', personalProfile.lastName);
    fillField('input#email', personalProfile.email);
    fillField('input#phone', personalProfile.phone);

    // Greenhouse custom questions (LinkedIn, GitHub, Website)
    // We iterate through labels to find the ones matching our profile data
    const customFields = [
      { keys: ["linkedin"], value: personalProfile.linkedin },
      { keys: ["github"], value: personalProfile.github },
      { keys: ["website", "portfolio"], value: personalProfile.website }
    ];

    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
      const labelText = label.textContent.toLowerCase();
      
      customFields.forEach(field => {
        if (field.keys.some(k => labelText.includes(k))) {
          // Find the input inside this label's container or associated with it
          let input = null;
          if (label.getAttribute('for')) {
            input = document.getElementById(label.getAttribute('for'));
          } else {
            // Usually in greenhouse, the structure is <div class="field"><label>Text <input></label></div>
            input = label.querySelector('input');
            if (!input && label.parentElement) {
              input = label.parentElement.querySelector('input');
            }
          }
          
          if (input && !input.value && field.value) {
            if (utils.setValueAndDispatch(input, field.value)) filledCount++;
          }
        }
      });

      // Cover letter textarea
      if (labelText.includes("cover letter") || labelText.includes("lettre de motivation")) {
        let textarea = null;
        if (label.getAttribute('for')) {
          textarea = document.getElementById(label.getAttribute('for'));
        }
        if (!textarea && label.parentElement) {
          textarea = label.parentElement.querySelector('textarea');
        }
        
        const clText = utils.getCoverLetterText(activeApp);
        if (textarea && !textarea.value && clText) {
          if (utils.setValueAndDispatch(textarea, clText)) filledCount++;
        }
      }
    });

    return filledCount;
  }
});
