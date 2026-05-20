import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Copy, Download, FileText, CheckCircle2, User, Settings, Bot, FileOutput, KeyRound, ExternalLink, Loader2, RotateCcw, Trash } from 'lucide-react';

// --- 1. Synthetic Fake CV ---
const SYNTHETIC_CV = `\\documentclass[a4paper,10pt]{article}

% --- Paquets ---
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[french]{babel}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

% --- Configuration ---
\\hypersetup{colorlinks=true, urlcolor=blue}
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

\\begin{document}

% --- En-tête ---
\\begin{center}
    {\\Huge \\textbf{Jean DUPONT}} \\\\
    \\vspace{4pt}
    Île-de-France, France | \\textbf{Permis B} \\\\
    +33 6 12 34 56 78 | \\href{mailto:jean.dupont@email.fake}{jean.dupont@email.fake} \\\\
    \\href{https://linkedin.com/in/jeandupont-fake}{linkedin.com/in/jeandupont-fake} | \\href{https://github.com/jeandupont-fake}{github.com/jeandupont-fake} \\\\
    \\vspace{6pt}
    \\textbf{\\Large Technicien Support Informatique \\& Systèmes}
\\end{center}

\\section{Résumé Professionnel}
Technicien support rigoureux doté d'un excellent sens du relationnel. Spécialisé dans le support de proximité et la gestion d'environnements hybrides (AD/M365). Mon expérience actuelle m'a forgé une solide résistance au stress, tandis que mon expertise technique acquise chez TechCorp me permet d'automatiser la résolution d'incidents via le scripting. Orienté satisfaction utilisateur et respect des SLA.

\\section{Compétences Support \\& Techniques}
\\begin{itemize}[leftmargin=0.15in, labelsep=0.5em]
    \\item \\textbf{Support \\& Helpdesk :} Gestion d'incidents via Jira / GLPI, diagnostic matériel/logiciel, prise en main à distance (TeamViewer).
    \\item \\textbf{Administration Système :} Active Directory (GPO, OU, DNS), Microsoft Entra ID (Azure AD), Microsoft 365, Microsoft Intune (MDM).
    \\item \\textbf{Réseau \\& Connectivité :} Dépannage IPv4, DNS, DHCP, VPN, pare-feu.
    \\item \\textbf{Langues :} Français (Maternel), Anglais (Courant - C1).
\\end{itemize}

\\section{Expériences Professionnelles}

\\textbf{RetailStore France} | \\textit{Responsable de point de vente} \\hfill \\textit{01/2025 -- Présent}
\\begin{itemize}[noitemsep]
    \\item \\textbf{Service Client :} Gestion des situations complexes et résolution de conflits.
    \\item \\textbf{Support Niveau 1 :} Diagnostic sur les systèmes d'encaissement et terminaux (TPE).
\\end{itemize}

\\textbf{TechCorp Internationale} | \\textit{Stagiaire Support Technique \\& Automatisation} \\hfill \\textit{04/2024 -- 10/2024}
\\begin{itemize}[noitemsep]
    \\item \\textbf{Support Client :} Support technique pour des clients européens.
    \\item \\textbf{Fiabilisation :} Validation de services Cloud pour la continuité en production.
\\end{itemize}

\\section{Projets Techniques (Labs)}
\\textbf{Lab Infrastructure Entreprise Hybride}
\\begin{itemize}[noitemsep, topsep=2pt]
    \\item Déploiement d'un DC (Windows Server 2022), masterisation de postes Windows 10 Pro.
    \\item Résolution d'incidents (verrouillages, DNS) et gestion de comptes via Active Directory.
\\end{itemize}

\\section{Éducation \\& Certifications}
\\begin{itemize}[leftmargin=0.15in, labelsep=0.5em]
    \\item \\textbf{Certifications :} AWS Certified Cloud Practitioner.
    \\item \\textbf{Master 2 Informatique :} Université de Paris \\hfill \\textit{2024}
\\end{itemize}

\\end{document}`;

