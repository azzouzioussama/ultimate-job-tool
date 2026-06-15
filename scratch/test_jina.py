import urllib.request

def scrape_jina(url):
    print(f"\n--- Jina AI on: {url} ---")
    req = urllib.request.Request(f"https://r.jina.ai/{url}")
    try:
        response = urllib.request.urlopen(req)
        md = response.read().decode('utf-8')
        
        # very simple print of all urls to see what Jina actually extracted
        import re
        links = re.findall(r'\]\((https?://[^\s\)]+)\)', md)
        job_links = [l.split('?')[0] for l in links if 'job' in l.lower() or 'emploi' in l.lower()]
        
        print(f"Total links found: {len(links)}")
        print(f"Job links found: {len(set(job_links))}")
        if job_links:
            print(f"Sample: {list(set(job_links))[:3]}")
    except Exception as e:
        print(f"Error: {e}")

scrape_jina("https://www.linkedin.com/jobs/search/?keywords=helpdesk")
scrape_jina("https://fr.indeed.com/jobs?q=helpdesk&l=France")
scrape_jina("https://www.free-work.com/fr/tech-it/jobs?query=helpdesk")
scrape_jina("https://www.welcometothejungle.com/fr/jobs?query=helpdesk")
