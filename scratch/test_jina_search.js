const fs = require('fs');

async function scrapeJina(searchUrl) {
  console.log(`\n--- Testing Jina AI on: ${searchUrl} ---`);
  try {
    const response = await fetch(`https://r.jina.ai/${searchUrl}`, {
      headers: { 'Accept': 'text/event-stream' }
    });
    if (!response.ok) throw new Error(`Jina AI Error: ${response.status}`);
    const md = await response.text();
    
    const linkRegex = /\]\((https?:\/\/[^\s\)]+)\)/g;
    const extracted = [];
    let match;
    while ((match = linkRegex.exec(md)) !== null) {
      const url = match[1].split('?')[0];
      const lowerUrl = url.toLowerCase();
      
      if (
        lowerUrl.includes('linkedin.com/jobs/view/') ||
        lowerUrl.includes('indeed.com/viewjob') ||
        (lowerUrl.includes('hellowork.com') && lowerUrl.includes('/emplois/') && lowerUrl.endsWith('.html')) ||
        (lowerUrl.includes('/jobs/') && !lowerUrl.endsWith('/jobs')) ||
        lowerUrl.includes('/job/') ||
        lowerUrl.includes('/emploi/') ||
        lowerUrl.includes('/offres/')
      ) {
        if (!extracted.includes(url)) {
          extracted.push(url);
        }
      }
    }
    console.log(`Found ${extracted.length} job links.`);
    if (extracted.length > 0) {
      console.log(`Sample links:`);
      extracted.slice(0, 3).forEach(l => console.log(` - ${l}`));
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function run() {
  await scrapeJina("https://www.linkedin.com/jobs/search/?keywords=helpdesk");
  await scrapeJina("https://fr.indeed.com/jobs?q=helpdesk&l=France");
  await scrapeJina("https://www.free-work.com/fr/tech-it/jobs?query=helpdesk");
  await scrapeJina("https://www.welcometothejungle.com/fr/jobs?query=helpdesk");
}

run();
