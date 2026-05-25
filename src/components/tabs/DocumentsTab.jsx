import { FileText, Trash2, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DocumentsTab({ documents, onDocumentsChange }) {
  const { t, i18n } = useTranslation();

  const handleDelete = (id) => {
    if (confirm(t('documents.confirmDelete', 'Voulez-vous vraiment supprimer ce document ?'))) {
      onDocumentsChange(documents.filter(d => d.id !== id));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[75vh]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText size={24} className="text-purple-600" />
          {t('documents.title', 'Lettres & Documents')}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t('documents.subtitle', "Retrouvez ici toutes les réponses de l'IA (Lettres de motivation, préparations d'entretien, emails) sauvegardées.")}
        </p>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FileText size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">{t('documents.emptyTitle', 'Aucun document')}</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {t('documents.emptyDesc', "Allez dans l'onglet Assistant IA pour générer et sauvegarder des lettres de motivation ou des préparations.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className="border border-slate-200 rounded-xl p-4 flex flex-col hover:border-purple-300 transition-colors bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{doc.title}</h3>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title={t('documents.delete', 'Supprimer')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-4 border-b border-slate-100 pb-2">
                <Calendar size={12} /> {formatDate(doc.timestamp)}
              </div>
              <textarea 
                readOnly
                className="w-full h-32 text-xs font-mono bg-slate-50 border border-slate-100 rounded-lg p-2 resize-none outline-none custom-scrollbar"
                value={doc.content}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
