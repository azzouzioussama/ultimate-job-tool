// popup.js - Controller for the extension popup view.

document.addEventListener("DOMContentLoaded", () => {
  const statusBadge = document.getElementById("status-badge");
  const statusText = document.getElementById("status-text");
  const appCard = document.getElementById("app-card");
  const btnOpenApp = document.getElementById("btn-open-app");
  const btnAutofillNow = document.getElementById("btn-autofill-now");

  // Load the active application status
  chrome.runtime.sendMessage({ action: "GET_ACTIVE_APPLICATION" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Failed to get active application:", chrome.runtime.lastError.message);
      statusBadge.className = "status-badge disconnected";
      statusText.textContent = "Erreur de connexion";
      return;
    }
    
    const activeApp = response?.data;
    
    if (activeApp) {
      // Connect UI state to connected status
      statusBadge.className = "status-badge connected";
      statusText.textContent = "Candidature active";
      
      // Calculate documents count
      let docCount = 0;
      if (activeApp.promptResponses) {
        docCount += Object.keys(activeApp.promptResponses).filter(k => activeApp.promptResponses[k] && !activeApp.promptResponses[k].includes("[CV MANQUANT]")).length;
      }
      if (activeApp.documents) {
        docCount += activeApp.documents.length;
      } else if (activeApp.cvGenerated) {
        docCount += 1;
      }

      // Build UI safely using DOM methods to prevent XSS
      appCard.innerHTML = '';
      const titleEl = document.createElement('h2');
      titleEl.className = 'app-title';
      titleEl.textContent = activeApp.jobTitle || "Poste non défini";
      
      const companyEl = document.createElement('p');
      companyEl.className = 'app-company';
      companyEl.textContent = activeApp.companyName || "Entreprise non définie";
      
      const statusRow = document.createElement('div');
      statusRow.className = 'info-row';
      statusRow.innerHTML = `<span>Statut :</span>`;
      const statusVal = document.createElement('span');
      statusVal.style.cssText = 'font-weight:600; color:#818cf8;';
      statusVal.textContent = activeApp.trackingStatus || "Draft";
      statusRow.appendChild(statusVal);
      
      const docRow = document.createElement('div');
      docRow.className = 'info-row';
      docRow.innerHTML = `<span>Documents prêts :</span><span>${docCount} document(s)</span>`;
      
      appCard.append(titleEl, companyEl, statusRow, docRow);
      
      // Enable autofill button
      btnAutofillNow.disabled = false;
    } else {
      statusBadge.className = "status-badge disconnected";
      statusText.textContent = "Aucune synchro";
      appCard.innerHTML = `
        <div style="font-size: 12px; color: #64748b; font-style: italic; text-align: center; padding: 12px 0;">
          Sélectionnez un poste dans le tableau de bord pour synchroniser les données.
        </div>
      `;
      btnAutofillNow.disabled = true;
    }
  });

  // Action: Open the main web application tab
  btnOpenApp.addEventListener("click", () => {
    const targetUrl = "http://localhost:3001"; // Dev URL
    
    // Look for existing tab matching the local server or vercel deployment
    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find(tab => 
        tab.url?.startsWith("http://localhost:3000") || 
        tab.url?.startsWith("http://localhost:3001") || 
        tab.url?.includes("ultimate-job-tool.vercel.app")
      );
      
      if (existingTab) {
        chrome.tabs.update(existingTab.id, { active: true });
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: targetUrl });
      }
    });
  });

  // Action: Trigger autofill on the current active tab
  btnAutofillNow.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;
      
      chrome.tabs.sendMessage(activeTab.id, { action: "TRIGGER_AUTOFILL" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Autofill trigger failed: content script not loaded on this tab.");
          alert("L'autoremplissage ne peut s'exécuter que sur les sites d'offres d'emploi configurés (Lever, Greenhouse, Workday, etc.). Ouvrez le panneau latéral flottant directement sur la page si elle est prise en charge !");
        } else {
          window.close(); // Close the popup on success
        }
      });
    });
  });
});
