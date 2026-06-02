/**
 * freework.js
 * Adapter for freework.com (French market)
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'freework',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("freework.com") ||
           document.querySelector('form[action*="freework"]') !== null;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Freework Adapter] Autofilling...");
    let filledCount = 0;

    const fillField = (name, value) => {
      const el = document.querySelector(`input[name="${name}"]`) || document.querySelector(`input[id*="${name}" i]`);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    fillField('firstName', personalProfile.firstName);
    fillField('lastName', personalProfile.lastName);
    fillField('email', personalProfile.email);
    fillField('phone', personalProfile.phone);

    // Cover letter
    const coverLetterText = utils.getCoverLetterText(activeApp);
    const clTextarea = document.querySelector('textarea[name="message"]') || 
                       document.querySelector('textarea[name="coverLetter"]');
    if (clTextarea && !clTextarea.value && coverLetterText) {
      if (utils.setValueAndDispatch(clTextarea, coverLetterText)) filledCount++;
    }

    return filledCount;
  }
});
