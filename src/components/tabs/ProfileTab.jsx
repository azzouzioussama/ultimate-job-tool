import { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { Download, User, Database, Mail, FileText, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function ProfileTab(props) {
  if (isClerkAvailable) {
    return <ProfileTabCloud {...props} />;
  }
  return <ProfileTabLocal {...props} />;
}

function ProfileTabCloud(props) {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <div className="p-8 text-center">Chargement...</div>;
  return <ProfileTabContent {...props} isSignedIn={isSignedIn} user={user} />;
}

function ProfileTabLocal(props) {
  return <ProfileTabContent {...props} isSignedIn={false} user={null} />;
}

function ProfileTabContent({ getAllApplications, isSignedIn, user }) {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const apps = await getAllApplications();
      setApplications(apps || []);
      setIsLoading(false);
    };
    loadData();
  }, [getAllApplications]);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.trackingStatus === 'Applied').length,
    draft: applications.filter(a => a.trackingStatus === 'Draft').length,
    interview: applications.filter(a => ['Interview', 'Offer', 'Rejected'].includes(a.trackingStatus)).length
  };

  const handleDownloadJobDescriptions = () => {
    const data = applications.map(app => ({
      id: app.id,
      company: app.companyName,
      title: app.jobTitle,
      status: app.trackingStatus,
      description: app.jobDescription
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_descriptions_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `full_applications_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12 mt-4 px-4 sm:px-0">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
          {isSignedIn && user?.imageUrl ? (
            <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User size={40} className="text-indigo-400" />
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-slate-800">
            {isSignedIn ? user?.fullName || user?.firstName || 'Utilisateur' : 'Mon Profil'}
          </h2>
          {isSignedIn && user?.primaryEmailAddress && (
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-1 mt-1">
              <Mail size={14} /> {user.primaryEmailAddress.emailAddress}
            </p>
          )}
          {!isSignedIn && (
            <p className="text-slate-500 mt-1">Mode local - Données sauvegardées sur cet appareil</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Database size={18} />
            <span className="font-medium text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <FileText size={18} />
            <span className="font-medium text-sm">Brouillons</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <CheckCircle size={18} />
            <span className="font-medium text-sm">Envoyées</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.applied}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Clock size={18} />
            <span className="font-medium text-sm">En cours</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.interview}</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Download size={20} className="text-indigo-600" />
          Export des Données
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Téléchargez vos données d'application pour les archiver ou les analyser en lot.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleDownloadJobDescriptions}
            disabled={isLoading || stats.total === 0}
            className="flex flex-col items-start p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <span className="font-medium text-slate-800 flex items-center gap-2 mb-1">
              <FileText size={16} className="text-indigo-600" />
              Offres d'emploi
            </span>
            <span className="text-xs text-slate-500 text-left w-full block">
              Exporte toutes les descriptions d'offres d'emploi au format JSON.
            </span>
          </button>

          <button
            onClick={handleExportAll}
            disabled={isLoading || stats.total === 0}
            className="flex flex-col items-start p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <span className="font-medium text-slate-800 flex items-center gap-2 mb-1">
              <Database size={16} className="text-indigo-600" />
              Sauvegarde Complète
            </span>
            <span className="text-xs text-slate-500 text-left w-full block">
              Exporte l'historique complet (CVs, documents, réponses IA) au format JSON.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
