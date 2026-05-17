Project Summary: Ultimate Job Hunting Tool

Overview

This project started as a Python script designed to generate tailored ChatGPT/Claude prompts for job applications. Over the course of the development session, we transformed it into a fully functional, browser-based React application named the "Ultimate Job Hunting Tool."

Tech Stack

Frontend Framework: React (scaffolded with Vite)

Styling: Tailwind CSS (v3)

Icons: lucide-react

AI Integration: Google Gemini API (via direct REST calls)

PDF Compilation: TeXLive.net CGI (via hidden HTML form POST requests)

Deployment: Vercel

Development History & Versions

Version 1: The Prompt Generator Web App

Goal: Convert the Python terminal script into a React app.

Features: Single-page interface where the user pastes a Job Description. The app extracts the job title, injects the JD into predefined templates (CV adaptation & Cover Letter), and allows the user to copy or download a .txt file.

Challenges Solved: * Set up Vite and Tailwind CSS. Downgraded Tailwind from v4 to v3 to resolve CLI initialization errors.

Resolved a deployment crash on Vercel where Tailwind's JIT compiler mistook a JavaScript regex /[-:T]/g for an invalid arbitrary CSS class [-:T].

Version 2: Tabbed Interface & Customization

Goal: Allow users to view and edit the default LaTeX CV and prompts without resetting the app.

Features: Introduced a tabbed navigation system (Generate, My CV, Templates).

Challenges Solved:

Addressed a React crash caused by duplicate export default function App() declarations during copy-pasting.

Version 3: The Ultimate Job Hunting Tool (Current State)

Goal: Create a standalone, comprehensive job application assistant.

Features Added:

Anonymized CV: Replaced real user data with a synthetic profile ("Jean DUPONT") to protect privacy while maintaining technical accuracy for the AI.

10 Expert Prompt Templates: Curated a list of 10 strategies (e.g., CV rewrite, Cover Letter, Q&A prep, Harsh Critique, Missing Skills Analysis, LinkedIn Optimization) plus a custom prompt option.

Integrated AI Assistant: Built a direct integration with the Google Gemini API. Users input their own free API key (saved to localStorage), and the app streams AI responses directly into an "Assistant IA" tab.

PDF Compiler: Integrated a feature to compile the LaTeX CV into a PDF directly from the browser.

Challenges Solved:

PDF Iframe Block: Initially attempted to use latexonline.cc inside an iframe, but encountered Cannot POST /compile errors and strict X-Frame-Options browser security blocks.

Solution: Switched the compiler to the official texlive.net server and changed the architecture to submit a hidden POST <form> with target="_blank". This bypasses iframe restrictions and safely opens the generated PDF in a new browser tab.

Current Application Structure (src/App.jsx)

The entire application is currently self-contained within a single React file (App.jsx). It manages multiple states for tabs, form inputs, AI loading phases, and dynamically replaces variables like {cv_content} and {job_description} before sending them to the Gemini API.