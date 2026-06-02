// content_filler.js - Runs on job application pages (Greenhouse, Lever, Workday, etc.)
// Autofills forms and provides a floating helper sidebar with generated assets.

(function() {
  console.log("Ultimate Job Tool Companion: Form Filler active.");

  // ── CSS STYLING (Injected) ──────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* Floating Widget Button */
    #ujt-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      z-index: 999999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    #ujt-fab:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.6);
    }
    #ujt-fab svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: white;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    /* Notification Badge */
    #ujt-fab-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: #ef4444;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }

    /* Sidebar Drawer */
    #ujt-sidebar {
      position: fixed;
      top: 0;
      right: -380px;
      width: 360px;
      height: 100vh;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      box-shadow: -4px 0 30px rgba(0, 0, 0, 0.3);
      z-index: 999998;
      transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
    }
    #ujt-sidebar.open {
      right: 0;
    }
    
    /* Header */
    .ujt-header {
      padding: 20px;
      background: rgba(30, 41, 59, 0.5);
      border-b: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ujt-title {
      font-size: 16px;
      font-weight: 700;
      background: linear-gradient(to right, #a5b4fc, #c7d2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }
    .ujt-close {
      cursor: pointer;
      color: #94a3b8;
      background: none;
      border: none;
      font-size: 20px;
      transition: color 0.2s;
    }
    .ujt-close:hover {
      color: #f1f5f9;
    }

    /* Content Area */
    .ujt-body {
      padding: 20px;
      overflow-y: auto;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    /* Custom Scrollbar */
    .ujt-body::-webkit-scrollbar {
      width: 6px;
    }
    .ujt-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .ujt-body::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    
    /* Card design */
    .ujt-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ujt-card-title {
      font-size: 13px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .ujt-card-desc {
      font-size: 14px;
      color: #e2e8f0;
      margin: 0;
    }
    
    /* Forms & Inputs */
    .ujt-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ujt-label {
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
    }
    .ujt-input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      color: white;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    .ujt-input:focus {
      border-color: #6366f1;
    }
    
    /* Buttons */
    .ujt-btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.2s;
    }
    .ujt-btn-primary:hover {
      background: #4338ca;
    }
    
    .ujt-btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .ujt-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    /* Collapsible section */
    .ujt-collapsible-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    .ujt-collapsible-content {
      display: none;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .ujt-collapsible-content.expanded {
      display: flex;
    }
    
    /* Icon wrapper */
    .ujt-icon-btn {
      cursor: pointer;
      color: #94a3b8;
      transition: color 0.2s;
    }
    .ujt-icon-btn:hover {
      color: white;
    }
  `;
  document.head.appendChild(style);

  // ── STATE VARIABLES ─────────────────────────────────────────────────────────
  let activeApp = null;
  let personalProfile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: ""
  };

  // Load state from local storage on execution
  chrome.storage.local.get(["activeApp", "personalProfile"], (result) => {
    activeApp = result.activeApp || null;
    if (result.personalProfile) {
      personalProfile = { ...personalProfile, ...result.personalProfile };
    }
    
    // Inject the DOM components
    createFAB();
    createSidebar();
    
    // If the active job URL matches the current page, highlight/autofill or alert the user
    console.log("Ultimate Job Tool Companion: Loaded active application state: ", activeApp?.companyName);
  });

  // Listen for storage updates (so sidebar updates immediately when active application changes in React tab)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (changes.activeApp) {
        activeApp = changes.activeApp.newValue || null;
        updateSidebarUI();
      }
      if (changes.personalProfile) {
        personalProfile = { ...personalProfile, ...changes.personalProfile.newValue };
        updateProfileFieldsUI();
      }
    }
  });

  // ── DOM INJECTION: FAB (Floating Action Button) ──────────────────────────────
  function createFAB() {
    // Remove if already exists
    const existingFab = document.getElementById("ujt-fab");
    if (existingFab) existingFab.remove();

    const fab = document.createElement("div");
    fab.id = "ujt-fab";
    fab.title = "Ultimate Job Tool Companion";
    
    // Render J logo using inline SVG checkmark + lines
    fab.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    `;

    if (activeApp) {
      const badge = document.createElement("div");
      badge.id = "ujt-fab-badge";
      badge.textContent = "!";
      fab.appendChild(badge);
    }

    fab.addEventListener("click", toggleSidebar);
    document.body.appendChild(fab);
  }

  // ── DOM INJECTION: SIDEBAR DRAWER ──────────────────────────────────────────
  function createSidebar() {
    const existingSidebar = document.getElementById("ujt-sidebar");
    if (existingSidebar) existingSidebar.remove();

    const sidebar = document.createElement("div");
    sidebar.id = "ujt-sidebar";
    
    sidebar.innerHTML = `
      <div class="ujt-header">
        <h3 class="ujt-title">Ultimate Job Tool</h3>
        <button class="ujt-close" id="ujt-sidebar-close">&times;</button>
      </div>
      <div class="ujt-body">
        
        <!-- Active Application Status -->
        <div class="ujt-card" id="ujt-active-app-card">
          <!-- Will be filled dynamically -->
        </div>
        
        <!-- Autofill Launcher -->
        <button class="ujt-btn-primary" id="ujt-btn-autofill">
          <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Autoremplir le Formulaire
        </button>

        <!-- Tailored Document Selector -->
        <div class="ujt-card">
          <h4 class="ujt-card-title">Lettre & Documents Générés</h4>
          <div id="ujt-docs-list" style="display:flex; flex-direction:column; gap:8px;">
            <!-- Filled dynamically -->
          </div>
        </div>

        <!-- Personal Profile Configurations -->
        <div class="ujt-card">
          <div class="ujt-collapsible-header" id="ujt-profile-toggle">
            <h4 class="ujt-card-title" style="margin:0;">Profil Personnel (Autofill)</h4>
            <span id="ujt-profile-arrow" style="font-size:12px; color:#94a3b8;">▼</span>
          </div>
          <div class="ujt-collapsible-content" id="ujt-profile-content">
            <div class="ujt-form-group">
              <label class="ujt-label">Prénom</label>
              <input type="text" class="ujt-input" id="ujt-prof-first" value="${personalProfile.firstName}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Nom</label>
              <input type="text" class="ujt-input" id="ujt-prof-last" value="${personalProfile.lastName}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Email</label>
              <input type="email" class="ujt-input" id="ujt-prof-email" value="${personalProfile.email}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Téléphone</label>
              <input type="tel" class="ujt-input" id="ujt-prof-phone" value="${personalProfile.phone}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Lien LinkedIn</label>
              <input type="text" class="ujt-input" id="ujt-prof-linkedin" value="${personalProfile.linkedin}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Lien GitHub</label>
              <input type="text" class="ujt-input" id="ujt-prof-github" value="${personalProfile.github}">
            </div>
            <div class="ujt-form-group">
              <label class="ujt-label">Site Web / Portfolio</label>
              <input type="text" class="ujt-input" id="ujt-prof-website" value="${personalProfile.website}">
            </div>
            <button class="ujt-btn-secondary" id="ujt-btn-save-profile" style="margin-top:4px;">
              Sauvegarder le Profil
            </button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(sidebar);

    // Event Wireup
    document.getElementById("ujt-sidebar-close").addEventListener("click", toggleSidebar);
    document.getElementById("ujt-btn-autofill").addEventListener("click", triggerAutofill);
    
    // Profile collapsible toggle
    document.getElementById("ujt-profile-toggle").addEventListener("click", () => {
      const content = document.getElementById("ujt-profile-content");
      const arrow = document.getElementById("ujt-profile-arrow");
      if (content.classList.contains("expanded")) {
        content.classList.remove("expanded");
        arrow.textContent = "▼";
      } else {
        content.classList.add("expanded");
        arrow.textContent = "▲";
      }
    });

    // Profile save action
    document.getElementById("ujt-btn-save-profile").addEventListener("click", saveProfileData);

    updateSidebarUI();
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("ujt-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  }

  // ── UPDATE UI CONTENT ────────────────────────────────────────────────────────
  function updateSidebarUI() {
    const card = document.getElementById("ujt-active-app-card");
    if (!card) return;

    if (!activeApp) {
      card.innerHTML = `
        <h4 class="ujt-card-title" style="color:#ef4444;">Aucune Candidature Active</h4>
        <p class="ujt-card-desc" style="font-size:12px; color:#94a3b8;">
          Ouvrez l'application web Ultimate Job Hunting Tool et sélectionnez une candidature dans le Tableau de Bord pour la synchroniser ici.
        </p>
      `;
      document.getElementById("ujt-btn-autofill").disabled = true;
      document.getElementById("ujt-btn-autofill").style.opacity = 0.5;
      document.getElementById("ujt-docs-list").innerHTML = '<div style="font-size:12px; color:#64748b; font-style:italic;">Aucune lettre générée</div>';
      
      const badge = document.getElementById("ujt-fab-badge");
      if (badge) badge.remove();
      return;
    }

    document.getElementById("ujt-btn-autofill").disabled = false;
    document.getElementById("ujt-btn-autofill").style.opacity = 1;

    // Display Active App Metadata
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h4 class="ujt-card-title">${activeApp.companyName || "Entreprise Inconnue"}</h4>
          <p class="ujt-card-desc" style="font-weight:600; font-size:15px; margin-top:2px;">${activeApp.jobTitle || "Poste non spécifié"}</p>
        </div>
        <span style="font-size:10px; background:rgba(99,102,241,0.2); color:#a5b4fc; padding:2px 6px; border-radius:4px; font-weight:600;">
          ${activeApp.trackingStatus || "Draft"}
        </span>
      </div>
      ${activeApp.jobUrl ? `<div style="font-size:11px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:4px;">
        URL: <a href="${activeApp.jobUrl}" target="_blank" style="color:#818cf8; text-decoration:none;">${activeApp.jobUrl}</a>
      </div>` : ''}
    `;

    // Populate active documents list (like cover letter templates 2 and 3, or other files)
    const docsList = document.getElementById("ujt-docs-list");
    docsList.innerHTML = "";

    const docs = [];
    
    // Look at prompt responses (from Template 2: French cover letter, Template 3: English cover letter, or manual responses)
    if (activeApp.promptResponses) {
      Object.keys(activeApp.promptResponses).forEach(key => {
        const textContent = activeApp.promptResponses[key];
        if (!textContent || textContent.includes("[CV MANQUANT]") || textContent.includes("[OFFRE MANQUANTE]")) return;

        let label = `Document (${key})`;
        if (key == "2") label = "Lettre de Motivation (FR)";
        else if (key == "3") label = "Cover Letter (EN)";
        else if (typeof key === 'string' && key.length > 2) label = key; // Named custom response
        
        docs.push({ type: "text", title: label, content: textContent });
      });
    }

    // Look at database document files (like generated LaTeX CV documents)
    if (activeApp.documents && activeApp.documents.length > 0) {
      activeApp.documents.forEach(doc => {
        docs.push({ type: "latex", title: `CV LaTeX: ${doc.title}`, content: doc.content, id: doc.id });
      });
    } else if (activeApp.cvGenerated) {
      docs.push({ type: "latex", title: "CV LaTeX Adapté", content: activeApp.cvGenerated });
    }

    if (docs.length === 0) {
      docsList.innerHTML = '<div style="font-size:12px; color:#64748b; font-style:italic;">Aucun document généré. Utilisez les invites IA d\'abord !</div>';
      return;
    }

    docs.forEach((doc, idx) => {
      const docItem = document.createElement("div");
      docItem.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.03); padding:8px; border-radius:8px; gap:4px;";
      
      const titleSpan = document.createElement("span");
      titleSpan.style.cssText = "font-size:12px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; color:#cbd5e1;";
      titleSpan.textContent = doc.title;
      
      const actionsDiv = document.createElement("div");
      actionsDiv.style.cssText = "display:flex; gap:6px; flex-shrink:0;";

      // Copy text button
      const copyBtn = document.createElement("button");
      copyBtn.className = "ujt-btn-secondary";
      copyBtn.style.padding = "4px 8px";
      copyBtn.style.fontSize = "11px";
      copyBtn.innerHTML = "Copier";
      copyBtn.addEventListener("click", () => {
        copyTextToClipboard(doc.content);
        copyBtn.textContent = "Copié !";
        setTimeout(() => copyBtn.textContent = "Copier", 2000);
      });
      actionsDiv.appendChild(copyBtn);

      // If document is text, add download action
      if (doc.type === "text") {
        const dlBtn = document.createElement("button");
        dlBtn.className = "ujt-btn-secondary";
        dlBtn.style.padding = "4px 8px";
        dlBtn.style.fontSize = "11px";
        dlBtn.innerHTML = "Télécharger";
        dlBtn.addEventListener("click", () => {
          chrome.runtime.sendMessage({
            action: "DOWNLOAD_TEXT",
            text: doc.content,
            filename: `${doc.title.replace(/\s+/g, "_")}.txt`
          });
        });
        actionsDiv.appendChild(dlBtn);
      }
      
      // If document is LaTeX, show LaTeX tag
      if (doc.type === "latex") {
        const tag = document.createElement("span");
        tag.style.cssText = "font-size:9px; background:rgba(245,158,11,0.2); color:#f59e0b; padding:1px 4px; border-radius:3px; font-weight:bold;";
        tag.textContent = "LaTeX";
        docItem.appendChild(tag);
      }

      docItem.appendChild(titleSpan);
      docItem.appendChild(actionsDiv);
      docsList.appendChild(docItem);
    });

    // Make sure FAB badge is visible
    let badge = document.getElementById("ujt-fab-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "ujt-fab-badge";
      badge.textContent = "!";
      document.getElementById("ujt-fab").appendChild(badge);
    }
  }

  function updateProfileFieldsUI() {
    const fn = document.getElementById("ujt-prof-first");
    const ln = document.getElementById("ujt-prof-last");
    const em = document.getElementById("ujt-prof-email");
    const ph = document.getElementById("ujt-prof-phone");
    const li = document.getElementById("ujt-prof-linkedin");
    const gh = document.getElementById("ujt-prof-github");
    const ws = document.getElementById("ujt-prof-website");

    if (fn) fn.value = personalProfile.firstName || "";
    if (ln) ln.value = personalProfile.lastName || "";
    if (em) em.value = personalProfile.email || "";
    if (ph) ph.value = personalProfile.phone || "";
    if (li) li.value = personalProfile.linkedin || "";
    if (gh) gh.value = personalProfile.github || "";
    if (ws) ws.value = personalProfile.website || "";
  }

  // ── SAVE PROFILE ACTIONS ────────────────────────────────────────────────────
  function saveProfileData() {
    const fn = document.getElementById("ujt-prof-first").value;
    const ln = document.getElementById("ujt-prof-last").value;
    const em = document.getElementById("ujt-prof-email").value;
    const ph = document.getElementById("ujt-prof-phone").value;
    const li = document.getElementById("ujt-prof-linkedin").value;
    const gh = document.getElementById("ujt-prof-github").value;
    const ws = document.getElementById("ujt-prof-website").value;

    personalProfile = {
      firstName: fn,
      lastName: ln,
      email: em,
      phone: ph,
      linkedin: li,
      github: gh,
      website: ws
    };

    chrome.storage.local.set({ personalProfile }, () => {
      const btn = document.getElementById("ujt-btn-save-profile");
      btn.textContent = "Enregistré !";
      btn.style.backgroundColor = "#10b981";
      setTimeout(() => {
        btn.textContent = "Sauvegarder le Profil";
        btn.style.backgroundColor = "";
      }, 2000);
    });
  }

  // ── CLIPBOARD COPY UTILITY ──────────────────────────────────────────────────
  function copyTextToClipboard(text) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  // ── AUTOFILL LOGIC & FIELD DETECTIONS ────────────────────────────────────────
  function triggerAutofill() {
    if (!activeApp) return;
    console.log("Ultimate Job Tool Companion: Starting autofill sequence...");

    // Make sure engine is loaded
    if (!window.UJTAutofillEngine) {
      console.error("Ultimate Job Tool Companion: Autofill Engine not found! Ensure it was loaded in manifest.json.");
      const btn = document.getElementById("ujt-btn-autofill");
      if (btn) {
        btn.textContent = "Erreur: Moteur Introuvable";
        btn.style.backgroundColor = "#ef4444";
        setTimeout(() => {
          btn.innerHTML = `
            <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Autoremplir le Formulaire
          `;
          btn.style.backgroundColor = "";
        }, 3000);
      }
      return;
    }

    // Run the engine
    const filledCount = window.UJTAutofillEngine.run(activeApp, personalProfile);

    // Provide visual feedback in the sidebar
    const btn = document.getElementById("ujt-btn-autofill");
    if (filledCount > 0) {
      btn.textContent = `${filledCount} Champs Remplis !`;
      btn.style.backgroundColor = "#10b981";
    } else {
      btn.textContent = "Aucun champ détecté";
      btn.style.backgroundColor = "#f59e0b";
    }

    setTimeout(() => {
      btn.innerHTML = `
        <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        Autoremplir le Formulaire
      `;
      btn.style.backgroundColor = "";
    }, 3000);
  }

  // Listen for messages from popup.js to trigger autofill
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TRIGGER_AUTOFILL") {
      triggerAutofill();
      sendResponse({ status: "success" });
    }
    return true;
  });

})();
