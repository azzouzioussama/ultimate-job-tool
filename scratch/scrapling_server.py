import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scrapling.fetchers import Fetcher, StealthyFetcher
import markdownify

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

if __name__ == "__main__":
    print("Starting Scrapling Proxy Server on http://localhost:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
