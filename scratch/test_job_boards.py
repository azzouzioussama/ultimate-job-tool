import sys
from scrapling.fetchers import Fetcher, StealthyFetcher
import time

def test_freework():
    print("\n--- Testing Free-Work ---")
    url = "https://www.free-work.com/fr/tech-it/jobs?query=helpdesk"
    # Try page 1
    page = Fetcher().get(url)
    links = [a.attrib.get('href') for a in page.css('a') if a.attrib.get('href') and '/jobs/' in a.attrib.get('href')]
    print(f"Page 1 status: {page.status}, Links: {len(links)}")
    
    # Try page 2 (guess ?page=2)
    page2 = Fetcher().get(url + "&page=2")
    links2 = [a.attrib.get('href') for a in page2.css('a') if a.attrib.get('href') and '/jobs/' in a.attrib.get('href')]
    print(f"Page 2 status: {page2.status}, Links: {len(links2)}")

def test_indeed():
    print("\n--- Testing Indeed ---")
    url = "https://fr.indeed.com/jobs?q=helpdesk&l=France&start=10"
    print("Trying Fetcher...")
    page = Fetcher().get(url)
    links = [a.attrib.get('data-jk') for a in page.css('a[data-jk]')]
    print(f"Fetcher status: {page.status}, Links: {len(links)}")
    
    if not links:
        print("Trying StealthyFetcher...")
        page2 = StealthyFetcher.fetch(url, headless=True)
        links2 = [a.attrib.get('data-jk') for a in page2.css('a[data-jk]')]
        print(f"Stealthy status: {page2.status}, Links: {len(links2)}")

def test_welcometothejungle():
    print("\n--- Testing Welcome To The Jungle ---")
    url = "https://www.welcometothejungle.com/fr/jobs?query=helpdesk"
    print("Trying Fetcher...")
    page = Fetcher().get(url)
    links = [a.attrib.get('href') for a in page.css('a')]
    job_links = [l for l in links if l and ('/jobs/' in l or '/emploi/' in l or '/offres/' in l)]
    print(f"Fetcher status: {page.status}, Total links: {len(links)}, Job links: {len(job_links)}")
    
    if not job_links:
        print("Trying StealthyFetcher...")
        page2 = StealthyFetcher.fetch(url, headless=True)
        links2 = [a.attrib.get('href') for a in page2.css('a')]
        job_links2 = [l for l in links2 if l and ('/jobs/' in l or '/emploi/' in l or '/offres/' in l)]
        print(f"Stealthy status: {page2.status}, Total links: {len(links2)}, Job links: {len(job_links2)}")
        if job_links2:
            print(f"Sample: {job_links2[:3]}")

if __name__ == "__main__":
    test_freework()
    test_indeed()
    test_welcometothejungle()
