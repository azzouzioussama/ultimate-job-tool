import fs from 'fs';

const fr = JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf-8'));
const en = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf-8'));

const stripLatexInstruction = (content) => {
  return content
    .replace(/\n\nIMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide\./g, '')
    .replace(/\n\nIMPORTANT: Please provide your response strictly in valid LaTeX code\./g, '');
};

for (const key in fr.templates) {
  fr.templates[key].content = stripLatexInstruction(fr.templates[key].content);
}

for (const key in en.templates) {
  en.templates[key].content = stripLatexInstruction(en.templates[key].content);
}

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(en, null, 2));
console.log('Stripped latex instructions!');
