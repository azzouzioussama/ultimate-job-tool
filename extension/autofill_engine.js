/**
 * autofill_engine.js
 * The core engine that orchestrates the job board adapters.
 */

window.UJTAutofillEngine = {
  adapters: [],

  registerAdapter: function(adapter) {
    this.adapters.push(adapter);
    // Sort adapters by priority (highest first)
    this.adapters.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  },

  // Heuristics and utilities available to all adapters
  utils: {
    setValueAndDispatch: function(input, value) {
      if (!input || !value) return false;
      input.value = value;
      // Dispatch standard browser events to trigger framework (React/Vue/Angular) listeners
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.focus();
      input.blur();
      return true;
    },

    getLabelForInput: function(input) {
      // 1. Direct label parent
      if (input.parentElement && input.parentElement.tagName.toLowerCase() === "label") {
        return input.parentElement.textContent || "";
      }
      // 2. Label with 'for' attribute matching input id
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label.textContent || "";
      }
      // 3. Search closest sibling or parent with text content
      let sibling = input.previousElementSibling;
      while (sibling) {
        if (sibling.tagName.toLowerCase() === "label" || sibling.textContent.trim().length > 0) {
          return sibling.textContent || "";
        }
        sibling = sibling.previousElementSibling;
      }
      // 4. Search aria-label or placeholder
      if (input.getAttribute("aria-label")) {
        return input.getAttribute("aria-label");
      }
      if (input.placeholder) {
        return input.placeholder;
      }
      return "";
    },

    cleanLatexText: function(text) {
      let clean = text;
      clean = clean.replace(/\\documentclass\[.*?\]\{.*?\}/g, "");
      clean = clean.replace(/\\usepackage\{.*?\}/g, "");
      clean = clean.replace(/\\begin\{document\}/g, "");
      clean = clean.replace(/\\end\{document\}/g, "");
      clean = clean.replace(/\\begin\{itemize\}/g, "");
      clean = clean.replace(/\\end\{itemize\}/g, "");
      clean = clean.replace(/\\item/g, "-");
      clean = clean.replace(/\\section\*?\{.*?\}/g, "");
      clean = clean.replace(/\\subsection\*?\{.*?\}/g, "");
      clean = clean.replace(/\\textbf\{(.*?)\}/g, "$1");
      clean = clean.replace(/\\textit\{(.*?)\}/g, "$1");
      clean = clean.replace(/\\href\{.*?\}\{(.*?)\}/g, "$1");
      clean = clean.replace(/\\%/g, "%");
      clean = clean.replace(/\\&/g, "&");
      clean = clean.replace(/\\_/g, "_");
      clean = clean.replace(/\\\\/g, "\n");
      return clean.trim();
    },

    getCoverLetterText: function(activeApp) {
      if (!activeApp || !activeApp.promptResponses) return "";
      let coverLetterText = activeApp.promptResponses["2"] || activeApp.promptResponses["3"] || "";
      if (!coverLetterText) {
        const keys = Object.keys(activeApp.promptResponses);
        for (const key of keys) {
          const body = activeApp.promptResponses[key];
          if (body && (key.toLowerCase().includes("lettre") || key.toLowerCase().includes("cover") || body.includes("Madame, Monsieur") || body.includes("Dear Hiring Manager"))) {
            coverLetterText = body;
            break;
          }
        }
      }
      return coverLetterText ? this.cleanLatexText(coverLetterText) : "";
    }
  },

  run: function(activeApp, personalProfile) {
    console.log("[UJT Engine] Detecting adapter for:", window.location.href);
    
    let matchedAdapter = null;
    for (const adapter of this.adapters) {
      if (adapter.detect()) {
        matchedAdapter = adapter;
        break;
      }
    }

    if (matchedAdapter) {
      console.log(`[UJT Engine] Found match: ${matchedAdapter.id}`);
      return matchedAdapter.fill(activeApp, personalProfile, this.utils);
    } else {
      console.log("[UJT Engine] No specific adapter found. Falling back to generic adapter.");
      const genericAdapter = this.adapters.find(a => a.id === 'generic');
      if (genericAdapter) {
        return genericAdapter.fill(activeApp, personalProfile, this.utils);
      }
    }
    return 0; // Filled count
  }
};
