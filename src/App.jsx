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
import PROMPT_TEMPLATES from './constants/promptTemplates';
import AI_PROVIDERS from './constants/aiProviders';
import CV_TEMPLATES from './constants/cvTemplates';

// ── Services ──────────────────────────────────────────────────────────────────
import { callAIProvider } from './services/aiService';
import { scrapeWithJina, scrapeWithScrapfly } from './services/scraperService';
import { compilePdfFromLatex, downloadBlobAsPdf } from './services/pdfService';
import { runAtsAnalysis } from './services/atsService';
import { extractTextFromFile, buildLatexConversionPrompt } from './services/fileUploadService';
import { extractLatexFromResponse } from './services/latexUtils';
import * as storage from './services/storageService';
import { createApplication, getApplication, updateApplication, getAllApplications } from './services/db';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';

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
import PdfMakerTab from './components/tabs/PdfMakerTab';
import AtsTestTab from './components/tabs/AtsTestTab';

// ── pdf.js Worker Setup ───────────────────────────────────────────────────────
// pdf.js needs a Web Worker to process PDF files in a background thread.
// This line tells it where to find the worker script.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
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

  // ── Settings (auto-saved to localStorage) ───────────────────────────────────
  const [aiResponse, setAiResponse] = useLocalStorage('ai_response', '');
  const [scraperType, setScraperType] = useLocalStorage('scraper_type', 'jina');

  // ── AI Provider Configuration ───────────────────────────────────────────────
  const [aiProvider, setAiProvider] = useState(storage.getAiProvider());
  const [aiModel, setAiModel] = useState(
    storage.getAiModel(storage.getAiProvider()) ||
    AI_PROVIDERS[storage.getAiProvider()]?.models[0]?.id
  );
  const [apiKey, setApiKey] = useState(storage.getApiKey(storage.getAiProvider()));

  // ── Template State ──────────────────────────────────────────────────────────
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [customPrompt, setCustomPrompt] = useState(PROMPT_TEMPLATES[0].content);
  const [selectedCvTemplateId, setSelectedCvTemplateId] = useLocalStorage('cv_template_id', 'french-ats');

  // ── Loading States ──────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isAtsLoading, setIsAtsLoading] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  // ── Scraper State ───────────────────────────────────────────────────────────
  const [jobUrl, setJobUrl] = useState('');

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
            cvGenerated: oldGenerated || ''
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
        }
      });
    } else {
      setJobDescription('');
      setCvOriginal(SYNTHETIC_CV);
      setCvGenerated('');
    }
  }, [activeAppId]);

  // 3. Debounced auto-save back to Dexie when typing
  useEffect(() => {
    if (!activeAppId) return;
    const timer = setTimeout(() => {
      updateApplication(activeAppId, {
        jobDescription,
        cvOriginal,
        cvGenerated
      });
    }, 500); // Wait 500ms after user stops typing
    return () => clearTimeout(timer);
  }, [activeAppId, jobDescription, cvOriginal, cvGenerated]);


  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS (Reactive logic that runs when state changes)
  // ═══════════════════════════════════════════════════════════════════════════

  // When the user selects a different prompt template, load its content
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) setCustomPrompt(template.content);
  }, [selectedTemplateId]);

  // When the user switches AI provider, load the correct API key and model
  useEffect(() => {
    setApiKey(storage.getApiKey(aiProvider));
    const savedModel = storage.getAiModel(aiProvider);
    const defaultModel = AI_PROVIDERS[aiProvider]?.models[0]?.id;
    setAiModel(savedModel || defaultModel);
  }, [aiProvider]);

  // Compile the final prompt by replacing placeholders with actual data
  const compiledPrompt = useMemo(() => {
    let final = customPrompt.replace(/{cv_content}/g, cvOriginal || '[CV MANQUANT]');
    let jobContent = jobDescription || '[OFFRE MANQUANTE]';

    // If the user pasted a raw URL instead of text, add an instruction for the AI
    if (/^https?:\/\/\S+$/.test(jobContent.trim())) {
      jobContent += "\n\n(IMPORTANT : La description de poste ci-dessus est une URL. Utilise tes outils de navigation web pour visiter ce lien et lire le contenu de l'offre d'emploi avant de générer ta réponse. Si tu ne peux pas naviguer, demande à l'utilisateur de fournir le texte.)";
    }

    return final.replace(/{job_description}/g, jobContent);
  }, [customPrompt, cvOriginal, jobDescription]);

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
      showToast('Copié dans le presse-papiers !');
    } catch {
      showToast('Échec de la copie.');
    }
    document.body.removeChild(textArea);
  };

  // ── Download Prompt as .txt ─────────────────────────────────────────────────
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

  // ── Reset Everything ────────────────────────────────────────────────────────
  const resetAll = () => {
    setCvOriginal(SYNTHETIC_CV);
    setCvGenerated('');
    setSelectedTemplateId(1);
    setCustomPrompt(PROMPT_TEMPLATES[0].content);
    setJobDescription('');
    setAiResponse('');
    showToast('Tout réinitialisé aux valeurs par défaut.');
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
      showToast(`Veuillez entrer une clé API ${providerLabel}.`);
      setActiveTab('ai');
      return;
    }
    if (!compiledPrompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    setActiveTab('ai');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const reply = await callCurrentAI(compiledPrompt, controller.signal);
      setAiResponse(reply);
    } catch (error) {
      // Auto-retry once on network/abort errors (e.g., mobile screen-off)
      if ((error.name === 'AbortError' || error.name === 'TypeError') && retryCount < 1) {
        showToast('Connexion interrompue, nouvelle tentative...');
        clearTimeout(timeoutId);
        return handleRunAI(retryCount + 1);
      }
      const msg = error.name === 'AbortError'
        ? 'La requête a expiré (timeout). Vérifiez votre connexion et réessayez.'
        : error.message;
      setAiResponse(`❌ Erreur: ${msg}\n\nVérifiez que votre clé API ${providerLabel} est valide et a des quotas disponibles.`);
    } finally {
      clearTimeout(timeoutId);
      setIsAiLoading(false);
    }
  };

  // ── Extract LaTeX from AI Response ──────────────────────────────────────────
  const handleExtractLatex = () => {
    const extracted = extractLatexFromResponse(aiResponse);
    if (extracted) {
      setCvGenerated(extracted);
      showToast('CV Généré extrait et sauvegardé (Corrections appliquées) !');
      setActiveTab('cv');
    } else {
      showToast('Aucun code LaTeX complet trouvé dans la réponse.');
    }
  };

  // ── Job Scraping ────────────────────────────────────────────────────────────
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
          key = window.prompt("Entrez votre clé API Scrapfly (commence par 'scp-live-...') :");
          if (!key) throw new Error("Clé Scrapfly requise pour l'extraction.");
          storage.saveScrapflyKey(key);
        }
        result = await scrapeWithScrapfly(jobUrl, key);
      }

      setJobDescription(result);
      showToast(`Offre extraite avec succès via ${scraperType === 'jina' ? 'Jina AI' : 'Scrapfly'} !`);
      setJobUrl('');

    } catch (error) {
      showToast('Erreur: ' + error.message);
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
      const contentToCompile = pdfSource === 'generated' && cvGenerated.trim()
        ? cvGenerated
        : cvOriginal;

      const blob = await compilePdfFromLatex(contentToCompile);
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

  const handleDownloadPDF = () => {
    if (!pdfBlobUrl) return;
    downloadBlobAsPdf(pdfBlobUrl);
    showToast('PDF téléchargé !');
  };

  // ── ATS Analysis ────────────────────────────────────────────────────────────
  const handleRunATS = async () => {
    if (!apiKey) {
      showToast(`Veuillez configurer une clé API ${providerLabel}.`);
      return;
    }
    if (!jobDescription.trim() || (!cvGenerated.trim() && !cvOriginal.trim())) {
      showToast("Il faut une offre d'emploi et un CV pour faire le test ATS.");
      return;
    }

    setIsAtsLoading(true);
    setAtsResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const cvToTest = cvGenerated || cvOriginal;
      const result = await runAtsAnalysis(callCurrentAI, jobDescription, cvToTest, controller.signal);
      setAtsResult(result);
      showToast('Analyse ATS terminée !');
    } catch (error) {
      console.error(error);
      showToast("Erreur lors de l'analyse ATS. Le format JSON retourné est invalide ou la requête a échoué.");
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
      showToast("Veuillez configurer votre clé API IA dans l'en-tête d'abord.");
      return;
    }

    setIsUploadingCv(true);
    showToast('Lecture du fichier en cours...');

    try {
      // Step 1: Extract raw text from the file (locally, no server)
      const extractedText = await extractTextFromFile(file);

      showToast("Texte extrait ! Génération LaTeX en cours par l'IA...");

      // Step 2: Send extracted text to AI for LaTeX conversion
      const selectedTemplate = CV_TEMPLATES.find(t => t.id === selectedCvTemplateId) || CV_TEMPLATES[0];
      const prompt = buildLatexConversionPrompt(extractedText, selectedTemplate.latex);
      const controller = new AbortController();
      const reply = await callCurrentAI(prompt, controller.signal);

      // Step 3: Extract the LaTeX code from the AI response
      const cleanLatex = extractLatexFromResponse(reply);
      if (cleanLatex) {
        setCvOriginal(cleanLatex);
        showToast('CV importé et converti avec succès en LaTeX !');
      } else {
        throw new Error("L'IA n'a pas renvoyé de code LaTeX valide.");
      }
    } catch (err) {
      console.error(err);
      showToast(`Erreur d'import : ${err.message}`);
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
      <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-2 w-full flex-grow flex flex-col gap-6">

        {/* Dashboard Tab */}
        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
          <DashboardTab
            onSelectApplication={(id) => {
              setActiveAppId(id);
              setActiveTab('templates'); // Auto-switch to Prompts after selecting
            }}
          />
        </div>

        {/* Prompts Tab */}
        <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
          <PromptsTab
            templates={PROMPT_TEMPLATES}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={setSelectedTemplateId}
            customPrompt={customPrompt}
            onCustomPromptChange={setCustomPrompt}
            compiledPrompt={compiledPrompt}
            onCopy={copyToClipboard}
            onDownload={downloadAsTxt}
            onRunAI={handleRunAI}
            onReset={resetAll}
          />
        </div>

        {/* AI Assistant Tab */}
        <div className={activeTab === 'ai' ? 'block' : 'hidden'}>
          <AiAssistantTab
            aiResponse={aiResponse}
            isAiLoading={isAiLoading}
            apiKey={apiKey}
            providerLabel={providerLabel}
            onRunAI={handleRunAI}
            onExtractLatex={handleExtractLatex}
            onCopy={copyToClipboard}
            onClear={() => setAiResponse('')}
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

        {/* PDF Maker Tab */}
        <div className={activeTab === 'pdf' ? 'block' : 'hidden'}>
          <PdfMakerTab
            pdfSource={pdfSource}
            onPdfSourceChange={setPdfSource}
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
    </div>
  );
}