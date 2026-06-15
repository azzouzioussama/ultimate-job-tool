import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass, Copy, Spinner, ListDashes, LinkSimple, Browsers } from '@phosphor-icons/react';
import { scrapeJobSearchLinks } from '../../services/scraperService';

export default function JobSearchScraperTab({ showToast }) {
  const { t } = useTranslation();
  
  // UI State
  const [mode, setMode] = useState('direct'); // 'direct' or 'builder'
  
  // Builder State
  const [builderSite, setBuilderSite] = useState('linkedin');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Direct URL State
  const [directUrl, setDirectUrl] = useState('');

  // Scraper State
  const [isScraping, setIsScraping] = useState(false);
  const [links, setLinks] = useState([]);

  const handleScrape = async () => {
    let searchUrl = '';

    if (mode === 'builder') {
      if (!keywords.trim()) {
        showToast('Veuillez entrer au moins un mot-clé.', 'warning');
        return;
      }
      const k = encodeURIComponent(keywords.trim());
      const l = encodeURIComponent(location.trim());
      
      switch (builderSite) {
        case 'linkedin':
          const params = new URLSearchParams();
          params.append('keywords', keywords);
          if (location.trim()) params.append('location', location);
          if (dateFilter) params.append('f_TPR', dateFilter);
          searchUrl = `https://www.linkedin.com/jobs/search/?${params.toString()}`;
          break;
        case 'indeed':
          searchUrl = `https://fr.indeed.com/jobs?q=${k}&l=${l}`;
          break;
        case 'hellowork':
          searchUrl = `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${k}&l=${l}`;
          break;
        case 'freework':
          searchUrl = `https://www.free-work.com/fr/tech-it/jobs?query=${k}&locations=${l}`;
          break;
        case 'welcometothejungle':
          searchUrl = `https://www.welcometothejungle.com/fr/jobs?query=${k}&location=${l}`;
          break;
        case 'glassdoor':
          searchUrl = `https://www.glassdoor.fr/Emploi/emplois.htm?sc.keyword=${k}&locT=C&locId=&locKeyword=${l}`;
          break;
        case 'monster':
          searchUrl = `https://www.monster.fr/emploi/recherche?q=${k}&where=${l}`;
          break;
        case 'apec':
          searchUrl = `https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=${k}&lieux=${l}`;
          break;
        case 'cadremploi':
          searchUrl = `https://www.cadremploi.fr/emploi/liste_offres?motcle=${k}&lieu=${l}`;
          break;
        case 'meteojob':
          searchUrl = `https://www.meteojob.com/recherche-offres-emploi?motsCles=${k}&lieu=${l}`;
          break;
        case 'lesjeudis':
          searchUrl = `https://www.lesjeudis.com/recherche-emploi?q=${k}&l=${l}`;
          break;
        case 'welovedevs':
          searchUrl = `https://welovedevs.com/app/jobs?q=${k}&location=${l}`;
          break;
        case 'chooseyourboss':
          searchUrl = `https://www.chooseyourboss.com/offres-emploi?keywords=${k}&location=${l}`;
          break;
        case 'talent':
          searchUrl = `https://fr.talent.com/jobs?k=${k}&l=${l}`;
          break;
        case 'jobijoba':
          searchUrl = `https://www.jobijoba.com/fr/recherche?q=${k}&where=${l}`;
          break;
        case 'jooble':
          searchUrl = `https://fr.jooble.org/SearchResult?ukw=${k}&reg=${l}`;
          break;
        case 'keljob':
          searchUrl = `https://www.keljob.com/recherche?q=${k}&l=${l}`;
          break;
        case 'jobteaser':
          searchUrl = `https://www.jobteaser.com/fr/job-offers?job_title=${k}&location=${l}`;
          break;
        case 'optioncarriere':
          searchUrl = `https://www.optioncarriere.com/recherche/emplois?s=${k}&l=${l}`;
          break;
        case 'joblift':
          searchUrl = `https://joblift.fr/recherche?q=${k}&l=${l}`;
          break;
        default:
          searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${k}`;
      }
    } else {
      if (!directUrl.trim()) {
        showToast('Veuillez coller une URL valide.', 'warning');
        return;
      }
      searchUrl = directUrl.trim();
    }

    setIsScraping(true);
    setLinks([]);

    try {
      const resultLinks = await scrapeJobSearchLinks(searchUrl);
      if (resultLinks && resultLinks.length > 0) {
        setLinks(resultLinks);
        showToast(`${resultLinks.length} liens trouvés !`, 'success');
      } else {
        showToast('Aucun lien trouvé. Essayez de modifier vos critères.', 'warning');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsScraping(false);
    }
  };

  const handleCopy = () => {
    if (links.length === 0) return;
    const textToCopy = links.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Liens copiés dans le presse-papiers !', 'success');
    }).catch(() => {
      showToast('Échec de la copie.', 'error');
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MagnifyingGlass size={24} weight="duotone" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Job Search Scraper</h2>
            <p className="text-sm text-slate-500">
              Extrayez en masse les liens d'offres d'emploi pour le traitement Batch AI.
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setMode('direct')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              mode === 'direct' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LinkSimple size={18} weight={mode === 'direct' ? "bold" : "regular"} />
            URL Directe (Tous sites)
          </button>
          <button
            onClick={() => setMode('builder')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              mode === 'builder' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Browsers size={18} weight={mode === 'builder' ? "bold" : "regular"} />
            Générateur (Multi-Sites)
          </button>
        </div>

        {/* Input Areas */}
        {mode === 'direct' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">URL de la page de recherche</label>
              <input
                type="text"
                value={directUrl}
                onChange={e => setDirectUrl(e.target.value)}
                placeholder="Ex: https://fr.indeed.com/jobs?q=helpdesk..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            
            <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-blue-700 font-medium mb-2">Plateformes supportées :</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white border border-blue-200 rounded-md text-[11px] font-semibold text-blue-700">LinkedIn</span>
                <span className="px-2 py-1 bg-white border border-blue-200 rounded-md text-[11px] font-semibold text-blue-700">Indeed</span>
                <span className="px-2 py-1 bg-white border border-blue-200 rounded-md text-[11px] font-semibold text-blue-700">HelloWork</span>
                <span className="px-2 py-1 bg-white border border-blue-200 rounded-md text-[11px] font-semibold text-blue-700">Free-Work</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Plateforme Jobboard</label>
              <select
                value={builderSite}
                onChange={e => setBuilderSite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="hellowork">HelloWork</option>
                <option value="freework">Free-Work</option>
                <option value="welcometothejungle">Welcome to the Jungle</option>
                <option value="glassdoor">Glassdoor</option>
                <option value="monster">Monster</option>
                <option value="apec">APEC</option>
                <option value="cadremploi">Cadremploi</option>
                <option value="meteojob">Meteojob</option>
                <option value="lesjeudis">LesJeudis</option>
                <option value="welovedevs">WeLoveDevs</option>
                <option value="chooseyourboss">ChooseYourBoss</option>
                <option value="talent">Talent.com</option>
                <option value="jobijoba">Jobijoba</option>
                <option value="jooble">Jooble</option>
                <option value="keljob">Keljob</option>
                <option value="jobteaser">JobTeaser</option>
                <option value="optioncarriere">OptionCarriere</option>
                <option value="joblift">Joblift</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Mots-clés (ex: Helpdesk, React)</label>
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="Poste, compétences, entreprise..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Lieu / Pays</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: France, Paris, Remote"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            {builderSite === 'linkedin' && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500">Date de publication (LinkedIn uniquement)</label>
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">À tout moment</option>
                  <option value="r86400">Dernières 24 heures</option>
                  <option value="r604800">Semaine passée</option>
                  <option value="r2592000">Mois passé</option>
                </select>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScraping ? (
              <>
                <Spinner className="animate-spin" size={20} />
                Recherche en cours...
              </>
            ) : (
              <>
                <ListDashes size={20} weight="bold" />
                Extraire les liens des offres
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            Liens extraits ({links.length})
          </h3>
          <button
            onClick={handleCopy}
            disabled={links.length === 0}
            className="text-sm flex items-center gap-1.5 text-indigo-600 font-semibold hover:text-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Copy size={16} /> Copier tout
          </button>
        </div>
        
        <textarea
          readOnly
          value={links.join('\n')}
          placeholder="Les liens extraits apparaîtront ici..."
          className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono resize-none focus:outline-none"
        />
        {links.length > 0 && (
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            Vous pouvez maintenant coller ces liens dans l'onglet "Batch Tools" (Import en vrac).
          </p>
        )}
      </div>
    </div>
  );
}
