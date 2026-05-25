import fs from 'fs';

const locales = {
  fr: JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf-8')),
  en: JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf-8'))
};

function addStrings(lang, strings) {
  for (const [key, value] of Object.entries(strings)) {
    const keys = key.split('.');
    let current = locales[lang];
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
}

const stringsFr = {
  // PromptsTab
  "prompts.title": "Choisir une stratégie",
  "prompts.editorTitle": "Éditeur de Prompt",
  "prompts.resetAll": "Réinitialiser tout",
  "prompts.reset": "Reset",
  "prompts.empty": "Veuillez sélectionner au moins une stratégie.",
  "prompts.download": "Télécharger",
  "prompts.copy": "Copier",
  "prompts.copyAll": "Copier Tout (Externe)",
  "prompts.generate": "Générer ({{count}}) avec l'IA",

  // AiAssistantTab
  "ai.title": "Réponse de l'IA ({{provider}})",
  "ai.rerun": "Relancer",
  "ai.compileSelected": "Compiler Sélection ({{count}})",
  "ai.compileTooltip": "Compiler la sélection en PDF et le mettre dans le CV Généré",
  "ai.copyAll": "Tout Copier",
  "ai.clearAll": "Tout Effacer",
  "ai.keyRequired": "Clé API Requise",
  "ai.keyDesc": "Choisissez un fournisseur dans la barre du haut, puis entrez votre clé API.",
  "ai.keyLink": "Clé {{provider}} ({{note}})",
  "ai.analyzing": "L'IA analyse votre profil...",
  "ai.includeInPdf": "Inclure dans la compilation PDF",

  // JobOfferTab
  "job.title": "Description de l'Offre",
  "job.clear": "Effacer",
  "job.jina": "Jina AI (Gratuit)",
  "job.scrapfly": "Scrapfly (Clé API)",
  "job.urlPlaceholder": "Coller l'URL de l'offre pour l'extraire",
  "job.extract": "Extraire",
  "job.placeholder": "Le texte de l'offre apparaîtra ici. Vous pouvez aussi le coller manuellement, ou coller directement l'URL de l'offre si vous utilisez une IA qui a accès à internet.",

  // MyCvTab
  "cv.templateTitle": "Choisissez votre modèle de base",
  "cv.templateDesc": "Ce modèle sera utilisé pour structurer votre CV lors de l'importation de votre fichier PDF/Word.",
  "cv.originalTitle": "CV Original (Source)",
  "cv.importBtn": "Importer (PDF/Word)",
  "cv.importing": "Import...",
  "cv.resetFake": "Rétablir CV Fake",
  "cv.generatedTitle": "CV Généré (Adapté)",
  "cv.clear": "Vider",
  "cv.generatedPlaceholder": "Le code LaTeX généré par l'IA sera affiché ici. Utilisez le bouton 'Extraire CV' dans l'onglet Assistant IA.",

  // PdfMakerTab
  "pdf.title": "Générateur PDF",
  "pdf.subtitle": "Via les serveurs officiels TeXLive.net",
  "pdf.sourceGenerated": "CV Généré",
  "pdf.sourceOriginal": "CV Original",
  "pdf.download": "Télécharger PDF",
  "pdf.compile": "Compiler le PDF",
  "pdf.recompile": "Recompiler",
  "pdf.compiling": "Compilation en cours...",
  "pdf.wait": "Cela peut prendre quelques secondes",
  "pdf.error": "❌ Erreur de compilation",
  "pdf.loadingError": "Erreur lors du chargement du PDF.",
  "pdf.emptyTitle": "Compilez votre CV LaTeX en PDF",
  "pdf.emptyDesc": "Votre code LaTeX de l'onglet \"Mon CV\" sera envoyé au compilateur TeXLive. Le PDF s'affichera ici directement.",

  // AtsTestTab
  "ats.title": "Testeur ATS",
  "ats.subtitle": "Évaluez la compatibilité entre votre CV et l'offre d'emploi.",
  "ats.run": "Lancer l'Analyse ATS",
  "ats.analyzing": "L'IA analyse les mots-clés...",
  "ats.scoreTitle": "Score de compatibilité",
  "ats.scoreDesc": "Un score supérieur à 80% maximise vos chances de passer les filtres automatiques (ATS) des recruteurs.",
  "ats.missingTitle": "Mots-clés manquants",
  "ats.missingGood": "Excellent ! Votre CV contient tous les mots-clés essentiels demandés dans l'offre.",
  "ats.adviceTitle": "Conseils d'amélioration",
  "ats.missingJob": "Il vous manque une offre d'emploi. Allez dans l'onglet 'Offre'.",
  "ats.missingCv": "Il vous manque un CV. Allez dans l'onglet 'Mon CV'.",
  "ats.clickToRun": "Cliquez sur 'Lancer l'Analyse ATS' pour évaluer votre CV par rapport à l'offre."
};

const stringsEn = {
  // PromptsTab
  "prompts.title": "Choose a strategy",
  "prompts.editorTitle": "Prompt Editor",
  "prompts.resetAll": "Reset all",
  "prompts.reset": "Reset",
  "prompts.empty": "Please select at least one strategy.",
  "prompts.download": "Download",
  "prompts.copy": "Copy",
  "prompts.copyAll": "Copy All (External)",
  "prompts.generate": "Generate ({{count}}) with AI",

  // AiAssistantTab
  "ai.title": "AI Response ({{provider}})",
  "ai.rerun": "Rerun",
  "ai.compileSelected": "Compile Selection ({{count}})",
  "ai.compileTooltip": "Compile selection to PDF and place in Generated CV",
  "ai.copyAll": "Copy All",
  "ai.clearAll": "Clear All",
  "ai.keyRequired": "API Key Required",
  "ai.keyDesc": "Choose a provider in the top bar, then enter your API key.",
  "ai.keyLink": "{{provider}} Key ({{note}})",
  "ai.analyzing": "AI is analyzing your profile...",
  "ai.includeInPdf": "Include in PDF compilation",

  // JobOfferTab
  "job.title": "Job Description",
  "job.clear": "Clear",
  "job.jina": "Jina AI (Free)",
  "job.scrapfly": "Scrapfly (API Key)",
  "job.urlPlaceholder": "Paste the job offer URL to extract it",
  "job.extract": "Extract",
  "job.placeholder": "The job offer text will appear here. You can also paste it manually, or paste the job offer URL directly if using an AI with internet access.",

  // MyCvTab
  "cv.templateTitle": "Choose your base template",
  "cv.templateDesc": "This template will be used to structure your CV when importing your PDF/Word file.",
  "cv.originalTitle": "Original CV (Source)",
  "cv.importBtn": "Import (PDF/Word)",
  "cv.importing": "Importing...",
  "cv.resetFake": "Restore Fake CV",
  "cv.generatedTitle": "Generated CV (Adapted)",
  "cv.clear": "Clear",
  "cv.generatedPlaceholder": "The LaTeX code generated by the AI will be displayed here. Use the 'Extract CV' button in the AI Assistant tab.",

  // PdfMakerTab
  "pdf.title": "PDF Generator",
  "pdf.subtitle": "Via official TeXLive.net servers",
  "pdf.sourceGenerated": "Generated CV",
  "pdf.sourceOriginal": "Original CV",
  "pdf.download": "Download PDF",
  "pdf.compile": "Compile PDF",
  "pdf.recompile": "Recompile",
  "pdf.compiling": "Compilation in progress...",
  "pdf.wait": "This may take a few seconds",
  "pdf.error": "❌ Compilation error",
  "pdf.loadingError": "Error loading the PDF.",
  "pdf.emptyTitle": "Compile your LaTeX CV to PDF",
  "pdf.emptyDesc": "Your LaTeX code from the 'My CV' tab will be sent to the TeXLive compiler. The PDF will be displayed here directly.",

  // AtsTestTab
  "ats.title": "ATS Tester",
  "ats.subtitle": "Evaluate the compatibility between your CV and the job offer.",
  "ats.run": "Run ATS Analysis",
  "ats.analyzing": "AI is analyzing the keywords...",
  "ats.scoreTitle": "Compatibility Score",
  "ats.scoreDesc": "A score above 80% maximizes your chances of passing recruiter automatic filters (ATS).",
  "ats.missingTitle": "Missing Keywords",
  "ats.missingGood": "Excellent! Your CV contains all the essential keywords requested in the offer.",
  "ats.adviceTitle": "Improvement Advice",
  "ats.missingJob": "You are missing a job offer. Go to the 'Job Offer' tab.",
  "ats.missingCv": "You are missing a CV. Go to the 'My CV' tab.",
  "ats.clickToRun": "Click on 'Run ATS Analysis' to evaluate your CV against the job offer."
};

addStrings('fr', stringsFr);
addStrings('en', stringsEn);

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(locales.fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(locales.en, null, 2));
console.log('Locales updated!');
