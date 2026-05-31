import os
from scrapling.fetchers import Fetcher

url = "https://www.linkedin.com/jobs/view/4420434397/"
print(f"Scraping using standard Fetcher: {url}")

try:
    fetcher = Fetcher()
    page = fetcher.get(url)
    print("Status code:", page.status)
    
    # Save raw HTML to file
    os.makedirs("scratch", exist_ok=True)
    html_path = "scratch/linkedin_http_4420434397.html"
    html_str = str(page.html_content)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_str)
        
    print(f"Successfully saved to {html_path}")
    print(f"HTML size: {len(html_str)} characters")
    
    # Let's inspect some text content
    # Try selector for description
    desc_el = page.css('.show-more-less-html__markup')
    if desc_el:
        print("Found show-more-less-html__markup element!")
        print("Text preview:")
        print(desc_el[0].text()[:500])
    else:
        print("CSS Selector .show-more-less-html__markup not found.")
        # Try generic article or main
        main_el = page.css('main')
        if main_el:
            print("Found main element, length of text:", len(main_el[0].text()))
except Exception as e:
    print("Error during HTTP scraping:", str(e))
