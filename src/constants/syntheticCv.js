/**
 * ============================================================================
 * FILE: syntheticCv.js
 * PURPOSE: Contains the fake/anonymized CV template used as a safe default.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This is a fake CV written in LaTeX format. It uses made-up names, phone
 * numbers, and company names so the user's real identity is never exposed.
 *
 * WHY DOES IT EXIST?
 * The app has a "dual CV" system:
 *   1. "CV Original" — the user's real CV (private, stored locally).
 *   2. "CV Généré"  — the AI-adapted version for a specific job.
 *
 * This SYNTHETIC_CV is used as the DEFAULT value for "CV Original" so that
 * when a new user opens the app, they see a working example instead of a
 * blank screen. It also serves as a "reset" target — the user can click
 * "Rétablir CV Fake" to go back to this safe template.
 *
 * HOW TO EDIT:
 * - This is standard LaTeX code. If you change it, make sure the LaTeX
 *   compiles correctly (test it in the app's PDF Maker tab).
 * - IMPORTANT: In JavaScript strings, backslashes must be doubled.
 *   For example, LaTeX's \textbf{} is written as \\textbf{} here.
 * - IMPORTANT: The '&' character must be escaped as \\& in LaTeX.
 */

const SYNTHETIC_CV = `\\documentclass[a4paper,10pt]{article}

% --- Paquets ---
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[french]{babel}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

% --- Configuration ---
\\hypersetup{colorlinks=true, urlcolor=blue}
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

\\begin{document}

% --- En-tête ---
\\begin{center}
    {\\Huge \\textbf{Jean DUPONT}} \\\\
    \\vspace{4pt}
    Île-de-France, France | \\textbf{Permis B} \\\\
    +33 6 12 34 56 78 | \\href{mailto:jean.dupont@email.fake}{jean.dupont@email.fake} \\\\
    \\href{https://linkedin.com/in/jeandupont-fake}{linkedin.com/in/jeandupont-fake} | \\href{https://github.com/jeandupont-fake}{github.com/jeandupont-fake} \\\\
    \\vspace{6pt}
    \\textbf{\\Large Technicien Support Informatique \\& Systèmes}
\\end{center}

\\section{Résumé Professionnel}
Technicien support rigoureux doté d'un excellent sens du relationnel. Spécialisé dans le support de proximité et la gestion d'environnements hybrides (AD/M365). Mon expérience actuelle m'a forgé une solide résistance au stress, tandis que mon expertise technique acquise chez TechCorp me permet d'automatiser la résolution d'incidents via le scripting. Orienté satisfaction utilisateur et respect des SLA.

\\section{Compétences Support \\& Techniques}
\\begin{itemize}[leftmargin=0.15in, labelsep=0.5em]
    \\item \\textbf{Support \\& Helpdesk :} Gestion d'incidents via Jira / GLPI, diagnostic matériel/logiciel, prise en main à distance (TeamViewer).
    \\item \\textbf{Administration Système :} Active Directory (GPO, OU, DNS), Microsoft Entra ID (Azure AD), Microsoft 365, Microsoft Intune (MDM).
    \\item \\textbf{Réseau \\& Connectivité :} Dépannage IPv4, DNS, DHCP, VPN, pare-feu.
    \\item \\textbf{Langues :} Français (Maternel), Anglais (Courant - C1).
\\end{itemize}

\\section{Expériences Professionnelles}

\\textbf{RetailStore France} | \\textit{Responsable de point de vente} \\hfill \\textit{01/2025 -- Présent}
\\begin{itemize}[noitemsep]
    \\item \\textbf{Service Client :} Gestion des situations complexes et résolution de conflits.
    \\item \\textbf{Support Niveau 1 :} Diagnostic sur les systèmes d'encaissement et terminaux (TPE).
\\end{itemize}

\\textbf{TechCorp Internationale} | \\textit{Stagiaire Support Technique \\& Automatisation} \\hfill \\textit{04/2024 -- 10/2024}
\\begin{itemize}[noitemsep]
    \\item \\textbf{Support Client :} Support technique pour des clients européens.
    \\item \\textbf{Fiabilisation :} Validation de services Cloud pour la continuité en production.
\\end{itemize}

\\section{Projets Techniques (Labs)}
\\textbf{Lab Infrastructure Entreprise Hybride}
\\begin{itemize}[noitemsep, topsep=2pt]
    \\item Déploiement d'un DC (Windows Server 2022), masterisation de postes Windows 10 Pro.
    \\item Résolution d'incidents (verrouillages, DNS) et gestion de comptes via Active Directory.
\\end{itemize}

\\section{Éducation \\& Certifications}
\\begin{itemize}[leftmargin=0.15in, labelsep=0.5em]
    \\item \\textbf{Certifications :} AWS Certified Cloud Practitioner.
    \\item \\textbf{Master 2 Informatique :} Université de Paris \\hfill \\textit{2024}
\\end{itemize}

\\end{document}`;

export default SYNTHETIC_CV;
