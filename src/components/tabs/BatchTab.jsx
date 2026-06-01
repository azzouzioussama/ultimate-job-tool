import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, ArrowCounterClockwise, Trash, Plus, Link, FileText, CheckCircle, WarningCircle, Spinner, Download, Stack, ArrowSquareOut, CaretRight, Terminal } from '@phosphor-icons/react';
import { useUser } from '@clerk/react';
import { useDatabase } from '../../hooks/useDatabase';
import { callAIProvider } from '../../services/aiService';
import { scrapeWithJina, scrapeWithScrapfly, scrapeWithScrapling } from '../../services/scraperService';
import { extractLatexFromResponse, mergeLatexResponses } from '../../services/latexUtils';
import { compilePdfFromLatex, downloadBlobAsPdf } from '../../services/pdfService';
import * as storage from '../../services/storageService';
import getPromptTemplates from '../../constants/promptTemplates';

export default function BatchTab({
  cvOriginal,
  aiProvider,
  aiModel,
  apiKey,
  scraperType,
  onScraperTypeChange,
  showToast,
  setActiveAppId,
  setActiveTab,
  currentUser
}) {
  const { t } = useTranslation();
  const { createApplication, updateApplication } = useDatabase();
  const templates = getPromptTemplates(t);

  // Clerk setup & Storage keys scoped to user
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const { user: clerkUser } = isClerkAvailable ? useUser() : { user: null };
  const userId = clerkUser ? clerkUser.id : (currentUser ? currentUser.id || currentUser.username : 'guest');
  const BATCH_ITEMS_KEY = `ujt_batch_items_${userId}`;
  const BATCH_SETTINGS_KEY = `ujt_batch_settings_${userId}`;

  // --- State Variables ---
  const [items, setItems] = useState([]);
  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([1, 2]); // default: CV LaTeX & French Cover Letter
  const [autoCompile, setAutoCompile] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Execution states
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState([]);

  // Refs to avoid stale states and manage concurrent running processes
  const isPlayingRef = useRef(false);
  const itemsRef = useRef([]);
  const logsContainerRef = useRef(null);
  const runningItemIdsRef = useRef(new Set());

  // Load persisted items and settings whenever userId changes
  useEffect(() => {
    setIsLoaded(false);
    
    // Items
    let initialItems = [];
    const storedItems = localStorage.getItem(BATCH_ITEMS_KEY);
    if (storedItems) {
      try {
        initialItems = JSON.parse(storedItems);
      } catch (e) {
        console.error("Failed to parse persisted batch items:", e);
      }
    }
    setItems(initialItems);

    // Settings
    const storedSettings = localStorage.getItem(BATCH_SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        if (parsed.selectedTemplates) setSelectedTemplates(parsed.selectedTemplates);
        if (parsed.autoCompile !== undefined) setAutoCompile(parsed.autoCompile);
        if (parsed.autoDownload !== undefined) setAutoDownload(parsed.autoDownload);
      } catch (e) {
        console.error("Failed to parse persisted batch settings:", e);
      }
    } else {
      setSelectedTemplates([1, 2]);
      setAutoCompile(true);
      setAutoDownload(true);
    }

    setIsLoaded(true);
  }, [userId, BATCH_ITEMS_KEY, BATCH_SETTINGS_KEY]);

  // Persist items on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(BATCH_ITEMS_KEY, JSON.stringify(items));
    }
  }, [items, BATCH_ITEMS_KEY, isLoaded]);

  // Sync refs with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Persist settings on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(BATCH_SETTINGS_KEY, JSON.stringify({
        selectedTemplates,
        autoCompile,
        autoDownload
      }));
    }
  }, [selectedTemplates, autoCompile, autoDownload, BATCH_SETTINGS_KEY, isLoaded]);

  // Scroll to bottom of logs console
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Add event helper to logs
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // --- Handlers ---
  const handleAddItem = (type) => {
    if (type === 'url') {
      let cleanUrl = inputUrl.trim();
      const urlMatch = cleanUrl.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
      if (urlMatch) {
        cleanUrl = urlMatch[0].replace(/[.,;!?()\[\]{}'"]+$/, '');
        if (/^www\./i.test(cleanUrl)) {
          cleanUrl = 'https://' + cleanUrl;
        }
      }
      if (!cleanUrl) return;

      // Duplicate Check
      const isDuplicate = items.some(item => 
        item.type === 'url' && item.input.toLowerCase() === cleanUrl.toLowerCase()
      );
      if (isDuplicate) {
        showToast("Cette offre (lien) est déjà présente dans la pile.", "warning");
        return;
      }

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'url',
        input: cleanUrl,
        status: 'pending',
        error: '',
        companyName: '',
        jobTitle: '',
        extractedDescription: '',
        appId: null,
        completedDocs: []
      };
      setItems(prev => [...prev, newItem]);
      setInputUrl('');
      addLog(`Offre URL ajoutée : ${newItem.input}`);
    } else {
      const cleanText = inputText.trim();
      if (!cleanText) return;

      // Duplicate Check
      const isDuplicate = items.some(item => 
        item.type === 'text' && item.input.toLowerCase() === cleanText.toLowerCase()
      );
      if (isDuplicate) {
        showToast("Cette description d'offre est déjà présente dans la pile.", "warning");
        return;
      }

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'text',
        input: cleanText,
        status: 'pending',
        error: '',
        companyName: 'Texte libre',
        jobTitle: 'Offre brute',
        extractedDescription: cleanText,
        appId: null,
        completedDocs: []
      };
      setItems(prev => [...prev, newItem]);
      setInputText('');
      addLog("Offre textuelle brute ajoutée.");
    }
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n');
    let addedCount = 0;
    let duplicateCount = 0;
    
    // Check if separating by ---
    if (bulkInput.includes('---')) {
      const blocks = bulkInput.split('---');
      blocks.forEach(block => {
        const cleanBlock = block.trim();
        if (cleanBlock) {
          const isDuplicate = items.some(item => 
            item.input.toLowerCase() === cleanBlock.toLowerCase()
          );
          if (isDuplicate) {
            duplicateCount++;
            return;
          }

          const newItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            type: 'text',
            input: cleanBlock,
            status: 'pending',
            error: '',
            companyName: 'Texte libre',
            jobTitle: 'Offre importée',
            extractedDescription: cleanBlock,
            appId: null,
            completedDocs: []
          };
          setItems(prev => [...prev, newItem]);
          addedCount++;
        }
      });
    } else {
      // Treat as list of URLs
      lines.forEach(line => {
        let cleanUrl = line.trim();
        const urlMatch = cleanUrl.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
        if (urlMatch) {
          cleanUrl = urlMatch[0].replace(/[.,;!?()\[\]{}'"]+$/, '');
          if (/^www\./i.test(cleanUrl)) {
            cleanUrl = 'https://' + cleanUrl;
          }
        }
        if (cleanUrl && (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://'))) {
          const isDuplicate = items.some(item => 
            item.input.toLowerCase() === cleanUrl.toLowerCase()
          );
          if (isDuplicate) {
            duplicateCount++;
            return;
          }

          const newItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            type: 'url',
            input: cleanUrl,
            status: 'pending',
            error: '',
            companyName: '',
            jobTitle: '',
            extractedDescription: '',
            appId: null,
            completedDocs: []
          };
          setItems(prev => [...prev, newItem]);
          addedCount++;
        }
      });
    }

    if (duplicateCount > 0) {
      showToast(`${duplicateCount} offre(s) en doublon ignorée(s).`, "warning");
    }
    addLog(`${addedCount} offre(s) importée(s) en vrac (${duplicateCount} doublons ignorés).`);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
    runningItemIdsRef.current.delete(id);
    addLog("Offre retirée de la pile.");
  };

  const handleClearAll = () => {
    setItems([]);
    setIsPlaying(false);
    setLogs([]);
    runningItemIdsRef.current.clear();
    addLog("Pile réinitialisée.");
  };

  const toggleTemplateSelection = (id) => {
    setSelectedTemplates(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleStartPause = () => {
    if (!isPlaying) {
      if (items.length === 0) {
        showToast("Veuillez ajouter des offres d'emploi avant de démarrer.", "warning");
        return;
      }
      if (!apiKey) {
        showToast("Clé API manquante. Configurez-la en haut.", "error");
        return;
      }

      const hasJobsToRun = items.some(item => item.status !== 'completed');
      if (!hasJobsToRun) {
        // Reset all items if they were all finished
        setItems(prev => prev.map(item => ({
          ...item,
          status: 'pending',
          error: '',
          completedDocs: []
        })));
        addLog("Démarrage du traitement de la pile...");
      } else {
        // Reset failed tasks so they run again, leave completed alone
        setItems(prev => prev.map(item => 
          item.status === 'failed'
            ? { ...item, status: 'pending', error: '', completedDocs: [] }
            : item
        ));
        addLog("Reprise du traitement en parallèle...");
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      addLog("Traitement mis en pause.");
    }
  };

  // --- Async Parallel Process Runner for Single Item ---
  const processItem = async (itemId, itemIndex) => {
    if (runningItemIdsRef.current.has(itemId)) return;
    runningItemIdsRef.current.add(itemId);

    const logPrefix = `[Offre #${itemIndex + 1}]`;

    // Helper to check if we should abort (paused)
    const isAborted = () => {
      if (!isPlayingRef.current) {
        addLog(`${logPrefix} Interrompu (en pause).`);
        runningItemIdsRef.current.delete(itemId);
        updateItemState(itemId, { status: 'pending' });
        return true;
      }
      return false;
    };

    // Helper to update status of this item
    const updateItemState = (id, updates) => {
      setItems(prev => prev.map(itm => itm.id === id ? { ...itm, ...updates } : itm));
    };

    try {
      // Find the current item data
      let currentItem = itemsRef.current.find(itm => itm.id === itemId);
      if (!currentItem) {
        runningItemIdsRef.current.delete(itemId);
        return;
      }

      addLog(`${logPrefix} Démarrage du traitement...`);
      
      // Step 1: Scrape
      let desc = currentItem.extractedDescription;
      if (currentItem.type === 'url' && !desc) {
        updateItemState(itemId, { status: 'scraping' });
        addLog(`${logPrefix} Extraction de l'URL : ${currentItem.input}`);
        
        if (scraperType === 'jina') {
          desc = await scrapeWithJina(currentItem.input);
        } else if (scraperType === 'scrapfly') {
          let key = storage.getScrapflyKey();
          if (!key) throw new Error("Clé Scrapfly requise pour l'extraction.");
          desc = await scrapeWithScrapfly(currentItem.input, key);
        } else if (scraperType === 'scrapling') {
          desc = await scrapeWithScrapling(currentItem.input);
        }
        
        if (isAborted()) return;
        addLog(`${logPrefix} Contenu web extrait avec succès (${desc.length} caractères).`);
        updateItemState(itemId, { extractedDescription: desc });
      }

      // Step 2: Info Extraction
      updateItemState(itemId, { status: 'extracting' });
      addLog(`${logPrefix} Analyse de l'offre par l'IA...`);

      const extractPrompt = `Agis comme un assistant de recrutement. Analyse la description de poste ci-dessous et extrait :
1. Le titre du poste (jobTitle)
2. Le nom de l'entreprise (companyName)

Tu DOIS retourner UNIQUEMENT un objet JSON valide avec cette structure exacte :
{
  "jobTitle": "titre du poste",
  "companyName": "nom de l'entreprise"
}
Ne retourne aucun autre texte, seulement le JSON.

Description :
${desc.substring(0, 3000)}`;

      if (isAborted()) return;
      const reply = await callAIProvider({
        provider: aiProvider,
        model: aiModel,
        apiKey,
        promptText: extractPrompt
      });

      if (isAborted()) return;

      let jobTitle = 'Offre extraite';
      let companyName = '';
      try {
        const jsonStr = reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        jobTitle = parsed.jobTitle || 'Offre extraite';
        companyName = parsed.companyName || '';
      } catch (e) {
        console.error("AI JSON parse failed:", e);
      }

      addLog(`${logPrefix} Offre identifiée : "${jobTitle}" chez "${companyName || 'Inconnu'}"`);
      updateItemState(itemId, { jobTitle, companyName });

      // Step 3: Create App in DB
      addLog(`${logPrefix} Création de la candidature en base de données...`);
      const newAppId = await createApplication({
        companyName: companyName,
        jobTitle: jobTitle,
        jobDescription: desc,
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
      updateItemState(itemId, { appId: newAppId });

      if (isAborted()) return;

      // Step 4: AI Generation
      updateItemState(itemId, { status: 'generating' });
      
      let cvGeneratedLocal = '';
      let documentsLocal = [];
      let promptResponsesLocal = {};
      let completedDocsLocal = [];

      for (const templateId of selectedTemplates) {
        if (isAborted()) return;
        const template = templates.find(t => t.id === templateId);
        if (!template) continue;

        addLog(`${logPrefix} Génération de : "${template.title}"...`);
        
        let compiledPrompt = template.content
          .replace(/{cv_content}/g, cvOriginal)
          .replace(/{job_description}/g, desc);
          
        if (templateId === 1) {
          compiledPrompt += "\nFormatte le CV LaTeX final proprement. Assure-toi que les caractères spéciaux (comme '&') soient bien échappés (\\&).";
        }

        const responseText = await callAIProvider({
          provider: aiProvider,
          model: aiModel,
          apiKey,
          promptText: compiledPrompt
        });

        if (templateId === 1) {
          const merged = mergeLatexResponses(cvOriginal, [responseText]);
          if (merged && merged.trim()) {
            cvGeneratedLocal = merged;
          } else {
            const fallbackExtracted = extractLatexFromResponse(responseText);
            cvGeneratedLocal = fallbackExtracted || responseText;
          }
          addLog(`${logPrefix} CV adapté généré (LaTeX).`);
          completedDocsLocal.push(template.title);
        } else {
          const docContent = extractLatexFromResponse(responseText) || responseText;
          documentsLocal.push({
            id: Date.now().toString() + Math.random().toString(),
            title: template.title,
            content: docContent,
            timestamp: new Date().toISOString()
          });
          promptResponsesLocal[template.title] = docContent;
          addLog(`${logPrefix} Document généré : "${template.title}".`);
          completedDocsLocal.push(template.title);
        }
        
        updateItemState(itemId, { completedDocs: [...completedDocsLocal] });
      }

      if (isAborted()) return;

      // Update database application
      await updateApplication(newAppId, {
        cvGenerated: cvGeneratedLocal,
        documents: documentsLocal,
        promptResponses: promptResponsesLocal,
        lastGeneratedDate: new Date().toISOString()
      });

      // Step 5: PDF Compilation
      if (autoCompile) {
        updateItemState(itemId, { status: 'compiling' });
        addLog(`${logPrefix} Compilation PDF automatique...`);

        if (cvGeneratedLocal) {
          try {
            if (isAborted()) return;
            addLog(`${logPrefix} Compilation du CV LaTeX...`);
            const cvBlob = await compilePdfFromLatex(cvGeneratedLocal);
            const cvBlobUrl = URL.createObjectURL(cvBlob);
            if (autoDownload) {
              downloadBlobAsPdf(cvBlobUrl, `${companyName.replace(/\s+/g, '_')}_CV_${jobTitle.replace(/\s+/g, '_')}.pdf`);
              addLog(`${logPrefix} CV PDF compilé et téléchargé.`);
            } else {
              addLog(`${logPrefix} CV PDF compilé avec succès (téléchargement automatique désactivé).`);
            }
          } catch (err) {
            addLog(`${logPrefix} ⚠️ Échec compilation CV PDF: ${err.message}`);
          }
        }

        for (const doc of documentsLocal) {
          if (doc.content.includes('\\documentclass') || doc.content.includes('\\begin{document}')) {
            try {
              if (isAborted()) return;
              addLog(`${logPrefix} Compilation de "${doc.title}"...`);
              const docBlob = await compilePdfFromLatex(doc.content);
              const docBlobUrl = URL.createObjectURL(docBlob);
              if (autoDownload) {
                downloadBlobAsPdf(docBlobUrl, `${companyName.replace(/\s+/g, '_')}_${doc.title.replace(/\s+/g, '_')}.pdf`);
                addLog(`${logPrefix} "${doc.title}" PDF compilé et téléchargé.`);
              } else {
                addLog(`${logPrefix} "${doc.title}" PDF compilé avec succès (téléchargement automatique désactivé).`);
              }
            } catch (err) {
              addLog(`${logPrefix} ⚠️ Échec compilation PDF pour "${doc.title}": ${err.message}`);
            }
          }
        }
      }

      // Complete
      updateItemState(itemId, { status: 'completed' });
      addLog(`${logPrefix} ✅ Terminé avec succès !`);
      
      if (autoCompile) {
        await updateApplication(newAppId, { trackingStatus: 'PDF Generated' });
      }

    } catch (error) {
      addLog(`${logPrefix} ❌ Échoué: ${error.message}`);
      updateItemState(itemId, { status: 'failed', error: error.message });
    } finally {
      runningItemIdsRef.current.delete(itemId);
    }
  };

  // Trigger processing loop whenever isPlaying is true or list changes length
  useEffect(() => {
    if (!isPlaying) return;

    items.forEach((item, index) => {
      if (item.status === 'pending') {
        processItem(item.id, index);
      }
    });
  }, [isPlaying, items.length]);

  // Check if all active items are finished to stop isPlaying
  useEffect(() => {
    if (isPlaying && items.length > 0) {
      const allDone = items.every(item => item.status === 'completed' || item.status === 'failed');
      if (allDone) {
        setIsPlaying(false);
        addLog("🎉 Toutes les tâches de la pile sont terminées !");
        showToast("Traitement en rafale terminé !", "success");
      }
    }
  }, [items, isPlaying]);

  // Overall statistics
  const totalCount = items.length;
  const completedCount = items.filter(item => item.status === 'completed').length;
  const failedCount = items.filter(item => item.status === 'failed').length;
  const progressPercent = totalCount > 0 ? Math.round(((completedCount + failedCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Stack className="text-indigo-600 w-8 h-8" />
            <span className="gradient-text">{t('batch.title', 'Génération en Rafale')}</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {t('batch.subtitle', 'Collez plusieurs URL d\'offres d\'emploi pour extraire et créer les candidatures automatiquement.')}
          </p>
        </div>

        {/* AI Model Summary Badge */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="text-slate-500 font-medium">Modèle Actif :</div>
            <div className="text-indigo-600 font-mono font-bold mt-0.5">{aiProvider} ({aiModel})</div>
          </div>
        </div>
      </div>

      {/* THREE PANELS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OPTIONS & INPUTS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUEUE ACTIONS / ADD ITEM */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Plus className="text-indigo-600 w-5 h-5" />
              Ajouter des offres
            </h2>

            {/* Scraper Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                Scraper à utiliser
              </label>
              <select
                value={scraperType}
                onChange={(e) => onScraperTypeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="jina">{t('job.jina', 'Jina AI (Gratuit)')}</option>
                <option value="scrapfly">{t('job.scrapfly', 'Scrapfly (Clé API)')}</option>
                <option value="scrapling">{t('job.scrapling', 'Scrapling (Local)')}</option>
              </select>
            </div>

            {/* Toggle view between single URL, text, and bulk */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button 
                onClick={() => setShowBulkInput(false)}
                className={`flex-1 py-2 text-center rounded-md font-medium transition-all ${!showBulkInput ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Ajout simple
              </button>
              <button 
                onClick={() => setShowBulkInput(true)}
                className={`flex-1 py-2 text-center rounded-md font-medium transition-all ${showBulkInput ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Import en vrac
              </button>
            </div>

            {!showBulkInput ? (
              <div className="space-y-4 pt-1">
                {/* Single URL Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Link className="w-3.5 h-3.5 text-indigo-500" /> Lien de l'offre (LinkedIn, Indeed, etc.)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="https://..."
                      value={inputUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        const urlMatch = val.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
                        if (urlMatch) {
                          let cleanUrl = urlMatch[0].replace(/[.,;!?()\[\]{}'"]+$/, '');
                          if (/^www\./i.test(cleanUrl)) {
                            cleanUrl = 'https://' + cleanUrl;
                          }
                          setInputUrl(cleanUrl);
                        } else {
                          setInputUrl(val);
                        }
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem('url')}
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition"
                    />
                    <button 
                      onClick={() => handleAddItem('url')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-sm font-semibold transition flex items-center justify-center shrink-0 shadow-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">OU</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Single Text Description Area */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> Description de poste (Texte)
                  </label>
                  <textarea 
                    placeholder="Coller la description de poste ici..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition resize-none"
                  />
                  <button 
                    onClick={() => handleAddItem('text')}
                    className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Ajouter ce texte
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold">
                    Coller une liste d'URLs (1 par ligne) ou de textes (séparés par <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">---</code>)
                  </label>
                  <textarea 
                    placeholder="https://linkedin.com/jobs/view/...\nhttps://indeed.com/viewjob/...\n\nOU\n\nDescription offre 1...\n---\nDescription offre 2..."
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition resize-none font-mono"
                  />
                </div>
                <button 
                  onClick={handleBulkImport}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Stack className="w-4 h-4" /> Importer la liste
                </button>
              </div>
            )}
          </div>

          {/* RUN CONFIG PANEL */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Terminal className="text-indigo-600 w-5 h-5" />
              Stratégies IA à lancer
            </h2>

            <div className="space-y-2">
              {templates.map((template) => (
                <label 
                  key={template.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                    selectedTemplates.includes(template.id) 
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={selectedTemplates.includes(template.id)}
                    onChange={() => toggleTemplateSelection(template.id)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <div>
                    <div className="text-xs font-semibold">{template.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{template.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-slate-700 select-none">
                <input 
                  type="checkbox"
                  checked={autoCompile}
                  onChange={(e) => setAutoCompile(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs font-bold">Compiler les documents en PDF</span>
              </label>
              <p className="text-[10px] text-slate-500 pl-6">
                Compile automatiquement les CV LaTeX et lettres de motivation en PDF.
              </p>

              {autoCompile && (
                <div className="pl-6 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer text-slate-700 select-none">
                    <input 
                      type="checkbox"
                      checked={autoDownload}
                      onChange={(e) => setAutoDownload(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold">Télécharger automatiquement après génération</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1 pl-6">
                    Télécharge les fichiers PDF sur votre ordinateur dès qu'ils sont prêts. Si désactivé, les fichiers PDF restent accessibles dans votre tableau de bord.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUEUE LIST & LIVE PROGRESS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CONTROLS & STATISTICS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Play / Pause Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleStartPause}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all duration-200 ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Démarrer la pile ({items.length - completedCount - failedCount} restants)
                  </>
                )}
              </button>

              <button 
                onClick={handleClearAll}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all flex items-center justify-center shadow-sm"
                title="Vider la pile"
              >
                <ArrowCounterClockwise className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Overall progress info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500 font-semibold">Progression globale</div>
                <div className="text-sm font-bold text-slate-800">{completedCount} / {totalCount} terminés</div>
              </div>

              {/* Progress bar container */}
              <div className="flex-1 sm:w-40 bg-slate-100 rounded-full h-3.5 border border-slate-200 overflow-hidden relative shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                {/* Floating percentage for visuals */}
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-indigo-950">
                  {progressPercent}%
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME LOG CONSOLE */}
          <div className="bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-md">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                CONSOLE D'EXÉCUTION IA
              </span>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] hover:text-white transition"
              >
                Effacer logs
              </button>
            </div>
            
            <div 
              ref={logsContainerRef}
              className="p-4 font-mono text-[11px] text-slate-300 h-40 overflow-y-auto space-y-1.5 scrollbar-thin"
            >
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">Console prête. En attente du démarrage du traitement...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap">
                    {log.startsWith('[') ? (
                      <>
                        <span className="text-indigo-400 font-semibold">{log.slice(0, 10)}</span>
                        {log.slice(10).includes('✅') || log.slice(10).includes('terminée') ? (
                          <span className="text-emerald-400">{log.slice(10)}</span>
                        ) : log.slice(10).includes('❌') || log.slice(10).includes('Erreur') ? (
                          <span className="text-rose-400">{log.slice(10)}</span>
                        ) : log.slice(10).includes('⚠️') ? (
                          <span className="text-amber-400">{log.slice(10)}</span>
                        ) : (
                          <span>{log.slice(10)}</span>
                        )}
                      </>
                    ) : (
                      log
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUEUE LIST VIEW */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Stack className="text-indigo-600 w-5 h-5" />
              Pile d'attente ({items.length} offres)
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <div className="text-sm font-semibold">Aucune offre dans la pile</div>
                <div className="text-xs text-slate-500 mt-1">Ajoutez des liens ou du texte pour commencer.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const isActive = ['scraping', 'extracting', 'generating', 'compiling'].includes(item.status);
                  return (
                    <div 
                      key={item.id}
                      className={`relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        isActive 
                          ? 'bg-indigo-50/20 border-indigo-300 shadow-sm shadow-indigo-600/5 animate-pulse' 
                          : item.status === 'completed'
                            ? 'bg-emerald-50/30 border-emerald-100/70 hover:border-emerald-200'
                            : item.status === 'failed'
                              ? 'bg-rose-50/30 border-rose-100/70'
                              : 'bg-slate-50/30 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="flex-grow space-y-1 min-w-0 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            #{index + 1}
                          </span>
                          
                          {/* Status Badge */}
                          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                            item.status === 'pending' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                            item.status === 'scraping' ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' :
                            item.status === 'extracting' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse' :
                            item.status === 'generating' ? 'bg-purple-50 text-purple-600 border-purple-200 animate-pulse' :
                            item.status === 'compiling' ? 'bg-pink-50 text-pink-600 border-pink-200 animate-pulse' :
                            item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {item.status === 'pending' && "En attente"}
                            {item.status === 'scraping' && "Scraping..."}
                            {item.status === 'extracting' && "Analyse IA..."}
                            {item.status === 'generating' && "Génération IA..."}
                            {item.status === 'compiling' && "Compilation..."}
                            {item.status === 'completed' && "Terminé"}
                            {item.status === 'failed' && "Échoué"}
                          </span>
                        </div>

                        {/* Title and Company */}
                        <div className="pt-1.5 truncate">
                          {item.type === 'url' && !item.jobTitle ? (
                            <div className="text-xs text-indigo-600 font-mono font-medium truncate max-w-xl flex items-center gap-1.5" title={item.input}>
                              <Link className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              {item.input}
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-slate-800 flex items-center flex-wrap gap-1.5">
                              {item.jobTitle}
                              {item.companyName && (
                                <span className="text-xs text-slate-500 font-normal">
                                  chez <strong className="text-slate-700">{item.companyName}</strong>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Completed documents badges */}
                        {item.completedDocs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {item.completedDocs.map((doc, docIdx) => (
                              <span key={docIdx} className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Error info if failed */}
                        {item.status === 'failed' && (
                          <div className="text-rose-600 text-xxs font-mono mt-1 flex items-start gap-1 p-1 bg-rose-50/50 rounded border border-rose-100">
                            <WarningCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                            <span>{item.error}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
                        {item.appId && (
                          <button
                            onClick={() => {
                              setActiveAppId(item.appId);
                              setActiveTab('dashboard');
                            }}
                            className="text-xs text-indigo-600 hover:text-white flex items-center gap-1 bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <ArrowSquareOut className="w-3 h-3" />
                            Ouvrir
                          </button>
                        )}

                        <button 
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          disabled={isActive}
                          className={`text-slate-500 hover:text-rose-600 p-2 rounded-lg transition-all ${isActive ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                          title="Supprimer de la liste"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
