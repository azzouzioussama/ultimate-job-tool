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

// App.jsx strings
const appStringsFr = {
  "app.auth.welcomeTitle": "Bienvenue !",
  "app.auth.welcomeDesc": "Connectez-vous pour gérer vos candidatures, générer des lettres de motivation, et adapter vos CV avec l'IA.",
  "app.auth.loginButton": "Se connecter",
  "app.prompts.missingCv": "[CV MANQUANT]",
  "app.prompts.missingJob": "[OFFRE MANQUANTE]",
  "app.prompts.urlInstruction": "(IMPORTANT : La description de poste ci-dessus est une URL. Utilise tes outils de navigation web pour visiter ce lien et lire le contenu de l'offre d'emploi avant de générer ta réponse. Si tu ne peux pas naviguer, demande à l'utilisateur de fournir le texte.)",
  "app.toast.copied": "Copié dans le presse-papiers !",
  "app.toast.copyFailed": "Échec de la copie.",
  "app.toast.downloaded": "Fichier téléchargé !",
  "app.toast.reset": "Tout réinitialisé aux valeurs par défaut.",
  "app.toast.apiKeyRequired": "Veuillez entrer une clé API {{provider}}.",
  "app.ai.error": "❌ Erreur: {{error}}",
  "app.toast.retry": "Connexion interrompue, nouvelle tentative...",
  "app.toast.timeout": "La requête a expiré (timeout). Vérifiez votre connexion et réessayez.",
  "app.ai.errorTitle": "Erreur",
  "app.ai.apiError": "❌ Erreur: {{msg}}\n\nVérifiez que votre clé API {{provider}} est valide.",
  "app.toast.noResponseSelected": "Aucune réponse sélectionnée.",
  "app.toast.cvMerged": "CV Généré extrait et sauvegardé (Fusion réussie) !",
  "app.toast.cvExtracted": "Premier CV extrait (Fusion impossible, pas de base document) !",
  "app.toast.latexNotFound": "Aucun code LaTeX complet trouvé ou fusion impossible.",
  "app.prompt.scrapflyKey": "Entrez votre clé API Scrapfly (commence par 'scp-live-...') :",
  "app.error.scrapflyRequired": "Clé Scrapfly requise pour l'extraction.",
  "app.toast.offerExtracted": "Offre extraite avec succès via {{provider}} !",
  "app.toast.error": "Erreur: ",
  "app.toast.pdfCompiled": "PDF compilé avec succès !",
  "app.toast.pdfError": "Erreur de compilation PDF.",
  "app.toast.pdfDownloaded": "PDF téléchargé !",
  "app.toast.atsMissingData": "Il faut une offre d'emploi et un CV pour faire le test ATS.",
  "app.toast.atsSuccess": "Analyse ATS terminée !",
  "app.toast.atsError": "Erreur lors de l'analyse ATS. Le format JSON retourné est invalide ou la requête a échoué.",
  "app.toast.apiRequiredFirst": "Veuillez configurer votre clé API IA dans l'en-tête d'abord.",
  "app.toast.readingFile": "Lecture du fichier en cours...",
  "app.toast.generatingLatex": "Texte extrait ! Génération LaTeX en cours par l'IA...",
  "app.toast.cvImported": "CV importé et converti avec succès en LaTeX !",
  "app.error.invalidLatex": "L'IA n'a pas renvoyé de code LaTeX valide.",
  "app.toast.importError": "Erreur d'import : {{error}}"
};

