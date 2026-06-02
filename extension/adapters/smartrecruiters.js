/**
 * smartrecruiters.js
 * Adapter for jobs.smartrecruiters.com
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'smartrecruiters',
  priority: 10,

  detect: function() {
    return window.location.hostname.includes("smartrecruiters.com");
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[SmartRecruiters Adapter] Autofilling...");
    let filledCount = 0;

    const fillField = (id, value) => {
      const el = document.getElementById(id);
      if (el && !el.value && value) {
        if (utils.setValueAndDispatch(el, value)) filledCount++;
      }
    };

    fillField('first-name-input', personalProfile.firstName);
    fillField('last-name-input', personalProfile.lastName);
    fillField('email-input', personalProfile.email);
    fillField('phone-number-input', personalProfile.phone);

    fillField('linkedin-input', personalProfile.linkedin);
    fillField('website-input', personalProfile.website);

    // Cover letter is often a separate section in SR, but uses a textarea
    const coverLetterText = utils.getCoverLetterText(activeApp);
    const clTextarea = document.querySelector('textarea#cover-letter-input') || document.querySelector('textarea[name="message"]');
    if (clTextarea && !clTextarea.value && coverLetterText) {
      if (utils.setValueAndDispatch(clTextarea, coverLetterText)) filledCount++;
    }

    return filledCount;
  }
});
