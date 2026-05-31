import os
import markdownify
from scrapling.fetchers import Fetcher

urls = [
    "https://www.linkedin.com/jobs/view/4420434397/",
    "https://www.linkedin.com/jobs/view/4421403555/"
]

os.makedirs("scratch", exist_ok=True)

for url in urls:
    job_id = url.split("/view/")[1].split("/")[0]
    print(f"\n--- Scraping {job_id} using Fetcher ---")
    try:
        fetcher = Fetcher()
        page = fetcher.get(url)
        print(f"HTTP Status: {page.status}")
        
        # Save raw HTML
        raw_path = f"scratch/raw_scrapling_{job_id}.html"
        with open(raw_path, "w", encoding="utf-8") as f:
            f.write(str(page.html_content))
            
        # Try various selectors for LinkedIn job description
        selectors = [
            '.show-more-less-html__markup',
            '.jobs-description__content',
            '.jobs-description',
            'article',
            'main'
        ]
        
        extracted_html = None
        for selector in selectors:
            elements = page.css(selector)
            if elements:
                # elements[0].get() returns the outer HTML of the matched node
                extracted_html = elements[0].get()
                print(f"Found job description container using selector: {selector}")
                break
                
        if extracted_html:
            # Convert HTML to clean Markdown
            md = markdownify.markdownify(str(extracted_html))
            
            # Save the clean Markdown
            out_path = f"scratch/scrapling_{job_id}.md"
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(md.strip())
            print(f"Successfully saved to {out_path} ({len(md)} characters)")
        else:
            print("Error: Could not locate job description container in HTML.")
            
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
