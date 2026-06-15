import sys
from scrapling.fetchers import StealthyFetcher
from urllib.parse import urljoin

url = "https://www.linkedin.com/jobs/search/?keywords=helpdesk&location=France&f_TPR=r86400"
print(f"Fetching {url}")

try:
    page = StealthyFetcher.fetch(url, headless=True)
    print(f"Status: {page.status}")
    
    a_tags = page.css('a')
    print(f"Found {len(a_tags)} a tags")
    if len(a_tags) > 0:
        first_a = a_tags[0]
        print(f"First a tag type: {type(first_a)}")
        print(f"First a tag dir: {dir(first_a)}")
        
        # Test getting href
        try:
            href = first_a.attrib.get('href')
            print(f"attrib.get('href') -> {href}")
        except Exception as e:
            print(f"Error accessing .attrib: {e}")
            
        try:
            href2 = first_a.attributes.get('href')
            print(f"attributes.get('href') -> {href2}")
        except Exception as e:
            print(f"Error accessing .attributes: {e}")
            
        try:
            href3 = getattr(first_a, 'attrib', {}).get('href')
            print(f"getattr attrib -> {href3}")
        except Exception as e:
            pass
            
except Exception as e:
    print(f"Fatal error: {e}")
