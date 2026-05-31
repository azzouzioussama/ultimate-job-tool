import sys
import os
from scrapling.fetchers import StealthyFetcher

url = "https://www.linkedin.com/jobs/view/4420434397/"
print(f"Scraping: {url}")

try:
    page = StealthyFetcher.fetch(url, headless=True)
    print("Status code:", page.status)
    
    # Ensure scratch directory exists
    os.makedirs("scratch", exist_ok=True)
    
    # Save raw HTML to file
    html_path = "scratch/linkedin_4420434397.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(page.html)
        
    print(f"Successfully saved to {html_path}")
    print(f"HTML size: {len(page.html)} characters")
except Exception as e:
    print("Error during scraping:", str(e))
