import urllib.request
import os

urls = [
    "https://www.linkedin.com/jobs/view/4420434397/",
    "https://www.linkedin.com/jobs/view/4421403555/"
]

# Ensure scratch directory exists
os.makedirs("scratch", exist_ok=True)

for url in urls:
    job_id = url.split("/view/")[1].split("/")[0]
    jina_url = f"https://r.jina.ai/{url}"
    print(f"Scraping with Jina AI: {jina_url}")
    try:
        req = urllib.request.Request(
            jina_url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            
        out_path = f"scratch/jina_{job_id}.md"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Saved to {out_path} ({len(content)} chars)")
    except Exception as e:
        print(f"Error scraping {url} with Jina: {str(e)}")
