from metapub import PubMedFetcher
fetch = PubMedFetcher()
def fetch_medical_documments(query):
    results = fetch.pmids_for_query(query)
    articles = []
    for result in results:
        articles.append(fetch.article_by_pmid(result))
    print(results)