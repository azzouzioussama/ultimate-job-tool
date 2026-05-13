import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Sparkles, Copy, Download, FileText, CheckCircle2, User, Settings, Bot, FileOutput, KeyRound, ExternalLink, Loader2, Menu, X } from 'lucide-react';

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
    Île-de-France, France | **Permis B** \\\\
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

--- MON CV LATEX ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 2,
    title: "2. Lettre de Motivation (FR)",
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
    title: "3. Cover Letter (EN)",
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
    title: "4. Questions d'Entretien (Q&A)",
    description: "Génère les 10 questions probables avec des réponses STAR.",
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
    description: "Trouve les failles de votre candidature.",
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
    description: "Crée une section 'Infos' attractive pour les recruteurs.",
    content: `Je veux optimiser mon profil LinkedIn pour attirer les recruteurs qui publient ce type d'offre d'emploi.
Rédige une section "Infos" (À propos) LinkedIn percutante à la première personne, en utilisant mon CV, optimisée avec les mots-clés de l'offre d'emploi. Inclut un "Call to Action" à la fin.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 7,
    title: "7. Pitch de Présentation (30s)",
    description: "Prépare la réponse à 'Parlez-moi de vous'.",
    content: `Prépare-moi un pitch "Elevator Pitch" de 30 à 45 secondes pour répondre à la fameuse question d'entretien : "Parlez-moi de vous". 
