const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded successfully.');
    
    // Check if the root element has children
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    if (!rootHtml) {
      console.log('ROOT IS EMPTY (Blank Screen)');
    } else {
      console.log('ROOT HTML snippet:', rootHtml.substring(0, 150) + '...');
    }
  } catch (err) {
    console.log('NAVIGATION ERROR:', err.message);
  }

  await browser.close();
})();
