/**
 * hellowork.js
 * Adapter for hellowork.com (French market)
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'hellowork',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("hellowork.com") ||
           document.querySelector('.hw-apply-form') !== null;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Hellowork Adapter] Autofilling...");
    let filledCount = 0;

    const fillField = (name, value) => {
      const el = document.querySelector(`input[name="${name}"]`);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    // Hellowork typically uses these names in their forms
    fillField('FirstName', personalProfile.firstName);
    fillField('LastName', personalProfile.lastName);
    fillField('Email', personalProfile.email);
    fillField('PhoneNumber', personalProfile.phone);

    // Cover letter in Hellowork
    const coverLetterText = utils.getCoverLetterText(activeApp);
    const clTextarea = document.querySelector('textarea[name="CoverLetter"]') || 
                       document.querySelector('textarea[name="Message"]');
    if (clTextarea && !clTextarea.value && coverLetterText) {
      if (utils.setValueAndDispatch(clTextarea, coverLetterText)) filledCount++;
    }

    return filledCount;
  }
});
