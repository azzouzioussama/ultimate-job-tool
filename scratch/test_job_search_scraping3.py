import sys
import traceback
from scrapling.fetchers import Fetcher, StealthyFetcher
from urllib.parse import urljoin

urls = {
    "hellowork": "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=Technicien+helpdesk",
    "indeed": "https://fr.indeed.com/jobs?q=helpdesk&l=France",
    "linkedin": "https://www.linkedin.com/jobs/search/?keywords=technicien%20informatique",
    "freework": "https://www.free-work.com/fr/tech-it/jobs?query=helpdesk"
}

def extract_links(page, url, site):
    links = []
    if site == "linkedin":
        for a_tag in page.css('a'):
            href = a_tag.attrib.get('href')
            if href and '/jobs/view/' in href:
                base = urljoin(url, href).split('?')[0]
                if base not in links: links.append(base)
    elif site == "hellowork":
        for a_tag in page.css('a'):
            href = a_tag.attrib.get('href')
            if href and '/fr-fr/emplois/' in href and href.endswith('.html'):
                base = urljoin(url, href).split('?')[0]
                if base not in links: links.append(base)
    elif site == "indeed":
        for a_tag in page.css('a[data-jk]'):
            jk = a_tag.attrib.get('data-jk')
            if jk:
                base = f"https://fr.indeed.com/viewjob?jk={jk}"
                if base not in links: links.append(base)
    elif site == "freework":
        for a_tag in page.css('a'):
            href = a_tag.attrib.get('href')
            if href and '/jobs/' in href and not href.endswith('/jobs'):
                base = urljoin(url, href).split('?')[0]
                if base not in links: links.append(base)
    return links

def test_fetchers():
    for name, url in urls.items():
        print(f"\n=== Testing {name} ===")
        links = []
        
        try:
            print("1. Trying basic Fetcher...")
            page = Fetcher().get(url)
            print(f"Status: {page.status}")
            links = extract_links(page, url, name)
            print(f"Fetcher found {len(links)} links.")
        except Exception as e:
            print(f"Fetcher failed: {e}")
            
        if len(links) == 0:
            try:
                print("2. Trying StealthyFetcher...")
                page = StealthyFetcher.fetch(url, headless=True)
                print(f"Status: {page.status}")
                links = extract_links(page, url, name)
                print(f"StealthyFetcher found {len(links)} links.")
            except Exception as e:
                print(f"StealthyFetcher failed: {e}")

if __name__ == "__main__":
    test_fetchers()