const appStringsEn = {
  "app.auth.welcomeTitle": "Welcome!",
  "app.auth.welcomeDesc": "Log in to manage your applications, generate cover letters, and adapt your resumes with AI.",
  "app.auth.loginButton": "Log in",
  "app.prompts.missingCv": "[MISSING CV]",
  "app.prompts.missingJob": "[MISSING JOB OFFER]",
  "app.prompts.urlInstruction": "(IMPORTANT: The job description above is a URL. Use your web browsing tools to visit this link and read the job offer content before generating your response. If you cannot browse, ask the user to provide the text.)",
  "app.toast.copied": "Copied to clipboard!",
  "app.toast.copyFailed": "Copy failed.",
  "app.toast.downloaded": "File downloaded!",
  "app.toast.reset": "Everything reset to defaults.",
  "app.toast.apiKeyRequired": "Please enter a {{provider}} API key.",
  "app.ai.error": "❌ Error: {{error}}",
  "app.toast.retry": "Connection interrupted, retrying...",
  "app.toast.timeout": "Request timed out. Check your connection and try again.",
  "app.ai.errorTitle": "Error",
  "app.ai.apiError": "❌ Error: {{msg}}\n\nCheck that your {{provider}} API key is valid.",
  "app.toast.noResponseSelected": "No response selected.",
  "app.toast.cvMerged": "Generated CV extracted and saved (Merge successful)!",
  "app.toast.cvExtracted": "First CV extracted (Merge impossible, no document base)!",
  "app.toast.latexNotFound": "No complete LaTeX code found or merge impossible.",
  "app.prompt.scrapflyKey": "Enter your Scrapfly API key (starts with 'scp-live-...') :",
  "app.error.scrapflyRequired": "Scrapfly key required for extraction.",
  "app.toast.offerExtracted": "Offer successfully extracted via {{provider}}!",
  "app.toast.error": "Error: ",
  "app.toast.pdfCompiled": "PDF successfully compiled!",
  "app.toast.pdfError": "PDF compilation error.",
  "app.toast.pdfDownloaded": "PDF downloaded!",
  "app.toast.atsMissingData": "A job offer and a resume are required for the ATS test.",
  "app.toast.atsSuccess": "ATS analysis complete!",
  "app.toast.atsError": "Error during ATS analysis. The returned JSON format is invalid or the request failed.",
  "app.toast.apiRequiredFirst": "Please configure your AI API key in the header first.",
  "app.toast.readingFile": "Reading file...",
  "app.toast.generatingLatex": "Text extracted! Generating LaTeX with AI...",
  "app.toast.cvImported": "CV successfully imported and converted to LaTeX!",
  "app.error.invalidLatex": "The AI did not return valid LaTeX code.",
  "app.toast.importError": "Import error: {{error}}"
};

// Dashboard strings
const dashboardStringsFr = {
  "dashboard.confirmDelete": "Êtes-vous sûr de vouloir supprimer cette candidature ?",
  "dashboard.unknown": "Inconnu",
  "dashboard.title": "Mes Candidatures",
  "dashboard.subtitle": "Gérez vos différentes versions de CV et offres d'emploi (Stockage local).",
  "dashboard.newApp": "Nouvelle Candidature",
  "dashboard.form.company": "Entreprise",
  "dashboard.form.companyPlaceholder": "Ex: Google",
  "dashboard.form.jobTitle": "Poste visé",
  "dashboard.form.jobTitlePlaceholder": "Ex: Développeur Frontend",
  "dashboard.form.cancel": "Annuler",
  "dashboard.form.create": "Créer",
  "dashboard.loading": "Chargement...",
  "dashboard.emptyTitle": "Aucune candidature",
  "dashboard.emptyDesc": "Créez votre première candidature pour commencer à adapter votre CV.",
  "dashboard.card.delete": "Supprimer",
  "dashboard.card.modified": "Modifié le {{date}}",
  "dashboard.card.open": "Ouvrir"
};

const dashboardStringsEn = {
  "dashboard.confirmDelete": "Are you sure you want to delete this application?",
  "dashboard.unknown": "Unknown",
  "dashboard.title": "My Applications",
  "dashboard.subtitle": "Manage your different versions of CVs and job offers (Local storage).",
  "dashboard.newApp": "New Application",
  "dashboard.form.company": "Company",
  "dashboard.form.companyPlaceholder": "E.g.: Google",
  "dashboard.form.jobTitle": "Target Position",
  "dashboard.form.jobTitlePlaceholder": "E.g.: Frontend Developer",
  "dashboard.form.cancel": "Cancel",
  "dashboard.form.create": "Create",
  "dashboard.loading": "Loading...",
  "dashboard.emptyTitle": "No application",
  "dashboard.emptyDesc": "Create your first application to start adapting your resume.",
  "dashboard.card.delete": "Delete",
  "dashboard.card.modified": "Modified on {{date}}",
  "dashboard.card.open": "Open"
};

addStrings('fr', appStringsFr);
addStrings('en', appStringsEn);
addStrings('fr', dashboardStringsFr);
addStrings('en', dashboardStringsEn);

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(locales.fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(locales.en, null, 2));
console.log('Locales updated!');
