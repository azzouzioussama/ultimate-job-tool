import os
import time
import urllib.parse
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scrapling.fetchers import Fetcher, StealthyFetcher
import markdownify
from urllib.parse import urljoin

app = FastAPI(title="Scrapling Proxy Server")

# Configure CORS to allow local frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

class SearchScrapeRequest(BaseModel):
    url: str

@app.post("/scrape")
async def scrape_url(request: ScrapeRequest):
    url = request.url
    print(f"\n--- New scrape request for URL: {url} ---")
    
    page = None
    errors = []
    
    # 1. Try fast HTTP Fetcher (with curl_cffi TLS fingerprint impersonation)
    try:
        print("Attempting scraping with standard Fetcher...")
        fetcher = Fetcher()
        page = fetcher.get(url)
        print(f"Standard Fetcher response status: {page.status}")
        if page.status != 200:
            raise Exception(f"HTTP status code {page.status}")
    except Exception as e:
        error_msg = f"Standard Fetcher failed: {str(e)}"
        print(error_msg)
        errors.append(error_msg)
        page = None

    # 2. Fallback to StealthyFetcher (Playwright-based browser rendering) if standard Fetcher failed
    if not page:
        try:
            print("Falling back to StealthyFetcher...")
            page = StealthyFetcher.fetch(url, headless=True)
            print(f"StealthyFetcher response status: {page.status}")
            if page.status != 200:
                raise Exception(f"HTTP status code {page.status}")
        except Exception as e:
            error_msg = f"StealthyFetcher failed: {str(e)}"
            print(error_msg)
            errors.append(error_msg)
            page = None

    if not page:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to scrape URL using all available methods. Errors: {'; '.join(errors)}"
        )

    # 3. Extract description using selectors
    selectors = [
        '.show-more-less-html__markup',  # Public LinkedIn job description
        '.jobs-description__content',    # Member/Logged-in LinkedIn description
        '.jobs-description',             # General LinkedIn description fallback
        'article',                       # Semantic article container
        'main'                           # Main page content
    ]
    
    extracted_html = None
    matched_selector = None
    
    for selector in selectors:
        elements = page.css(selector)
        if elements:
            extracted_html = elements[0].get()
            matched_selector = selector
            print(f"Successfully extracted content using selector: {selector}")
            break
            
    if extracted_html:
        # Convert HTML container to clean Markdown
        md = markdownify.markdownify(str(extracted_html))
        return {
            "success": True,
            "markdown": md.strip(),
            "selector": matched_selector,
            "url": url
        }
    else:
        # If no specific container is found, fall back to converting the entire body
        print("No description selectors matched. Converting the full body.")
        body_elements = page.css('body')
        if body_elements:
            md = markdownify.markdownify(str(body_elements[0].get()))
            return {
                "success": True,
                "markdown": md.strip(),
                "selector": "body",
                "url": url
            }
        else:
            # Absolute fallback
            md = markdownify.markdownify(str(page.html_content))
            return {
                "success": True,
                "markdown": md.strip(),
                "selector": "raw_html",
                "url": url
            }