// --- 2. Top 10 Prompt Templates ---
const PROMPT_TEMPLATES = [
  {
    id: 1,
    title: "1. Refonte du CV (LaTeX)",
    description: "Adapte votre CV LaTeX aux mots-clés exacts de l'offre d'emploi.",
    content: `Agis comme un recruteur expert IT. Analyse la description de poste et mon CV LaTeX ci-dessous.
Tâches :
1. Identifie les 3 compétences techniques les plus recherchées.
2. Réécris mon CV ENTIER en LaTeX. Adapte les bullet points et le résumé pour refléter exactement les mots-clés de l'offre, tout en gardant le code LaTeX intact.
3. Dis-moi quelle expérience je dois mettre en avant en entretien.

ATTENTION - REGLES STRICTES POUR LE CODE LATEX :
- Tu DOIS ABSOLUMENT échapper le caractère '&' en l'écrivant '\\&' dans le texte. Ne laisse jamais un '&' seul.
- Assure-toi de bien fermer toutes les accolades '{ }' et de ne jamais les confondre avec des crochets '[ ]'.
- Ne modifie pas la structure du préambule ni les balises d'environnement.

--- MON CV LATEX ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 2,
    title: "2. Lettre de Motivation (Français)",
    description: "Génère une lettre de motivation courte et percutante.",
    content: `Agis comme un expert en recrutement. Rédige une lettre de motivation courte (max 150 mots, 3 paragraphes) en français pour ce poste.
Contraintes :
- Paragraphe 1 : Intérêt pour le rôle.
- Paragraphe 2 : Relie 2 de mes forces (issues du CV) aux besoins du poste.
- Paragraphe 3 : Disponibilité et appel à l'action.
Garde un ton professionnel mais dynamique.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 3,
    title: "3. Lettre de Motivation (Anglais)",
    description: "Génère une lettre de motivation en anglais professionnel.",
    content: `Act as an expert technical recruiter. Write a concise cover letter (max 150 words) in English for this position.
Connect my background from the provided CV to the exact needs of the job description. Keep the tone highly professional, direct, and confident.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}`
  },
  {
    id: 4,
    title: "4. Préparation Entretien (Q&A)",
    description: "Génère les 10 questions les plus probables pour ce poste avec les réponses STAR.",
    content: `En te basant sur la description de poste et mon CV, génère les 10 questions d'entretien les plus probables (techniques et comportementales) que l'on pourrait me poser.
Pour chaque question, rédige une suggestion de réponse en utilisant la méthode STAR (Situation, Tâche, Action, Résultat), en piochant dans mes expériences.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 5,
    title: "5. Critique Sévère du CV",
    description: "Analyse critique pour trouver les failles de votre candidature.",
    content: `Agis comme un recruteur IT très exigeant. Analyse mon CV par rapport à l'offre d'emploi.
1. Donne-moi une note sur 100 de matching.
2. Liste impitoyablement les 3 plus grandes faiblesses ou manques de mon CV pour ce poste précis.
3. Donne-moi une stratégie pour contourner ces faiblesses lors de l'entretien.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 6,
    title: "6. Optimisation LinkedIn",
    description: "Crée une section 'Infos' LinkedIn attractive pour attirer ce type de recruteur.",
    content: `Je veux optimiser mon profil LinkedIn pour attirer les recruteurs qui publient ce type d'offre d'emploi.
Rédige une section "Infos" (À propos) LinkedIn percutante à la première personne, en utilisant mon CV, optimisée avec les mots-clés de l'offre d'emploi. Inclut un "Call to Action" à la fin.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 7,
    title: "7. Pitch de Présentation (30 sec)",
    description: "Prépare votre réponse à la question 'Parlez-moi de vous'.",
    content: `Prépare-moi un pitch "Elevator Pitch" de 30 à 45 secondes pour répondre à la fameuse question d'entretien : "Parlez-moi de vous". 
Il doit être naturel, en français, et lier immédiatement mon parcours (mon CV) au besoin principal de l'entreprise (l'offre d'emploi).

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 8,
    title: "8. Analyse des Compétences Manquantes",
    description: "Identifie les technologies que vous devez réviser avant l'entretien.",
    content: `Analyse les exigences du poste par rapport à mon CV.
Fais une liste des technologies, outils ou compétences mentionnés dans l'offre que je NE possède PAS clairement dans mon CV.
Pour chaque manque, propose-moi un plan d'action d'apprentissage express de 2 heures (concepts clés à googler, tutoriels à chercher) pour que je sois capable d'en parler intelligemment en entretien.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 9,
    title: "9. Email de Remerciement",
    description: "Rédige un email post-entretien percutant.",
    content: `Rédige un e-mail de remerciement post-entretien court et professionnel.
L'email doit remercier le recruteur pour son temps, réaffirmer mon enthousiasme pour ce poste spécifique, et rappeler brièvement en une ligne pourquoi ma compétence principale fait de moi un excellent choix.

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 10,
    title: "10. Prompt Personnalisé (Libre)",
    description: "Écrivez votre propre requête à l'IA.",
    content: `(Écrivez vos instructions ici. Utilisez {cv_content} et {job_description} pour injecter vos données automatiquement).`
  }
];

