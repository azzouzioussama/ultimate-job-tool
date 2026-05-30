/**
 * ============================================================================
 * FILE: App.jsx
 * PURPOSE: The main application shell that wires all services and components.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This is the "brain" of the app. It does NOT contain business logic or
 * UI rendering — those live in the services/ and components/ folders.
 *
 * Instead, App.jsx does three things:
 *   1. Declares all shared state (using React hooks).
 *   2. Wires service functions to component callbacks.
 *   3. Renders the layout (Header, Tabs, active tab content, Toast).
 *
 * ARCHITECTURE OVERVIEW:
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                        App.jsx                          │
 *   │  (State Management + Wiring)                            │
 *   │                                                         │
 *   │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
 *   │  │ constants │  │ services │  │  hooks   │              │
 *   │  │ (data)    │  │ (logic)  │  │ (state)  │              │
 *   │  └──────────┘  └──────────┘  └──────────┘              │
 *   │                      │                                  │
 *   │              ┌───────┴────────┐                         │
 *   │              │   components   │                         │
 *   │              │   (UI only)    │                         │
 *   │              └────────────────┘                         │
 *   └─────────────────────────────────────────────────────────┘
 *
 * HOW TO ADD A NEW FEATURE:
 * 1. If it needs new data/config → add to constants/
 * 2. If it needs new business logic → add to services/
 * 3. If it needs a new UI → add to components/tabs/
 * 4. Wire them together here in App.jsx
 * 5. See CONTRIBUTORS_GUIDE.md for step-by-step examples.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ── Constants ─────────────────────────────────────────────────────────────────
import SYNTHETIC_CV from './constants/syntheticCv';
import getPromptTemplates from './constants/promptTemplates';
import AI_PROVIDERS from './constants/aiProviders';
import CV_TEMPLATES from './constants/cvTemplates';

// ── Services ──────────────────────────────────────────────────────────────────
import { callAIProvider } from './services/aiService';
import { scrapeWithJina, scrapeWithScrapfly } from './services/scraperService';
import { compilePdfFromLatex, downloadBlobAsPdf } from './services/pdfService';
import { runAtsAnalysis } from './services/atsService';
import { extractTextFromFile, buildLatexConversionPrompt } from './services/fileUploadService';
import { extractLatexFromResponse, mergeLatexResponses } from './services/latexUtils';
import * as storage from './services/storageService';
// DB hook replaced with useDatabase
import { useDatabase } from './hooks/useDatabase';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { Show, SignInButton } from '@clerk/react';
import { useTranslation } from 'react-i18next';

// ── Auth (Clerk) — optional, only active when env var is set ──────────────────
const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Auth gate component: shows login page when signed out, children when signed in
function AuthGate({ children }) {
  const { t } = useTranslation();
  if (!isClerkAvailable) return children;
  return (
    <>
      <Show when="signed-in">
        {children}
      </Show>
      <Show when="signed-out">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('app.auth.welcomeTitle', 'Bienvenue !')}</h1>
            <p className="text-slate-600 mb-8">
              {t('app.auth.welcomeDesc', "Connectez-vous pour gérer vos candidatures, générer des lettres de motivation, et adapter vos CV avec l'IA.")}
            </p>
            <SignInButton mode="modal">
              <button className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full">
                {t('app.auth.loginButton', 'Se connecter')}
              </button>
            </SignInButton>
          </div>
        </main>
      </Show>
    </>
  );
}

// ── Layout Components ─────────────────────────────────────────────────────────
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import Toast from './components/layout/Toast';

// ── Tab Components ────────────────────────────────────────────────────────────
import DashboardTab from './components/tabs/DashboardTab';
import PromptsTab from './components/tabs/PromptsTab';
import AiAssistantTab from './components/tabs/AiAssistantTab';
import JobOfferTab from './components/tabs/JobOfferTab';
import MyCvTab from './components/tabs/MyCvTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import PdfMakerTab from './components/tabs/PdfMakerTab';
import AtsTestTab from './components/tabs/AtsTestTab';

// ── pdf.js Worker Setup ───────────────────────────────────────────────────────
// pdf.js needs a Web Worker to process PDF files in a background thread.
// This line tells it where to find the worker script.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


export default function App() {
  const { t } = useTranslation();
  const PROMPT_TEMPLATES = getPromptTemplates(t);
  // ── Database Hook ───────────────────────────────────────────────────────────
  const { createApplication, getApplication, updateApplication, getAllApplications } = useDatabase();

  // ── Toast Notifications ─────────────────────────────────────────────────────
  const { toastMessage, showToast } = useToast();

  // ── Navigation State ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Database State ──────────────────────────────────────────────────────────
  const [activeAppId, setActiveAppId] = useState(null);

  // ── Core Data ───────────────────────────────────────────────────────────────
  const [jobDescription, setJobDescription] = useState('');
  const [cvOriginal, setCvOriginal] = useState(SYNTHETIC_CV);
  const [cvGenerated, setCvGenerated] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [documents, setDocuments] = useState([]);

  // ── Tracking & Job Offer Data ───────────────────────────────────────────────
  const [trackingStatus, setTrackingStatus] = useState('Draft');
  const [promptResponses, setPromptResponses] = useState({});
  const [atsScoreBefore, setAtsScoreBefore] = useState(null);
  const [atsScoreAfter, setAtsScoreAfter] = useState(null);
  const [lastGeneratedDate, setLastGeneratedDate] = useState(null);

  // ── Settings (auto-saved to localStorage) ───────────────────────────────────
  const [aiResponses, setAiResponses] = useState([]);
  const [scraperType, setScraperType] = useLocalStorage('scraper_type', 'jina');

  // ── AI Provider Configuration ───────────────────────────────────────────────
  const [aiProvider, setAiProvider] = useState(storage.getAiProvider());
  const [aiModel, setAiModel] = useState(
    storage.getAiModel(storage.getAiProvider()) ||
    AI_PROVIDERS[storage.getAiProvider()]?.models[0]?.id
  );
  const [apiKey, setApiKey] = useState(storage.getApiKey(storage.getAiProvider()));

  // ── Template & Prompts State ────────────────────────────────────────────────
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([1]);
  const [customPrompts, setCustomPrompts] = useState({});
  const [requireLatex, setRequireLatex] = useState(true);
  const [selectedCvTemplateId, setSelectedCvTemplateId] = useLocalStorage('cv_template_id', 'french-ats');

  // ── Loading States ──────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isAtsLoading, setIsAtsLoading] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  // ── Scraper State ───────────────────────────────────────────────────────────
  const [jobUrl, setJobUrl] = useState('');
  const [autoCreateOffer, setAutoCreateOffer] = useState(true);

  // ── ATS State ───────────────────────────────────────────────────────────────
  const [atsResult, setAtsResult] = useState(null);

  // ── PDF State ───────────────────────────────────────────────────────────────
  const [pdfSource, setPdfSource] = useState('generated');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [numPages, setNumPages] = useState(null);
  const pdfContainerRef = useRef(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


  // ═══════════════════════════════════════════════════════════════════════════
  // DATABASE SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. One-time migration & initial load
  useEffect(() => {
    async function initDB() {
      const allApps = await getAllApplications();
      if (allApps.length === 0) {
        // Migration from old localStorage
        const oldCv = storage.getCvOriginal();
        const oldJob = storage.getJobDescription();
        const oldGenerated = storage.getCvGenerated();
        
        if (oldCv || oldJob || oldGenerated) {
          const newAppId = await createApplication({
            companyName: 'Ancienne Candidature',
            jobTitle: 'Importée',
            jobDescription: oldJob || '',
            cvOriginal: oldCv || SYNTHETIC_CV,
            cvGenerated: oldGenerated || '',
            documents: [],
            atsResult: null,
            trackingStatus: 'Draft',
            atsScoreBefore: null,
            atsScoreAfter: null,
            lastGeneratedDate: null,
            aiResponses: []
          });
          setActiveAppId(newAppId);
        }
      } else {
        // Load the most recently updated application
        setActiveAppId(allApps[0].id);
      }
    }
    initDB();
  }, []);

  // 2. Load data when activeAppId changes
  useEffect(() => {
    if (activeAppId) {
      getApplication(activeAppId).then(app => {
        if (app) {
          setJobDescription(app.jobDescription || '');
          setCvOriginal(app.cvOriginal || SYNTHETIC_CV);
          setCvGenerated(app.cvGenerated || '');
          setTargetPosition(app.jobTitle || '');
          setCompanyName(app.companyName || '');
          setDocuments(app.documents || []);
          setAtsResult(app.atsResult || null);
          setTrackingStatus(app.trackingStatus || 'Draft');
          setPromptResponses(app.promptResponses || {});
          setAtsScoreBefore(app.atsScoreBefore || null);
          setAtsScoreAfter(app.atsScoreAfter || null);
          setLastGeneratedDate(app.lastGeneratedDate || null);
          setAiResponses(app.aiResponses || []);
        }
      });
    } else {
      setJobDescription('');
      setCvOriginal(SYNTHETIC_CV);
      setCvGenerated('');
      setTargetPosition('');
      setCompanyName('');
      setDocuments([]);
      setAtsResult(null);
      setTrackingStatus('Draft');
      setPromptResponses({});
      setAtsScoreBefore(null);
      setAtsScoreAfter(null);
      setLastGeneratedDate(null);
      setAiResponses([]);
    }
  }, [activeAppId]);

  // 3. Debounced auto-save back to DB when typing
  useEffect(() => {
    if (!activeAppId) return;
    const timer = setTimeout(() => {
      updateApplication(activeAppId, {
        jobDescription,
        cvOriginal,
        cvGenerated,
        jobTitle: targetPosition,
        companyName,
        documents,
        atsResult,
        trackingStatus,
        promptResponses,
        atsScoreBefore,
        atsScoreAfter,
        lastGeneratedDate,
        aiResponses
      });
    }, 500); // Wait 500ms after user stops typing
    return () => clearTimeout(timer);
  }, [activeAppId, jobDescription, cvOriginal, cvGenerated, targetPosition, companyName, documents, atsResult, trackingStatus, promptResponses, atsScoreBefore, atsScoreAfter, lastGeneratedDate, aiResponses]);


  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS (Reactive logic that runs when state changes)
  // ═══════════════════════════════════════════════════════════════════════════

  // When the user selects different prompt templates, load their content
  useEffect(() => {
    setCustomPrompts(prev => {
      const next = { ...prev };
      selectedTemplateIds.forEach(id => {
        if (!next[id]) {
          const template = PROMPT_TEMPLATES.find(t => t.id === id);
          if (template) next[id] = template.content;
        }
      });
      return next;
    });
  }, [selectedTemplateIds]);

  // When the user switches AI provider, load the correct API key and model
  useEffect(() => {
    setApiKey(storage.getApiKey(aiProvider));
    const savedModel = storage.getAiModel(aiProvider);
    const defaultModel = AI_PROVIDERS[aiProvider]?.models[0]?.id;
    setAiModel(savedModel || defaultModel);
  }, [aiProvider]);

  // Compile the final prompt by replacing placeholders with actual data
  const getCompiledPrompt = useCallback((promptText) => {
    let final = promptText.replace(/{cv_content}/g, cvOriginal || t('app.prompts.missingCv', '[CV MANQUANT]'));
    let jobContent = jobDescription || t('app.prompts.missingJob', '[OFFRE MANQUANTE]');

    // If the user pasted a raw URL instead of text, add an instruction for the AI
    if (/^https?:\/\/\S+$/.test(jobContent.trim())) {
      jobContent += "\n\n" + t('app.prompts.urlInstruction', "(IMPORTANT : La description de poste ci-dessus est une URL. Utilise tes outils de navigation web pour visiter ce lien et lire le contenu de l'offre d'emploi avant de générer ta réponse. Si tu ne peux pas naviguer, demande à l'utilisateur de fournir le texte.)");
    }

    let compiled = final.replace(/{job_description}/g, jobContent);
    
    if (requireLatex) {
      compiled += "\n\n" + t('app.prompts.latexInstruction', "IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.");
    }
    return compiled;
  }, [cvOriginal, jobDescription, t, requireLatex]);

  // Measure the PDF container width for responsive page rendering (mobile)
  useEffect(() => {
    if (!pdfContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setPdfContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(pdfContainerRef.current);
    return () => observer.disconnect();
  }, [pdfBlobUrl]);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n);
  }, []);


  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLER FUNCTIONS (Wire services to UI actions)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Clipboard ───────────────────────────────────────────────────────────────
  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(t('app.toast.copied', 'Copié dans le presse-papiers !'));
    } catch {
      showToast(t('app.toast.copyFailed', 'Échec de la copie.'));
    }
    document.body.removeChild(textArea);
  };

  // ── Download Prompt as .txt ─────────────────────────────────────────────────
  const downloadAsTxt = (text, id) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${id}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('app.toast.downloaded', 'Fichier téléchargé !'));
  };

  // ── Reset Everything ────────────────────────────────────────────────────────
  const resetAll = () => {
    setCvOriginal(SYNTHETIC_CV);
    setCvGenerated('');
    setTargetPosition('');
    setCompanyName('');
    setDocuments([]);
    setAtsResult(null);
    setTrackingStatus('Draft');
    setPromptResponses({});
    setAtsScoreBefore(null);
    setAtsScoreAfter(null);
    setLastGeneratedDate(null);
    setSelectedTemplateIds([1]);
    setCustomPrompts({});
    setJobDescription('');
    setAiResponses([]);
    showToast(t('app.toast.reset', 'Tout réinitialisé aux valeurs par défaut.'));
  };

  // ── AI Provider/Model/Key Management ────────────────────────────────────────
  const handleProviderChange = (provider) => {
    setAiProvider(provider);
    storage.saveAiProvider(provider);
  };

  const handleModelChange = (model) => {
    setAiModel(model);
    storage.saveAiModel(aiProvider, model);
  };

  const handleSaveApiKey = (e) => {
    const val = e.target.value;
    setApiKey(val);
    storage.saveApiKey(aiProvider, val);
  };

  // ── AI Helper: call the current provider ────────────────────────────────────
  const providerLabel = AI_PROVIDERS[aiProvider]?.label || aiProvider;

  const callCurrentAI = async (promptText, signal) => {
    return callAIProvider({
      provider: aiProvider,
      model: aiModel,
      apiKey,
      promptText,
      signal,
    });
  };

  // ── Run AI Generation ───────────────────────────────────────────────────────
  const handleRunAI = async (retryCount = 0) => {
    if (!apiKey) {
      showToast(t('app.toast.apiKeyRequired', { provider: providerLabel, defaultValue: `Veuillez entrer une clé API ${providerLabel}.` }));
      setActiveTab('ai');
      return;
    }
    if (selectedTemplateIds.length === 0) return;

    setIsAiLoading(true);
    setAiResponses([]);
    setActiveTab('ai');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const promises = selectedTemplateIds.map(async (id) => {
        const template = PROMPT_TEMPLATES.find(t => t.id === id);
        const text = customPrompts[id] || template.content;
        const compiled = getCompiledPrompt(text);
        const reply = await callCurrentAI(compiled, controller.signal);
        return {
          id: Date.now() + Math.random(),
          templateId: id,
          title: template.title,
          content: reply,
          isSelectedForPdf: true
        };
      });

      const results = await Promise.allSettled(promises);
      const successfulResponses = [];
      
      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          successfulResponses.push(res.value);
        } else {
          // Handle individual failure
          successfulResponses.push({
            id: Date.now() + Math.random(),
            templateId: selectedTemplateIds[index],
            title: PROMPT_TEMPLATES.find(t => t.id === selectedTemplateIds[index])?.title,
            content: t('app.ai.error', { error: res.reason.message, defaultValue: `❌ Erreur: ${res.reason.message}` }),
            isSelectedForPdf: false
          });
        }
      });
      
      setAiResponses(successfulResponses);
    } catch (error) {
      // Auto-retry once on network/abort errors
      if ((error.name === 'AbortError' || error.name === 'TypeError') && retryCount < 1) {
        showToast(t('app.toast.retry', 'Connexion interrompue, nouvelle tentative...'));
        clearTimeout(timeoutId);
        return handleRunAI(retryCount + 1);
      }
      const msg = error.name === 'AbortError'
        ? t('app.toast.timeout', 'La requête a expiré (timeout). Vérifiez votre connexion et réessayez.')
        : error.message;
      setAiResponses([{ id: Date.now(), title: t('app.ai.errorTitle', 'Erreur'), content: t('app.ai.apiError', { msg, provider: providerLabel, defaultValue: `❌ Erreur: ${msg}\n\nVérifiez que votre clé API ${providerLabel} est valide.` }), isSelectedForPdf: false }]);
    } finally {
      clearTimeout(timeoutId);
      setIsAiLoading(false);
    }
  };

  // ── Extract LaTeX from AI Response ──────────────────────────────────────────
  const handleExtractLatex = () => {
    const selectedResponses = aiResponses.filter(r => r.isSelectedForPdf);
    if (selectedResponses.length === 0) {
      showToast(t('app.toast.noResponseSelected', 'Aucune réponse sélectionnée.'));
      return;
    }
    
    // Save the responses to promptResponses state for history
    const newResponses = { ...promptResponses };
    selectedResponses.forEach(r => {
      newResponses[r.templateId || 'custom'] = r.content;
    });
    setPromptResponses(newResponses);

    const selectedTexts = selectedResponses.map(r => r.content);
    
    // Try to merge if there are multiple or if the text isn't a full doc
    const extracted = mergeLatexResponses(cvOriginal, selectedTexts);
    if (extracted) {
      setCvGenerated(extracted);
      showToast(t('app.toast.cvMerged', 'CV Généré extrait et sauvegardé (Fusion réussie) !'));
      setActiveTab('cv');
    } else {
      // Fallback if merge fails (e.g., base CV has no \begin{document})
      const fallback = extractLatexFromResponse(selectedTexts[0]);
      if (fallback) {
        setCvGenerated(fallback);
        showToast(t('app.toast.cvExtracted', 'Premier CV extrait (Fusion impossible, pas de base document) !'));
        setActiveTab('cv');
      } else {
        showToast(t('app.toast.latexNotFound', 'Aucun code LaTeX complet trouvé ou fusion impossible.'));
      }
    }
  };

  // ── Compile Multiple PDFs (Save to Dashboard) ───────────────────────────────
  const handleCompileMultiplePdfs = async () => {
    const selectedResponses = aiResponses.filter(r => r.isSelectedForPdf);
    if (selectedResponses.length === 0) {
      showToast(t('app.toast.noResponseSelected', 'Aucune réponse sélectionnée.'));
      return;
    }
    
    let successCount = 0;
    const newDocs = [];
    const newPromptResponses = { ...promptResponses };
    
    for (const [index, resp] of selectedResponses.entries()) {
      let latexToCompile = extractLatexFromResponse(resp.content);
      
      if (!latexToCompile && resp.content.includes('\\documentclass')) {
        latexToCompile = resp.content;
      }

      if (!latexToCompile) {
        latexToCompile = mergeLatexResponses(cvOriginal, [resp.content]);
      }
      
      if (!latexToCompile) {
        console.warn('Could not extract or merge LaTeX for response', resp.title);
        continue;
      }

      let baseTitle = resp.title || 'Document';
      const existingCount = documents.filter(d => d.title === baseTitle || d.title.startsWith(`${baseTitle} (`)).length + newDocs.filter(d => d.title === baseTitle || d.title.startsWith(`${baseTitle} (`)).length;
      
      const docTitle = existingCount > 0 ? `${baseTitle} (${existingCount + 1})` : baseTitle;

      newDocs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: docTitle,
        content: latexToCompile,
        timestamp: new Date().toISOString()
      });

      newPromptResponses[docTitle] = latexToCompile;
      successCount++;
      
      // Compile and download immediately
      try {
        const blob = await compilePdfFromLatex(latexToCompile);
        const url = URL.createObjectURL(blob);
        setTimeout(() => {
          downloadBlobAsPdf(url, `${docTitle}_${new Date().getTime()}.pdf`);
        }, index * 800);
      } catch (err) {
        console.error('Error compiling response:', err);
        showToast(t('app.toast.compileMultipleError', { title: docTitle, error: err.message, defaultValue: `Erreur pour "${docTitle}": ${err.message}` }));
      }
    }

    if (successCount > 0) {
      setDocuments(prev => [...newDocs, ...prev]);
      setPromptResponses(newPromptResponses);
      setLastGeneratedDate(new Date().toISOString());
      setTrackingStatus('Applied');
      showToast(t('app.toast.compilingMultipleDone', { count: successCount, defaultValue: `${successCount} Document(s) préparé(s), sauvegardé(s) et téléchargé(s) !` }));
      // Deselect them after success
      setAiResponses(prev => prev.map(r => r.isSelectedForPdf ? { ...r, isSelectedForPdf: false } : r));
    }
  };

  const handleAutoCreateFromText = async (textToAnalyze) => {
    if (!apiKey) {
      showToast(t('app.toast.apiKeyRequiredAutoCreate', 'Clé API requise pour extraire le titre automatiquement.'));
      return;
    }
    
    showToast(t('app.toast.aiExtractingInfo', 'Extraction des informations par l\'IA en cours...'));
    setIsAiLoading(true);
    try {
      const prompt = `Extract the Job Title and Company Name from the following job description. Return ONLY a valid JSON object matching this schema: {"jobTitle": "...", "companyName": "..."}. If you cannot find one, return an empty string for that field.\n\nDescription:\n${textToAnalyze.substring(0, 3000)}`;
      const controller = new AbortController();
      const reply = await callCurrentAI(prompt, controller.signal);
      
      let finalJobTitle = 'Offre extraite';
      let finalCompanyName = '';

      try {
        const jsonStr = reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        finalJobTitle = parsed.jobTitle || 'Offre extraite';
        finalCompanyName = parsed.companyName || '';
      } catch (e) {
        console.error('Failed to parse AI JSON:', e);
      }

      const newAppId = await createApplication({
        companyName: finalCompanyName,
        jobTitle: finalJobTitle,
        jobDescription: textToAnalyze,
        cvOriginal: cvOriginal,
        cvGenerated: '',
        documents: [],
        atsResult: null,
        trackingStatus: 'Draft',
        promptResponses: {},
        atsScoreBefore: null,
        atsScoreAfter: null,
        lastGeneratedDate: null,
        aiResponses: []
      });
      
      setActiveAppId(newAppId);
      showToast(t('app.toast.autoCreated', 'Nouvelle candidature créée avec succès !'));
    } catch (e) {
      showToast(t('app.toast.error', 'Erreur: ') + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ── Scrape Job ────────────────────────────────────────────────────────────
  const handleScrape = async () => {
    if (!jobUrl) return;
    setIsScraping(true);

    try {
      let result;

      if (scraperType === 'jina') {
        result = await scrapeWithJina(jobUrl);
      } else if (scraperType === 'scrapfly') {
        let key = storage.getScrapflyKey();
        if (!key) {
          // TODO(security): Replace browser prompt() with a React modal component
          key = window.prompt(t('app.prompt.scrapflyKey', "Entrez votre clé API Scrapfly (commence par 'scp-live-...') :"));
          if (!key) throw new Error(t('app.error.scrapflyRequired', "Clé Scrapfly requise pour l'extraction."));
          storage.saveScrapflyKey(key);
        }
        result = await scrapeWithScrapfly(jobUrl, key);
      }

      if (autoCreateOffer) {
        if (!apiKey) {
          showToast(t('app.toast.apiKeyRequiredAutoCreate', 'Clé API requise pour extraire le titre automatiquement. L\'offre est sauvegardée dans la candidature actuelle.'));
          setJobDescription(result);
        } else {
          await handleAutoCreateFromText(result);
        }
      } else {
        setJobDescription(result);
        const providerName = scraperType === 'jina' ? 'Jina AI' : 'Scrapfly';
        showToast(t('app.toast.offerExtracted', { provider: providerName, defaultValue: `Offre extraite avec succès via ${providerName} !` }));
      }
      
      setJobUrl('');

    } catch (error) {
      showToast(t('app.toast.error', 'Erreur: ') + error.message);
    } finally {
      setIsScraping(false);
    }
  };

  // ── PDF Compilation ─────────────────────────────────────────────────────────
  const handleCompilePDF = async () => {
    setIsPdfLoading(true);
    setPdfError('');
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);

    try {
      let contentToCompile = '';
      if (pdfSource === 'original') {
        contentToCompile = cvOriginal;
      } else if (pdfSource === 'generated') {
        contentToCompile = cvGenerated.trim() ? cvGenerated : cvOriginal;
      } else {
        const doc = documents.find(d => d.id === pdfSource);
        contentToCompile = doc ? doc.content : cvOriginal;
      }

      const blob = await compilePdfFromLatex(contentToCompile);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setLastGeneratedDate(new Date().toISOString());
      if (trackingStatus === 'Draft') setTrackingStatus('PDF Generated');
      showToast(t('app.toast.pdfCompiled', 'PDF compilé avec succès !'));
    } catch (error) {
      setPdfError(error.message);
      showToast(t('app.toast.pdfError', 'Erreur de compilation PDF.'));
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlobUrl) return;
    downloadBlobAsPdf(pdfBlobUrl);
    setLastGeneratedDate(new Date().toISOString());
    if (trackingStatus === 'Draft' || trackingStatus === 'PDF Generated') setTrackingStatus('Applied');
    showToast(t('app.toast.pdfDownloaded', 'PDF téléchargé !'));
  };

  // ── ATS Analysis ────────────────────────────────────────────────────────────
  const handleRunATS = async () => {
    if (!apiKey) {
      showToast(t('app.toast.apiKeyRequired', { provider: providerLabel, defaultValue: `Veuillez configurer une clé API ${providerLabel}.` }));
      return;
    }
    if (!jobDescription.trim() || (!cvGenerated.trim() && !cvOriginal.trim())) {
      showToast(t('app.toast.atsMissingData', "Il faut une offre d'emploi et un CV pour faire le test ATS."));
      return;
    }

    setIsAtsLoading(true);
    setAtsResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const results = {};
      
      // 1. Run for cvOriginal
      if (cvOriginal && cvOriginal.trim()) {
        const resultBefore = await runAtsAnalysis(callCurrentAI, jobDescription, cvOriginal, controller.signal);
        results.before = resultBefore;
        setAtsScoreBefore(resultBefore?.score || null);
      }

      // 2. Run for cvGenerated
      if (cvGenerated && cvGenerated.trim() && cvGenerated !== cvOriginal) {
        const resultAfter = await runAtsAnalysis(callCurrentAI, jobDescription, cvGenerated, controller.signal);
        results.after = resultAfter;
        setAtsScoreAfter(resultAfter?.score || null);
        setAtsResult(resultAfter); // Current backwards compat
      } else if (results.before) {
        setAtsResult(results.before);
      }

      showToast(t('app.toast.atsSuccess', 'Analyse ATS terminée !'));
    } catch (error) {
      console.error(error);
      showToast(t('app.toast.atsError', "Erreur lors de l'analyse ATS. Le format JSON retourné est invalide ou la requête a échoué."));
    } finally {
      clearTimeout(timeoutId);
      setIsAtsLoading(false);
    }
  };

  // ── File Upload (CV Import) ─────────────────────────────────────────────────
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!apiKey) {
      showToast(t('app.toast.apiRequiredFirst', "Veuillez configurer votre clé API IA dans l'en-tête d'abord."));
      return;
    }

    setIsUploadingCv(true);
    showToast(t('app.toast.readingFile', 'Lecture du fichier en cours...'));

    try {
      // Step 1: Extract raw text from the file (locally, no server)
      const extractedText = await extractTextFromFile(file);

      showToast(t('app.toast.generatingLatex', "Texte extrait ! Génération LaTeX en cours par l'IA..."));

      // Step 2: Send extracted text to AI for LaTeX conversion
      const selectedTemplate = CV_TEMPLATES.find(t => t.id === selectedCvTemplateId) || CV_TEMPLATES[0];
      const prompt = buildLatexConversionPrompt(extractedText, selectedTemplate.latex);
      const controller = new AbortController();
      const reply = await callCurrentAI(prompt, controller.signal);

      // Step 3: Extract the LaTeX code from the AI response
      const cleanLatex = extractLatexFromResponse(reply);
      if (cleanLatex) {
        setCvOriginal(cleanLatex);
        showToast(t('app.toast.cvImported', 'CV importé et converti avec succès en LaTeX !'));
      } else {
        throw new Error(t('app.error.invalidLatex', "L'IA n'a pas renvoyé de code LaTeX valide."));
      }
    } catch (err) {
      console.error(err);
      showToast(t('app.toast.importError', { error: err.message, defaultValue: `Erreur d'import : ${err.message}` }));
    } finally {
      setIsUploadingCv(false);
      event.target.value = '';
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 sm:pb-0 flex flex-col">

      {/* ── Header (Logo + AI Config) ──────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <Header
          aiProvider={aiProvider}
          aiModel={aiModel}
          apiKey={apiKey}
          onProviderChange={handleProviderChange}
          onModelChange={handleModelChange}
          onApiKeyChange={handleSaveApiKey}
        />
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </header>

      {/* ── Toast Notification ─────────────────────────────────────── */}
      <Toast message={toastMessage} />

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <AuthGate>
        <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-2 w-full flex-grow flex flex-col gap-6">

          {/* Dashboard Tab */}
          <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
            <DashboardTab
              onSelectApplication={(id) => {
                setActiveAppId(id);
                setActiveTab('templates'); // Auto-switch to Prompts after selecting
              }}
              showToast={showToast}
            />
          </div>

          {/* Prompts Tab */}
          <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
            <PromptsTab
              templates={PROMPT_TEMPLATES}
              selectedTemplateIds={selectedTemplateIds}
              onSelectTemplate={(id) => {
                setSelectedTemplateIds(prev => 
                  prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                );
              }}
              customPrompts={customPrompts}
              onCustomPromptChange={(id, value) => setCustomPrompts(prev => ({ ...prev, [id]: value }))}
              requireLatex={requireLatex}
              onRequireLatexChange={setRequireLatex}
              getCompiledPrompt={getCompiledPrompt}
              onCopy={copyToClipboard}
              onDownload={downloadAsTxt}
              onRunAI={handleRunAI}
              onReset={resetAll}
            />
          </div>

          {/* AI Assistant Tab */}
          <div className={activeTab === 'ai' ? 'block' : 'hidden'}>
            <AiAssistantTab
              aiResponses={aiResponses}
              setAiResponses={setAiResponses}
              isAiLoading={isAiLoading}
              apiKey={apiKey}
              providerLabel={providerLabel}
              onRunAI={handleRunAI}
              onExtractLatex={handleExtractLatex}
              onCompileMultiple={handleCompileMultiplePdfs}
              onSaveToDocuments={() => {
                const selected = aiResponses.filter(r => r.isSelectedForPdf);
                if (selected.length === 0) return;
                
                const newDocs = selected.map(r => ({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  title: r.title || 'Document IA',
                  content: r.content,
                  timestamp: new Date().toISOString()
                }));
                
                setDocuments(prev => [...newDocs, ...prev]);
                showToast(t('app.toast.docsSaved', { count: newDocs.length, defaultValue: `${newDocs.length} document(s) sauvegardé(s)` }));
                
                // Deselect them
                setAiResponses(prev => prev.map(r => r.isSelectedForPdf ? { ...r, isSelectedForPdf: false } : r));
              }}
              onCopy={copyToClipboard}
              onClear={() => setAiResponses([])}
            />
          </div>

          {/* Job Offer Tab */}
          <div className={activeTab === 'job' ? 'block' : 'hidden'}>
            <JobOfferTab
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              jobUrl={jobUrl}
              onJobUrlChange={setJobUrl}
              scraperType={scraperType}
              onScraperTypeChange={setScraperType}
              onScrape={handleScrape}
              isScraping={isScraping}
              onClear={() => setJobDescription('')}
              autoCreateOffer={autoCreateOffer}
              onAutoCreateOfferChange={setAutoCreateOffer}
              onAutoCreateFromText={() => handleAutoCreateFromText(jobDescription)}
            />
          </div>

          {/* My CV Tab */}
          <div className={activeTab === 'cv' ? 'block' : 'hidden'}>
            <MyCvTab
              cvOriginal={cvOriginal}
              onCvOriginalChange={setCvOriginal}
              cvGenerated={cvGenerated}
              onCvGeneratedChange={setCvGenerated}
              onResetToSynthetic={() => setCvOriginal(SYNTHETIC_CV)}
              onFileUpload={handleFileUpload}
              isUploadingCv={isUploadingCv}
              selectedCvTemplateId={selectedCvTemplateId}
              onSelectedCvTemplateIdChange={setSelectedCvTemplateId}
            />
          </div>

          {/* Documents Tab */}
          <div className={activeTab === 'docs' ? 'block' : 'hidden'}>
            <DocumentsTab 
              documents={documents}
              onDocumentsChange={setDocuments}
            />
          </div>

          {/* PDF Maker Tab */}
          <div className={activeTab === 'pdf' ? 'block' : 'hidden'}>
            <PdfMakerTab
              pdfSource={pdfSource}
              onPdfSourceChange={setPdfSource}
              documents={documents}
              pdfBlobUrl={pdfBlobUrl}
              isPdfLoading={isPdfLoading}
              pdfError={pdfError}
              onCompile={handleCompilePDF}
              onDownload={handleDownloadPDF}
              isMobile={isMobile}
              numPages={numPages}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
              pdfContainerRef={pdfContainerRef}
              pdfContainerWidth={pdfContainerWidth}
            />
          </div>

          {/* ATS Test Tab */}
          <div className={activeTab === 'ats' ? 'block' : 'hidden'}>
            <AtsTestTab
              atsResult={atsResult}
              isAtsLoading={isAtsLoading}
              onRunATS={handleRunATS}
              canRunATS={!!(jobDescription && (cvGenerated || cvOriginal))}
              jobDescription={jobDescription}
              cvGenerated={cvGenerated}
              cvOriginal={cvOriginal}
            />
          </div>

        </main>
      </AuthGate>


    </div>
  );
}