@app.post("/scrape-search")
def scrape_search_url(request: SearchScrapeRequest):
    url = request.url
    print(f"\n--- New search scrape request for URL: {url} ---")
    
    try:
        # Pre-process URLs if necessary
        if "linkedin.com/jobs/search-results/" in url:
            url = url.replace("/search-results/", "/search/")
            print(f"Converted LinkedIn URL to bypass auth wall: {url}")
            
        def extract_links_from_page(page, url_origin):
            extracted = []
            if "linkedin.com" in url_origin:
                for a_tag in page.css('a'):
                    href = a_tag.attrib.get('href')
                    if href and '/jobs/view/' in href:
                        base_url = urljoin(url_origin, href).split('?')[0]
                        if base_url not in extracted: extracted.append(base_url)
            elif "hellowork.com" in url_origin:
                for a_tag in page.css('a'):
                    href = a_tag.attrib.get('href')
                    if href and '/fr-fr/emplois/' in href and href.endswith('.html'):
                        base_url = urljoin(url_origin, href).split('?')[0]
                        if base_url not in extracted: extracted.append(base_url)
            elif "indeed.com" in url_origin:
                for a_tag in page.css('a[data-jk]'):
                    jk = a_tag.attrib.get('data-jk')
                    if jk:
                        base_url = f"https://fr.indeed.com/viewjob?jk={jk}"
                        if base_url not in extracted: extracted.append(base_url)
            elif "free-work.com" in url_origin:
                for a_tag in page.css('a'):
                    href = a_tag.attrib.get('href')
                    if href and '/jobs/' in href and not href.endswith('/jobs'):
                        base_url = urljoin(url_origin, href).split('?')[0]
                        if base_url not in extracted: extracted.append(base_url)
            else:
                for a_tag in page.css('a'):
                    href = a_tag.attrib.get('href')
                    if href and ('/job/' in href or '/jobs/' in href or '/emploi/' in href or '/offres/' in href):
                        base_url = urljoin(url_origin, href).split('?')[0]
                        if base_url not in extracted: extracted.append(base_url)
            return extracted

        links = []
        fetcher = Fetcher()
        
        # 1. LinkedIn Hidden API Pagination
        if "linkedin.com" in url:
            parsed = urllib.parse.urlparse(url)
            base_api = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?{parsed.query}"
            print("Using LinkedIn seeMoreJobPostings API for deep pagination...")
            for start_offset in range(0, 1000, 25): # Try up to 40 pages (1000 jobs)
                page_url = f"{base_api}&start={start_offset}"
                try:
                    page = fetcher.get(page_url)
                    if page.status != 200: break
                    page_links = extract_links_from_page(page, "https://www.linkedin.com")
                    if not page_links: break
                    for link in page_links:
                        if link not in links: links.append(link)
                    print(f"LinkedIn offset {start_offset}: found {len(page_links)} links.")
                    time.sleep(0.5)
                except Exception as e:
                    print(f"LinkedIn pagination failed at {start_offset}: {e}")
                    break

        # 2. Indeed Pagination
        elif "indeed.com" in url:
            for start_offset in range(0, 50, 10): # 5 pages max
                separator = "&" if "?" in url else "?"
                page_url = f"{url}{separator}start={start_offset}"
                try:
                    page = fetcher.get(page_url)
                    if page.status != 200: break
                    page_links = extract_links_from_page(page, url)
                    if not page_links:
                        # Fallback to StealthyFetcher if Fetcher gets blocked by Cloudflare on pagination
                        print(f"Indeed: Fetcher found 0 links on offset {start_offset}. Trying StealthyFetcher...")
                        page = StealthyFetcher.fetch(page_url, headless=True)
                        page_links = extract_links_from_page(page, url)
                        if not page_links: break
                    for link in page_links:
                        if link not in links: links.append(link)
                    print(f"Indeed offset {start_offset}: found {len(page_links)} links.")
                    time.sleep(1)
                except Exception:
                    break

        # 3. HelloWork Pagination
        elif "hellowork.com" in url:
            for page_num in range(1, 6): # 5 pages max
                separator = "&" if "?" in url else "?"
                page_url = f"{url}{separator}p={page_num}"
                try:
                    page = fetcher.get(page_url)
                    if page.status != 200: break
                    page_links = extract_links_from_page(page, url)
                    if not page_links: break
                    for link in page_links:
                        if link not in links: links.append(link)
                    print(f"HelloWork page {page_num}: found {len(page_links)} links.")
                    time.sleep(0.5)
                except Exception:
                    break

        # 4. Free-Work Pagination
        elif "free-work.com" in url:
            for page_num in range(1, 6): # 5 pages max
                separator = "&" if "?" in url else "?"
                page_url = f"{url}{separator}page={page_num}"
                try:
                    page = fetcher.get(page_url)
                    if page.status != 200: break
                    page_links = extract_links_from_page(page, url)
                    if not page_links: break
                    for link in page_links:
                        if link not in links: links.append(link)
                    print(f"Free-Work page {page_num}: found {len(page_links)} links.")
                    time.sleep(0.5)
                except Exception:
                    break

        # 5. Standard Fetcher or StealthyFetcher Fallback for others (or if something failed)
        if not links:
            try:
                print("Attempting with fast Fetcher...")
                page = fetcher.get(url)
                links = extract_links_from_page(page, url)
            except Exception as e:
                print(f"Fetcher failed: {e}")
                
            if not links:
                try:
                    print("Falling back to StealthyFetcher...")
                    page = StealthyFetcher.fetch(url, headless=True)
                    links = extract_links_from_page(page, url)
                except Exception as e:
                    print(f"StealthyFetcher failed: {e}")

        print(f"Found a total of {len(links)} unique job links.")
        return {"success": True, "links": links, "url": url}
    except Exception as e:
        error_msg = f"Search scraping failed completely: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    print("Starting Scrapling Proxy Server on http://localhost:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
