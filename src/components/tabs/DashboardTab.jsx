/**
 * ============================================================================
 * FILE: DashboardTab.jsx
 * PURPOSE: Overview of all saved job applications in the local database.
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Plus, Trash2, Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function DashboardTab({ onSelectApplication }) {
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
  }, [getAllApplications]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCompany.trim() || !newJobTitle.trim()) return;

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
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      await deleteApplication(id);
      loadApps();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Inconnu';
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mes Candidatures</h2>
          <p className="text-sm text-slate-500">Gérez vos différentes versions de CV et offres d'emploi (Stockage local).</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nouvelle Candidature
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Entreprise</label>
            <input
              type="text"
              autoFocus
              required
              className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Google"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Poste visé</label>
            <input
              type="text"
              required
              className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Développeur Frontend"
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
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      {!applications ? (
        <div className="text-center py-10 text-slate-500">Chargement...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Aucune candidature</h3>
          <p className="text-sm text-slate-500 mt-1">Créez votre première candidature pour commencer à adapter votre CV.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map(app => (
            <div 
              key={app.id}
              onClick={() => onSelectApplication(app.id)}
              className="group cursor-pointer bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg">
                  <Briefcase size={20} />
                </div>
                <button 
                  onClick={(e) => handleDelete(app.id, e)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={app.jobTitle}>
                {app.jobTitle}
              </h3>
              <p className="text-slate-600 text-sm font-medium mb-4 line-clamp-1">
                {app.companyName}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Modifié le {formatDate(app.lastUpdated)}
                </span>
                <span className="flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                  Ouvrir <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
