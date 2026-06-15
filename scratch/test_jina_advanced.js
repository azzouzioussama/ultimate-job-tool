async function run() {
  const url = "https://www.welcometothejungle.com/fr/jobs?query=helpdesk";
  console.log(`\n--- Testing ${url} with advanced Jina headers ---`);
  
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 
        'x-timeout': '10',
        'x-remove-selector': '#axeptio_overlay,.axeptio_mount,div[id^="axeptio"]'
      }
    });
    const md = await response.text();
    
    const linkRegex = /\]\((https?:\/\/[^\s\)]+)\)/g;
    const extracted = [];
    let match;
    while ((match = linkRegex.exec(md)) !== null) {
      const parsedUrl = match[1].split('?')[0];
      const lower = parsedUrl.toLowerCase();
      
      if (lower.includes('welcometothejungle.com') && lower.includes('/jobs/')) {
        if (!extracted.includes(parsedUrl)) {
          extracted.push(parsedUrl);
        }
      }
    }
    console.log(`Found ${extracted.length} job links.`);
    if (extracted.length > 0) {
      extracted.slice(0, 10).forEach(l => console.log(` - ${l}`));
    }
  } catch (err) {
    console.log("Error:", err);
  }
}
run();
