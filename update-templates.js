import fs from 'fs';

const PROMPT_TEMPLATES = [
  {
    id: 1,
    title: "1. Refonte du CV (LaTeX)",
    description: "Adapte votre CV LaTeX aux mots-clés exacts de l'offre d'emploi.",
    content: `Agis comme un recruteur expert IT. Analyse la description de poste et mon CV LaTeX ci-dessous.
Tâches :
1. Identifie les 3 compétences techniques les plus recherchées.
2. Réécris mon CV ENTIER en LaTeX. Adapte les bullet points et le résumé pour refléter exactement les mots-clés de l'offre, tout en gardant le code LaTeX intact.
3. Dis-moi quelle expérience je dois mettre en avant en entretien.

ATTENTION - REGLES STRICTES POUR LE CODE LATEX :
- Tu DOIS ABSOLUMENT échapper le caractère '&' en l'écrivant '\\&' dans le texte. Ne laisse jamais un '&' seul.
- Assure-toi de bien fermer toutes les accolades '{ }' et de ne jamais les confondre avec des crochets '[ ]'.
- Ne modifie pas la structure du préambule ni les balises d'environnement.

--- MON CV LATEX ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 2,
    title: "2. Lettre de Motivation (Français)",
    description: "Génère une lettre de motivation courte et percutante.",
    content: `Agis comme un expert en recrutement. Rédige une lettre de motivation courte (max 150 mots, 3 paragraphes) en français pour ce poste.
Contraintes :
- Paragraphe 1 : Intérêt pour le rôle.
- Paragraphe 2 : Relie 2 de mes forces (issues du CV) aux besoins du poste.
- Paragraphe 3 : Disponibilité et appel à l'action.
Garde un ton professionnel mais dynamique.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 3,
    title: "3. Lettre de Motivation (Anglais)",
    description: "Génère une lettre de motivation en anglais professionnel.",
    content: `Act as an expert technical recruiter. Write a concise cover letter (max 150 words) in English for this position.
Connect my background from the provided CV to the exact needs of the job description. Keep the tone highly professional, direct, and confident.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 4,
    title: "4. Préparation Entretien (Q&A)",
    description: "Génère les 10 questions les plus probables pour ce poste avec les réponses STAR.",
    content: `En te basant sur la description de poste et mon CV, génère les 10 questions d'entretien les plus probables (techniques et comportementales) que l'on pourrait me poser.
Pour chaque question, rédige une suggestion de réponse en utilisant la méthode STAR (Situation, Tâche, Action, Résultat), en piochant dans mes expériences.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 5,
    title: "5. Critique Sévère du CV",
    description: "Analyse critique pour trouver les failles de votre candidature.",
    content: `Agis comme un recruteur IT très exigeant. Analyse mon CV par rapport à l'offre d'emploi.
1. Donne-moi une note sur 100 de matching.
2. Liste impitoyablement les 3 plus grandes faiblesses ou manques de mon CV pour ce poste précis.
3. Donne-moi une stratégie pour contourner ces faiblesses lors de l'entretien.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 6,
    title: "6. Optimisation LinkedIn",
    description: "Crée une section 'Infos' LinkedIn attractive pour attirer ce type de recruteur.",
    content: `Je veux optimiser mon profil LinkedIn pour attirer les recruteurs qui publient ce type d'offre d'emploi.
Rédige une section "Infos" (À propos) LinkedIn percutante à la première personne, en utilisant mon CV, optimisée avec les mots-clés de l'offre d'emploi. Inclut un "Call to Action" à la fin.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 7,
    title: "7. Pitch de Présentation (30 sec)",
    description: "Prépare votre réponse à la question 'Parlez-moi de vous'.",
    content: `Prépare-moi un pitch "Elevator Pitch" de 30 à 45 secondes pour répondre à la fameuse question d'entretien : "Parlez-moi de vous". 
Il doit être naturel, en français, et lier immédiatement mon parcours (mon CV) au besoin principal de l'entreprise (l'offre d'emploi).

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 8,
    title: "8. Analyse des Compétences Manquantes",
    description: "Identifie les technologies que vous devez réviser avant l'entretien.",
    content: `Analyse les exigences du poste par rapport à mon CV.
Fais une liste des technologies, outils ou compétences mentionnés dans l'offre que je NE possède PAS clairement dans mon CV.
Pour chaque manque, propose-moi un plan d'action d'apprentissage express de 2 heures (concepts clés à googler, tutoriels à chercher) pour que je sois capable d'en parler intelligemment en entretien.

--- MON CV ---
{cv_content}

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 9,
    title: "9. Email de Remerciement",
    description: "Rédige un email post-entretien percutant.",
    content: `Rédige un e-mail de remerciement post-entretien court et professionnel.
L'email doit remercier le recruteur pour son temps, réaffirmer mon enthousiasme pour ce poste spécifique, et rappeler brièvement en une ligne pourquoi ma compétence principale fait de moi un excellent choix.

--- DESCRIPTION DU POSTE ---
{job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  },
  {
    id: 10,
    title: "10. Prompt Personnalisé (Libre)",
    description: "Écrivez votre propre requête à l'IA.",
    content: `(Écrivez vos instructions ici. Utilisez {cv_content} et {job_description} pour injecter vos données automatiquement).

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.`
  }
];

// English translations
const PROMPT_TEMPLATES_EN = [
  {
    id: 1,
    title: "1. CV Redesign (LaTeX)",
    description: "Adapts your LaTeX CV to the exact keywords of the job offer.",
    content: `Act as an expert IT recruiter. Analyze the job description and my LaTeX CV below.
Tasks:
1. Identify the top 3 most sought-after technical skills.
2. Rewrite my ENTIRE CV in LaTeX. Adapt the bullet points and summary to exactly reflect the keywords of the offer, while keeping the LaTeX code intact.
3. Tell me which experience I should highlight in the interview.

ATTENTION - STRICT RULES FOR LATEX CODE:
- You MUST ABSOLUTELY escape the '&' character by writing it '\\&' in the text. Never leave an '&' alone.
- Make sure to properly close all curly braces '{ }' and never confuse them with brackets '[ ]'.
- Do not modify the structure of the preamble or the environment tags.

--- MY LATEX CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 2,
    title: "2. Cover Letter (French)",
    description: "Generates a short and impactful cover letter in French.",
    content: PROMPT_TEMPLATES[1].content // Intentionally keeping French for this specific prompt
  },
  {
    id: 3,
    title: "3. Cover Letter (English)",
    description: "Generates a professional cover letter in English.",
    content: PROMPT_TEMPLATES[2].content // Intentionally keeping English
  },
  {
    id: 4,
    title: "4. Interview Preparation (Q&A)",
    description: "Generates the 10 most likely questions for this position with STAR answers.",
    content: `Based on the job description and my CV, generate the 10 most likely interview questions (technical and behavioral) I might be asked.
For each question, write a suggested answer using the STAR method (Situation, Task, Action, Result), drawing from my experiences.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 5,
    title: "5. Severe CV Critique",
    description: "Critical analysis to find the flaws in your application.",
    content: `Act as a very demanding IT recruiter. Analyze my CV against the job offer.
1. Give me a matching score out of 100.
2. Ruthlessly list the 3 biggest weaknesses or gaps in my CV for this specific position.
3. Give me a strategy to overcome these weaknesses during the interview.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 6,
    title: "6. LinkedIn Optimization",
    description: "Creates an attractive LinkedIn 'About' section to attract this type of recruiter.",
    content: `I want to optimize my LinkedIn profile to attract recruiters who post this type of job offer.
Write a powerful LinkedIn "About" section in the first person, using my CV, optimized with the keywords from the job offer. Include a "Call to Action" at the end.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 7,
    title: "7. Presentation Pitch (30 sec)",
    description: "Prepares your answer to the 'Tell me about yourself' question.",
    content: `Prepare a 30 to 45-second "Elevator Pitch" for me to answer the famous interview question: "Tell me about yourself". 
It must be natural, in English, and immediately link my background (my CV) to the company's main need (the job offer).

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 8,
    title: "8. Missing Skills Analysis",
    description: "Identifies the technologies you need to review before the interview.",
    content: `Analyze the job requirements against my CV.
Make a list of the technologies, tools, or skills mentioned in the offer that I do NOT clearly have in my CV.
For each gap, propose a 2-hour crash-course action plan (key concepts to google, tutorials to find) so that I can talk about it intelligently in an interview.

--- MY CV ---
{cv_content}

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 9,
    title: "9. Thank You Email",
    description: "Writes a powerful post-interview email.",
    content: `Write a short and professional post-interview thank you email.
The email should thank the recruiter for their time, reaffirm my enthusiasm for this specific position, and briefly remind them in one sentence why my core skill makes me a great fit.

--- JOB DESCRIPTION ---
{job_description}

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  },
  {
    id: 10,
    title: "10. Custom Prompt (Free)",
    description: "Write your own request to the AI.",
    content: `(Write your instructions here. Use {cv_content} and {job_description} to inject your data automatically).

IMPORTANT: Please provide your response strictly in valid LaTeX code.`
  }
];

const locales = {
  fr: JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf-8')),
  en: JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf-8'))
};

locales.fr.templates = {};
PROMPT_TEMPLATES.forEach(t => {
  locales.fr.templates[t.id] = {
    title: t.title,
    desc: t.description,
    content: t.content
  };
});

locales.en.templates = {};
PROMPT_TEMPLATES_EN.forEach(t => {
  locales.en.templates[t.id] = {
    title: t.title,
    desc: t.description,
    content: t.content
  };
});

fs.writeFileSync('./src/locales/fr.json', JSON.stringify(locales.fr, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(locales.en, null, 2));
console.log('Template Locales updated!');
