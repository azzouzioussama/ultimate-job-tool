/**
 * ============================================================================
 * FILE: DashboardTab.jsx
 * PURPOSE: Overview of all saved job applications in the local database.
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Plus, Trash2, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DashboardTab({ onSelectApplication }) {
  const { t, i18n } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  const [applications, setApplications] = useState(null);
  const { createApplication, deleteApplication, getAllApplications } = useDatabase();

  const loadApps = async () => {
    const apps = await getAllApplications();
    setApplications(apps);
  };

  useEffect(() => {
    loadApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const newAppId = await createApplication({
      companyName: newCompany.trim(),
      jobTitle: newJobTitle.trim(),
      jobDescription: '',
      cvOriginal: '',
      cvGenerated: ''
    });

    setNewCompany('');
    setNewJobTitle('');
    setIsCreating(false);
    onSelectApplication(newAppId);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening the application
    if (confirm(t('dashboard.confirmDelete', 'Êtes-vous sûr de vouloir supprimer cette candidature ?'))) {
      await deleteApplication(id);
      loadApps();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return t('dashboard.unknown', 'Inconnu');
    return new Date(timestamp).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('dashboard.title', 'Mes Candidatures')}</h2>
          <p className="text-sm text-slate-500">{t('dashboard.subtitle', "Gérez vos différentes versions de CV et offres d'emploi (Stockage local).")}</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          {t('dashboard.newApp', 'Nouvelle Candidature')}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('dashboard.form.company', 'Entreprise (Optionnel)')}</label>
            <input
              type="text"
              autoFocus
              className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder={t('dashboard.form.companyPlaceholder', 'Ex: Google ou "Projet Perso"')}
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('dashboard.form.jobTitle', 'Poste visé / Objectif')}</label>
            <input
              type="text"
              required
              className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder={t('dashboard.form.jobTitlePlaceholder', 'Ex: Développeur Frontend')}
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              {t('dashboard.form.cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              {t('dashboard.form.create', 'Créer')}
            </button>
          </div>
        </form>
      )}

      {!applications ? (
        <div className="text-center py-10 text-slate-500">{t('dashboard.loading', 'Chargement...')}</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">{t('dashboard.emptyTitle', 'Aucune candidature')}</h3>
          <p className="text-sm text-slate-500 mt-1">{t('dashboard.emptyDesc', 'Créez votre première candidature pour commencer à adapter votre CV.')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold rounded-tl-xl">{t('dashboard.table.date', 'Date')}</th>
                <th className="p-4 font-semibold">{t('dashboard.table.jobTitle', 'Objectif / Poste')}</th>
                <th className="p-4 font-semibold">{t('dashboard.table.company', 'Entreprise')}</th>
                <th className="p-4 font-semibold text-center">{t('dashboard.table.offer', 'Offre')}</th>
                <th className="p-4 font-semibold text-center">{t('dashboard.table.cv', 'CV')}</th>
                <th className="p-4 font-semibold text-center">{t('dashboard.table.docs', 'Docs')}</th>
                <th className="p-4 font-semibold text-center">{t('dashboard.table.ats', 'ATS')}</th>
                <th className="p-4 font-semibold text-right rounded-tr-xl">{t('dashboard.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map(app => (
                <tr 
                  key={app.id} 
                  onClick={() => onSelectApplication(app.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="p-4 text-xs text-slate-500">{formatDate(app.lastUpdated)}</td>
                  <td className="p-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-indigo-400" />
                      {app.jobTitle}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {app.companyName || <span className="italic text-slate-400">{t('dashboard.noCompany', 'Projet libre')}</span>}
                  </td>
                  <td className="p-4 text-center">
                    {app.jobDescription?.length > 10 ? (
                      <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">✅</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-slate-50 text-slate-400 text-xs font-semibold rounded-md border border-slate-100">❌</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {app.cvGenerated?.length > 10 ? (
                      <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100">✅</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-slate-50 text-slate-400 text-xs font-semibold rounded-md border border-slate-100">❌</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {app.documents?.length > 0 ? (
                      <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md border border-purple-100">
                        {app.documents.length}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {app.atsResult ? (
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-md border ${app.atsResult.score >= 80 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                        {app.atsResult.score}%
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => handleDelete(app.id, e)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title={t('dashboard.card.delete', 'Supprimer')}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="text-slate-300 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50 ml-1"
                      title={t('dashboard.card.open', 'Ouvrir')}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
