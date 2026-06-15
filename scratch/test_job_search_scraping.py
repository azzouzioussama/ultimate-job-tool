import sys
from scrapling.fetchers import StealthyFetcher
from urllib.parse import urljoin

urls = {
    "hellowork": "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=Technicien+helpdesk&k_autocomplete=http%3A%2F%2Fwww.rj.com%2FCommun%2FPost%2FTechn_support_informatique&l=&l_autocomplete=&st=date&msa=0&d=h",
    "linkedin": "https://www.linkedin.com/jobs/search-results/?currentJobId=4425734787&keywords=technicien%20informatique&origin=SEMANTIC_SEARCH_JOB_ALERT_IN_APP_NOTIFICATION&originToLandingJobPostings=4425734787&savedSearchId=8533583514&geoId=105015875&distance=25&f_TPR=a1781373840-&f_EA=true",
    "indeed": "https://fr.indeed.com/jobs?q=helpdesk&l=France&from=searchOnHP%2Cwhatautocomplete%2CwhatautocompleteSourceStandard%2Cwhereautocomplete&vjk=366463e357b9fbe0",
    "freework": "https://www.free-work.com/fr/tech-it/jobs?query=helpdesk&locations=fr~~~"
}

def test_scrape():
    for name, url in urls.items():
        print(f"\n--- Testing {name} ---")
        try:
            page = StealthyFetcher.fetch(url, headless=True)
            print(f"Status: {page.status}")
            
            titles = page.css("title")
            if titles:
                print(f"Title: {titles[0].text.strip()}")
            else:
                print("No title found.")
                
            a_tags = page.css('a')
            print(f"Total 'a' tags: {len(a_tags)}")
            
            hrefs = []
            for a in a_tags:
                try:
                    h = a.attrib.get('href')
                    if h:
                        absolute_url = urljoin(url, h)
                        base_url = absolute_url.split('?')[0]
                        hrefs.append(base_url)
                except Exception as e:
                    pass
                    
            # Unique hrefs
            hrefs = list(set(hrefs))
                    
            print("\nGuessing job link pattern:")
            job_links = []
            for h in hrefs:
                if name == "hellowork" and "/fr-fr/emplois/" in h:
                    job_links.append(h)
                elif name == "linkedin" and "/jobs/view/" in h:
                    job_links.append(h)
                elif name == "indeed" and ("/rc/clk" in h or "/viewjob" in h):
                    job_links.append(h)
                elif name == "freework" and "/jobs/" in h and not h.endswith("/jobs"):
                    job_links.append(h)
                    
            print(f"Found {len(job_links)} potential job links. Sample:")
            for h in job_links[:5]:
                print(f" - {h}")
                
        except Exception as e:
            print(f"Error on {name}: {e}")

if __name__ == "__main__":
    test_scrape()
