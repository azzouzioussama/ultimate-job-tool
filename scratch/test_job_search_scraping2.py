import sys
from scrapling.fetchers import StealthyFetcher
from urllib.parse import urljoin

indeed_url = "https://fr.indeed.com/jobs?q=helpdesk&l=France"
freework_url = "https://www.free-work.com/fr/tech-it/jobs?query=helpdesk&locations=fr~~~"

try:
    print("--- Indeed ---")
    page = StealthyFetcher.fetch(indeed_url, headless=True)
    
    # Indeed often uses a elements with data-jk attribute for the job cards
    elements = page.css('a[data-jk]')
    print(f"Found {len(elements)} data-jk links.")
    for el in elements[:3]:
        jk = el.attrib.get('data-jk')
        if jk:
            print(f"https://fr.indeed.com/viewjob?jk={jk}")
            
    # Or class starting with jcs-JobTitle
    title_links = page.css('.jcs-JobTitle')
    print(f"Found {len(title_links)} jcs-JobTitle links.")
    for el in title_links[:3]:
        print(urljoin(indeed_url, el.attrib.get('href', '')))
        
    print("\n--- Free-work ---")
    page2 = StealthyFetcher.fetch(freework_url, headless=True)
    
    # In Free-work, job links might be inside a specific container or have a specific class.
    # Usually job links are in a list, let's look for article or div.
    articles = page2.css('article a')
    print(f"Found {len(articles)} links in articles")
    for el in articles[:5]:
        href = el.attrib.get('href', '')
        if href:
            print(urljoin(freework_url, href))
            
    # Or look for div.job-card
    job_links = []
    for a in page2.css('a'):
        href = a.attrib.get('href', '')
        if href and '/fr/tech-it/jobs/' in href and not href.endswith('/jobs'):
            # filter out locations or categories
            # jobs usually have an id at the end, or are longer slugs
            job_links.append(href)
            
    # remove duplicates
    job_links = list(set(job_links))
    print(f"Found {len(job_links)} job links overall. Sample:")
    for h in job_links[:5]:
        print(h)
            
except Exception as e:
    print(f"Error: {e}")
