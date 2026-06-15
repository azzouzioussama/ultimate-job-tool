import sys
from scrapling.fetchers import StealthyFetcher

def test_wttj_stealthy():
    url = "https://www.welcometothejungle.com/fr/jobs?query=helpdesk"
    print("Testing StealthyFetcher with wait...")
    # Does scrapling StealthyFetcher accept wait_until?
    try:
        page = StealthyFetcher.fetch(url, headless=True, wait_until='networkidle')
        links = [a.attrib.get('href') for a in page.css('a')]
        job_links = [l for l in links if l and ('/jobs/' in l or '/emploi/' in l or '/offres/' in l)]
        print(f"Total job links: {len(job_links)}")
        if job_links: print(f"Sample: {job_links[:3]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_wttj_stealthy()
