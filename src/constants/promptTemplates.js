/**
 * ============================================================================
 * FILE: promptTemplates.js
 * PURPOSE: Contains the 10 pre-built prompt strategies for job applications.
 * ============================================================================
 *
 * WHAT IS THIS?
 * These are expert-level prompt templates that the user selects from.
 * Each template is designed for a specific job application task
 * (e.g., rewriting a CV, writing a cover letter, preparing for an interview).
 *
 * HOW DO PLACEHOLDERS WORK?
 * Each template's `content` string contains two special placeholders:
 *   - {cv_content}       → Gets replaced with the user's current CV text.
 *   - {job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide.  → Gets replaced with the pasted job offer text.
 *
 * The replacement happens in App.jsx's compiled prompt logic, NOT here.
 * This file only stores the raw templates.
 *
 * HOW TO ADD A NEW PROMPT:
 * 1. Copy one of the objects below as a starting point.
 * 2. Give it the next `id` number (e.g., 11).
 * 3. Write a `title`, `description`, and `content`.
 * 4. Use {cv_content} and {job_description}

IMPORTANT: Veuillez fournir votre réponse strictement en code LaTeX valide. in your content where needed.
 * 5. Save this file — the new prompt will automatically appear in the UI.
 *
 * HOW TO REMOVE A PROMPT:
 * Simply delete the entire object (from { to },) and save.
 */

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

export default PROMPT_TEMPLATES;
