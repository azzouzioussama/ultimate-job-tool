/**
 * ============================================================================
 * FILE: scraperService.js
 * PURPOSE: Extracts job descriptions from URLs using Jina AI or Scrapfly.
 * ============================================================================
 *
 * WHAT IS THIS?
 * Instead of manually copy-pasting a job description, the user can paste
 * a URL from a job board (LinkedIn, Indeed, HelloWork, etc.) and this
 * service will fetch and extract the job description text.
 *
 * TWO SCRAPERS ARE SUPPORTED:
 *   1. Jina AI (free)   — Converts any web page to Markdown text.
 *                          Downside: returns the ENTIRE page (menus, footers, ads).
 *                          We fix this with `cleanJinaMarkdown()`.
 *   2. Scrapfly (paid)  — A professional scraping API with AI-powered extraction.
 *                          It uses a `job_posting` model to parse structured data.
 *                          Much cleaner results, but requires an API key.
 *
 * HOW TO ADD A NEW SCRAPER:
 * 1. Create a new function (e.g., `scrapeWithBrightData(url, apiKey)`).
 * 2. Follow the same pattern: take URL → return extracted text string.
 * 3. Add a new option in the scraper type dropdown in JobOfferTab.jsx.
 * 4. Add an `else if` branch in the `scrapeJobUrl()` function.
 */

// ─── Jina AI Scraper ──────────────────────────────────────────────────────────

/**
 * Scrape a job URL using Jina AI's free reader service.
 * Jina converts any web page into Markdown text.
 *
 * KNOWN LIMITATION: Jina is blocked by Cloudflare on sites like Indeed.
 * The calling code should check for Indeed URLs BEFORE calling this function.
 *
 * @param {string} url - The full URL of the job posting.
 * @returns {Promise<string>} Cleaned job description text.
 * @throws {Error} If the URL is blocked or the request fails.
 */
export async function scrapeWithJina(url, signal) {
  // Safety check: Indeed blocks Jina with a 403 Cloudflare challenge
  if (url.toLowerCase().includes('indeed.com')) {
    throw new Error(
      "Jina AI est bloqué par les protections anti-bot (Cloudflare) d'Indeed. " +
      "Veuillez sélectionner 'Scrapfly (Clé API)' pour ce site."
    );
  }

  // Jina's reader API: prefix any URL with "https://r.jina.ai/" to get Markdown
  const response = await fetch(`https://r.jina.ai/${url}`, { signal });

  if (!response.ok) {
    throw new Error('Erreur HTTP ' + response.status);
  }

  const rawMarkdown = await response.text();

  // The raw Markdown contains the entire page (menus, footers, cookie banners).
  // We clean it using our custom heuristic function.
  return cleanJinaMarkdown(rawMarkdown);
}

// ─── Scrapfly Scraper ─────────────────────────────────────────────────────────

/**
 * Scrape a job URL using Scrapfly's API with AI-powered extraction.
 * Scrapfly uses a pre-trained `job_posting` model to parse structured
 * job data from messy HTML.
 *
 * NOTE: Requests go through a proxy (/api/scrapfly) defined in vite.config.js
 * (dev) and vercel.json (prod) to avoid CORS issues. See TROUBLESHOOTING.md.
 *
 * @param {string} url    - The full URL of the job posting.
 * @param {string} apiKey - The user's Scrapfly API key (starts with 'scp-live-...').
 * @returns {Promise<string>} The extracted job description text.
 * @throws {Error} If the API returns an error or no data is extracted.
 */
