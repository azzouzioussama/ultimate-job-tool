/**
 * generic.js
 * The fallback adapter that tries to guess form fields based on labels.
 */

window.UJTAutofillEngine.registerAdapter({
  id: 'generic',
  priority: 0, // Lowest priority, acts as fallback

  detect: function() {
    // Generic adapter always returns false for strict detection, 
    // it's only called manually as a fallback by the engine.
    return false;
  },

  fill: function(activeApp, personalProfile, utils) {
    console.log("[Generic Adapter] Running fallback heuristics...");
    let filledCount = 0;

    const coverLetterText = utils.getCoverLetterText(activeApp);

    const fieldMapping = [
      {
        keys: ["first name", "given name", "prénom", "prenom"],
        value: personalProfile.firstName
      },
      {
        keys: ["last name", "family name", "surname", "nom de famille", "nom"],
        value: personalProfile.lastName
      },
      {
        keys: ["email", "e-mail", "courriel", "adresse électronique"],
        value: personalProfile.email
      },
      {
        keys: ["phone", "telephone", "téléphone", "mobile", "gsm"],
        value: personalProfile.phone
      },
      {
        keys: ["linkedin", "profil linkedin"],
        value: personalProfile.linkedin
      },
      {
        keys: ["github", "dépôt github", "compte github"],
        value: personalProfile.github
      },
      {
        keys: ["website", "portfolio", "site web", "personal website", "personal site", "blog"],
        value: personalProfile.website
      }
    ];

    const inputs = document.querySelectorAll("input, textarea");
    
    inputs.forEach(input => {
      // Avoid filling hidden or special extension inputs
      if (input.type === "hidden" || input.style.display === "none" || input.style.visibility === "hidden" || input.id === "ujt-fab" || input.classList.contains("ujt-input")) {
        return;
      }
      
      const labelText = utils.getLabelForInput(input).toLowerCase();
      const inputName = (input.name || "").toLowerCase();
      const inputId = (input.id || "").toLowerCase();
      const inputPlaceholder = (input.placeholder || "").toLowerCase();
      
      // Cover Letter
      if (input.tagName.toLowerCase() === "textarea" && coverLetterText) {
        const coverLetterKeywords = ["cover letter", "motivation", "lettre de motivation", "additional info", "message to the", "lettre", "remarques", "note"];
        const matchesCoverLetter = coverLetterKeywords.some(kw => 
          labelText.includes(kw) || inputName.includes(kw) || inputId.includes(kw) || inputPlaceholder.includes(kw)
        );
        
        if (matchesCoverLetter && !input.value) {
          if (utils.setValueAndDispatch(input, coverLetterText)) filledCount++;
          return;
        }
      }

      // Standard Inputs
      for (const mapping of fieldMapping) {
        if (!mapping.value) continue;
        
        const isMatch = mapping.keys.some(key => 
          labelText.includes(key) || inputName.includes(key) || inputId.includes(key) || inputPlaceholder.includes(key)
        );

        if (isMatch) {
          // Full name heuristic
          if (mapping.keys.includes("nom") && labelText.includes("nom complet") && personalProfile.firstName && personalProfile.lastName) {
            if (!input.value) {
              if (utils.setValueAndDispatch(input, `${personalProfile.firstName} ${personalProfile.lastName}`)) filledCount++;
            }
            break;
          }
          
          if (!input.value) {
            if (utils.setValueAndDispatch(input, mapping.value)) filledCount++;
          }
          break;
        }
      }
    });

    return filledCount;
  }
});
