import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass, Copy, Spinner, ListDashes } from '@phosphor-icons/react';
import { scrapeJobSearchLinks } from '../../services/scraperService';

export default function JobSearchScraperTab({ showToast }) {
  const { t } = useTranslation();
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // '' means anytime, 'r86400' 24h, 'r604800' week, 'r2592000' month
  const [isScraping, setIsScraping] = useState(false);
  const [links, setLinks] = useState([]);

  const handleScrape = async () => {
    if (!keywords.trim()) {
      showToast('Veuillez entrer au moins un mot-clé.', 'warning');
      return;
    }

    setIsScraping(true);
    setLinks([]);

    try {
      // Build LinkedIn search URL
      const params = new URLSearchParams();
      params.append('keywords', keywords);
      if (location.trim()) {
        params.append('location', location);
      }
      if (dateFilter) {
        params.append('f_TPR', dateFilter);
      }
      
      const searchUrl = `https://www.linkedin.com/jobs/search/?${params.toString()}`;
      
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
              Recherchez des offres sur LinkedIn et extrayez tous les liens en un clic pour le traitement par lots.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-500">Date de publication</label>
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
        </div>

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
