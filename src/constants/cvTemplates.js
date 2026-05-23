/**
 * ============================================================================
 * FILE: cvTemplates.js
 * PURPOSE: Contains the base LaTeX templates for ATS-friendly CV generation.
 * ============================================================================
 */

import SYNTHETIC_CV from './syntheticCv';

const CV_TEMPLATES = [
  {
    id: 'french-ats',
    name: 'Modèle ATS Français',
    description: 'Format monocolonne standard, idéal pour le marché français. Simple, clair et 100% lisible par les robots de recrutement.',
    previewColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    latex: `\\documentclass[11pt,a4paper]{article}

% Packages
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[french]{babel}
\\usepackage{hyperref}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{parskip}

\\setlist[itemize]{leftmargin=*,nosep}

\\begin{document}

% Title / Header
\\noindent {\\LARGE \\textbf{Prénom NOM}} \\hfill \\textbf{Permis B} \\\\
\\noindent Ville, Pays \\hfill +33 6 00 00 00 00 \\\\
\\noindent \\href{mailto:email@example.com}{email@example.com} \\hfill
\\href{https://linkedin.com/in/profil}{linkedin.com/in/profil} \\hfill
\\href{https://github.com/profil}{github.com/profil} \\\\
\\vspace{0.3cm}
\\noindent \\textbf{Titre du poste visé}

% Section : Résumé
\\section*{Résumé Professionnel}
[Votre résumé professionnel ici. 3-4 lignes maximum mettant en valeur vos années d'expérience et compétences clés.]

% Section : Compétences
\\section*{Compétences}
\\begin{itemize}
    \\item \\textbf{Catégorie 1 :} Compétence 1, Compétence 2, Compétence 3.
    \\item \\textbf{Catégorie 2 :} Compétence 4, Compétence 5, Compétence 6.
    \\item \\textbf{Langues :} Français (Maternel), Anglais (Courant).
\\end{itemize}

% Section : Expériences
\\section*{Expériences Professionnelles}

\\subsection*{Nom de l'Entreprise \\hfill Titre du Poste}
\\vspace{-0.2cm}
\\noindent Mois/Année -- Présent
\\begin{itemize}
    \\item Réalisation principale 1 avec indicateur de performance.
    \\item Réalisation principale 2 avec outil utilisé.
    \\item Réalisation principale 3 avec contexte.
\\end{itemize}

% Section : Éducation
\\section*{Éducation \\& Certifications}

\\begin{itemize}
    \\item \\textbf{Diplôme obtenu / Titre} -- Établissement \\hfill Année d'obtention
    \\item \\textbf{Certification} -- Organisme certificateur \\hfill Année
\\end{itemize}

\\end{document}`
  },
  {
    id: 'worldwide-ats',
    name: 'Modèle ATS International',
    description: `Basé sur "Jake's Resume", le standard mondial. Très dense, structuré avec des lignes de séparation. Parfait pour les entreprises anglo-saxonnes ou la tech.`,
    previewColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    latex: `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING-----------------
\\begin{center}
    \\textbf{\\Huge \\scshape First Last} \\\\ \\vspace{1pt}
    123 Street Name, City, State 12345 \\\\
    (123) 456-7890 $|$ \\href{mailto:email@example.com}{\\underline{email@example.com}} $|$ 
    \\href{https://linkedin.com/in/username}{\\underline{linkedin.com/in/username}} $|$
    \\href{https://github.com/username}{\\underline{github.com/username}}
\\end{center}

%-----------EDUCATION-----------------
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{University Name} & City, State \\\\
        \\textit{Degree Name in Major} & Aug. 2018 -- May 2022 \\\\
      \\end{tabular*}
  \\end{itemize}

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{Company Name} & City, State \\\\
        \\textit{Job Title} & June 2022 -- Present \\\\
      \\end{tabular*}\\vspace{-7pt}
      \\begin{itemize}
        \\item Accomplishment 1 using X, Y, and Z.
        \\item Accomplishment 2 resulting in X\\% improvement.
      \\end{itemize}
  \\end{itemize}

%-----------PROJECTS-----------------
\\section{Projects}
    \\begin{itemize}[leftmargin=0.15in, label={}]
      \\item
        \\textbf{Project Name} $|$ \\emph{Technologies Used} \\\\
        \\begin{itemize}
          \\item Project detail 1.
          \\item Project detail 2.
        \\end{itemize}
    \\end{itemize}

%-----------TECHNICAL SKILLS-----------------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\item{
     \\textbf{Languages}{: Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS} \\\\
     \\textbf{Frameworks}{: React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI} \\\\
     \\textbf{Developer Tools}{: Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse}
    }
 \\end{itemize}

\\end{document}`
  },
  {
    id: 'synthetic-base',
    name: 'Notre Modèle Base',
    description: "Le template d'origine fourni avec l'outil. Format compact avec des titres encadrés d'une ligne.",
    previewColor: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    latex: SYNTHETIC_CV
  }
];

export default CV_TEMPLATES;
