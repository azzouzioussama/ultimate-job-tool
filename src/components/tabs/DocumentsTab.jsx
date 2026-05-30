import { FileText, Trash2, Calendar, FileCode2, FileDown, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { compilePdfFromLatex, downloadBlobAsPdf } from '../../services/pdfService';

export default function DocumentsTab({ documents, onDocumentsChange, showToast }) {
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

  const handleDownloadPDF = async (content, filename, e) => {
    e.stopPropagation();
    if (showToast) showToast(t('documents.compiling', 'Compilation en cours...'));
    try {
      const blob = await compilePdfFromLatex(content);
      const url = URL.createObjectURL(blob);
      downloadBlobAsPdf(url, filename);
    } catch (err) {
      console.error(err);
      if (showToast) showToast(t('documents.compileError', 'Erreur de compilation: ') + err.message);
    }
  };

  const handlePreviewPDF = async (content, e) => {
    e.stopPropagation();
    if (showToast) showToast(t('documents.compiling', 'Compilation en cours...'));
    try {
      const blob = await compilePdfFromLatex(content);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      if (showToast) showToast(t('documents.compileError', 'Erreur de compilation: ') + err.message);
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
                className="w-full h-32 text-xs font-mono bg-slate-50 border border-slate-100 rounded-lg p-2 resize-none outline-none custom-scrollbar mb-3"
                value={doc.content}
              />
              <div className="flex gap-2 mt-auto flex-wrap">
                <button 
                  onClick={(e) => handlePreviewPDF(doc.content, e)} 
                  className="flex-1 min-w-[30px] flex justify-center items-center py-1.5 bg-slate-50 hover:bg-green-50 hover:text-green-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                  title={t('documents.previewPdf', 'Aperçu PDF')}
                >
                  <Eye size={14} className="mr-1"/> 
                </button>
                <button 
                  onClick={(e) => handleDownloadPrompt(doc.content, `${doc.title}.tex`, e)} 
                  className="flex-1 min-w-[30px] flex justify-center items-center py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                  title={t('documents.downloadLatex', 'Télécharger LaTeX (.tex)')}
                >
                  <FileCode2 size={14} className="mr-1"/> .tex
                </button>
                <button 
                  onClick={(e) => handleDownloadPDF(doc.content, `${doc.title}.pdf`, e)} 
                  className="flex-1 min-w-[30px] flex justify-center items-center py-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                  title={t('documents.downloadPdf', 'Compiler & Télécharger PDF (.pdf)')}
                >
                  <FileText size={14} className="mr-1"/> .pdf
                </button>
                <button 
                  onClick={(e) => handleDownloadWord(doc.content, `${doc.title}.doc`, e)} 
                  className="flex-1 min-w-[30px] flex justify-center items-center py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded border border-slate-200 text-xs font-medium text-slate-600 transition-colors" 
                  title={t('documents.downloadWord', 'Télécharger Word (.doc)')}
                >
                  <FileDown size={14} className="mr-1"/> .doc
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