Il doit être naturel, en français, et lier immédiatement mon parcours (mon CV) au besoin principal de l'entreprise (l'offre d'emploi).

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  },
  {
    id: 8,
    title: "8. Analyse des Lacunes (Skills)",
    description: "Plan de révision de 2h avant l'entretien.",
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
    title: "10. Prompt Personnalisé",
    description: "Écrivez votre propre requête à l'IA.",
    content: `(Écrivez vos instructions ici. Utilisez {cv_content} et {job_description} pour injecter vos données automatiquement).

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}`
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('templates');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States (Loaded from LocalStorage to persist without Firebase)
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('ujt_job') || '');
  const [cvContent, setCvContent] = useState(() => localStorage.getItem('ujt_cv') || SYNTHETIC_CV);
  
  // UI States
  const [toastMessage, setToastMessage] = useState('');
  
  // Templates State
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [customPrompt, setCustomPrompt] = useState(PROMPT_TEMPLATES[0].content);
  const [compiledPrompt, setCompiledPrompt] = useState('');

  // AI State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ujt_gemini_key') || '');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // PDF Form Ref
  const pdfFormRef = useRef(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('ujt_job', jobDescription);
    localStorage.setItem('ujt_cv', cvContent);
    localStorage.setItem('ujt_gemini_key', apiKey);
  }, [jobDescription, cvContent, apiKey]);

  // Handle Template Selection
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setCustomPrompt(template.content);
    }
  }, [selectedTemplateId]);

  // Update compiled prompt whenever inputs change
  useEffect(() => {
    let final = customPrompt.replace(/{cv_content}/g, cvContent || '[CV MANQUANT]');
    final = final.replace(/{job_description}/g, jobDescription || '[OFFRE MANQUANTE]');
    setCompiledPrompt(final);
  }, [customPrompt, cvContent, jobDescription]);

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

  // --- AI Chat Function (Gemini API) ---
  const handleRunAI = async () => {
    if (!apiKey) {
      showToast("Veuillez entrer une clé API Gemini.");
      setActiveTab('ai');
      return;
    }
    if (!compiledPrompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    setActiveTab('ai');

    try {
      // Using gemini-2.5-flash as the fast, high-quality, free model
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compiledPrompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Erreur API");
      }

      const reply = data.candidates[0].content.parts[0].text;
      setAiResponse(reply);
    } catch (error) {
      setAiResponse(`❌ Erreur API: ${error.message}\n\nVérifiez que votre clé API Gemini est valide et correctement copiée.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- PDF Compilation Trigger ---
  const compilePDF = () => {
    if (pdfFormRef.current) {
      setIsPdfLoading(true);
      pdfFormRef.current.submit();
      // Hide loader after a generous delay assuming compilation finished
      setTimeout(() => setIsPdfLoading(false), 5000); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Briefcase size={28} />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Ultimate Job Tool</h1>
            <h1 className="text-lg font-bold tracking-tight sm:hidden">UJT</h1>
          </div>
          
          {/* API Key Input */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
            <KeyRound size={16} className="text-slate-400 hidden sm:block" />
            <input 
              type="password" 
              placeholder="Clé API Gemini..." 
              className="bg-transparent border-none outline-none text-xs w-28 sm:w-48 text-slate-700"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* TAB NAVIGATION */}
        <div className={`max-w-6xl mx-auto px-4 border-t border-slate-100 bg-white flex sm:flex-row flex-col overflow-x-auto ${isMobileMenuOpen ? 'block' : 'hidden sm:flex'}`}>
          {[
            { id: 'templates', icon: Settings, label: 'Prompts & IA' },
            { id: 'ai', icon: Bot, label: 'Réponses IA' },
            { id: 'job', icon: FileText, label: 'Offre d\'Emploi' },
            { id: 'cv', icon: User, label: 'Code CV LaTeX' },
            { id: 'pdf', icon: FileOutput, label: 'Visualiseur PDF' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 flex justify-start sm:justify-center items-center gap-2 transition-colors whitespace-nowrap px-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon size={16} /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 w-full flex-grow flex flex-col gap-6">

        {/* --- VIEW: TEMPLATES & COMPILED PROMPT --- */}
        <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[75vh]">
            
            {/* Left Col: Top 10 Selection */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[50vh] lg:h-full">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800">
                <Settings size={20} className="text-indigo-600" /> Choisissez une stratégie
              </h2>
              <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar pr-2 pb-4">
                {PROMPT_TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTemplateId === t.id ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className={`font-semibold text-sm ${selectedTemplateId === t.id ? 'text-indigo-900' : 'text-slate-800'}`}>{t.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Editor & Preview */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[60vh] lg:h-full">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-semibold text-sm text-slate-800">Aperçu du Prompt & Éditeur</span>
                <button onClick={() => copyToClipboard(compiledPrompt)} className="text-xs flex items-center gap-1.5 font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <Copy size={14}/> Copier le texte
                </button>
              </div>
              
              <div className="p-5 flex-grow flex flex-col gap-4">
                {/* Editable Template */}
                <textarea
                  className="w-full flex-1 resize-none rounded-xl border border-slate-200 p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar leading-relaxed"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                
                <button
                  onClick={handleRunAI}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-indigo-200"
                >
                  <Sparkles size={18} /> Soumettre ce Prompt à l'IA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- VIEW: AI ASSISTANT --- */}
        <div className={`${activeTab === 'ai' ? 'flex' : 'hidden'} flex-col h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-4 border-b border-indigo-100 bg-indigo-50/80 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-900">
              <Bot size={20} className="text-indigo-600" /> Réponse Gemini
            </h2>
            <div className="flex gap-2">
               <button onClick={handleRunAI} disabled={isAiLoading} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm">
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Relancer
                </button>
               {aiResponse && (
                  <button onClick={() => copyToClipboard(aiResponse)} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 flex items-center gap-2 shadow-sm">
                    <Copy size={14} /> Copier la réponse
                  </button>
               )}
            </div>
          </div>
          <div className="flex-grow p-6 overflow-y-auto bg-slate-50 custom-scrollbar">
            {!apiKey ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                <div className="bg-slate-100 p-4 rounded-full">
                  <KeyRound size={40} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-lg">Clé API Google Gemini Requise</p>
                  <p className="text-sm max-w-sm mt-2 leading-relaxed">
                    Pour utiliser l'assistant IA intégré gratuitement, vous devez fournir une clé API. Collez-la dans la barre supérieure.
                  </p>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 mt-6 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-medium py-2 px-4 rounded-lg transition-all shadow-sm">
                    Obtenir une clé gratuite <ExternalLink size={14}/>
                  </a>
                </div>
              </div>
            ) : isAiLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-4">
                <Loader2 size={48} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse">L'IA de Google génère la réponse...</p>
              </div>
            ) : aiResponse ? (
              <div className="prose prose-sm sm:prose-base prose-indigo max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
                <pre className="font-sans whitespace-pre-wrap">{aiResponse}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <Bot size={48} className="opacity-20 mb-4" />
                <p>Aucune requête envoyée.</p>
                <p className="text-sm mt-1">Allez dans l'onglet "Prompts & IA" pour lancer une génération.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- VIEW: JOB DESCRIPTION --- */}
        <div className={`${activeTab === 'job' ? 'flex' : 'hidden'} flex-col h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800"><FileText size={20} className="text-slate-500" /> Description de l'Offre d'Emploi</h2>
             <p className="text-xs text-slate-500 mt-1">Collez ici l'offre pour laquelle vous postulez. L'IA s'en servira pour personnaliser votre CV.</p>
          </div>
          <textarea
            className="flex-grow w-full resize-none p-6 text-sm outline-none custom-scrollbar leading-relaxed"
            placeholder="Ex: Nous recherchons un Ingénieur Système..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* --- VIEW: MY CV --- */}
        <div className={`${activeTab === 'cv' ? 'flex' : 'hidden'} flex-col h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
           <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <div>
               <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800"><User size={20} className="text-slate-500" /> Code Source du CV</h2>
               <p className="text-xs text-slate-500 mt-1">Format LaTeX requis pour la compilation PDF.</p>
             </div>
             <button onClick={() => setCvContent(SYNTHETIC_CV)} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:text-red-600 hover:border-red-200 transition-colors">
               Réinitialiser CV Fake
             </button>
          </div>
          <textarea
            className="flex-grow w-full resize-none p-6 text-sm font-mono outline-none custom-scrollbar bg-slate-900 text-slate-100 leading-relaxed"
            value={cvContent}
            onChange={(e) => setCvContent(e.target.value)}
          />
        </div>

        {/* --- VIEW: PDF COMPILER --- */}
        <div className={`${activeTab === 'pdf' ? 'flex' : 'hidden'} flex-col h-[85vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800"><FileOutput size={20} className="text-slate-500" /> Visualiseur de PDF</h2>
                <p className="text-xs text-slate-500 mt-1">Généré via LaTeXOnline.cc. Vous pouvez télécharger le résultat via les boutons du visualiseur.</p>
             </div>
             <button onClick={compilePDF} disabled={isPdfLoading} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-red-200 transition-transform active:scale-[0.98]">
                {isPdfLoading ? <Loader2 size={18} className="animate-spin" /> : <FileOutput size={18} />} Compiler en PDF
             </button>
          </div>
          
          <div className="flex-grow relative bg-slate-300">
            {/* Hidden POST form to bypass long URL limits */}
            <form ref={pdfFormRef} target="pdf-frame" action="https://latexonline.cc/compile" method="POST" className="hidden">
              <input type="hidden" name="text" value={cvContent} />
              <input type="hidden" name="command" value="pdflatex" />
            </form>
            
            <iframe 
              name="pdf-frame" 
              className="w-full h-full border-none"
              title="PDF Preview"
            />
            
            {isPdfLoading && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
                  <Loader2 size={36} className="animate-spin text-red-600" />
                  <div className="text-center">
                    <span className="font-bold text-lg text-slate-800 block">Compilation en cours...</span>
                    <span className="text-sm text-slate-500">Cela peut prendre jusqu'à 10 secondes.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}