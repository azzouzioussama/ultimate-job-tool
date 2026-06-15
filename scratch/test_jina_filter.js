async function run() {
  const urls = [
    "https://www.linkedin.com/jobs/search/?keywords=helpdesk",
    "https://www.free-work.com/fr/tech-it/jobs?query=helpdesk",
    "https://www.welcometothejungle.com/fr/jobs?query=helpdesk"
  ];
  
  for (const url of urls) {
    console.log(`\n--- Testing ${url} ---`);
    const response = await fetch(`https://r.jina.ai/${url}`);
    const md = await response.text();
    
    const linkRegex = /\]\((https?:\/\/[^\s\)]+)\)/g;
    const extracted = [];
    let match;
    while ((match = linkRegex.exec(md)) !== null) {
      const parsedUrl = match[1].split('?')[0];
      const lower = parsedUrl.toLowerCase();
      
      // better filtering
      if (
        lower.includes('/jobs/view/') || 
        lower.includes('indeed.com/viewjob') ||
        (lower.includes('hellowork.com') && lower.includes('/emplois/')) ||
        (lower.includes('free-work.com') && lower.includes('/job-mission/')) ||
        (lower.includes('welcometothejungle.com') && lower.includes('/jobs/')) ||
        (lower.includes('/jobs/') && !lower.endsWith('/jobs/')) ||
        (lower.includes('/job/')) ||
        (lower.includes('/emploi')) ||
        (lower.includes('/offres/'))
      ) {
        if (!extracted.includes(parsedUrl)) {
          extracted.push(parsedUrl);
        }
      }
    }
    console.log(`Found ${extracted.length} job links.`);
    if (extracted.length > 0) {
      extracted.slice(0, 3).forEach(l => console.log(` - ${l}`));
    }
  }
}
run();