export async function scrapeWithScrapfly(url, apiKey, signal) {
  // Build query parameters for the Scrapfly API
  const params = new URLSearchParams({
    key: apiKey,
    url: url,
    extraction_model: 'job_posting',   // Must be exactly 'job_posting', not 'job'
    render_js: 'true',                 // Enable JavaScript rendering (for SPAs)
    asp: 'true'                        // Anti Scraping Protection (residential proxies)
  });

  // NOTE: We hit "/api/scrapfly" (our proxy), NOT "api.scrapfly.io" directly.
  // The proxy is configured in vite.config.js (dev) and vercel.json (prod).
  const response = await fetch(`/api/scrapfly?${params.toString()}`, { signal });

  if (!response.ok) {
    // Try to extract a meaningful error message from Scrapfly's response
    let errMsg = `Erreur API Scrapfly (${response.status})`;
    try {
      const errData = await response.json();
      if (errData.message) {
        errMsg += `: ${errData.message}`;
      } else if (errData.error && errData.error.message) {
        errMsg += `: ${errData.error.message}`;
      } else if (errData.error) {
        errMsg += `: ${errData.error}`;
      }
    } catch {
      try {
        const errText = await response.text();
        if (errText) errMsg += `: ${errText.slice(0, 150)}`;
      } catch { /* If we can't read the error body, just use the status code */ }
    }
    throw new Error(errMsg);
  }

  const data = await response.json();

  // Scrapfly returns structured data under result.extracted_data.data
  // We specifically want the "jobDescription" field (plain text of the job)
  if (data.result && data.result.extracted_data) {
    const extData = data.result.extracted_data.data || {};
    // Prefer the clean jobDescription field; fall back to full JSON dump
    return extData.jobDescription || JSON.stringify(data.result.extracted_data, null, 2);
  }

  throw new Error("Aucune donnée extraite par le modèle Scrapfly.");
}

// ─── Scrapling Scraper ────────────────────────────────────────────────────────

/**
 * Scrape a job URL using our local Scrapling proxy server.
 *
 * @param {string} url    - The full URL of the job posting.
 * @param {AbortSignal} [signal] - Optional AbortSignal.
 * @returns {Promise<string>} The extracted job description text.
 * @throws {Error} If the server is offline or the scraping fails.
 */
