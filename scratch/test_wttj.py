import sys
from scrapling.fetchers import Fetcher

def test_wttj():
    url = "https://www.welcometothejungle.com/fr/jobs?query=helpdesk"
    page = Fetcher().get(url)
    links = [a.attrib.get('href') for a in page.css('a')]
    # print all unique links to see structure
    for l in list(set(links))[:50]:
        print(l)

if __name__ == "__main__":
    test_wttj()
