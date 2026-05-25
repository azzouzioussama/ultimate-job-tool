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
 *   - {job_description}  → Gets replaced with the pasted job offer text.
 *
 * The replacement happens in App.jsx's compiled prompt logic, NOT here.
 * This file only stores the raw templates.
 *
 * HOW TO ADD A NEW PROMPT:
 * 1. Add it to en.json and fr.json under the "templates" key.
 * 2. Add it to the array below with its corresponding id.
 */

const getPromptTemplates = (t) => {
  return [
    {
      id: 1,
      title: t('templates.1.title', { defaultValue: '1. Refonte du CV (LaTeX)' }),
      description: t('templates.1.desc', { defaultValue: "Adapte votre CV LaTeX aux mots-clés exacts de l'offre d'emploi." }),
      content: t('templates.1.content')
    },
    {
      id: 2,
      title: t('templates.2.title', { defaultValue: '2. Lettre de Motivation (Français)' }),
      description: t('templates.2.desc', { defaultValue: 'Génère une lettre de motivation courte et percutante.' }),
      content: t('templates.2.content')
    },
    {
      id: 3,
      title: t('templates.3.title', { defaultValue: '3. Lettre de Motivation (Anglais)' }),
      description: t('templates.3.desc', { defaultValue: 'Génère une lettre de motivation en anglais professionnel.' }),
      content: t('templates.3.content')
    },
    {
      id: 4,
      title: t('templates.4.title', { defaultValue: '4. Préparation Entretien (Q&A)' }),
      description: t('templates.4.desc', { defaultValue: 'Génère les 10 questions les plus probables pour ce poste avec les réponses STAR.' }),
      content: t('templates.4.content')
    },
    {
      id: 5,
      title: t('templates.5.title', { defaultValue: '5. Critique Sévère du CV' }),
      description: t('templates.5.desc', { defaultValue: 'Analyse critique pour trouver les failles de votre candidature.' }),
      content: t('templates.5.content')
    },
    {
      id: 6,
      title: t('templates.6.title', { defaultValue: '6. Optimisation LinkedIn' }),
      description: t('templates.6.desc', { defaultValue: "Crée une section 'Infos' LinkedIn attractive pour attirer ce type de recruteur." }),
      content: t('templates.6.content')
    },
    {
      id: 7,
      title: t('templates.7.title', { defaultValue: '7. Pitch de Présentation (30 sec)' }),
      description: t('templates.7.desc', { defaultValue: "Prépare votre réponse à la question 'Parlez-moi de vous'." }),
      content: t('templates.7.content')
    },
    {
      id: 8,
      title: t('templates.8.title', { defaultValue: '8. Analyse des Compétences Manquantes' }),
      description: t('templates.8.desc', { defaultValue: 'Identifie les technologies que vous devez réviser avant l\'entretien.' }),
      content: t('templates.8.content')
    },
    {
      id: 9,
      title: t('templates.9.title', { defaultValue: '9. Email de Remerciement' }),
      description: t('templates.9.desc', { defaultValue: 'Rédige un email post-entretien percutant.' }),
      content: t('templates.9.content')
    },
    {
      id: 10,
      title: t('templates.10.title', { defaultValue: '10. Prompt Personnalisé (Libre)' }),
      description: t('templates.10.desc', { defaultValue: 'Écrivez votre propre requête à l\'IA.' }),
      content: t('templates.10.content')
    }
  ];
};

export default getPromptTemplates;
