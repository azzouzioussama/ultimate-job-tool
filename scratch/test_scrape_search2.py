import sys
import traceback
from scrapling.fetchers import StealthyFetcher
from urllib.parse import urljoin

url = "https://www.linkedin.com/jobs/search/?keywords=helpdesk&location=France&f_TPR=r86400"

try:
    page = StealthyFetcher.fetch(url, headless=True)
    if page.status != 200:
        print(f"Error: Status {page.status}")
    
    links = []
    for i, a_tag in enumerate(page.css('a')):
        try:
            # Let's see if this throws an exception on any tag
            href = a_tag.attrib.get('href')
            if href and '/jobs/view/' in href:
                absolute_url = urljoin(url, href)
                base_url = absolute_url.split('?')[0]
                if base_url not in links:
                    links.append(base_url)
        except Exception as e:
            print(f"Exception on a_tag {i}: {e}")
            
    print(f"Found {len(links)} job links.")
except Exception as e:
    print(f"Fatal error: {e}")
    traceback.print_exc()
