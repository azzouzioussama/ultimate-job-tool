import fs from 'fs';

const fr = JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf-8'));
const en = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf-8'));

fr.tabs.documents = 'Documents';
en.tabs.documents = 'Documents';

fr.documents = {
  title: 'Lettres & Documents',
  subtitle: 'Retrouvez ici toutes les réponses de l\'IA (Lettres de motivation, préparations d\'entretien, emails) sauvegardées.',
  emptyTitle: 'Aucun document',
  emptyDesc: 'Allez dans l\'onglet Assistant IA pour générer et sauvegarder des lettres de motivation ou des préparations.',
  delete: 'Supprimer',
  confirmDelete: 'Voulez-vous vraiment supprimer ce document ?'
};

en.documents = {
  title: 'Letters & Documents',
  subtitle: 'Find all your saved AI responses (Cover letters, interview prep, emails) here.',
  emptyTitle: 'No documents',
  emptyDesc: 'Go to the AI Assistant tab to generate and save cover letters or prep materials.',
  delete: 'Delete',
  confirmDelete: 'Are you sure you want to delete this document?'
};

fr.app.toast.docsSaved = '{{count}} document(s) sauvegardé(s)';
en.app.toast.docsSaved = '{{count}} document(s) saved';

fr.dashboard.noCompany = 'Projet libre';
en.dashboard.noCompany = 'Personal Project';

fr.dashboard.badge = {
  job: 'Offre',
  cv: 'CV',
  docs: 'Doc(s)'
};

en.dashboard.badge = {
  job: 'Job',
  cv: 'CV',
  docs: 'Doc(s)'
};

fr.pdf.sourceDoc = 'Doc: {{title}}';
en.pdf.sourceDoc = 'Doc: {{title}}';

fr.prompts.requireLatex = 'Forcer format LaTeX';
en.prompts.requireLatex = 'Require LaTeX format';

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(en, null, 2));
console.log('Translations updated!');