// Fonction pour nettoyer le markdown extrait par Jina AI des menus, formulaires et cookies de bas de page.
function cleanJinaMarkdown(md) {
  if (!md) return '';
  const lines = md.split(/\r\n?|\n/);
  const cleaned = [];
  
  const linkRegex = /\[.*?\]\(.*?\)/g;
  
  const cutoffHeadings = [
    'ces offres',
    'recherches similaires',
    'recherche similaire',
    'emplois similaires',
    'offres similaires',
    'offres associées',
    'créez votre compte',
    'creez votre compte',
    'activez votre alerte',
    'créer une alerte',
    'creer une alerte',
    'envoyez votre candidature',
    'partager l\'offre',
    'partager cette offre',
    'vous aimerez aussi',
    'autres offres',
    'coach emploi',
    'candidature',
    'postuler en ligne',
    'sign up',
    'create an account',
    'similar jobs',
    'recommended jobs',
    'more jobs',
    'subscribe to',
    'newsletter'
  ];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      cleaned.push('');
      continue;
    }
    
    const lower = trimmed.toLowerCase();
    
    // Si on atteint un titre de fin de page ou de publicité/connexion, on s'arrête
    if (trimmed.startsWith('#') || lower.includes('coach emploi')) {
      const headingText = trimmed.replace(/^#+\s*/, '').toLowerCase();
      const isCutoff = cutoffHeadings.some(keyword => headingText.includes(keyword) || lower.includes(keyword));
      if (isCutoff) {
        break;
      }
    }
    
    // 1. Filtrer les cases à cocher de menu
    if (trimmed === '- [x]' || trimmed === '- [ ]' || trimmed === '* [x]' || trimmed === '* [ ]') {
      continue;
    }

    // 2. Filtrer les réseaux sociaux
    if (
      lower.includes('facebook.com') ||
      lower.includes('twitter.com') ||
      lower.includes('linkedin.com/company') ||
      lower.includes('youtube.com') ||
      lower.includes('instagram.com') ||
      lower.includes('pinterest.com') ||
      lower.includes('glassdoor')
    ) {
      continue;
    }
    
    // 3. Boutons de téléchargement d'app mobiles
    if (lower.includes('play.google.com') || lower.includes('apps.apple.com')) {
      continue;
    }
    
    // 4. Mots-clés des portails de connexion et formulaires
    if (
      lower.includes('se connecter') ||
      lower.includes('s\'inscrire') ||
      lower.includes('mon espace') ||
      lower.includes('mon profil') ||
      lower.includes('créer un compte') ||
      lower.includes('complétez votre profil') ||
      lower.includes('completez votre profil') ||
      lower.includes('accés recruteur') ||
      lower.includes('acces recruteur') ||
      lower.includes('déconnexion') ||
      lower.includes('deconnexion') ||
      lower.includes('mes candidatures') ||
      lower.includes('mes alertes') ||
      lower.includes('paramètres') ||
      lower.includes('parametres') ||
      lower.includes('créer mon alerte')
    ) {
      continue;
    }
    
    // 5. Filtrer les lignes qui ne contiennent que des liens (menus de navigation)
    const textWithoutLinks = trimmed.replace(linkRegex, '');
    const hasAlphaNumeric = /[a-zA-Z0-9\u00C0-\u00FF]/.test(textWithoutLinks);
    if (!hasAlphaNumeric && trimmed.includes('[')) {
      continue;
    }
    
    // 6. Filtrer les images et formats d'image restants
    if (trimmed.startsWith('![') || (trimmed.startsWith('[') && (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.gif')))) {
      continue;
    }
    
    // 7. Textes de RGPD, cookies et politique légale
    if (
      lower.includes('cookie') ||
      lower.includes('traceur') ||
      lower.includes('cgu') ||
      lower.includes('politique de confidentialité') ||
      lower.includes('privacy policy') ||
      lower.includes('mentions légales') ||
      lower.includes('tous droits réservés') ||
      lower.includes('copyright') ||
      lower.includes('données personnelles') ||
      lower.includes('gérer les traceurs') ||
      lower.includes('continuer sans accepter')
    ) {
      continue;
    }
    
    // 8. Phrases génériques de navigation
    if (
      lower === 'lire dans l\'app' ||
      lower === 'téléchargez l\'app et postulez dans les premiers !' ||
      lower === 'c\'est noté' ||
      lower === 'voir plus' ||
      lower === 'lire la suite' ||
      lower === 'voir plus d\'offres' ||
      lower === 'lien copié' ||
      lower === 'lien copie' ||
      lower.includes("le job l'entreprise") ||
      lower.includes("l'entreprise l'entreprise")
    ) {
      continue;
    }
    
    cleaned.push(line);
  }
  
  return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export default function App() {
  const [activeTab, setActiveTab] = useState('templates');
  const [jobDescription, setJobDescription] = useState(localStorage.getItem('job_description') || '');
  const [cvOriginal, setCvOriginal] = useState(localStorage.getItem('cv_original') || localStorage.getItem('cv_content') || SYNTHETIC_CV);
  const [cvGenerated, setCvGenerated] = useState(localStorage.getItem('cv_generated') || '');
  const [pdfSource, setPdfSource] = useState('generated');
  const [toastMessage, setToastMessage] = useState('');
  
  // Templates State
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [customPrompt, setCustomPrompt] = useState(PROMPT_TEMPLATES[0].content);
  const [compiledPrompt, setCompiledPrompt] = useState('');

  // --- AI Provider & Model Config ---
  const AI_PROVIDERS = {
    openrouter: {
      label: 'OpenRouter',
      models: [
        { id: 'deepseek/deepseek-v4-flash:free', label: 'DeepSeek V4 Flash', note: 'Gratuit' },
        { id: 'openrouter/free', label: 'Auto (meilleur gratuit)', note: 'Gratuit' },
      ],
      keyLink: 'https://openrouter.ai/keys',
      keyNote: 'Gratuit',
    },
    gemini: {
      label: 'Gemini',
      models: [
        { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', note: 'Gratuit' },
        { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', note: 'Gratuit' },
      ],
      keyLink: 'https://aistudio.google.com/app/apikey',
      keyNote: 'Gratuit',
    },
    openai: {
      label: 'OpenAI',
      models: [
        { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano', note: '$0.20/M in' },
        { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', note: '$0.75/M in' },
        { id: 'gpt-5.4', label: 'GPT-5.4', note: '$2.50/M in' },
        { id: 'gpt-5.5', label: 'GPT-5.5 (Flagship)', note: '$5.00/M in' },
        { id: 'gpt-5.5-pro', label: 'GPT-5.5 Pro', note: '$30.00/M in' },
        { id: 'o4-mini', label: 'o4-mini (Reasoning)', note: '$0.55/M in' },
        { id: 'o3', label: 'o3 (Reasoning)', note: '$2.00/M in' },
        { id: 'o3-pro', label: 'o3-pro (High Reasoning)', note: '$20.00/M in' },
      ],
      keyLink: 'https://platform.openai.com/api-keys',
      keyNote: 'Payant',
    },
    deepseek: {
      label: 'DeepSeek',
      models: [
        { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', note: '$0.14/M in' },
        { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', note: '$1.74/M in' },
        { id: 'deepseek-chat', label: 'DeepSeek Chat (Legacy)', note: 'Déprécié' },
        { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (Legacy)', note: 'Déprécié' },
      ],
      keyLink: 'https://platform.deepseek.com/api_keys',
      keyNote: 'Payant',
    },
  };

  // AI State
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('ai_provider') || 'gemini');
  const [aiModel, setAiModel] = useState(localStorage.getItem('ai_model') || 'gemini-2.5-flash');
  const [apiKey, setApiKey] = useState(localStorage.getItem(`api_key_${localStorage.getItem('ai_provider') || 'gemini'}`) || '');
  const [aiResponse, setAiResponse] = useState(localStorage.getItem('ai_response') || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [scraperType, setScraperType] = useState(localStorage.getItem('scraper_type') || 'jina');

  // Autosave to localStorage
  useEffect(() => { localStorage.setItem('job_description', jobDescription); }, [jobDescription]);
  useEffect(() => { localStorage.setItem('cv_original', cvOriginal); }, [cvOriginal]);
  useEffect(() => { localStorage.setItem('cv_generated', cvGenerated); }, [cvGenerated]);
  useEffect(() => { localStorage.setItem('ai_response', aiResponse); }, [aiResponse]);
  useEffect(() => { localStorage.setItem('scraper_type', scraperType); }, [scraperType]);

  // PDF State
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Handle Template Selection
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setCustomPrompt(template.content);
    }
  }, [selectedTemplateId]);

  // Load correct API key + default model when provider changes
  useEffect(() => {
    const key = localStorage.getItem(`api_key_${aiProvider}`) || '';
    setApiKey(key);
    const savedModel = localStorage.getItem(`ai_model_${aiProvider}`);
    const defaultModel = AI_PROVIDERS[aiProvider]?.models[0]?.id;
    setAiModel(savedModel || defaultModel);
  }, [aiProvider]);

  // Update compiled prompt whenever inputs change
  useEffect(() => {
    let final = customPrompt.replace(/{cv_content}/g, cvOriginal || '[CV MANQUANT]');
    
    let jobContent = jobDescription || '[OFFRE MANQUANTE]';
    // Method 3: If the user pasted a raw URL instead of text, add an explicit instruction to the AI
    if (/^https?:\/\/\S+$/.test(jobContent.trim())) {
      jobContent += "\n\n(IMPORTANT : La description de poste ci-dessus est une URL. Utilise tes outils de navigation web pour visiter ce lien et lire le contenu de l'offre d'emploi avant de générer ta réponse. Si tu ne peux pas naviguer, demande à l'utilisateur de fournir le texte.)";
    }
    
    final = final.replace(/{job_description}/g, jobContent);
    setCompiledPrompt(final);
  }, [customPrompt, cvOriginal, jobDescription]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Copié dans le presse-papiers !');
    } catch (err) {
      showToast('Échec de la copie.');
    }
    document.body.removeChild(textArea);
  };

  const handleSaveApiKey = (e) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem(`api_key_${aiProvider}`, val);
  };

  const handleProviderChange = (provider) => {
    setAiProvider(provider);
    localStorage.setItem('ai_provider', provider);
  };

  const handleModelChange = (model) => {
    setAiModel(model);
    localStorage.setItem('ai_model', model);
    localStorage.setItem(`ai_model_${aiProvider}`, model);
  };

  const downloadAsTxt = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${selectedTemplateId}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fichier téléchargé !');
  };

  const resetAll = () => {
    setCvOriginal(SYNTHETIC_CV);
    setCvGenerated('');
    setSelectedTemplateId(1);
    setCustomPrompt(PROMPT_TEMPLATES[0].content);
    setJobDescription('');
    setAiResponse('');
    showToast('Tout réinitialisé aux valeurs par défaut.');
  };

  const providerLabel = AI_PROVIDERS[aiProvider]?.label || aiProvider;

  // --- AI Chat Function (Multi-Provider) ---
  const handleRunAI = async () => {
    if (!apiKey) {
      showToast(`Veuillez entrer une clé API ${providerLabel}.`);
      setActiveTab('ai');
      return;
    }
    if (!compiledPrompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    setActiveTab('ai');

    try {
      let reply = '';

      if (aiProvider === 'gemini') {
        // Gemini uses its own API format
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compiledPrompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message || 'Erreur API Gemini');
        reply = data.candidates[0].content.parts[0].text;
      } else {
        // OpenAI, DeepSeek & OpenRouter all use OpenAI-compatible format
        const endpoints = {
          openai: 'https://api.openai.com/v1/chat/completions',
          deepseek: 'https://api.deepseek.com/chat/completions',
          openrouter: 'https://openrouter.ai/api/v1/chat/completions',
        };
        const endpoint = endpoints[aiProvider];

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        // OpenRouter recommends these optional headers
        if (aiProvider === 'openrouter') {
          headers['HTTP-Referer'] = window.location.origin;
          headers['X-Title'] = 'Ultimate Job Tool';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: aiModel,
            messages: [{ role: 'user', content: compiledPrompt }],
            temperature: 0.7
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message || `Erreur API ${providerLabel}`);
        reply = data.choices[0].message.content;
      }

      setAiResponse(reply);
    } catch (error) {
      setAiResponse(`❌ Erreur: ${error.message}\n\nVérifiez que votre clé API ${providerLabel} est valide et a des quotas disponibles.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const extractLatexAndSave = () => {
    const match = aiResponse.match(/\\documentclass[\s\S]*?\\end\{document\}/);
    if (match) {
      let extracted = match[0];
      // Auto-fix common AI hallucinations: unescaped ampersands (assuming no tables in CV)
      extracted = extracted.replace(/(?<!\\)&/g, '\\&');
      
      setCvGenerated(extracted);
      showToast('CV Généré extrait et sauvegardé (Corrections appliquées) !');
      setActiveTab('cv');
    } else {
      showToast('Aucun code LaTeX complet trouvé dans la réponse.');
    }
  };

  const handleScrape = async () => {
    if (!jobUrl) return;
    setIsScraping(true);
    try {
      if (scraperType === 'jina') {
        const response = await fetch(`https://r.jina.ai/${jobUrl}`);
        if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
        const text = await response.text();
        const cleanedText = cleanJinaMarkdown(text);
        setJobDescription(cleanedText);
        showToast('Offre extraite avec succès via Jina AI !');
        setJobUrl('');
      } else if (scraperType === 'scrapfly') {
        let key = localStorage.getItem('scrapfly_key');
        if (!key) {
          key = prompt("Entrez votre clé API Scrapfly (commence par 'scp-live-...') :");
          if (!key) throw new Error("Clé Scrapfly requise pour l'extraction.");
          localStorage.setItem('scrapfly_key', key);
        }
        
        const params = new URLSearchParams({
          key: key,
          url: jobUrl,
          extraction_model: 'job_posting',
          render_js: 'true'
        });
        
        const response = await fetch(`/api/scrapfly?${params.toString()}`);
        if (!response.ok) {
          let errMsg = `Erreur API Scrapfly (${response.status})`;
          try {
            const errData = await response.json();
            if (errData.message) {
              errMsg += `: ${errData.message}`;
            } else if (errData.error && errData.error.message) {
              errMsg += `: ${errData.error.message}`;
            } else if (errData.error) {
              errMsg += `: ${errData.error}`;
            }
          } catch (e) {
            try {
              const errText = await response.text();
              if (errText) errMsg += `: ${errText.slice(0, 150)}`;
            } catch (e2) {}
          }
          throw new Error(errMsg);
        }
        
        const data = await response.json();
        if (data.result && data.result.extracted_data) {
          const extData = data.result.extracted_data.data || {};
          const jobDescText = extData.jobDescription || JSON.stringify(data.result.extracted_data, null, 2);
          setJobDescription(jobDescText);
          showToast('Offre extraite et structurée via Scrapfly !');
          setJobUrl('');
        } else {
           throw new Error("Aucune donnée extraite par le modèle Scrapfly.");
        }
      }
    } catch (error) {
      showToast('Erreur: ' + error.message);
    } finally {
      setIsScraping(false);
    }
  };

  // --- PDF Compilation via fetch ---
  const compilePDF = async () => {
    setIsPdfLoading(true);
    setPdfError('');
    // Revoke old blob URL to free memory
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);

    try {
      const formData = new FormData();
      const contentToCompile = pdfSource === 'generated' && cvGenerated.trim() ? cvGenerated : cvOriginal;
      formData.append('filecontents[]', contentToCompile);
      formData.append('filename[]', 'document.tex');
      formData.append('engine', 'pdflatex');
      formData.append('return', 'pdf');

      const response = await fetch('/api/latex', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();

      if (!contentType.includes('pdf')) {
        // Server returned an error page (HTML/text) instead of PDF
        const text = await blob.text();
        throw new Error('La compilation a échoué. Vérifiez votre code LaTeX.\n\n' + text.slice(0, 500));
      }

      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      showToast('PDF compilé avec succès !');
    } catch (error) {
      setPdfError(error.message);
      showToast('Erreur de compilation PDF.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = 'cv_compiled.pdf';
    a.click();
    showToast('PDF téléchargé !');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 sm:pb-0 flex flex-col">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Briefcase size={28} />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Ultimate Job Tool</h1>
            <h1 className="text-xl font-bold tracking-tight sm:hidden">Job Tool</h1>
          </div>
          {/* Provider + Model + API Key */}
          <div className="flex items-center gap-1.5">
            <select
              value={aiProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              {Object.entries(AI_PROVIDERS).map(([key, p]) => (
                <option key={key} value={key}>{p.label}</option>
              ))}
            </select>
            <select
              value={aiModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer hidden sm:block"
            >
              {AI_PROVIDERS[aiProvider]?.models.map(m => (
                <option key={m.id} value={m.id}>{m.label} ({m.note})</option>
              ))}
            </select>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
              <KeyRound size={16} className="text-slate-400" />
              <input 
                type="password" 
                placeholder={`Clé ${providerLabel}...`}
                className="bg-transparent border-none outline-none text-xs w-20 sm:w-32 text-slate-700"
                value={apiKey}
                onChange={handleSaveApiKey}
              />
            </div>
          </div>
        </div>
        
        {/* TAB NAVIGATION */}
        <div className="max-w-5xl mx-auto px-4 border-t border-slate-100 bg-white flex overflow-x-auto custom-scrollbar">
          {[
            { id: 'templates', icon: Settings, label: 'Prompts' },
            { id: 'ai', icon: Bot, label: 'Assistant IA' },
            { id: 'job', icon: FileText, label: 'Offre' },
            { id: 'cv', icon: User, label: 'Mon CV' },
            { id: 'pdf', icon: FileOutput, label: 'PDF Maker' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium border-b-2 flex justify-center items-center gap-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-2 w-full flex-grow flex flex-col gap-6">

        {/* --- VIEW: TEMPLATES & COMPILED PROMPT --- */}
        <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Col: Top 10 Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[70vh]">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Settings size={20} className="text-indigo-600" /> Choisir une stratégie
              </h2>
              <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar pr-2">
                {PROMPT_TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTemplateId === t.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="font-semibold text-sm text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Editor & Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[70vh]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-semibold text-sm">Éditeur de Prompt</span>
                <div className="flex items-center gap-2">
                  <button onClick={resetAll} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600" title="Réinitialiser tout">
                    <RotateCcw size={14}/> Reset
                  </button>
                  <button onClick={downloadAsTxt} className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600">
                    <Download size={14}/> .txt
                  </button>
                  <button onClick={() => copyToClipboard(compiledPrompt)} className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600">
                    <Copy size={14}/> Copier
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col gap-4">
                {/* Editable Template */}
                <textarea
                  className="w-full flex-1 resize-none rounded-xl border border-slate-200 p-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(compiledPrompt)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] border border-slate-200 shadow-sm"
                  >
                    <Copy size={18} /> Copier (Externe)
                  </button>
                  <button
                    onClick={handleRunAI}
                    className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md"
                  >
                    <Sparkles size={18} /> Générer avec l'IA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- VIEW: AI ASSISTANT --- */}
        <div className={`${activeTab === 'ai' ? 'flex' : 'hidden'} flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-900">
              <Bot size={20} className="text-indigo-600" /> Réponse de l'IA ({providerLabel} — {aiModel})
            </h2>
            <div className="flex gap-2">
               <button onClick={handleRunAI} disabled={isAiLoading} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Relancer
                </button>
               {aiResponse && (
                  <>
                    <button onClick={extractLatexAndSave} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-colors" title="Extraire le code LaTeX et le mettre dans le CV Généré">
                      <FileText size={14} /> Extraire CV
                    </button>
                    <button onClick={() => copyToClipboard(aiResponse)} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                      <Copy size={14} /> Copier
                    </button>
                    <button onClick={() => setAiResponse('')} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors">
                      <Trash size={14} /> Effacer
                    </button>
                  </>
               )}
            </div>
          </div>
          <div className="flex-grow p-6 overflow-y-auto bg-slate-50 custom-scrollbar">
            {!apiKey && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                <KeyRound size={48} className="text-slate-300" />
                <div>
                  <p className="font-semibold text-slate-700">Clé API Requise</p>
                  <p className="text-sm max-w-sm mt-1">Choisissez un fournisseur dans la barre du haut, puis entrez votre clé API.</p>
                  <div className="flex flex-col gap-2 mt-4">
                    {Object.entries(AI_PROVIDERS).map(([key, p]) => (
                      <a key={key} href={p.keyLink} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center justify-center gap-1">
                        Clé {p.label} ({p.keyNote}) <ExternalLink size={12}/>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isAiLoading && (
              <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-3">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse">L'IA analyse votre profil...</p>
              </div>
            )}
            {aiResponse && !isAiLoading && (
              <pre className="text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-w-4xl mx-auto">
                {aiResponse}
              </pre>
            )}
          </div>
        </div>

        {/* --- VIEW: JOB DESCRIPTION --- */}
        <div className={`${activeTab === 'job' ? 'flex' : 'hidden'} flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h2 className="text-lg font-semibold flex items-center gap-2"><FileText size={20} className="text-slate-500" /> Description de l'Offre</h2>
             <button onClick={() => setJobDescription('')} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 border border-slate-200 px-2 py-1 rounded-md bg-white">
               <Trash size={14}/> Effacer
             </button>
          </div>
          
          <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 flex flex-col sm:flex-row gap-2 items-center">
             <select 
               value={scraperType}
               onChange={(e) => setScraperType(e.target.value)}
               className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
               <option value="jina">Jina AI (Gratuit)</option>
               <option value="scrapfly">Scrapfly (Clé API)</option>
             </select>
             <input 
               type="url" 
               placeholder="Coller l'URL de l'offre pour l'extraire" 
               className="flex-grow w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
               value={jobUrl}
               onChange={(e) => setJobUrl(e.target.value)}
             />
             <button 
               onClick={handleScrape}
               disabled={isScraping || !jobUrl}
               className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {isScraping ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
               Extraire
             </button>
          </div>

          <textarea
            className="flex-grow w-full resize-none p-6 text-sm outline-none custom-scrollbar"
            placeholder="Le texte de l'offre apparaîtra ici. Vous pouvez aussi le coller manuellement, ou coller directement l'URL de l'offre si vous utilisez une IA qui a accès à internet."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* --- VIEW: MY CV --- */}
        <div className={`${activeTab === 'cv' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original CV */}
            <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-slate-500" /> CV Original (Source)</h2>
                <button onClick={() => setCvOriginal(SYNTHETIC_CV)} className="text-xs text-slate-500 hover:text-red-600 underline">Rétablir CV Fake</button>
              </div>
              <textarea
                className="flex-grow w-full resize-none p-4 text-xs font-mono outline-none custom-scrollbar bg-slate-900 text-slate-100 rounded-b-2xl"
                value={cvOriginal}
                onChange={(e) => setCvOriginal(e.target.value)}
              />
            </div>
            {/* Generated CV */}
            <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-indigo-900"><Sparkles size={16} className="text-indigo-600" /> CV Généré (Adapté)</h2>
                <button onClick={() => setCvGenerated('')} className="text-xs text-slate-500 hover:text-red-600 underline">Vider</button>
              </div>
              <textarea
                className="flex-grow w-full resize-none p-4 text-xs font-mono outline-none custom-scrollbar bg-indigo-950 text-indigo-100 rounded-b-2xl"
                placeholder="Le code LaTeX généré par l'IA sera affiché ici. Utilisez le bouton 'Extraire CV' dans l'onglet Assistant IA."
                value={cvGenerated}
                onChange={(e) => setCvGenerated(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- VIEW: PDF COMPILER --- */}
        <div className={`${activeTab === 'pdf' ? 'flex' : 'hidden'} flex-col h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <div>
                <h2 className="text-lg font-semibold flex items-center gap-2"><FileOutput size={20} className="text-slate-500" /> Générateur PDF</h2>
                <p className="text-xs text-slate-500 mt-1">Via les serveurs officiels TeXLive.net</p>
             </div>
             <div className="flex gap-2">
               <select 
                 value={pdfSource}
                 onChange={(e) => setPdfSource(e.target.value)}
                 className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
               >
                 <option value="generated">CV Généré</option>
                 <option value="original">CV Original</option>
               </select>
               {pdfBlobUrl && (
                 <button onClick={downloadPDF} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2">
                   <Download size={14} /> Télécharger PDF
                 </button>
               )}
               <button 
                 onClick={compilePDF} 
                 disabled={isPdfLoading} 
                 className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
               >
                 {isPdfLoading ? <Loader2 size={14} className="animate-spin" /> : <FileOutput size={14} />}
                 {pdfBlobUrl ? 'Recompiler' : 'Compiler le PDF'}
               </button>
             </div>
          </div>
          
          <div className="flex-grow bg-slate-50 flex flex-col">
            {/* Loading State */}
            {isPdfLoading && (
              <div className="flex-grow flex flex-col items-center justify-center text-red-600 space-y-3">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse">Compilation en cours...</p>
                <p className="text-xs text-slate-500">Cela peut prendre quelques secondes</p>
              </div>
            )}

            {/* Error State */}
            {pdfError && !isPdfLoading && (
              <div className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-lg bg-red-50 text-red-800 p-5 rounded-xl border border-red-200 text-sm">
                  <strong className="block mb-2 font-bold">❌ Erreur de compilation</strong>
                  <pre className="text-xs whitespace-pre-wrap font-mono mt-2 max-h-48 overflow-y-auto">{pdfError}</pre>
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {pdfBlobUrl && !isPdfLoading && (
              <iframe 
                src={pdfBlobUrl} 
                className="flex-grow w-full border-none" 
                title="PDF Preview"
              />
            )}

            {/* Empty State */}
            {!pdfBlobUrl && !isPdfLoading && !pdfError && (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                  <FileOutput size={48} className="text-slate-300 mx-auto" />
                  <div>
                    <p className="font-semibold text-slate-700">Compilez votre CV LaTeX en PDF</p>
                    <p className="text-sm text-slate-500 mt-2">Votre code LaTeX de l'onglet "Mon CV" sera envoyé au compilateur TeXLive. Le PDF s'affichera ici directement.</p>
                  </div>
                  <button 
                    onClick={compilePDF} 
                    className="w-full py-4 text-base font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                  >
                    <FileOutput size={24} /> Compiler le PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Global Styles for Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}