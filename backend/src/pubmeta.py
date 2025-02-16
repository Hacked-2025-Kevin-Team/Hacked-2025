from metapub import PubMedFetcher
fetch = PubMedFetcher()
def fetch_medical_documments(query):
    results = fetch.pmids_for_query(query)
    print(results)