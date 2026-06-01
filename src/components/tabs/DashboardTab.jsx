/**
 * ============================================================================
 * FILE: DashboardTab.jsx
 * PURPOSE: Overview of all saved job applications in the local database.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Plus, Trash2, Briefcase, Calendar, ChevronRight, ChevronDown, Download, Edit3, FileText, FileDown, FileCode2, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { compilePdfFromLatex, downloadBlobAsPdf } from '../../services/pdfService';

export default function DashboardTab({ onSelectApplication, showToast }) {
  const { t, i18n } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  const [applications, setApplications] = useState(null);
  const [expandedAppId, setExpandedAppId] = useState(null);
  const { createApplication, deleteApplication, updateApplication, getAllApplications } = useDatabase();

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
      cvOriginal: localStorage.getItem('ujt_general_cv') || '',
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

  const handleStatusChange = async (id, newStatus, e) => {
    e.stopPropagation();
    await updateApplication(id, { trackingStatus: newStatus });
    loadApps();
  };

  const handleDownloadPrompt = (content, filename, e) => {
    e.stopPropagation();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeletePrompt = async (app, promptKey, e) => {
    e.stopPropagation();
    if (confirm(t('dashboard.confirmDeletePrompt', 'Voulez-vous vraiment supprimer ce document ?'))) {
      const newResponses = { ...app.promptResponses };
      delete newResponses[promptKey];
      await updateApplication(app.id, { promptResponses: newResponses });
      loadApps();
    }
  };

  const handleDownloadPDF = async (content, filename, e) => {
    e.stopPropagation();
    if (showToast) showToast(t('dashboard.compiling', 'Compilation du PDF en cours...'));
    try {
      const blob = await compilePdfFromLatex(content);
      const url = URL.createObjectURL(blob);
      downloadBlobAsPdf(url, filename);
    } catch (err) {
      console.error(err);
      if (showToast) showToast(t('dashboard.compileError', 'Erreur de compilation: ') + err.message);
    }
  };

  const handleDownloadWord = (content, filename, e) => {
    e.stopPropagation();
    let text = content
      .replace(/\\documentclass\[.*?\]{.*?}/g, '')
      .replace(/\\usepackage\[.*?\]{.*?}/g, '')
      .replace(/\\begin{document}/g, '')
      .replace(/\\end{document}/g, '')
      .replace(/\\textbf{(.*?)}/g, '<b>$1</b>')
      .replace(/\\textit{(.*?)}/g, '<i>$1</i>')
      .replace(/\\underline{(.*?)}/g, '<u>$1</u>')
      .replace(/\\section{(.*?)}/g, '<h2>$1</h2>')
      .replace(/\\subsection{(.*?)}/g, '<h3>$1</h3>')
      .replace(/\\item /g, '<li>')
      .replace(/\\begin{itemize}/g, '<ul>')
      .replace(/\\end{itemize}/g, '</ul>')
      .replace(/\\(%)?/g, '')
      .replace(/\n/g, '<br/>');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export</title></head>
      <body style="font-family: Arial, sans-serif;">${text}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold rounded-tl-xl whitespace-nowrap">{t('dashboard.table.date', 'Date')}</th>
                <th className="p-4 font-semibold w-2/5 min-w-[200px]">{t('dashboard.table.jobTitle', 'Objectif / Poste')}</th>
                <th className="p-4 font-semibold w-1/5 min-w-[150px]">{t('dashboard.table.company', 'Entreprise')}</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">{t('dashboard.table.status', 'Statut')}</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap hidden sm:table-cell">{t('dashboard.table.atsBefore', 'ATS Avant')}</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap hidden sm:table-cell">{t('dashboard.table.atsAfter', 'ATS Après')}</th>
                <th className="p-4 font-semibold text-right rounded-tr-xl whitespace-nowrap">{t('dashboard.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map(app => (
                <React.Fragment key={app.id}>
                  <tr 
                    onClick={() => setExpandedAppId(prev => prev === app.id ? null : app.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-50"
                  >
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {expandedAppId === app.id ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronRight size={14} className="text-slate-400"/>}
                        {formatDate(app.lastGeneratedDate || app.lastUpdated)}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800 break-words">
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Briefcase size={16} className="text-indigo-400 shrink-0" />
                        <span className="break-words">{app.jobTitle}</span>
                        {app.jobUrl && (
                          <a 
                            href={app.jobUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={e => e.stopPropagation()}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center p-1 rounded hover:bg-indigo-50 shrink-0"
                            title={t('dashboard.openLink', 'Ouvrir le lien de l\'offre')}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 break-words">
                      {app.companyName || <span className="italic text-slate-400">{t('dashboard.noCompany', 'Projet libre')}</span>}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <select 
                        onClick={e => e.stopPropagation()} 
                        onChange={e => handleStatusChange(app.id, e.target.value, e)}
                        value={app.trackingStatus || 'Draft'}
                        className={`text-xs border rounded-md p-1 font-medium ${
                          app.trackingStatus === 'Applied' ? 'bg-green-50 text-green-700 border-green-200' : 
                          app.trackingStatus === 'Interview' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          app.trackingStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          app.trackingStatus === 'PDF Generated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="Draft">{t('dashboard.status.draft', 'Brouillon')}</option>
                        <option value="PDF Generated">{t('dashboard.status.pdfGenerated', 'PDF Généré')}</option>
                        <option value="Applied">{t('dashboard.status.applied', 'Candidature Envoyée')}</option>
                        <option value="Interview">{t('dashboard.status.interview', 'Entretien')}</option>
                        <option value="Rejected">{t('dashboard.status.rejected', 'Refusé')}</option>
                      </select>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap hidden sm:table-cell">
                      {app.atsScoreBefore ? <span className="text-sm font-bold text-slate-600">{app.atsScoreBefore}%</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap hidden sm:table-cell">
                      {app.atsScoreAfter ? (
                        <span className="text-sm font-bold text-indigo-600">{app.atsScoreAfter}%</span>
                      ) : app.atsResult?.score ? (
                        <span className="text-sm font-bold text-indigo-600">{app.atsResult.score}%</span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => handleDelete(app.id, e)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title={t('dashboard.card.delete', 'Supprimer')}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectApplication(app.id); }}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50 ml-1"
                        title={t('dashboard.card.open', 'Éditer')}
                      >
                        <Edit3 size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detailed View */}
                  {expandedAppId === app.id && (
                    <tr className="bg-slate-50/50 border-b border-slate-200 shadow-inner">
                      <td colSpan="7" className="p-6">
                        {/* Mobile-only stats display */}
                        <div className="flex sm:hidden justify-between items-center bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-4 text-xs">
                          <div>
                            <span className="text-slate-500 font-semibold">ATS Avant : </span>
                            <span className="font-bold text-slate-700">{app.atsScoreBefore ? `${app.atsScoreBefore}%` : '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold">ATS Après : </span>
                            <span className="font-bold text-indigo-600 font-bold">
                              {app.atsScoreAfter ? `${app.atsScoreAfter}%` : (app.atsResult?.score ? `${app.atsResult.score}%` : '-')}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                          
                          {/* Saved LaTeX Files / AI Responses */}
                          <div className="mt-8 border-t border-slate-100 pt-6">
                            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                              <Download size={16} className="text-slate-400"/> {t('dashboard.savedFiles', 'Fichiers LaTeX Sauvegardés')}
                            </h4>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                              {app.promptResponses && Object.keys(app.promptResponses).length > 0 ? (
                                Object.entries(app.promptResponses).map(([key, latex]) => (
                                  <div key={key} className="flex flex-col bg-white border border-slate-200 rounded-lg p-3 shadow-sm min-w-[220px]">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-semibold text-slate-700 truncate" title={key}>{key}</span>
                                      <button 
                                        onClick={(e) => handleDeletePrompt(app, key, e)} 
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title={t('dashboard.deleteDoc', 'Supprimer')}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={(e) => handleDownloadPrompt(latex, `${key}.tex`, e)} 
                                        className="flex-1 flex justify-center items-center py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                                        title={t('dashboard.downloadLatex', 'Télécharger LaTeX (.tex)')}
                                      >
                                        <FileCode2 size={14} /> 
                                      </button>
                                      <button 
                                        onClick={(e) => handleDownloadPDF(latex, `${key}.pdf`, e)} 
                                        className="flex-1 flex justify-center items-center py-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                                        title={t('dashboard.downloadPdf', 'Compiler & Télécharger PDF (.pdf)')}
                                      >
                                        <FileText size={14} /> 
                                      </button>
                                      <button 
                                        onClick={(e) => handleDownloadWord(latex, `${key}.doc`, e)} 
                                        className="flex-1 flex justify-center items-center py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                                        title={t('dashboard.downloadWord', 'Télécharger Word (.doc)')}
                                      >
                                        <FileDown size={14} className="mr-1"/> .doc
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-slate-500 italic py-2">
                                  {t('dashboard.noSavedFiles', "Aucun code LaTeX n'a été extrait et sauvegardé pour cette offre.")}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
                            <button                                
                                onClick={() => onSelectApplication(app.id)}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                              >
                                <Edit3 size={16} /> {t('dashboard.continueEditing', "Continuer l'édition")}
                              </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
