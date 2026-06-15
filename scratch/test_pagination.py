import sys
from scrapling.fetchers import Fetcher
import urllib.parse
from urllib.parse import urljoin
import time

def extract_links_from_page(page, url_origin):
    extracted = []
    if "linkedin.com" in url_origin:
        for a_tag in page.css('a'):
            href = a_tag.attrib.get('href')
            if href and '/jobs/view/' in href:
                base_url = urljoin(url_origin, href).split('?')[0]
                if base_url not in extracted: extracted.append(base_url)
    elif "indeed.com" in url_origin:
        for a_tag in page.css('a[data-jk]'):
            jk = a_tag.attrib.get('data-jk')
            if jk:
                base_url = f"https://fr.indeed.com/viewjob?jk={jk}"
                if base_url not in extracted: extracted.append(base_url)
    elif "hellowork.com" in url_origin:
        for a_tag in page.css('a'):
            href = a_tag.attrib.get('href')
            if href and '/fr-fr/emplois/' in href and href.endswith('.html'):
                base_url = urljoin(url_origin, href).split('?')[0]
                if base_url not in extracted: extracted.append(base_url)
    return extracted

def test_pagination():
    # Test LinkedIn Deep
    url = "https://www.linkedin.com/jobs/search/?keywords=technicien%20informatique"
    parsed = urllib.parse.urlparse(url)
    base_api = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?{parsed.query}"
    
    links = []
    fetcher = Fetcher()
    for start_offset in range(0, 100, 25): # Test 4 pages
        page_url = f"{base_api}&start={start_offset}"
        print(f"Fetching LinkedIn offset {start_offset}...")
        page = fetcher.get(page_url)
        if page.status != 200:
            print(f"Status {page.status}, breaking.")
            break
        page_links = extract_links_from_page(page, "https://www.linkedin.com")
        if not page_links:
            print("No links found, breaking.")
            break
        for link in page_links:
            if link not in links: links.append(link)
        print(f"Found {len(page_links)} links on this page.")
        time.sleep(1)
        
    print(f"Total LinkedIn links found: {len(links)}")

    # Test Indeed Deep
    url = "https://fr.indeed.com/jobs?q=helpdesk&l=France"
    links = []
    for start_offset in range(0, 30, 10):
        page_url = f"{url}&start={start_offset}"
        print(f"Fetching Indeed offset {start_offset}...")
        page = fetcher.get(page_url)
        page_links = extract_links_from_page(page, url)
        for link in page_links:
            if link not in links: links.append(link)
        print(f"Found {len(page_links)} links on this page.")
        time.sleep(1)
    print(f"Total Indeed links found: {len(links)}")

if __name__ == "__main__":
    test_pagination()