export async function scrapeWithScrapling(url, signal) {
  try {
    const response = await fetch('http://localhost:8000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url }),
      signal
    });

    if (!response.ok) {
      let errMsg = `Erreur API Scrapling (${response.status})`;
      try {
        const errData = await response.json();
        if (errData.detail) {
          errMsg += `: ${errData.detail}`;
        }
      } catch {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (data.success && data.markdown) {
      return data.markdown;
    }
    throw new Error("Format de réponse invalide du serveur Scrapling.");
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    // Network/fetch errors or 502/504 Bad Gateway from Vite proxy
    const isOffline = 
      err.message.includes('Failed to fetch') || 
      err.message.includes('NetworkError') || 
      err.message.includes('502') || 
      err.message.includes('504') ||
      err.message.includes('Connection refused');
      
    if (isOffline) {
      throw new Error(
        "Le serveur Scrapling local est hors ligne. " +
        "Veuillez vous assurer que le serveur Python est démarré en exécutant : " +
        "python3 scratch/scrapling_server.py dans votre terminal."
      );
    }
    throw err;
  }
}



// ─── Jina AI Markdown Cleaner ─────────────────────────────────────────────────

/**
 * Clean up the raw Markdown output from Jina AI Reader.
 *
 * Jina converts the ENTIRE web page to Markdown, which means we get:
 * - Navigation menus (links to Home, About, Login, etc.)
 * - Cookie consent banners ("Nous utilisons des cookies...")
 * - Signup/login forms ("Créez votre compte")
 * - Social media links (Facebook, Twitter, etc.)
 * - Related job listings ("Offres similaires", "Similar Jobs")
 * - Footer links (Copyright, Legal, Privacy Policy)
 *
 * This function uses heuristics (rules of thumb) to strip all that noise
 * and keep only the actual job description content.
 *
 * @param {string} md - Raw Markdown string from Jina AI.
 * @returns {string} Cleaned Markdown with only the job content.
 */
export function cleanJinaMarkdown(md) {
  if (!md) return '';

  const lines = md.split(/\r\n?|\n/);
  const cleaned = [];

  // Regex to detect markdown links like [text](url)
  const linkRegex = /\[.*?\]\(.*?\)/g;

  // ── Cut-off Headings ────────────────────────────────────────────────
  // If we encounter any of these headings, we STOP reading the page.
  // Everything below them is typically "related jobs", "sign up", etc.
  const cutoffHeadings = [
    'ces offres',
    'recherches similaires',
    'recherche similaire',
    'emplois similaires',
    'offres similaires',
    'offres associées',
    'créez votre compte',
    'creez votre compte',
    'activez votre alerte',
    'créer une alerte',
    'creer une alerte',
    'envoyez votre candidature',
    'partager l\'offre',
    'partager cette offre',
    'vous aimerez aussi',
    'autres offres',
    'coach emploi',
    'candidature',
    'postuler en ligne',
    'sign up',
    'create an account',
    'similar jobs',
    'recommended jobs',
    'more jobs',
    'subscribe to',
    'newsletter'
  ];

  for (let line of lines) {
    const trimmed = line.trim();

    // Keep blank lines (they preserve paragraph spacing)
    if (!trimmed) {
      cleaned.push('');
      continue;
    }

    const lower = trimmed.toLowerCase();

    // ── Check for cut-off headings ──────────────────────────────────
    // If the current line is a heading (#, ##, etc.) that matches one
    // of our cut-off keywords, stop processing the rest of the document.
    if (trimmed.startsWith('#') || lower.includes('coach emploi')) {
      const headingText = trimmed.replace(/^#+\s*/, '').toLowerCase();
      const isCutoff = cutoffHeadings.some(
        keyword => headingText.includes(keyword) || lower.includes(keyword)
      );
      if (isCutoff) {
        break; // Stop! Everything below is noise.
      }
    }

    // ── Filter 1: Menu checkboxes ───────────────────────────────────
    // Some sites render checkboxes as "- [x]" or "- [ ]" in Markdown
    if (trimmed === '- [x]' || trimmed === '- [ ]' || trimmed === '* [x]' || trimmed === '* [ ]') {
      continue;
    }

    // ── Filter 2: Social media links ────────────────────────────────
    if (
      lower.includes('facebook.com') ||
      lower.includes('twitter.com') ||
      lower.includes('linkedin.com/company') ||
      lower.includes('youtube.com') ||
      lower.includes('instagram.com') ||
      lower.includes('pinterest.com') ||
      lower.includes('glassdoor')
    ) {
      continue;
    }

    // ── Filter 3: App store download buttons ────────────────────────
    if (lower.includes('play.google.com') || lower.includes('apps.apple.com')) {
      continue;
    }

    // ── Filter 4: Login/signup portal text ───────────────────────────
    if (
      lower.includes('se connecter') ||
      lower.includes('s\'inscrire') ||
      lower.includes('mon espace') ||
      lower.includes('mon profil') ||
      lower.includes('créer un compte') ||
      lower.includes('complétez votre profil') ||
      lower.includes('completez votre profil') ||
      lower.includes('accés recruteur') ||
      lower.includes('acces recruteur') ||
      lower.includes('déconnexion') ||
      lower.includes('deconnexion') ||
      lower.includes('mes candidatures') ||
      lower.includes('mes alertes') ||
      lower.includes('paramètres') ||
      lower.includes('parametres') ||
      lower.includes('créer mon alerte')
    ) {
      continue;
    }

    // ── Filter 5: Lines that are only links (navigation menus) ──────
    // If we remove all [text](url) patterns and nothing is left,
    // the line was just a navigation link.
    const textWithoutLinks = trimmed.replace(linkRegex, '');
    const hasAlphaNumeric = /[a-zA-Z0-9\u00C0-\u00FF]/.test(textWithoutLinks);
    if (!hasAlphaNumeric && trimmed.includes('[')) {
      continue;
    }

    // ── Filter 6: Images ────────────────────────────────────────────
    if (
      trimmed.startsWith('![') ||
      (trimmed.startsWith('[') &&
        (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.gif')))
    ) {
      continue;
    }

    // ── Filter 7: GDPR / cookie / legal text ────────────────────────
    if (
      lower.includes('cookie') ||
      lower.includes('traceur') ||
      lower.includes('cgu') ||
      lower.includes('politique de confidentialité') ||
      lower.includes('privacy policy') ||
      lower.includes('mentions légales') ||
      lower.includes('tous droits réservés') ||
      lower.includes('copyright') ||
      lower.includes('données personnelles') ||
      lower.includes('gérer les traceurs') ||
      lower.includes('continuer sans accepter')
    ) {
      continue;
    }

    // ── Filter 8: Generic UI phrases ────────────────────────────────
    if (
      lower === 'lire dans l\'app' ||
      lower === 'téléchargez l\'app et postulez dans les premiers !' ||
      lower === 'c\'est noté' ||
      lower === 'voir plus' ||
      lower === 'lire la suite' ||
      lower === 'voir plus d\'offres' ||
      lower === 'lien copié' ||
      lower === 'lien copie' ||
      lower.includes("le job l'entreprise") ||
      lower.includes("l'entreprise l'entreprise")
    ) {
      continue;
    }

    // If the line passed all filters, keep it
    cleaned.push(line);
  }

  // Collapse 3+ consecutive blank lines into a maximum of 2
  return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Search Scraper (Job Links) ───────────────────────────────────────────────

/**
 * Scrape a job search page to extract individual job posting URLs.
 * Supports the local Scrapling proxy (deep scraping) or Jina AI (mobile fallback).
 *
 * @param {string} searchUrl - The search page URL to scrape.
 * @param {string} engine - 'scrapling' or 'jina'
 * @param {AbortSignal} [signal] - Optional AbortSignal.
 * @returns {Promise<string[]>} Array of extracted job URLs.
 */
export async function scrapeJobSearchLinks(searchUrl, engine = 'scrapling', signal) {
  if (engine === 'jina') {
    try {
      const response = await fetch(`https://r.jina.ai/${searchUrl}`, {
        signal
      });
      if (!response.ok) throw new Error(`Jina AI Error: ${response.status}`);
      const md = await response.text();
      
      const linkRegex = /\]\((https?:\/\/[^\s\)]+)\)/g;
      const extracted = [];
      let match;
      while ((match = linkRegex.exec(md)) !== null) {
        const url = match[1].split('?')[0]; // Remove query params for cleaner links
        const lowerUrl = url.toLowerCase();
        
        // Skip search index pages
        if (lowerUrl.includes('jobs/search') || lowerUrl.includes('jobs-guest/jobs/api')) continue;

        // Match generic job link patterns
        if (
          lowerUrl.includes('linkedin.com/jobs/view/') ||
          lowerUrl.includes('indeed.com/viewjob') ||
          (lowerUrl.includes('hellowork.com') && lowerUrl.includes('/emplois/')) ||
          (lowerUrl.includes('free-work.com') && lowerUrl.includes('/job-mission/')) ||
          (lowerUrl.includes('welcometothejungle.com') && lowerUrl.includes('/jobs/')) ||
          (lowerUrl.includes('/jobs/') && !lowerUrl.endsWith('/jobs/') && !lowerUrl.endsWith('/jobs')) ||
          lowerUrl.includes('/job/') ||
          lowerUrl.includes('/emploi/') ||
          lowerUrl.includes('/offres/')
        ) {
          if (!extracted.includes(url)) {
            extracted.push(url);
          }
        }
      }
      return extracted;
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      throw new Error(`Erreur Jina AI : ${err.message}`);
    }
  }

  // Default Scrapling logic
  try {
    const response = await fetch('http://localhost:8000/scrape-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: searchUrl }),
      signal
    });

    if (!response.ok) {
      let errMsg = `Erreur API Scrapling (${response.status})`;
      try {
        const errData = await response.json();
        if (errData.detail) {
          errMsg += `: ${errData.detail}`;
        }
      } catch {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (data.success && Array.isArray(data.links)) {
      return data.links;
    }
    throw new Error("Format de réponse invalide du serveur Scrapling.");
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    const isOffline = 
      err.message.includes('Failed to fetch') || 
      err.message.includes('NetworkError') || 
      err.message.includes('Connection refused');
      
    if (isOffline) {
      throw new Error(
        "Le serveur Scrapling local est hors ligne. " +
        "Démarrez-le avec : python3 scratch/scrapling_server.py"
      );
    }
    throw err;
  }
}
