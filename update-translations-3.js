import fs from 'fs';

const fr = JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf-8'));
const en = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf-8'));

if (!fr.dashboard.table) fr.dashboard.table = {};
if (!en.dashboard.table) en.dashboard.table = {};

fr.dashboard.table = {
  date: 'Date',
  jobTitle: 'Objectif / Poste',
  company: 'Entreprise',
  offer: 'Offre',
  cv: 'CV',
  docs: 'Docs',
  ats: 'ATS',
  actions: 'Actions'
};

en.dashboard.table = {
  date: 'Date',
  jobTitle: 'Goal / Target Position',
  company: 'Company',
  offer: 'Offer',
  cv: 'CV',
  docs: 'Docs',
  ats: 'ATS',
  actions: 'Actions'
};

fr.ai.compileMultipleTooltip = 'Compiler chaque réponse sélectionnée en un PDF distinct';
en.ai.compileMultipleTooltip = 'Compile each selected response into a distinct PDF';

fr.ai.compileMultiple = 'Compiler Séparément ({{count}})';
en.ai.compileMultiple = 'Compile Separately ({{count}})';

fr.ai.extractCv = 'Fusionner CV ({{count}})';
en.ai.extractCv = 'Merge CV ({{count}})';

fr.ai.extractTooltip = 'Fusionner la sélection et remplacer le CV Généré';
en.ai.extractTooltip = 'Merge the selection and replace the Generated CV';

fr.app.toast.compilingMultipleStart = 'Compilation de {{count}} PDFs en cours...';
en.app.toast.compilingMultipleStart = 'Compiling {{count}} PDFs...';

fr.app.toast.compilingMultipleDone = '{{count}} PDF(s) compilé(s) et téléchargé(s) !';
en.app.toast.compilingMultipleDone = '{{count}} PDF(s) compiled and downloaded!';

fr.app.toast.compileMultipleError = 'Erreur pour "{{title}}": {{error}}';
en.app.toast.compileMultipleError = 'Error for "{{title}}": {{error}}';

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(en, null, 2));
console.log('Phase 3 translations updated!');
